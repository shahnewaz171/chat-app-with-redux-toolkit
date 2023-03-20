import { debounce, size } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  conversationApi,
  useAddConversationMutation,
  useEditConversationMutation,
} from "../../features/conversations/conversationApi";
import { useGetUserQuery } from "../../features/users/userApi";
import isValidEmail from "../../utils/isValidEmail";
import Error from "../ui/Error";

const Modal = ({ open, control }) => {
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const [mutationData, setMutationData] = useState({});
  const [userCheck, setUserCheck] = useState(false);
  const [responseError, setResponseError] = useState("");
  const [conversations, setConversations] = useState(undefined);
  const dispatch = useDispatch();
  const formRef = useRef(null);

  //   query
  const { data: participant, isLoading } = useGetUserQuery(
    mutationData?.sender,
    {
      skip: !userCheck,
    }
  );

  const isLoggedInUserParticipant =
    size(participant) && participant[0]?.email === loggedInUser?.email;

  // add and edit conversations
  const [addConversation] = useAddConversationMutation();
  const [editConversation] = useEditConversationMutation();

  useEffect(() => {
    if (!isLoggedInUserParticipant) {
      // check conversation existence
      dispatch(
        conversationApi.endpoints.getConversation.initiate({
          userEmail: loggedInUser?.email,
          participantsEmail: mutationData?.sender,
        })
      )
        .unwrap()
        .then((data) => {
          setResponseError("");
          setConversations(data);
        })
        .catch((err) => setResponseError("There was a problem!"));
    }
  }, [
    dispatch,
    isLoggedInUserParticipant,
    loggedInUser?.email,
    mutationData?.sender,
  ]);

  const handleChange = debounce((type, value) => {
    if (type === "sender") {
      if (isValidEmail(value)) {
        setMutationData((prevData) => ({ ...prevData, [type]: value }));
        setUserCheck(true);
      }
    } else {
      setMutationData((prevData) => ({ ...prevData, [type]: value }));
    }
  }, 700);

  const handleMessage = (e) => {
    e.preventDefault();

    const updatedData = {
      participants: `${loggedInUser?.email}-${participant[0]?.email}`,
      users: [loggedInUser, participant[0]],
      message: mutationData?.message,
      timestamp: new Date().getTime(),
    };

    if (size(conversations)) {
      // edit conversation
      editConversation({
        id: conversations[0]?.id,
        data: updatedData,
        sender: loggedInUser?.email,
      })
        .unwrap()
        .then((data) => {
          formRef.current.reset();
          setMutationData({});
          control();
        })
        .catch((err) => alert("There was a problem!"));
    } else if (size(conversations) === 0) {
      // add conversation
      addConversation({ sender: loggedInUser?.email, data: updatedData })
        .unwrap()
        .then((data) => {
          formRef.current.reset();
          setMutationData({});
          control();
        })
        .catch((err) => alert("There was a problem!"));
    }
  };

  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        ></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Send message
          </h2>
          <form
            ref={formRef}
            onSubmit={handleMessage}
            className="mt-8 space-y-6"
          >
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  id="to"
                  name="to"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Send to"
                  onChange={(e) => handleChange("sender", e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  type="message"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Message"
                  onChange={(e) => handleChange("message", e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={
                  isLoggedInUserParticipant ||
                  isLoading ||
                  conversations === undefined
                }
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                Send Message
              </button>
            </div>

            {participant?.length === 0 ? (
              <Error message="This user does not exit!" />
            ) : (
              ""
            )}
            {(() => {
              if (isLoggedInUserParticipant)
                return <Error message="You can not send message yourself!" />;
              return "";
            })()}
            {responseError && <Error message={responseError} />}
          </form>
        </div>
      </>
    )
  );
};

export default Modal;
