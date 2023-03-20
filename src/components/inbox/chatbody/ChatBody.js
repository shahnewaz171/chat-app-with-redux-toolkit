// import Blank from "./Blank";
import { size } from "lodash";
import { useParams } from "react-router-dom";
import { useGetMessagesQuery } from "../../../features/messages/messagesApi";
import Error from "../../ui/Error";
import ChatHead from "./ChatHead";
import Messages from "./Messages";
import Options from "./Options";

const ChatBody = () => {
  const { id } = useParams();
  const { data: messages, isLoading, isError, error } = useGetMessagesQuery(id);

  return (
    <div className="w-full lg:col-span-2 lg:block">
      <div className="w-full grid conversation-row-grid">
        {(() => {
          if (isLoading) {
            return <div>Loading...</div>;
          }
          if (isError) {
            return (
              <div>
                <Error messages={error?.data} />
              </div>
            );
          }
          if (size(messages)) {
            return (
              <>
                <ChatHead message={messages[0]} />
                <Messages messages={messages} />
                <Options message={messages[0]} />
              </>
            );
          }
          return <div>No messages found!</div>;
        })()}
      </div>
    </div>
  );
};

export default ChatBody;
