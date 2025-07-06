"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Send, Sparkles, Phone, Video, PhoneOff, Paperclip, Smile, Zap, Brain, Cpu } from "lucide-react"

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: Date
  avatar: string
  type: "user" | "ai" | "system"
  isAiCommand?: boolean
  model?: string
}

interface FuturisticChatPaneProps {
  isMeetingActive: boolean
  onStartMeeting: () => void
  onEndMeeting: () => void
}

const AI_MODELS = [
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI", icon: Brain },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", icon: Sparkles },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google", icon: Zap },
  { id: "llama-3-70b", name: "Llama 3 70B", provider: "Meta", icon: Cpu },
  { id: "mixtral-8x7b", name: "Mixtral 8x7B", provider: "Mistral", icon: Brain },
]

export function FuturisticChatPane({ isMeetingActive, onStartMeeting, onEndMeeting }: FuturisticChatPaneProps) {
  const [message, setMessage] = useState("")
  const [selectedModel, setSelectedModel] = useState("gpt-4-turbo")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: "Sarah Wilson",
      message: "Ready to build something amazing? 🚀",
      timestamp: new Date(Date.now() - 300000),
      avatar: "SW",
      type: "user",
    },
    {
      id: "2",
      user: "Mike Johnson",
      message: "The new AI integration looks great! 🤯",
      timestamp: new Date(Date.now() - 240000),
      avatar: "MJ",
      type: "user",
    },
    {
      id: "3",
      user: "AI Assistant",
      message: "🤖 AI ready! Use @ai to get coding help and suggestions.",
      timestamp: new Date(Date.now() - 180000),
      avatar: "AI",
      type: "ai",
      model: "gpt-4-turbo",
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

    // Handle AI commands with OpenRouter API
    if (newMessage.isAiCommand) {
      setIsTyping(true)

      try {
        const aiResponse = await callOpenRouterAPI(newMessage.message.replace("@ai", "").trim(), selectedModel)

        const responseMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          user: "AI Assistant",
          message: aiResponse,
          timestamp: new Date(),
          avatar: "AI",
          type: "ai",
          model: selectedModel,
        }

        setMessages((prev) => [...prev, responseMessage])
      } catch (error) {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          user: "AI Assistant",
          message: "⚠️ AI temporarily offline. Please try again.",
          timestamp: new Date(),
          avatar: "AI",
          type: "ai",
          model: selectedModel,
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsTyping(false)
      }
    }
  }

  const callOpenRouterAPI = async (prompt: string, model: string): Promise<string> => {
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          model,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      return data.message || "Unable to generate response."
    } catch (error) {
      console.error("AI API Error:", error)
      throw error
    }
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

  const selectedModelInfo = AI_MODELS.find((m) => m.id === selectedModel)

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Chat Header */}
      <div className="relative p-4 lg:p-6 border-b border-cyan-500/20 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-400 rounded-full border-2 border-black animate-pulse shadow-lg" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base lg:text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Team Chat
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg" />
                <span className="text-xs text-cyan-300 font-medium">4 online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isMeetingActive ? (
              <>
                <Button
                  size="sm"
                  onClick={onStartMeeting}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transition-all duration-300"
                >
                  <Video className="w-4 h-4 mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">Meet</span>
                </Button>
                <Button
                  size="sm"
                  onClick={onStartMeeting}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg transition-all duration-300"
                >
                  <Phone className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={onEndMeeting}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg transition-all duration-300"
              >
                <PhoneOff className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">End</span>
              </Button>
            )}
          </div>
        </div>

        {/* AI Model Selector */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-cyan-300 font-medium">AI Model:</span>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-full lg:w-48 bg-black/50 border-cyan-500/30 text-white hover:border-cyan-400/50 transition-all duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-xl border-cyan-500/30">
              {AI_MODELS.map((model) => {
                const Icon = model.icon
                return (
                  <SelectItem key={model.id} value={model.id} className="text-white hover:bg-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <span className="hidden lg:inline">{model.name}</span>
                      <span className="lg:hidden">{model.provider}</span>
                      <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 text-xs">
                        {model.provider}
                      </Badge>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 lg:p-6 relative" ref={scrollRef}>
        <div className="space-y-4 lg:space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-3 lg:gap-4 group">
              <Avatar className="w-8 h-8 lg:w-10 lg:h-10 border-2 border-cyan-500/30 shadow-lg">
                <AvatarFallback
                  className={`text-xs lg:text-sm font-bold ${
                    msg.type === "ai"
                      ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                  }`}
                >
                  {msg.avatar}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 lg:gap-3 mb-2">
                  <span className="text-sm font-bold text-white truncate">{msg.user}</span>
                  {msg.type === "ai" && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs shadow-lg">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI
                      </Badge>
                      {msg.model && (
                        <Badge
                          variant="outline"
                          className="border-cyan-500/30 text-cyan-300 text-xs hidden lg:inline-flex"
                        >
                          {AI_MODELS.find((m) => m.id === msg.model)?.name}
                        </Badge>
                      )}
                    </div>
                  )}
                  <span className="text-xs text-cyan-400">{formatTime(msg.timestamp)}</span>
                </div>

                <div
                  className={`p-3 lg:p-4 rounded-2xl max-w-full lg:max-w-md backdrop-blur-sm transition-all duration-300 ${
                    msg.type === "ai"
                      ? "bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-500/20 shadow-lg shadow-cyan-500/10"
                      : msg.user === "You"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-auto shadow-lg shadow-blue-500/20"
                        : "bg-black/30 text-gray-200 border border-gray-700/30"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 lg:gap-4">
              <Avatar className="w-8 h-8 lg:w-10 lg:h-10 border-2 border-cyan-500/30 shadow-lg">
                <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs lg:text-sm font-bold">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border border-cyan-500/20 p-3 lg:p-4 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-lg" />
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce shadow-lg"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce shadow-lg"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                  <span className="text-sm text-cyan-300 font-medium">AI thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="relative p-4 lg:p-6 border-t border-cyan-500/20 bg-black/40 backdrop-blur-xl">
        <div className="flex gap-3 lg:gap-4">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type @ai for AI help..."
              className="bg-black/50 border-cyan-500/30 text-white placeholder-cyan-400/60 pr-20 lg:pr-24 h-10 lg:h-12 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-200 backdrop-blur-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 lg:gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-cyan-400 hover:text-white hover:bg-cyan-500/20 p-1 lg:p-2 rounded-xl transition-all duration-200"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-cyan-400 hover:text-white hover:bg-cyan-500/20 p-1 lg:p-2 rounded-xl transition-all duration-200"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white h-10 lg:h-12 px-4 lg:px-6 rounded-2xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50"
          >
            <Send className="w-4 h-4 lg:w-5 lg:h-5" />
          </Button>
        </div>

        <div className="mt-3 text-xs text-cyan-400/80 font-medium">
          Use <span className="text-cyan-300 font-bold">@ai</span> to activate {selectedModelInfo?.name} • Press Enter
          to send
        </div>
      </div>
    </div>
  )
}
