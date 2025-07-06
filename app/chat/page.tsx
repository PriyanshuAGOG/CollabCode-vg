"use client"
import { ModernChatInterface } from "@/components/chat/ModernChatInterface"
import { AuthProvider } from "@/components/auth/AuthProvider"

interface Message {
  id: string
  isAI: boolean
  text: string
  timestamp: Date
  user?: string
  avatar?: string
}

interface TeamMessage {
  id: string
  user: string
  text: string
  timestamp: Date
  avatar: string
  channel: string
}

export default function ChatPage() {
  return (
    <AuthProvider>
      <ModernChatInterface />
    </AuthProvider>
  )
}
