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
          // nothing
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
        try {
          const conversation = await queryFulfilled;

          if (conversation?.data?.id) {
            // silent entry to message table
            const users = arg.data.users;
            const senderUser = users?.find((user) => user.email === arg.sender);
            const receiverUser = users?.find(
              (user) => user.email !== arg.sender
            );

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
          // nothing
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
