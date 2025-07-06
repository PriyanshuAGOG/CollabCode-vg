"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Square, Trash2, Terminal } from "lucide-react"

interface ConsolePaneProps {
  code: string
  language: string
}

interface ConsoleMessage {
  id: string
  type: "output" | "error" | "input" | "system"
  content: string
  timestamp: Date
}

export function ConsolePane({ code, language }: ConsolePaneProps) {
  const [messages, setMessages] = useState<ConsoleMessage[]>([
    {
      id: "1",
      type: "system",
      content: "Console ready. Press Run to execute code.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const addMessage = (type: ConsoleMessage["type"], content: string) => {
    const newMessage: ConsoleMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const runCode = async () => {
    setIsRunning(true)
    addMessage("system", `Running ${language} code...`)

    // Simulate code execution
    setTimeout(() => {
      try {
        if (language === "javascript") {
          // Simulate JavaScript execution
          addMessage("output", "Todo app initialized")
          addMessage("output", "React components rendered successfully")
          addMessage("output", "Application ready")
        } else if (language === "python") {
          // Simulate Python execution
          addMessage("output", "Python script executed")
          addMessage("output", "No errors found")
        } else {
          addMessage("output", `${language} code executed successfully`)
        }
      } catch (error) {
        addMessage("error", `Error: ${error}`)
      }
      setIsRunning(false)
    }, 1000)
  }

  const stopExecution = () => {
    setIsRunning(false)
    addMessage("system", "Execution stopped")
  }

  const clearConsole = () => {
    setMessages([])
  }

  const handleInputSubmit = () => {
    if (input.trim()) {
      addMessage("input", `> ${input}`)

      // Simulate input processing
      setTimeout(() => {
        addMessage("output", `Input received: ${input}`)
      }, 100)

      setInput("")
    }
  }

  const getMessageColor = (type: ConsoleMessage["type"]) => {
    switch (type) {
      case "error":
        return "text-red-400"
      case "input":
        return "text-blue-400"
      case "system":
        return "text-yellow-400"
      default:
        return "text-green-400"
    }
  }

  const getMessagePrefix = (type: ConsoleMessage["type"]) => {
    switch (type) {
      case "error":
        return "[ERROR]"
      case "input":
        return "[INPUT]"
      case "system":
        return "[SYSTEM]"
      default:
        return "[OUTPUT]"
    }
  }

  return (
    <div className="h-full bg-black flex flex-col">
      {/* Console Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <h3 className="text-white font-medium">Console</h3>
          <span className="text-xs text-gray-400">({language})</span>
        </div>

        <div className="flex items-center gap-2">
          {!isRunning ? (
            <Button size="sm" onClick={runCode} className="bg-green-500 hover:bg-green-600 text-white">
              <Play className="w-4 h-4 mr-1" />
              Run
            </Button>
          ) : (
            <Button size="sm" onClick={stopExecution} className="bg-red-500 hover:bg-red-600 text-white">
              <Square className="w-4 h-4 mr-1" />
              Stop
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={clearConsole}
            className="border-gray-600 text-white hover:bg-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Console Output */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-1 font-mono text-sm">
          {messages.map((message) => (
            <div key={message.id} className={`${getMessageColor(message.type)} leading-relaxed`}>
              <span className="text-gray-500 text-xs mr-2">{message.timestamp.toLocaleTimeString()}</span>
              <span className="text-gray-400 mr-2">{getMessagePrefix(message.type)}</span>
              <span>{message.content}</span>
            </div>
          ))}

          {isRunning && (
            <div className="text-yellow-400 animate-pulse">
              <span className="text-gray-500 text-xs mr-2">{new Date().toLocaleTimeString()}</span>
              <span className="text-gray-400 mr-2">[SYSTEM]</span>
              <span>Executing...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-3">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center bg-gray-800 rounded border border-gray-600">
            <span className="text-green-400 px-3 font-mono">$</span>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleInputSubmit()}
              placeholder="Enter input for your program..."
              className="border-0 bg-transparent text-white font-mono focus:ring-0"
            />
          </div>
          <Button size="sm" onClick={handleInputSubmit} className="bg-blue-500 hover:bg-blue-600 text-white">
            Send
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Press Enter or click Send to provide input to your running program</p>
      </div>
    </div>
  )
}
