"use client";

import { useState } from 'react';
import { CircleList } from './circle-list';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { ContextBar } from './context-bar';
import { ChatHeader } from './chat-header';

export function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, user: 'Michael', content: "Hey, how's it going? We should catch up sometime soon. 🙏", type: 'sent' },
    { id: 2, user: 'Sarah', content: "Sure, I'm free this weekend if you want to grab a coffee.", type: 'received' },
    { id: 3, user: 'Michael', content: "Sounds good! Let's meet at the Starbucks on 5th Ave.", type: 'sent' },
  ]);

  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: messages.length + 1,
      user: 'You',
      content: message,
      type: 'sent',
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className="flex h-screen w-full">
      <CircleList />
      <div className="w-full flex-1 flex flex-col">
        <ChatHeader />
        <ChatMessages messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
      <ContextBar />
    </div>
  );
}
