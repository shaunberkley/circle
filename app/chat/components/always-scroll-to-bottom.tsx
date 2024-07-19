import { useRef, useEffect } from 'react'

export const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    elementRef.current?.scrollIntoView({ behavior: 'smooth' })
  })
  return <div ref={elementRef} />
}
