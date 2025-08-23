"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Hash,
  Volume2,
  Video,
  Phone,
  UserPlus,
  Pin,
  Search,
  Send,
  Smile,
  Paperclip,
  Gift,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Settings,
} from "lucide-react"
import {
  client,
  dbId,
  collections,
  getTeamRooms,
  getRoomMessages,
  sendMessage as appwriteSendMessage,
  startCall,
  joinCall,
  endCall,
} from "@/lib/appwrite"
import { useAuth } from "@/components/auth/AuthProvider"

interface Message {
  id: string
  content: string
  author: {
    id: string
    username: string
    avatar_url?: string
  }
  created_at: string
  edited_at?: string
  reply_to?: {
    id: string
    content: string
    author: string
  }
}

interface Channel {
  id: string
  name: string
  type: "text" | "voice" | "video"
  description?: string
}

interface VoiceState {
  user_id: string
  is_muted: boolean
  is_deafened: boolean
  is_video_enabled: boolean
  user: {
    username: string
    avatar_url?: string
  }
}

interface DiscordChatAreaProps {
  channelId: string | null
  channelType: "channel" | "dm"
  serverId?: string | null
}

export function DiscordChatArea({ channelId, channelType, serverId }: DiscordChatAreaProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [channel, setChannel] = useState<Channel | null>(null)
  const [newMessage, setNewMessage] = useState("")
  // TODO: Implement voice chat with Jitsi
  // const [voiceStates, setVoiceStates] = useState<VoiceState[]>([])
  // const [isInVoice, setIsInVoice] = useState(false)
  // const [isMuted, setIsMuted] = useState(false)
  // const [isDeafened, setIsDeafened] = useState(false)
  // const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (channelId) {
      loadChannel()
      loadMessages()
      if (channelType === "channel") {
        // loadVoiceStates()
        const unsubscribe = subscribeToMessages()
        // const unsubscribeVoice = subscribeToVoiceStates()
        return () => {
          unsubscribe?.();
          // unsubscribeVoice?.();
        }
      }
    }
  }, [channelId, channelType])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadChannel = async () => {
    if (channelType === "channel" && channelId) {
      const { data, error } = await getRoom(channelId);
      if (!error && data) {
        setChannel(data as any); // The type from appwrite is Document, not Channel
      }
    } else {
      // For DMs, we'd load the other user's info
      setChannel({
        id: channelId!,
        name: "Direct Message",
        type: "text",
      })
    }
  }

  const loadMessages = async () => {
    if (!channelId) return;
    const { data, error } = await getRoomMessages(channelId);

    if (!error && data) {
      const formattedMessages = data.map((msg: any) => ({ // I've added : any here because the user data is not fetched yet
        id: msg.$id,
        content: msg.content,
        author: {
          id: msg.user_id,
          username: "loading...", // TODO: fetch user data
          avatar_url: "",
        },
        created_at: msg.$createdAt,
        edited_at: msg.$updatedAt,
      }));
      setMessages(formattedMessages as Message[]);
    }
  }

  const subscribeToMessages = () => {
    if (!channelId) return;

    const channel = `databases.${dbId}.collections.${collections.messages}.documents`
    const unsubscribe = client.subscribe(channel, (response) => {
      if (response.events.includes(`databases.${dbId}.collections.${collections.messages}.documents.*.create`)) {
        const message = response.payload as any;
        if (message.room_id === channelId) {
          // In a real app, you'd fetch the full message with author info
          console.log("New message:", message)
          loadMessages() // Reload messages for simplicity
        }
      }
    });

    return unsubscribe;
  }

  // TODO: Implement voice chat with Jitsi
  // const loadVoiceStates = async () => { ... }
  // const subscribeToVoiceStates = () => { ... }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !channelId) return

    const { error } = await appwriteSendMessage(
      channelId,
      newMessage.trim(),
      "text", // type
      user.$id
    );

    if (!error) {
      setNewMessage("")
    }
  }

  // TODO: Implement voice chat with Jitsi
  // const joinVoiceChannel = async () => { ... }
  // const leaveVoiceChannel = async () => { ... }
  // const toggleMute = async () => { ... }
  // const toggleVideo = async () => { ... }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  if (!channelId || !channel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#0A0A0F] to-[#1A1A2E]">
        <div className="text-center">
          <Hash className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Channel Selected</h3>
          <p className="text-gray-400">Select a channel or start a conversation</p>
        </div>
      </div>
    )
  }

  const isVoiceChannel = channel.type === "voice" || channel.type === "video"

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-[#0A0A0F] to-[#1A1A2E]">
      {/* Channel Header */}
      <div className="p-4 border-b border-gray-700/30 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {channel.type === "video" ? (
                <Video className="w-5 h-5 text-gray-400" />
              ) : channel.type === "voice" ? (
                <Volume2 className="w-5 h-5 text-gray-400" />
              ) : (
                <Hash className="w-5 h-5 text-gray-400" />
              )}
              <h2 className="text-white font-bold text-lg">{channel.name}</h2>
            </div>
            {channel.description && <div className="hidden md:block w-px h-6 bg-gray-600" />}
            {channel.description && <p className="hidden md:block text-gray-400 text-sm">{channel.description}</p>}
          </div>

          <div className="flex items-center gap-2">
            {/* TODO: Implement voice chat with Jitsi */}
            {/* {isVoiceChannel && !isInVoice && ( ... )} */}
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <UserPlus className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <Pin className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* TODO: Implement voice chat with Jitsi */}
      {/* Voice Channel Users */}
      {/* {isVoiceChannel && voiceStates.length > 0 && ( ... )} */}

      {/* Messages Area */}
      {/* {!isVoiceChannel && ( */}
        <>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => {
                const showAvatar = index === 0 || messages[index - 1].author.id !== message.author.id
                const isConsecutive = index > 0 && messages[index - 1].author.id === message.author.id

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 hover:bg-gray-800/20 p-2 rounded-lg transition-colors ${isConsecutive ? "mt-1" : "mt-4"}`}
                  >
                    {showAvatar ? (
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={message.author.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {message.author.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center">
                        <span className="text-xs text-gray-500 opacity-0 hover:opacity-100 transition-opacity">
                          {formatTime(message.created_at)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      {showAvatar && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white">{message.author.username}</span>
                          <span className="text-xs text-gray-500">{formatTime(message.created_at)}</span>
                          {message.edited_at && (
                            <Badge variant="secondary" className="text-xs">
                              edited
                            </Badge>
                          )}
                        </div>
                      )}
                      <p className="text-gray-200 leading-relaxed break-words">{message.content}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-700/30 bg-black/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder={`Message #${channel.name}`}
                  className="bg-gray-800/50 border-gray-600/30 text-white placeholder-gray-400 pr-20"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-gray-400 hover:text-white">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-gray-400 hover:text-white">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-gray-400 hover:text-white">
                    <Gift className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      {/* )} */}

      {/* Voice Controls */}
      {/* {isInVoice && ( ... )} */}
    </div>
  )
}
