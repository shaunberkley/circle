import Image from 'next/image';
import { ThumbsUpIcon, MessageCircleIcon } from "lucide-react";
import { AlwaysScrollToBottom } from './always-scroll-to-bottom';

interface ChatMessagesProps {
  messages: { id: number; user: string; content: string; type: string }[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const groupedMessages = messages.reduce((acc: any[], message) => {
    const lastGroup = acc[acc.length - 1];
    if (lastGroup && lastGroup.user === message.user && lastGroup.type === message.type) {
      lastGroup.messages.push(message);
    } else {
      acc.push({ user: message.user, type: message.type, messages: [message] });
    }
    return acc;
  }, []);

  return (
    <ul className="flex-1 overflow-auto p-4 space-y-6">
      {groupedMessages.map((group, index) => (
        <li key={index} className="flex flex-col gap-1">
          {group.type === 'received' && (
            <div className="text-sm px-3">{group.user}</div>
          )}
          {group.messages.map((message: any) => (
            <div key={message.id} className={`flex w-fit sm:w-max max-w-[500px] flex-col gap-1 rounded-2xl px-3 py-1.5 text-sm ${group.type === 'sent' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted'}`}>
              {message.content}
            </div>
          ))}
          {group.messages.some((msg: any) => msg.type === 'image') && (
            <div className="flex w-fit sm:w-max max-w-[500px] flex-col gap-1 rounded-xl overflow-hidden text-sm ml-auto">
              <Image src="/placeholder.svg" alt="photo" width={200} height={150} className="object-cover" />
              <div className="flex items-center gap-2 bg-muted/50 px-2 py-1 text-xs">
                <ThumbsUpIcon className="h-4 w-4" />
                <span>2</span>
                <MessageCircleIcon className="h-4 w-4" />
                <span>5</span>
              </div>
            </div>
          )}
        </li>
      ))}
      <AlwaysScrollToBottom />
    </ul>
  );
}
