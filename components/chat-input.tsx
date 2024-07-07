import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 300);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = "44px";
        const newHeight = Math.min(textareaRef.current.scrollHeight, 300);
        textareaRef.current.style.height = `${newHeight}px`;
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExpand = () => {
    if (textareaRef.current && containerRef.current) {
      if (isExpanded) {
        textareaRef.current.style.height = "44px";
        const newHeight = Math.min(textareaRef.current.scrollHeight, 300);
        textareaRef.current.style.height = `${newHeight}px`;
        containerRef.current.style.height = ""; // Reset container height
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
        containerRef.current.style.height = `${window.innerHeight * 0.5}px`; // Adjust container height to 50% of window height
        textareaRef.current.style.height = "100%"; // Ensure textarea takes full height
      }
    }
  };

  return (
    <div className="relative px-3 pt-6 pb-3 flex items-end space-x-2 border-t" ref={containerRef}>
      {isExpanded ? (
        <ChevronDownIcon
          className="absolute w-6 h-6 text-gray-400 -top-3 cursor-pointer left-0 right-0 mx-auto bg-white border rounded-full"
          onClick={handleExpand}
        />
      ) : (
        <ChevronUpIcon
          className="absolute w-6 h-6 text-gray-400 -top-3 cursor-pointer left-0 right-0 mx-auto bg-white border rounded-full"
          onClick={handleExpand}
        />
      )}
      <Textarea
        ref={textareaRef}
        id="message"
        placeholder="Type your message..."
        className="flex-1 resize-none h-full bg-white text-base overflow-auto"
        autoComplete="off"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={handleKeyPress}
        data-1p-ignore
      />
      <Button type="submit" size="icon" onClick={handleSendMessage}>
        <span className="sr-only">Send</span>
        <SendIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
