"use client"

import React, { useState, useEffect } from "react"

interface StreamingTextProps {
  text: string
  speed?: number
  onComplete?: () => void
  isStreaming?: boolean
}

export function StreamingText({ text, speed = 30, onComplete, isStreaming = true }: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(!isStreaming)

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(text)
      setIsComplete(true)
      return
    }

    setDisplayedText("")
    setIsComplete(false)
    
    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setIsComplete(true)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed, isStreaming, onComplete])

  return (
    <span>
      {displayedText}
      {!isComplete && <span className="inline-block w-0.5 h-4 bg-foreground/60 ml-0.5 animate-pulse" />}
    </span>
  )
}

interface ThinkingIndicatorProps {
  show: boolean
}

export function ThinkingIndicator({ show }: ThinkingIndicatorProps) {
  if (!show) return null

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span>思考中</span>
    </div>
  )
}
