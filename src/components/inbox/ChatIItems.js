import gravatarUrl from "gravatar-url";
import { size } from "lodash";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetConversationsQuery } from "../../features/conversations/conversationApi";
import Error from "../ui/Error";
import ChatItem from "./ChatItem";

const ChatItems = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    data: conversations,
    isLoading,
    isError,
    error,
  } = useGetConversationsQuery(user?.email);

  return (
    <ul>
      {(() => {
        if (isLoading) {
          return <li className="m-2 text-center">Loading...</li>;
        }
        if (isError) {
          return (
            <li className="m-2 text-center">
              <Error message={error?.data} />
            </li>
          );
        }
        if (size(conversations)) {
          return conversations?.map((conversation) => {
            const { id, message, timestamp, users } = conversation;

            const partner = users?.find((item) => item?.email !== user?.email);

            return (
              <Link key={conversation?.id} to={`/inbox/${id}`}>
                <li>
                  <ChatItem
                    avatar={gravatarUrl(partner?.email, {
                      size: 80,
                    })}
                    name={partner?.name || ""}
                    lastMessage={message}
                    lastTime={moment(timestamp).fromNow()}
                  />
                </li>
              </Link>
            );
          });
        }
        return <li className="m-2 text-center">No conversations found!</li>;
      })()}
    </ul>
  );
};

export default ChatItems;
