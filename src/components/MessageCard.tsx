import { Message } from "@/types";
import classNames from "classnames";

interface MessageCardProps {
  message: Message;
}

type AvatarProps = Pick<Message, "role">;

function Avatar({ role }: AvatarProps) {
    const getName = () => role === 'user' ? 'U' : 'AI'

  return (
    <span
      className={classNames(
        "w-6 h-6 inline-flex items-center justify-center rounded-full min-w-[24px]",
        role === "user" ? "bg-orange-300" : "bg-green-400"
      )}
    >
        {getName()}
    </span>
  );
}

function MessageCard({ message }: MessageCardProps) {
  return (
    <div className="flex items-center">
      <Avatar role={message.role} />
      <div className="ml-2">{message.text}</div>
    </div>
  );
}

export default MessageCard;