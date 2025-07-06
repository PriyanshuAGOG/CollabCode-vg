"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, Sparkles, Phone, Video, PhoneOff, Paperclip, Smile } from "lucide-react"

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: Date
  avatar: string
  type: "user" | "ai" | "system"
  isAiCommand?: boolean
}

interface PremiumChatPaneProps {
  isMeetingActive: boolean
  onStartMeeting: () => void
  onEndMeeting: () => void
}

export function PremiumChatPane({ isMeetingActive, onStartMeeting, onEndMeeting }: PremiumChatPaneProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: "Sarah Wilson",
      message: "Hey team! Ready to build something amazing? 🚀",
      timestamp: new Date(Date.now() - 300000),
      avatar: "SW",
      type: "user",
    },
    {
      id: "2",
      user: "Mike Johnson",
      message: "The new collaborative features are incredible!",
      timestamp: new Date(Date.now() - 240000),
      avatar: "MJ",
      type: "user",
    },
    {
      id: "3",
      user: "AI Assistant",
      message: "I'm here to help! Use @ai followed by your request to get coding assistance.",
      timestamp: new Date(Date.now() - 180000),
      avatar: "AI",
      type: "ai",
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!message.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      message: message.trim(),
      timestamp: new Date(),
      avatar: "YO",
      type: "user",
      isAiCommand: message.trim().startsWith("@ai"),
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage("")

    // Handle AI commands
    if (newMessage.isAiCommand) {
      setIsTyping(true)

      // Simulate AI processing
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          user: "AI Assistant",
          message: generateAIResponse(newMessage.message.replace("@ai", "").trim()),
          timestamp: new Date(),
          avatar: "AI",
          type: "ai",
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)
      }, 2000)
    }
  }

  const generateAIResponse = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase()

    if (lowerPrompt.includes("build") || lowerPrompt.includes("create")) {
      return `🚀 I'll help you build that! Here's what I'll create:

• Component structure with modern React patterns
• TypeScript interfaces for type safety  
• Tailwind CSS for premium styling
• State management with hooks
• Error handling and loading states

The code will be added to your editor. Would you like me to also create tests or documentation?`
    }

    if (lowerPrompt.includes("fix") || lowerPrompt.includes("debug")) {
      return `🔧 I'll analyze your code and fix the issues:

• Identifying syntax errors and warnings
• Optimizing performance bottlenecks
• Adding proper error boundaries
• Implementing best practices
• Ensuring accessibility compliance

Let me review your current code and provide specific fixes.`
    }

    if (lowerPrompt.includes("design") || lowerPrompt.includes("ui")) {
      return `🎨 I'll create a beautiful design for you:

• Modern, clean interface components
• Responsive layouts for all devices
• Premium color schemes and typography
• Smooth animations and transitions
• Accessibility-first approach

I can generate both the design mockup and the implementation code.`
    }

    return `✨ I understand you want help with: "${prompt}"

I can assist with:
• Building React/Next.js applications
• Creating beautiful UI components
• Writing TypeScript/JavaScript code
• Debugging and optimization
• Database integration
• API development

Please provide more details about what you'd like me to build!`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700/30 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Team Chat</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-gray-400">4 online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isMeetingActive ? (
              <>
                <Button size="sm" onClick={onStartMeeting} className="bg-green-600 hover:bg-green-700 text-white">
                  <Video className="w-4 h-4 mr-1" />
                  Meet
                </Button>
                <Button
                  size="sm"
                  onClick={onStartMeeting}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Phone className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={onEndMeeting} className="bg-red-600 hover:bg-red-700 text-white">
                <PhoneOff className="w-4 h-4 mr-1" />
                End
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-3 group">
              <Avatar className="w-8 h-8 border-2 border-gray-700">
                <AvatarFallback
                  className={`text-xs font-medium ${
                    msg.type === "ai"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  {msg.avatar}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{msg.user}</span>
                  {msg.type === "ai" && (
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                </div>

                <div
                  className={`p-3 rounded-xl max-w-md ${
                    msg.type === "ai"
                      ? "bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20"
                      : msg.user === "You"
                        ? "bg-blue-600 text-white ml-auto"
                        : "bg-gray-800/50 text-gray-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 border-2 border-gray-700">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-800/50 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700/30 bg-black/20 backdrop-blur-sm">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type @ai to get AI assistance..."
              className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 pr-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-1">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-1">
                <Smile className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          Use <span className="text-blue-400 font-medium">@ai</span> to get coding assistance • Press Enter to send
        </div>
      </div>
    </div>
  )
}
