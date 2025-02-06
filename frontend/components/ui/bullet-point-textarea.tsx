"use client"

import { useState, useRef, type KeyboardEvent, type FocusEvent } from "react"
import { Textarea } from "@/components/ui/textarea"

export function BulletPointTextarea() {
  const [content, setContent] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const cursorPosition = e.currentTarget.selectionStart
      const currentContent = e.currentTarget.value

      const beforeCursor = currentContent.substring(0, cursorPosition)
      const afterCursor = currentContent.substring(cursorPosition)

      const currentLineStart = beforeCursor.lastIndexOf("\n") + 1
      const currentLine = beforeCursor.substring(currentLineStart)
      const hasBullet = currentLine.trimStart().startsWith("• ")

      let newContent
      if (hasBullet && currentLine.trim() === "• ") {
        newContent = beforeCursor.substring(0, currentLineStart) + afterCursor
      } else {
        newContent = beforeCursor + "\n• " + afterCursor
      }

      setContent(newContent)

      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = cursorPosition + 3
          textareaRef.current.setSelectionRange(newPosition, newPosition)
        }
      }, 0)
    }
  }

  const handleFocus = (e: FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true)
    if (!content.trim()) {
      setContent("• ")
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(2, 2)
        }
      }, 0)
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (content.trim() === "•") {
      setContent("")
    }
  }

  return (
    <Textarea
      ref={textareaRef}
      value={content}
      onChange={(e) => setContent(e.target.value)}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={!isFocused ? "Enter text here..." : ""}
      className="min-h-[200px]"
    />
  )
}
