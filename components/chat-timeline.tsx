import React, { useState, useEffect, useRef } from 'react';
import { format, getYear, getMonth } from 'date-fns';
import { Message } from './chat';

interface TimelineProps {
  messages: Message[];
  onScrollToDate: (date: string) => void;
}

const groupDates = (messages: { timestamp: Date }[]) => {
  const years: { [key: number]: boolean[] } = {};

  messages.forEach(({ timestamp }) => {
    const year = getYear(timestamp);
    const month = getMonth(timestamp);

    if (!years[year]) {
      years[year] = Array(12).fill(false);
    }
    years[year][month] = true;
  });

  return years;
};

export function Timeline({ messages, onScrollToDate }: TimelineProps) {
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const position = e.clientY - rect.top;
    const messageIndex = Math.floor((position / rect.height) * messages.length);
    const messageDate = messages[messageIndex]?.timestamp;
    setHoverDate(messageDate ? format(messageDate, 'MMM yyyy') : null);
    setCurrentPosition(position);
  };

  const handleMouseLeave = () => {
    setHoverDate(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const position = e.clientY - rect.top;
    const messageIndex = Math.floor((position / rect.height) * messages.length);
    const messageDate = messages[messageIndex]?.timestamp;
    if (messageDate) {
      onScrollToDate(format(messageDate, 'MMM yyyy'));
    }
  };

  const years = groupDates(messages);

  const calculateDynamicSpacing = () => {
    // Calculate total number of items (years + months)
    const totalItems = Object.keys(years).length * 13; // 12 months + 1 year label for each year
    const screenHeight = window.innerHeight;
    const maxItemsVisible = Math.floor(screenHeight / 50); // Approximate item height

    return totalItems > maxItemsVisible ? 'quarterly' : 'monthly';
  };

  const renderDots = (hasMessages: boolean, label: string) => (
    <div className="relative w-full flex items-center justify-center" aria-label={label}>
      <div className={`w-2 h-2 rounded-full ${hasMessages ? 'bg-muted' : 'bg-transparent'} mb-2`}></div>
    </div>
  );

  const spacing = calculateDynamicSpacing();

  return (
    <div
      ref={timelineRef}
      className="h-full w-10 bg-background z-20 flex flex-col items-center justify-between py-8 transform transition-transform duration-300"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="relative w-full h-full">
        {hoverDate && (
          <div
            className="absolute right-0 px-2 py-1 bg-white border-b border-blue-500 rounded-t shadow text-sm text-center whitespace-nowrap pointer-events-none"
            style={{ transform: `translate3d(0px, ${currentPosition - 60}px, 0px)` }}
          >
            {hoverDate}
          </div>
        )}
        <div className="flex flex-col items-center w-full h-full flex-1">
          {Object.keys(years).map((year) => (
            <div key={year} className="flex flex-col items-center w-full">
              <div className="text-xs text-muted-foreground">{year}</div>
              {years[parseInt(year)].map((hasMessages, monthIndex) => {
                if (spacing === 'monthly') {
                  const monthLabel = format(new Date(parseInt(year), monthIndex), 'MMM yyyy');
                  return (
                    <div key={`${year}-${monthIndex}`} className="w-full flex items-center justify-center">
                      {renderDots(hasMessages, monthLabel)}
                    </div>
                  );
                } else if (spacing === 'quarterly' && monthIndex % 3 === 0) {
                  const quarterLabel = `Q${Math.floor(monthIndex / 3) + 1} ${year}`;
                  return (
                    <div key={`${year}-Q${Math.floor(monthIndex / 3)}`} className="w-full flex items-center justify-center">
                      {renderDots(hasMessages, quarterLabel)}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
