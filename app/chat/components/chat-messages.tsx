import React, { useEffect, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Timeline } from './chat-timeline';
import { Message } from './chat';

interface DateMessage {
  type: 'date';
  date: string;
}

type ChatItem = Message | DateMessage;

interface ChatMessagesProps {
  messages: Message[];
  onScrollToDate: (date: string) => void;
  currentUser: string
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
};

const prepareMessages = (messages: Message[]): ChatItem[] => {
  const result: ChatItem[] = [];
  let lastDate = '';

  messages.forEach((message) => {
    const currentDate = formatDate(message.timestamp);
    if (currentDate !== lastDate) {
      result.push({ type: 'date', date: currentDate });
      lastDate = currentDate;
    }
    result.push(message);
  });

  return result;
};

export function ChatMessages({
  messages,
  onScrollToDate,
  currentUser
}: ChatMessagesProps) {
  const preparedMessages = prepareMessages(messages);
  const virtuosoRef = useRef<any>(null);

  useEffect(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: preparedMessages.length - 1,
        align: 'end',
        behavior: 'auto',
      });
    }
  }, [messages]);

  const handleScrollToDate = (date: string) => {
    const index = preparedMessages.findIndex(
      (item) => 'date' in item && item.date === date
    );
    if (index !== -1 && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index,
        align: 'start',
        behavior: 'smooth',
      });
    }
  };

  const renderMessage = (index: number) => {
    const item = preparedMessages[index];
    if ('date' in item) {
      return (
        <div className="sticky top-0 bg-background py-2 mx-4 text-center font-semibold text-sm text-muted-foreground z-10">
          {item.date}
        </div>
      );
    }
    return (
      <div key={item.id} className="flex flex-col gap-1 py-2">
        {item.user !== currentUser && <div className="text-sm px-3 mx-4 font-medium">{item.user}</div>}
        <div className={`flex w-max sm:w-fit max-w-[80%] 2xl:max-w-[800px] mx-4 flex-col gap-1 rounded-2xl px-3 py-1.5 text-sm ${item.user === currentUser ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted'}`} aria-label={item.timestamp.toDateString()}>
          {item.content}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full z-10 flex flex-1 h-full overflow-hidden">
      <div className="w-full h-full flex flex-col">
        <div className="flex-grow" data-testid="message-list">
          <Virtuoso
            ref={virtuosoRef}
            data={preparedMessages}
            followOutput={(atBottom: boolean) => (atBottom || true) ? 'auto' : false}
            style={{ height: '100%', width: '100%' }}
            totalCount={preparedMessages.length}
            initialTopMostItemIndex={preparedMessages.length - 1}
            itemContent={(index) => renderMessage(index)}
          />
        </div>
      </div>
      <Timeline messages={messages} onScrollToDate={handleScrollToDate} />
    </div>
  );
}
