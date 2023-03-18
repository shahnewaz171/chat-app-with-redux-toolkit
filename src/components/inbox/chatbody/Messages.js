import { useSelector } from "react-redux";
import Message from "./Message";

const Messages = ({ messages = [] }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="relative w-full h-[calc(100vh_-_197px)] p-6 overflow-y-auto flex flex-col-reverse">
      <ul className="space-y-2">
        {[...messages]
          ?.sort((a, b) => a?.timestamp - b?.timestamp)
          ?.map((item) => {
            const { id, message, sender } = item;

            const justify = sender?.email === user?.email ? "end" : "start";

            return <Message key={id} justify={justify} message={message} />;
          })}
      </ul>
    </div>
  );
};

export default Messages;
