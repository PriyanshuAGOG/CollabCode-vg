"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Send, X, Lightbulb, Code, Palette } from "lucide-react"

interface AIMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export function AIBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        'Hi! I\'m your AI assistant. I can help you build apps, write code, create designs, and more. Try asking me something like "Build a React todo app" or "Create a login form".',
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const quickActions = [
    {
      icon: Code,
      label: "Build a React app",
      prompt: "Build a React todo application with add, delete, and toggle functionality",
    },
    { icon: Palette, label: "Create a design", prompt: "Create a modern login form design with a dark theme" },
    {
      icon: Lightbulb,
      label: "Optimize code",
      prompt: "Optimize the current code for better performance and readability",
    },
  ]

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(userMessage.content),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase()

    if (lowerPrompt.includes("todo") || lowerPrompt.includes("task")) {
      return `I'll help you build a todo app! Here's what I'll create:

1. A React component with state management
2. Add/delete/toggle functionality
3. Clean, modern styling
4. Local storage persistence

The code will be added to your editor. Would you like me to also create a matching design in the canvas?`
    }

    if (lowerPrompt.includes("login") || lowerPrompt.includes("form")) {
      return `I'll create a beautiful login form for you! This will include:

1. Email and password fields
2. Validation and error handling
3. Responsive design
4. Dark theme styling

I can generate both the code and the visual design. Which would you prefer first?`
    }

    if (lowerPrompt.includes("optimize") || lowerPrompt.includes("improve")) {
      return `I'll analyze your current code and suggest optimizations:

1. Performance improvements (useMemo, useCallback)
2. Code structure and readability
3. Best practices implementation
4. Accessibility enhancements

Let me review your code and provide specific suggestions.`
    }

    return `I understand you want help with: "${prompt}"

I can assist with:
• Writing React/JavaScript/Python code
• Creating UI designs and components
• Optimizing existing code
• Building complete applications
• Debugging and troubleshooting

Could you provide more specific details about what you'd like me to build or help with?`
  }

  const handleQuickAction = (prompt: string) => {
    setInput(prompt)
    sendMessage()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <Sparkles className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white text-black rounded-lg shadow-2xl flex flex-col border border-gray-200">
      {/* AI Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-medium">AI Assistant</h3>
            <p className="text-xs opacity-90">Ready to help you build</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white hover:bg-opacity-20"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
        <div className="flex gap-1">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction(action.prompt)}
              className="text-xs h-8 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
            >
              <action.icon className="w-3 h-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <span className="text-sm text-gray-600 ml-2">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to build something..."
            className="text-sm border-gray-300 focus:border-blue-500"
            disabled={isLoading}
          />
          <Button
            size="sm"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  )
}
