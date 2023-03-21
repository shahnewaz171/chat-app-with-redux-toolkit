import { apiSlice } from "../api/apiSlice";
import { messagesAPi } from "../messages/messagesApi";

export const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=5`,
    }),
    getConversation: builder.query({
      query: ({ userEmail, participantsEmail }) =>
        `/conversations?participants_like=${userEmail}-${participantsEmail}&&participants_like=${participantsEmail}-${userEmail}`,
    }),
    addConversation: builder.mutation({
      query: ({ sender, data }) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const conversation = await queryFulfilled;

          if (conversation?.data?.id) {
            // silent entry to message table
            const users = arg.data.users;
            const senderUser = users?.find((user) => user.email === arg.sender);
            const receiverUser = users?.find(
              (user) => user.email !== arg.sender
            );

            // optimistic cache update start
            dispatch(
              apiSlice.util.updateQueryData(
                "getConversations",
                arg.sender,
                (draft) => {
                  draft.unshift(conversation?.data);
                }
              )
            );
            // optimistic cache update end

            dispatch(
              messagesAPi.endpoints.addMessage.initiate({
                conversationId: conversation?.data?.id,
                sender: senderUser,
                receiver: receiverUser,
                message: arg.data?.message,
                timestamp: arg.data?.timestamp,
              })
            );
          }
        } catch (err) {
          // patchResult.undo();
        }
      },
    }),
    editConversation: builder.mutation({
      query: ({ id, data, sender }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        // optimistic cache update start
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            arg.sender,
            (draft) => {
              const draftConversation = draft?.find(
                (item) => parseInt(item?.id) === arg?.id
              );
              draftConversation.message = arg.data?.message;
              draftConversation.timestamp = arg.data?.timestamp;
            }
          )
        );
        // optimistic cache update end

        try {
          const conversation = await queryFulfilled;

          if (conversation?.data?.id) {
            // silent entry to message table
            const users = arg.data.users;
            const senderUser = users?.find((user) => user.email === arg.sender);
            const receiverUser = users?.find(
              (user) => user.email !== arg.sender
            );

            const res = await dispatch(
              messagesAPi.endpoints.addMessage.initiate({
                conversationId: conversation?.data?.id,
                sender: senderUser,
                receiver: receiverUser,
                message: arg.data?.message,
                timestamp: arg.data?.timestamp,
              })
            ).unwrap();

            // optimistic cache update start
            dispatch(
              apiSlice.util.updateQueryData(
                "getMessages",
                res.conversationId.toString(),
                (draft) => {
                  draft.push(res);
                }
              )
            );
            // optimistic cache update end
          }
        } catch (err) {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationApi;
