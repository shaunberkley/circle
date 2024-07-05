"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="border-t p-3 flex items-center space-x-2">
      <Input 
        id="message" 
        placeholder="Type your message..." 
        className="flex-1" 
        autoComplete="off" 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onEnter={handleSendMessage}
        data-1p-ignore 
      />
      <Button type="button" size="icon" onClick={handleSendMessage}>
        <span className="sr-only">Send</span>
        <SendIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
