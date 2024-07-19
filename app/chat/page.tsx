'use client'

import React, { useState, useEffect } from 'react'
import { CircleList } from './components/circle-list'
import { ChatMessages } from './components/chat-messages'
import { ChatInput } from './components/chat-input'
import { ContextBar } from './components/context-bar'
import { ChatHeader } from './components/chat-header'

export interface Message {
  id: number
  user: string
  content: string
  timestamp: Date
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  // const [hasNextPage, setHasNextPage] = useState(true)
  // const [isNextPageLoading, setIsNextPageLoading] = useState(false)

  useEffect(() => {
    fetch('/messages.json')
      .then((response) => response.json())
      .then((data) => {
        const formattedMessages = data.map((message: any) => ({
          ...message,
          timestamp: new Date(message.timestamp),
        }))
        setMessages(formattedMessages)
      })
      .catch((error) => console.error('Error fetching messages:', error))
  }, [])

  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      user: 'Shaun',
      content: message,
      timestamp: new Date(),
    }
    setMessages((prevMessages) => [...prevMessages, newMessage])
  }

  // const loadNextPage = () => {
  //   if (isNextPageLoading) return
  //   setIsNextPageLoading(true)
  //   // Mocking a network request to load more messages
  //   setTimeout(() => {
  //     const moreMessages = Array.from({ length: 20 }, (_, index) => ({
  //       id: messages.length + index + 1,
  //       user: `User ${index + 1}`,
  //       content: 'Lorem ipsum dolor sit amet.',
  //       type: 'received',
  //       timestamp: new Date(new Date().getTime() - (index + 1) * 10000000),
  //     }))
  //     setMessages((prevMessages) => [...moreMessages, ...prevMessages])
  //     setIsNextPageLoading(false)
  //     // Assuming we've loaded all messages after this page
  //     if (messages.length + moreMessages.length >= 100) {
  //       setHasNextPage(false)
  //     }
  //   }, 1500)
  // }

  return (
    <div className="flex h-screen w-full">
      <CircleList className="hidden lg:flex" />
      <div className="flex h-full w-full flex-1 flex-col">
        <ChatHeader />
        <ChatMessages
          messages={messages}
          currentUser="Shaun"
          onScrollToDate={(date: string) =>
            console.log(`Scroll to date: ${date}`)
          }
        />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
      <ContextBar className="hidden lg:flex" />
    </div>
  )
}
