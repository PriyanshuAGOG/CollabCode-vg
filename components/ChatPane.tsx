"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, X, Users } from "lucide-react"

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: Date
  avatar: string
}

export function ChatPane() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: "Jane Smith",
      message: "Hey everyone! Ready to build something amazing?",
      timestamp: new Date(Date.now() - 300000),
      avatar: "JS",
    },
    {
      id: "2",
      user: "Mike Johnson",
      message: "I love the AI suggestions feature",
      timestamp: new Date(Date.now() - 240000),
      avatar: "MJ",
    },
    {
      id: "3",
      user: "Sarah Wilson",
      message: "The real-time collaboration is so smooth!",
      timestamp: new Date(Date.now() - 180000),
      avatar: "SW",
    },
    {
      id: "4",
      user: "Jane Smith",
      message: "Should we start with the todo component?",
      timestamp: new Date(Date.now() - 120000),
      avatar: "JS",
    },
  ])
  const [unreadCount, setUnreadCount] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (!isOpen && messages.length > 4) {
      setUnreadCount(messages.length - 4)
    } else {
      setUnreadCount(0)
    }
  }, [messages, isOpen])

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: "You",
        message: message.trim(),
        timestamp: new Date(),
        avatar: "YO",
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isOpen) {
    return (
      <Button size="sm" onClick={() => setIsOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white relative">
        <MessageCircle className="w-4 h-4 mr-1" />
        Chat
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </Badge>
        )}
      </Button>
    )
  }

  return (
    <div className="w-80 h-96 bg-gray-800 border border-gray-600 rounded-lg flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-blue-400" />
          <span className="text-white font-medium">Team Chat</span>
          <Badge variant="outline" className="border-gray-600 text-gray-400">
            <Users className="w-3 h-3 mr-1" />4
          </Badge>
        </div>
        <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
                {msg.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white text-sm font-medium">{msg.user}</span>
                  <span className="text-gray-500 text-xs">{formatTime(msg.timestamp)}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed break-words">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t border-gray-700 p-3">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="bg-gray-700 border-gray-600 text-white text-sm"
          />
          <Button size="sm" onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
