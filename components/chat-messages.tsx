import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { ThumbsUpIcon, MessageCircleIcon } from "lucide-react";

interface ChatMessagesProps {
  messages: { id: number; user: string; content: string; type: string }[];
}

const AlwaysScrollToBottom = () => {
    const elementRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      elementRef.current?.scrollIntoView();
    });
    return <div ref={elementRef} />;
  };

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <ul className="flex-1 overflow-auto p-4 space-y-6">
      {messages.map((message) => (
        <li key={message.id} className="flex flex-col gap-1">
          <div className="text-sm px-3">{message.user}</div>
          <div className={`flex w-fit sm:w-max max-w-[500px] flex-col gap-1 rounded-2xl px-3 py-1.5 text-sm ${message.type === 'sent' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted'}`}>
            {message.content}
          </div>
          {message.type === 'image' && (
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
