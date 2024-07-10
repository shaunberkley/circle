import Image from 'next/image';
import { ThumbsUpIcon, MessageCircleIcon } from "lucide-react";
import { AlwaysScrollToBottom } from './always-scroll-to-bottom';

// Use the same Message type here
interface Message {
  id: number;
  user: string;
  content: string;
  type: string;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
};

const groupMessagesByDate = (messages: Message[]) => {
  return messages.reduce((acc, message) => {
    const date = formatDate(message.timestamp);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {} as { [key: string]: Message[] });
};

export function ChatMessages({ messages }: ChatMessagesProps) {
  const groupedMessages = groupMessagesByDate(messages);

  const handleScrollToDate = (date: string) => {
    const element = document.querySelector(`[data-date="${date}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-1 h-full overflow-auto relative">
      <ul className="flex-1 h-full overflow-auto p-4 space-y-6 mr-12">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date} data-date={date}>
            <div className="sticky top-0 bg-background py-2 text-center font-semibold text-sm text-muted-foreground">
              {date}
            </div>
            {messages.map((message: Message) => (
              <li key={message.id} className="flex flex-col gap-1">
                {message.type === 'received' && (
                  <div className="text-sm px-3">{message.user}</div>
                )}
                <div className={`flex w-max sm:w-fit max-w-[80%] 2xl:max-w-[800px] flex-col gap-1 rounded-2xl px-3 py-1.5 text-sm ${message.type === 'sent' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted'}`}>
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
          </div>
        ))}
        <AlwaysScrollToBottom />
      </ul>
      <div className="absolute right-0 top-0 h-full w-10 bg-background z-10 flex flex-col items-center justify-between py-4">
        {Object.keys(groupedMessages).map((date) => (
          <div key={date} className="cursor-pointer" onClick={() => handleScrollToDate(date)}>
            <div className="w-2 h-2 rounded-full bg-muted mb-2"></div>
            <div className="text-xs text-muted-foreground">{date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
