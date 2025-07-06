"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useCollaboration } from "@/contexts/CollaborationContext"
import type { CodeChange } from "@/lib/websocket"
import { Badge } from "@/components/ui/badge"
import { Users, Wifi, WifiOff, AlertCircle } from "lucide-react"

interface CollaborativeCodeEditorProps {
  code: string
  setCode: (code: string) => void
  language: string
  activeFile: string
  className?: string
}

export function CollaborativeCodeEditor({
  code,
  setCode,
  language,
  activeFile,
  className = "",
}: CollaborativeCodeEditorProps) {
  const { collaborators, cursors, isConnected, connectionStatus, sendCodeChange, sendCursorUpdate, sendFileChange } =
    useCollaboration()

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const [localCode, setLocalCode] = useState(code)
  const [cursorPosition, setCursorPosition] = useState({ line: 0, column: 0 })
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Handle incoming code changes
  useEffect(() => {
    const handleCodeChange = (event: CustomEvent<CodeChange>) => {
      const change = event.detail
      applyCodeChange(change)
    }

    window.addEventListener("collaboration:code_change", handleCodeChange as EventListener)
    return () => {
      window.removeEventListener("collaboration:code_change", handleCodeChange as EventListener)
    }
  }, [])

  // Sync local code with prop
  useEffect(() => {
    setLocalCode(code)
  }, [code])

  // Send file change when active file changes
  useEffect(() => {
    if (activeFile) {
      sendFileChange(activeFile)
    }
  }, [activeFile, sendFileChange])

  const applyCodeChange = useCallback(
    (change: CodeChange) => {
      setLocalCode((prevCode) => {
        const lines = prevCode.split("\n")
        const { line, column } = change.position

        if (change.operation === "insert") {
          const targetLine = lines[line] || ""
          const before = targetLine.substring(0, column)
          const after = targetLine.substring(column)
          lines[line] = before + change.content + after
        } else if (change.operation === "delete") {
          const targetLine = lines[line] || ""
          const before = targetLine.substring(0, column)
          const after = targetLine.substring(column + (change.length || 0))
          lines[line] = before + after
        } else if (change.operation === "replace") {
          const targetLine = lines[line] || ""
          const before = targetLine.substring(0, column)
          const after = targetLine.substring(column + (change.length || 0))
          lines[line] = before + change.content + after
        }

        const newCode = lines.join("\n")
        setCode(newCode)
        return newCode
      })
    },
    [setCode],
  )

  const handleCodeChange = useCallback(
    (newCode: string) => {
      const oldCode = localCode
      setLocalCode(newCode)
      setCode(newCode)

      // Calculate diff and send change
      if (newCode !== oldCode) {
        const change = calculateChange(oldCode, newCode, cursorPosition)
        if (change) {
          sendCodeChange(change)
        }
      }

      // Handle typing indicator
      setIsTyping(true)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
      }, 1000)
    },
    [localCode, setCode, sendCodeChange, cursorPosition],
  )

  const handleCursorChange = useCallback(() => {
    if (!editorRef.current) return

    const textarea = editorRef.current
    const { selectionStart, selectionEnd } = textarea
    const textBeforeCursor = textarea.value.substring(0, selectionStart)
    const lines = textBeforeCursor.split("\n")
    const line = lines.length - 1
    const column = lines[lines.length - 1].length

    const newPosition = { line, column }
    setCursorPosition(newPosition)

    const selection =
      selectionStart !== selectionEnd
        ? {
            start: newPosition,
            end: calculatePosition(textarea.value, selectionEnd),
          }
        : undefined

    sendCursorUpdate(activeFile, newPosition, selection)
  }, [activeFile, sendCursorUpdate])

  const calculateChange = (
    oldCode: string,
    newCode: string,
    position: { line: number; column: number },
  ): Omit<CodeChange, "id" | "timestamp" | "userId" | "username"> | null => {
    if (oldCode.length < newCode.length) {
      // Insertion
      const insertedText = newCode.substring(oldCode.length)
      return {
        operation: "insert",
        position,
        content: insertedText,
      }
    } else if (oldCode.length > newCode.length) {
      // Deletion
      const deletedLength = oldCode.length - newCode.length
      return {
        operation: "delete",
        position,
        content: "",
        length: deletedLength,
      }
    }
    return null
  }

  const calculatePosition = (text: string, offset: number) => {
    const textBeforeOffset = text.substring(0, offset)
    const lines = textBeforeOffset.split("\n")
    return {
      line: lines.length - 1,
      column: lines[lines.length - 1].length,
    }
  }

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="w-4 h-4 text-green-500" />
      case "connecting":
        return <Wifi className="w-4 h-4 text-yellow-500 animate-pulse" />
      case "disconnected":
        return <WifiOff className="w-4 h-4 text-red-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <WifiOff className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Collaboration Status Bar */}
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          {getConnectionStatusIcon()}
          <span className="text-sm text-gray-300 capitalize">{connectionStatus}</span>
          {collaborators.length > 0 && (
            <>
              <div className="w-px h-4 bg-gray-600 mx-2" />
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">{collaborators.length} online</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          {collaborators.slice(0, 5).map((collaborator) => (
            <div
              key={collaborator.userId}
              className="relative"
              title={`${collaborator.username}${collaborator.currentFile ? ` - ${collaborator.currentFile}` : ""}`}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                style={{ backgroundColor: collaborator.color }}
              >
                {collaborator.username.charAt(0).toUpperCase()}
              </div>
              {collaborator.isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
              )}
            </div>
          ))}
          {collaborators.length > 5 && (
            <Badge variant="secondary" className="text-xs">
              +{collaborators.length - 5}
            </Badge>
          )}
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 relative">
        <textarea
          ref={editorRef}
          value={localCode}
          onChange={(e) => handleCodeChange(e.target.value)}
          onSelect={handleCursorChange}
          onKeyUp={handleCursorChange}
          onClick={handleCursorChange}
          className="w-full h-full p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none outline-none border-none"
          style={{ fontFamily: "Fira Code, monospace" }}
          placeholder="Start typing your code..."
          spellCheck={false}
        />

        {/* Collaborative Cursors */}
        {cursors.map((cursor) => (
          <div
            key={cursor.userId}
            className="absolute pointer-events-none z-10"
            style={{
              // This is a simplified cursor positioning - in a real implementation,
              // you'd need to calculate exact pixel positions based on line height and character width
              top: `${cursor.position.line * 20 + 16}px`,
              left: `${cursor.position.column * 8 + 16}px`,
            }}
          >
            <div className="w-0.5 h-5 animate-pulse" style={{ backgroundColor: cursor.color }} />
            <div
              className="absolute -top-6 left-0 px-1 py-0.5 text-xs text-white rounded whitespace-nowrap"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.username}
            </div>
          </div>
        ))}

        {/* Typing Indicators */}
        {isTyping && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">Typing...</div>
        )}
      </div>

      {/* Connection Issues */}
      {!isConnected && (
        <div className="p-2 bg-yellow-500 text-yellow-900 text-sm text-center">
          Connection lost. Attempting to reconnect...
        </div>
      )}
    </div>
  )
}
