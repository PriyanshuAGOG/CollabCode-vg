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
import { supabase } from "@/lib/supabase"
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
  const [voiceStates, setVoiceStates] = useState<VoiceState[]>([])
  const [isInVoice, setIsInVoice] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isDeafened, setIsDeafened] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (channelId) {
      loadChannel()
      loadMessages()
      if (channelType === "channel") {
        loadVoiceStates()
        subscribeToMessages()
        subscribeToVoiceStates()
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
    if (channelType === "channel") {
      const { data, error } = await supabase.from("channels").select("*").eq("id", channelId).single()

      if (!error && data) {
        setChannel(data)
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
    const query =
      channelType === "channel"
        ? supabase
            .from("messages")
            .select(`
            id,
            content,
            created_at,
            edited_at,
            profiles:author_id (
              id,
              username,
              avatar_url
            )
          `)
            .eq("channel_id", channelId)
        : supabase
            .from("messages")
            .select(`
            id,
            content,
            created_at,
            edited_at,
            profiles:author_id (
              id,
              username,
              avatar_url
            )
          `)
            .eq("dm_id", channelId)

    const { data, error } = await query.order("created_at", { ascending: true }).limit(50)

    if (!error && data) {
      const formattedMessages = data.map((msg) => ({
        id: msg.id,
        content: msg.content,
        author: {
          id: msg.profiles.id,
          username: msg.profiles.username,
          avatar_url: msg.profiles.avatar_url,
        },
        created_at: msg.created_at,
        edited_at: msg.edited_at,
      }))
      setMessages(formattedMessages)
    }
  }

  const loadVoiceStates = async () => {
    if (channel?.type === "voice" || channel?.type === "video") {
      const { data, error } = await supabase
        .from("voice_states")
        .select(`
          user_id,
          is_muted,
          is_deafened,
          is_video_enabled,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq("channel_id", channelId)

      if (!error && data) {
        const formattedStates = data.map((state) => ({
          user_id: state.user_id,
          is_muted: state.is_muted,
          is_deafened: state.is_deafened,
          is_video_enabled: state.is_video_enabled,
          user: {
            username: state.profiles.username,
            avatar_url: state.profiles.avatar_url,
          },
        }))
        setVoiceStates(formattedStates)
      }
    }
  }

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel(`messages:${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: channelType === "channel" ? `channel_id=eq.${channelId}` : `dm_id=eq.${channelId}`,
        },
        (payload) => {
          // In a real app, you'd fetch the full message with author info
          console.log("New message:", payload)
          loadMessages() // Reload messages for simplicity
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const subscribeToVoiceStates = () => {
    const subscription = supabase
      .channel(`voice_states:${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "voice_states",
          filter: `channel_id=eq.${channelId}`,
        },
        () => {
          loadVoiceStates()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return

    const messageData = {
      content: newMessage.trim(),
      author_id: user.id,
      ...(channelType === "channel" ? { channel_id: channelId } : { dm_id: channelId }),
    }

    const { error } = await supabase.from("messages").insert([messageData])

    if (!error) {
      setNewMessage("")
    }
  }

  const joinVoiceChannel = async () => {
    if (!user || !channelId) return

    const { error } = await supabase.from("voice_states").upsert([
      {
        user_id: user.id,
        channel_id: channelId,
        is_muted: false,
        is_deafened: false,
        is_video_enabled: false,
      },
    ])

    if (!error) {
      setIsInVoice(true)
    }
  }

  const leaveVoiceChannel = async () => {
    if (!user || !channelId) return

    const { error } = await supabase.from("voice_states").delete().eq("user_id", user.id).eq("channel_id", channelId)

    if (!error) {
      setIsInVoice(false)
      setIsMuted(false)
      setIsDeafened(false)
      setIsVideoEnabled(false)
    }
  }

  const toggleMute = async () => {
    if (!user || !channelId) return

    const newMutedState = !isMuted
    const { error } = await supabase
      .from("voice_states")
      .update({ is_muted: newMutedState })
      .eq("user_id", user.id)
      .eq("channel_id", channelId)

    if (!error) {
      setIsMuted(newMutedState)
    }
  }

  const toggleVideo = async () => {
    if (!user || !channelId) return

    const newVideoState = !isVideoEnabled
    const { error } = await supabase
      .from("voice_states")
      .update({ is_video_enabled: newVideoState })
      .eq("user_id", user.id)
      .eq("channel_id", channelId)

    if (!error) {
      setIsVideoEnabled(newVideoState)
    }
  }

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
            {isVoiceChannel && !isInVoice && (
              <Button size="sm" onClick={joinVoiceChannel} className="bg-green-600 hover:bg-green-700 text-white">
                <Phone className="w-4 h-4 mr-2" />
                Join
              </Button>
            )}
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

      {/* Voice Channel Users */}
      {isVoiceChannel && voiceStates.length > 0 && (
        <div className="p-4 border-b border-gray-700/30 bg-black/20 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">In Voice — {voiceStates.length}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {voiceStates.map((state) => (
              <div key={state.user_id} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={state.user.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                      {state.user.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {state.is_muted && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <MicOff className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-sm text-white truncate">{state.user.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Area */}
      {!isVoiceChannel && (
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
      )}

      {/* Voice Controls */}
      {isInVoice && (
        <div className="p-4 border-t border-gray-700/30 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center justify-center gap-3">
            <Button
              size="sm"
              onClick={toggleMute}
              className={`${isMuted ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"} text-white`}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>

            {channel.type === "video" && (
              <Button
                size="sm"
                onClick={toggleVideo}
                className={`${!isVideoEnabled ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"} text-white`}
              >
                {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </Button>
            )}

            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </Button>

            <Button size="sm" onClick={leaveVoiceChannel} className="bg-red-600 hover:bg-red-700 text-white">
              <PhoneOff className="w-4 h-4 mr-2" />
              Leave
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
