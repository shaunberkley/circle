import React, { useEffect, useRef } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { Timeline } from './chat-timeline'
import { Message } from '../page'

interface DateMessage {
  type: 'date'
  date: string
}

type ChatItem = Message | DateMessage

interface ChatMessagesProps {
  messages: Message[]
  onScrollToDate: (date: string) => void
  currentUser: string
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

const prepareMessages = (messages: Message[]): ChatItem[] => {
  const result: ChatItem[] = []
  let lastDate = ''

  messages.forEach((message) => {
    const currentDate = formatDate(message.timestamp)
    if (currentDate !== lastDate) {
      result.push({ type: 'date', date: currentDate })
      lastDate = currentDate
    }
    result.push(message)
  })

  return result
}

export function ChatMessages({
  messages,
  onScrollToDate,
  currentUser,
}: ChatMessagesProps) {
  const preparedMessages = prepareMessages(messages)
  const virtuosoRef = useRef<any>(null)

  useEffect(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: preparedMessages.length - 1,
        align: 'end',
        behavior: 'auto',
      })
    }
  }, [messages])

  const handleScrollToDate = (date: string) => {
    const index = preparedMessages.findIndex(
      (item) => 'date' in item && item.date === date
    )
    if (index !== -1 && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index,
        align: 'start',
        behavior: 'smooth',
      })
    }
  }

  const renderMessage = (index: number) => {
    const item = preparedMessages[index]
    if ('date' in item) {
      return (
        <div className="sticky top-0 z-10 mx-4 bg-background py-2 text-center text-sm font-semibold text-muted-foreground">
          {item.date}
        </div>
      )
    }
    return (
      <div key={item.id} className="flex flex-col gap-1 py-2">
        {item.user !== currentUser && (
          <div className="mx-4 px-3 text-sm font-medium">{item.user}</div>
        )}
        <div
          className={`mx-4 flex w-max max-w-[80%] flex-col gap-1 rounded-2xl px-3 py-1.5 text-sm sm:w-fit 2xl:max-w-[800px] ${item.user === currentUser ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted'}`}
          aria-label={item.timestamp.toDateString()}
        >
          {item.content}
        </div>
      </div>
    )
  }

  return (
    <div className="relative z-10 flex h-full w-full flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-col">
        <div className="flex-grow" data-testid="message-list">
          <Virtuoso
            ref={virtuosoRef}
            data={preparedMessages}
            followOutput={(atBottom: boolean) => (atBottom ? 'auto' : false)}
            style={{ height: '100%', width: '100%' }}
            totalCount={preparedMessages.length}
            initialTopMostItemIndex={preparedMessages.length - 1}
            itemContent={(index) => renderMessage(index)}
          />
        </div>
      </div>
      <Timeline messages={messages} onScrollToDate={handleScrollToDate} />
    </div>
  )
}
