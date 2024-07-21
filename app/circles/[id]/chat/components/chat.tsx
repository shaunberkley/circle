'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Session } from '@supabase/auth-helpers-react'
import { CircleList } from './circle-list'
import { ChatMessages } from './chat-messages'
import { ChatInput } from './chat-input'
import { ContextBar } from './context-bar'
import { ChatHeader } from './chat-header'

export interface Message {
  id: string
  user_id: string
  user: {
    id: string
    full_name: string
  }
  content: string
  timestamp: Date
}

interface ChatProps {
  circleId: string
  session: Session
}

const Chat: React.FC<ChatProps> = ({ circleId, session }) => {
  const supabase = createClientComponentClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [hasNextPage, setHasNextPage] = useState(true)
  const [isNextPageLoading, setIsNextPageLoading] = useState(false)
  const [currentUserSentMessage, setCurrentUserSentMessage] = useState(false)
  const [lastReadMessageId, setLastReadMessageId] = useState<string | null>(
    null
  )

  const fetchMessages = useCallback(
    async (before?: string) => {
      let url = `/api/v1/messages/${circleId}`
      if (before) {
        url += `?before=${before}`
      }

      const response = await fetch(url)
      const result = await response.json()

      if (response.ok) {
        return result.data.map((message: any) => ({
          ...message,
          timestamp: new Date(message.timestamp), // Ensure timestamp is parsed as Date object
        }))
      } else {
        console.error('Error fetching messages:', result.error)
        return []
      }
    },
    [circleId]
  )

  useEffect(() => {
    fetchMessages()
      .then((data) => {
        setMessages(data)
      })
      .catch((error) => console.error('Error fetching messages:', error))
  }, [fetchMessages])

  useEffect(() => {
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const newMessage = payload.new
          console.log('New message received:', newMessage)
          if (newMessage.circle_id === circleId) {
            let user = newMessage.user
            if (!user || !user.full_name) {
              const { data: userData } = await supabase
                .from('users')
                .select('id, full_name')
                .eq('id', newMessage.user_id)
                .single()
              user = userData
            }
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                ...newMessage,
                user,
                timestamp: new Date(newMessage.timestamp),
              },
            ])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [circleId, supabase])

  const handleSendMessage = async (message: string) => {
    const newMessage = {
      user_id: session.user.id,
      content: message,
      timestamp: new Date().toISOString(),
      circle_id: circleId,
    }

    const response = await fetch(`/api/v1/messages/${circleId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMessage),
    })

    const result = await response.json()

    if (response.ok) {
      console.log('Message sent:', result.data)
      setCurrentUserSentMessage(true)
    } else {
      console.error('Error sending message:', result.error)
    }
  }

  const loadNextPage = async () => {
    if (isNextPageLoading) return
    setIsNextPageLoading(true)
    const oldestMessage = messages[messages.length - 1]
    const moreMessages = await fetchMessages(
      oldestMessage.timestamp.toISOString()
    )
    if (moreMessages.length === 0) {
      setHasNextPage(false)
    } else {
      setMessages((prevMessages) => [...prevMessages, ...moreMessages])
    }
    setIsNextPageLoading(false)
  }

  const fetchLastReadMessage = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/v1/messages/${circleId}/read-status?userId=${session.user.id}`
      )
      if (!response.ok) {
        console.error('Failed to fetch read status')
        return
      }
      const data = await response.json()
      setLastReadMessageId(data.data?.last_read_message_id || null)
    } catch (error) {
      console.error('Error fetching read status:', error)
    }
  }, [circleId, session.user.id])

  const updateReadStatus = async (messageId: string) => {
    try {
      const response = await fetch(
        `/api/v1/messages/${circleId}/read-status?userId=${session.user.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lastReadMessageId: messageId,
            userId: session.user.id,
          }),
        }
      )

      if (!response.ok) {
        console.error('Error updating read status:', await response.json())
      } else {
        setLastReadMessageId(messageId) // Update the state with the new last read message ID
      }
    } catch (error) {
      console.error('Error updating read status:', error)
    }
  }

  useEffect(() => {
    fetchLastReadMessage()
  }, [fetchLastReadMessage])

  return (
    <>
      <CircleList className="hidden lg:flex" />
      <div className="flex h-full w-full flex-1 flex-col">
        <ChatHeader />
        <ChatMessages
          messages={messages}
          currentUser={session?.user?.id || 'Guest'}
          onScrollToDate={(date: string) =>
            console.log(`Scroll to date: ${date}`)
          }
          loadNextPage={loadNextPage}
          hasNextPage={hasNextPage}
          currentUserSentMessage={currentUserSentMessage}
          setCurrentUserSentMessage={setCurrentUserSentMessage}
          updateReadStatus={updateReadStatus}
          lastReadMessageId={lastReadMessageId}
        />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
      <ContextBar className="hidden lg:flex" />
    </>
  )
}

export default Chat
