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
  id: number
  user_id: string
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
        (payload) => {
          const newMessage = payload.new
          console.log('New message received:', newMessage)
          if (newMessage.circle_id === circleId) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { ...newMessage, timestamp: new Date(newMessage.timestamp) },
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
        />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
      <ContextBar className="hidden lg:flex" />
    </>
  )
}

export default Chat
