import React, { useEffect, useRef, useState } from 'react'
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
  currentUserSentMessage: boolean
  setCurrentUserSentMessage: (value: boolean) => void
  updateReadStatus: (messageId: string) => void
  lastReadMessageId: string | null
}

const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const prepareMessages = (messages: Message[]): ChatItem[] => {
  const result: ChatItem[] = []
  let lastDate = ''

  messages.forEach((message) => {
    if (!message) return // Ensure message is defined
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
  currentUserSentMessage,
  setCurrentUserSentMessage,
  updateReadStatus,
  lastReadMessageId,
}: ChatMessagesProps) {
  const preparedMessages = prepareMessages(messages)
  const virtuosoRef = useRef<any>(null)
  const [firstUnreadIndex, setFirstUnreadIndex] = useState<number | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [atBottom, setAtBottom] = useState(true)

  // Scroll to last read message or the first unread message
  useEffect(() => {
    if (lastReadMessageId && virtuosoRef.current) {
      const index = preparedMessages.findIndex(
        (item) => item && 'id' in item && item.id === lastReadMessageId
      )
      if (index !== -1) {
        setFirstUnreadIndex(index + 1)
        virtuosoRef.current.scrollToIndex({
          index: index + 1,
          align: 'end',
          behavior: 'auto',
        })
        const unreadMessagesCount = preparedMessages
          .slice(index + 1)
          .filter(
            (item) => item && 'user_id' in item && item.user_id !== currentUser
          ).length
        setUnreadCount(unreadMessagesCount)
        setAtBottom(false)
      }
    } else {
      setFirstUnreadIndex(0)
      if (virtuosoRef.current) {
        virtuosoRef.current.scrollToIndex({
          index: 0,
          align: 'end',
          behavior: 'auto',
        })
        const unreadMessagesCount = preparedMessages.filter(
          (item) => item && 'user_id' in item && item.user_id !== currentUser
        ).length
        setUnreadCount(unreadMessagesCount)
        setAtBottom(false)
      }
    }
  }, [lastReadMessageId, preparedMessages, currentUser])

  // Scroll to bottom when the current user sends a message
  useEffect(() => {
    if (currentUserSentMessage && virtuosoRef.current) {
      const lastIndex = preparedMessages.length - 1
      virtuosoRef.current.scrollToIndex({
        index: lastIndex,
        align: 'end',
        behavior: 'auto',
      })
      setCurrentUserSentMessage(false)
      setAtBottom(true)
      if (lastIndex >= 0) {
        const lastMessage = preparedMessages[lastIndex]
        if (lastMessage && 'id' in lastMessage) {
          updateReadStatus(lastMessage.id)
        }
      }
    }
  }, [
    currentUserSentMessage,
    preparedMessages,
    setCurrentUserSentMessage,
    updateReadStatus,
  ])

  const handleScrollToDate = (date: string) => {
    const index = preparedMessages.findIndex(
      (item) => item && 'date' in item && item.date === date
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
    if (!item) return null // Ensure item is defined

    const isUnread =
      firstUnreadIndex !== null &&
      index >= firstUnreadIndex &&
      item &&
      'timestamp' in item &&
      item.user_id !== currentUser

    if (item && 'date' in item) {
      return (
        <div className="sticky top-0 z-10 mx-4 bg-background py-2 text-center text-sm font-semibold text-muted-foreground">
          {item.date}
        </div>
      )
    }
    return (
      <div
        key={item?.id}
        className={`flex flex-col gap-1 py-2 ${isUnread ? 'text-red-500' : ''}`}
      >
        {item?.user_id !== currentUser && (
          <div className="mx-4 px-3 text-sm font-medium">
            {item?.user?.full_name}
          </div>
        )}
        <div
          className={`mx-4 flex w-max max-w-[80%] flex-col gap-1 rounded-2xl px-3 py-1.5 text-sm sm:w-fit 2xl:max-w-[800px] ${
            item?.user_id === currentUser
              ? 'ml-auto bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
          aria-label={new Date(item?.timestamp).toDateString()}
        >
          {item?.content}
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
            followOutput={(isAtBottom: boolean) =>
              isAtBottom ? 'auto' : false
            }
            style={{ height: '100%', width: '100%' }}
            totalCount={preparedMessages.length}
            initialTopMostItemIndex={
              firstUnreadIndex !== null ? firstUnreadIndex : 0
            }
            itemContent={(index) => renderMessage(index)}
            atBottomStateChange={(isAtBottom) => {
              setAtBottom(isAtBottom)
              if (isAtBottom) {
                const lastMessage =
                  preparedMessages[preparedMessages.length - 1]
                if (lastMessage && 'id' in lastMessage) {
                  updateReadStatus(lastMessage.id)
                }
                setUnreadCount(0)
              }
            }}
          />
        </div>
        {!atBottom && unreadCount > 0 && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 transform rounded-full bg-blue-500 px-4 py-2 text-white">
            {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
          </div>
        )}
      </div>
      <Timeline messages={messages} onScrollToDate={handleScrollToDate} />
    </div>
  )
}
