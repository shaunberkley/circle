import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SendIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      //   textareaRef.current.style.height = "44px";
      //   const newHeight = Math.min(textareaRef.current.scrollHeight, 300);
      //   textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message])

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      onSendMessage(message)
      setMessage('')
      if (textareaRef.current && containerRef.current) {
        textareaRef.current.style.height = '44px'
        const newHeight = Math.min(textareaRef.current.scrollHeight, 300)
        textareaRef.current.style.height = `${newHeight}px`
        containerRef.current.style.height = '' // Reset container height
        setIsExpanded(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleExpand = () => {
    if (textareaRef.current && containerRef.current) {
      if (isExpanded) {
        textareaRef.current.style.height = '44px'
        const newHeight = Math.min(textareaRef.current.scrollHeight, 300)
        textareaRef.current.style.height = `${newHeight}px`
        containerRef.current.style.height = '' // Reset container height
        setIsExpanded(false)
      } else {
        setIsExpanded(true)
        containerRef.current.style.height = `${window.innerHeight * 0.5}px` // Adjust container height to 50% of window height
        textareaRef.current.style.height = '100%' // Ensure textarea takes full height
      }
    }
  }

  return (
    <div
      className="relative flex items-end space-x-2 border-t px-3 pb-3 pt-6"
      ref={containerRef}
    >
      {isExpanded ? (
        <ChevronDownIcon
          className="absolute -top-3 left-0 right-0 mx-auto h-6 w-6 cursor-pointer rounded-full border bg-white text-gray-400"
          onClick={handleExpand}
        />
      ) : (
        <ChevronUpIcon
          className="absolute -top-3 left-0 right-0 mx-auto h-6 w-6 cursor-pointer rounded-full border bg-white text-gray-400"
          onClick={handleExpand}
        />
      )}
      <Textarea
        ref={textareaRef}
        id="message"
        placeholder="Type your message..."
        className="h-full flex-1 resize-none overflow-auto bg-white text-base"
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
  )
}
