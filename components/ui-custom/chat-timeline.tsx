import React, { useState, useRef } from 'react'
import { format, getYear, getMonth } from 'date-fns'
import { Message } from '../../app/chat/page'

interface TimelineProps {
  messages: Message[]
  onScrollToDate: (date: string) => void
}

const groupDates = (messages: { timestamp: Date }[]) => {
  const years: { [key: number]: boolean[] } = {}

  messages.forEach(({ timestamp }) => {
    const year = getYear(timestamp)
    const month = getMonth(timestamp)

    if (!years[year]) {
      years[year] = Array(12).fill(false)
    }
    years[year][month] = true
  })

  return years
}

export function Timeline({ messages, onScrollToDate }: TimelineProps) {
  const [hoverDate, setHoverDate] = useState<string | null>(null)
  const [currentPosition, setCurrentPosition] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const timeline = e.currentTarget
    const rect = timeline.getBoundingClientRect()
    const position = e.clientY - rect.top
    const messageIndex = Math.floor((position / rect.height) * messages.length)
    const messageDate = messages[messageIndex]?.timestamp
    setHoverDate(messageDate ? format(messageDate, 'MMM yyyy') : null)
    setCurrentPosition(position)
  }

  const handleMouseLeave = () => {
    setHoverDate(null)
  }

  const handleClick = (e: React.MouseEvent) => {
    const timeline = e.currentTarget
    const rect = timeline.getBoundingClientRect()
    const position = e.clientY - rect.top
    const messageIndex = Math.floor((position / rect.height) * messages.length)
    const messageDate = messages[messageIndex]?.timestamp
    if (messageDate) {
      onScrollToDate(format(messageDate, 'MMM yyyy'))
    }
  }

  const years = groupDates(messages)

  const calculateDynamicSpacing = () => {
    // Calculate total number of items (years + months)
    const totalItems = Object.keys(years).length * 13 // 12 months + 1 year label for each year
    const screenHeight = window.innerHeight
    const maxItemsVisible = Math.floor(screenHeight / 50) // Approximate item height

    return totalItems > maxItemsVisible ? 'quarterly' : 'monthly'
  }

  const renderDots = (hasMessages: boolean, label: string) => (
    <div
      className="relative flex w-full items-center justify-center"
      aria-label={label}
    >
      <div
        className={`h-2 w-2 rounded-full ${hasMessages ? 'bg-muted' : 'bg-transparent'} mb-2`}
      ></div>
    </div>
  )

  const spacing = calculateDynamicSpacing()

  return (
    <div
      ref={timelineRef}
      className="z-20 flex h-full w-10 transform flex-col items-center justify-between bg-background py-8 transition-transform duration-300"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="relative h-full w-full">
        {hoverDate && (
          <div
            className="pointer-events-none absolute right-0 whitespace-nowrap rounded-t border-b border-blue-500 bg-white px-2 py-1 text-center text-sm shadow"
            style={{
              transform: `translate3d(0px, ${currentPosition - 60}px, 0px)`,
            }}
          >
            {hoverDate}
          </div>
        )}
        <div className="flex h-full w-full flex-1 flex-col items-center">
          {Object.keys(years).map((year) => (
            <div key={year} className="flex w-full flex-col items-center">
              <div className="text-xs text-muted-foreground">{year}</div>
              {years[parseInt(year)].map((hasMessages, monthIndex) => {
                if (spacing === 'monthly') {
                  const monthLabel = format(
                    new Date(parseInt(year), monthIndex),
                    'MMM yyyy'
                  )
                  return (
                    <div
                      key={`${year}-${monthIndex}`}
                      className="flex w-full items-center justify-center"
                    >
                      {renderDots(hasMessages, monthLabel)}
                    </div>
                  )
                } else if (spacing === 'quarterly' && monthIndex % 3 === 0) {
                  const quarterLabel = `Q${Math.floor(monthIndex / 3) + 1} ${year}`
                  return (
                    <div
                      key={`${year}-Q${Math.floor(monthIndex / 3)}`}
                      className="flex w-full items-center justify-center"
                    >
                      {renderDots(hasMessages, quarterLabel)}
                    </div>
                  )
                }
                return null
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
