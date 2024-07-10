"use client";

import { useState } from 'react';
import { CircleList } from './circle-list';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { ContextBar } from './context-bar';
import { ChatHeader } from './chat-header';

// Define the message type
interface Message {
  id: number;
  user: string;
  content: string;
  type: string;
  timestamp: Date;
}

export function Chat() {
  // Use the defined message type for the state
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, user: 'Michael', content: "Hey, how's it going? We should catch up sometime soon. 🙏", type: 'sent', timestamp: new Date('2021-01-01') },
  { id: 2, user: 'Sarah', content: "Sure, I'm free this weekend if you want to grab a coffee.", type: 'received', timestamp: new Date('2021-01-02') },
  { id: 3, user: 'Sarah', content: "How about Saturday?", type: 'received', timestamp: new Date('2021-01-02') },
  { id: 4, user: 'Michael', content: "Saturday works for me!", type: 'sent', timestamp: new Date('2021-01-02') },
  { id: 5, user: 'Sarah', content: "Great, see you then!", type: 'received', timestamp: new Date('2021-01-02') },
  { id: 6, user: 'Michael', content: "Looking forward to it.", type: 'sent', timestamp: new Date('2021-01-03') },
  { id: 7, user: 'Michael', content: "Hey, how's it going?", type: 'sent', timestamp: new Date('2021-06-01') },
  { id: 8, user: 'Sarah', content: "Pretty good! How about you?", type: 'received', timestamp: new Date('2021-06-01') },
  { id: 9, user: 'Michael', content: "I'm doing well, thanks!", type: 'sent', timestamp: new Date('2021-06-02') },
  { id: 10, user: 'Sarah', content: "What are you up to?", type: 'received', timestamp: new Date('2021-06-02') },
  { id: 11, user: 'Michael', content: "Just working on a project.", type: 'sent', timestamp: new Date('2021-06-02') },
  { id: 12, user: 'Sarah', content: "Nice! Good luck with that.", type: 'received', timestamp: new Date('2021-06-03') },
  { id: 13, user: 'Michael', content: "Thanks!", type: 'sent', timestamp: new Date('2021-06-03') },
  { id: 14, user: 'Michael', content: "Happy New Year!", type: 'sent', timestamp: new Date('2022-01-01') },
  { id: 15, user: 'Sarah', content: "Happy New Year to you too!", type: 'received', timestamp: new Date('2022-01-01') },
  { id: 16, user: 'Michael', content: "Any resolutions?", type: 'sent', timestamp: new Date('2022-01-02') },
  { id: 17, user: 'Sarah', content: "Just the usual, eat healthier and exercise more.", type: 'received', timestamp: new Date('2022-01-02') },
  { id: 18, user: 'Michael', content: "Same here!", type: 'sent', timestamp: new Date('2022-01-03') },
  { id: 19, user: 'Sarah', content: "Let's keep each other accountable.", type: 'received', timestamp: new Date('2022-01-03') },
  { id: 20, user: 'Michael', content: "Definitely. We got this!", type: 'sent', timestamp: new Date('2022-01-04') },
  { id: 21, user: 'Michael', content: "Long message: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", type: 'sent', timestamp: new Date('2022-02-01') },
  { id: 22, user: 'Sarah', content: "That's a lot of text!", type: 'received', timestamp: new Date('2022-02-02') },
  { id: 23, user: 'Michael', content: "Indeed it is.", type: 'sent', timestamp: new Date('2022-02-03') },
  { id: 24, user: 'Michael', content: "Another long message: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Nulla facilisi. Pellentesque ut turpis venenatis, efficitur purus ac, interdum nulla. Proin gravida, arcu non convallis ultricies, purus risus ultrices ex, id condimentum eros eros ac lectus. Nulla facilisi. Sed aliquam eget arcu sed tempor. Nam at felis ac ligula tempor blandit non vel libero. Integer vulputate.", type: 'sent', timestamp: new Date('2022-03-01') },
  { id: 25, user: 'Sarah', content: "Wow, you're on a roll with the long messages.", type: 'received', timestamp: new Date('2022-03-02') },
  { id: 26, user: 'Michael', content: "Just practicing my typing skills. 😂", type: 'sent', timestamp: new Date('2022-03-03') },
  { id: 27, user: 'Sarah', content: "Good practice for sure!", type: 'received', timestamp: new Date('2022-03-04') },
  { id: 28, user: 'Michael', content: "Here's another one: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula magna non nunc consequat, ut feugiat elit facilisis. In hac habitasse platea dictumst. Curabitur tempor, orci ut viverra aliquet, urna turpis bibendum dui, ac dictum ex libero a tortor. Duis vel nulla ac libero cursus commodo.", type: 'sent', timestamp: new Date('2022-04-01') },
  { id: 29, user: 'Sarah', content: "Keep them coming!", type: 'received', timestamp: new Date('2022-04-02') },
  { id: 30, user: 'Michael', content: "Sure thing: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras id ligula convallis, placerat libero ac, cursus felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla facilisi. Donec sed quam id sapien elementum bibendum a ac lacus. Praesent ultricies.", type: 'sent', timestamp: new Date('2022-05-01') },
  { id: 31, user: 'Sarah', content: "You're quite the storyteller.", type: 'received', timestamp: new Date('2022-05-02') },
  { id: 32, user: 'Michael', content: "Thanks! I try.", type: 'sent', timestamp: new Date('2022-05-03') },
  { id: 33, user: 'Michael', content: "Let's add some variety: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed arcu sit amet est efficitur convallis. Suspendisse potenti. Integer tincidunt, orci vel dapibus malesuada, magna massa laoreet sapien, sit amet congue urna arcu a mi.", type: 'sent', timestamp: new Date('2022-06-01') },
  { id: 34, user: 'Sarah', content: "Nice change of pace.", type: 'received', timestamp: new Date('2022-06-02') },
  { id: 35, user: 'Michael', content: "Gotta keep things interesting!", type: 'sent', timestamp: new Date('2022-06-03') },
  { id: 36, user: 'Sarah', content: "Absolutely.", type: 'received', timestamp: new Date('2022-06-04') },
  { id: 37, user: 'Michael', content: "And here's another: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed arcu sit amet est efficitur convallis. Suspendisse potenti. Integer tincidunt, orci vel dapibus malesuada, magna massa laoreet sapien, sit amet congue urna arcu a mi.", type: 'sent', timestamp: new Date('2022-07-01') },
  { id: 38, user: 'Sarah', content: "Loving these long messages.", type: 'received', timestamp: new Date('2022-07-02') },
  { id: 39, user: 'Michael', content: "Great! I'll keep them coming.", type: 'sent', timestamp: new Date('2022-07-03') },
  { id: 40, user: 'Sarah', content: "Looking forward to it!", type: 'received', timestamp: new Date('2022-07-04') },
  ]);

  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      user: 'You',
      content: message,
      type: 'sent',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className="flex h-screen w-full">
      <CircleList className="hidden lg:flex" />
      <div className="w-full h-full flex-1 flex flex-col">
        <ChatHeader />
        <ChatMessages messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
      <ContextBar className="hidden lg:flex" />
    </div>
  );
}
