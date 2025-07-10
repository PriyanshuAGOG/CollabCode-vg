"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Hash,
  Video,
  Phone,
  Send,
  Smile,
  Paperclip,
  Plus,
  Search,
  Settings,
  Star,
  Reply,
  MoreHorizontal,
  Zap,
  ImageIcon,
  Code,
  Mic,
  Users,
  PhoneCall,
  VideoIcon,
  MicOff,
  VideoOff,
  PhoneOff,
  Volume2,
  Monitor,
  ArrowLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { WebRTCManager } from "@/lib/integrations/webrtc"

interface ChatMessage {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
    status: "online" | "away" | "busy" | "offline"
  }
  timestamp: Date
  type: "text" | "code" | "image" | "file" | "system"
  reactions?: Array<{
    emoji: string
    count: number
    users: string[]
  }>
  thread?: {
    count: number
    lastReply: Date
  }
  edited?: boolean
  pinned?: boolean
}

interface ChatRoom {
  id: string
  name: string
  type: "channel" | "dm" | "group"
  description?: string
  members: number
  unreadCount: number
  lastActivity: Date
  isPrivate: boolean
  category?: string
}

interface Team {
  id: string
  name: string
  avatar?: string
  description: string
  memberCount: number
  rooms: ChatRoom[]
  isActive: boolean
}

interface CallParticipant {
  id: string
  name: string
  avatar?: string
  isVideoOn: boolean
  isAudioOn: boolean
  isSpeaking: boolean
  stream?: MediaStream
}

export function ModernChatInterface() {
  const router = useRouter()
  const [activeTeam, setActiveTeam] = useState<string>("team-1")
  const [activeRoom, setActiveRoom] = useState<string>("general")
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false)
  const [isVideoCallActive, setIsVideoCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [callParticipants, setCallParticipants] = useState<CallParticipant[]>([])
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const webRTCManager = useRef<WebRTCManager | null>(null)

  const [teams] = useState<Team[]>([
    {
      id: "team-1",
      name: "CollabCode Core",
      avatar: "🚀",
      description: "Main development team",
      memberCount: 12,
      isActive: true,
      rooms: [
        {
          id: "general",
          name: "general",
          type: "channel",
          description: "General team discussions",
          members: 12,
          unreadCount: 3,
          lastActivity: new Date(),
          isPrivate: false,
          category: "General",
        },
        {
          id: "development",
          name: "development",
          type: "channel",
          description: "Development discussions",
          members: 8,
          unreadCount: 0,
          lastActivity: new Date(Date.now() - 3600000),
          isPrivate: false,
          category: "Work",
        },
        {
          id: "design",
          name: "design",
          type: "channel",
          description: "Design and UX discussions",
          members: 5,
          unreadCount: 1,
          lastActivity: new Date(Date.now() - 7200000),
          isPrivate: false,
          category: "Work",
        },
      ],
    },
    {
      id: "team-2",
      name: "AI Research",
      avatar: "🤖",
      description: "AI and ML research team",
      memberCount: 6,
      isActive: false,
      rooms: [
        {
          id: "ai-general",
          name: "ai-general",
          type: "channel",
          description: "AI research discussions",
          members: 6,
          unreadCount: 0,
          lastActivity: new Date(Date.now() - 86400000),
          isPrivate: false,
          category: "Research",
        },
      ],
    },
  ])

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hey everyone! 👋 Ready to start our sprint planning session?",
      author: {
        id: "sarah",
        name: "Sarah Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        status: "online",
      },
      timestamp: new Date(Date.now() - 1800000),
      type: "text",
      reactions: [
        { emoji: "👍", count: 3, users: ["mike", "alex", "emma"] },
        { emoji: "🚀", count: 2, users: ["john", "lisa"] },
      ],
    },
    {
      id: "2",
      content: `\`\`\`javascript
function calculateProjectVelocity(sprints) {
  return sprints.reduce((total, sprint) => {
    return total + sprint.completedPoints;
  }, 0) / sprints.length;
}
\`\`\``,
      author: {
        id: "mike",
        name: "Mike Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
        status: "online",
      },
      timestamp: new Date(Date.now() - 1200000),
      type: "code",
      thread: {
        count: 2,
        lastReply: new Date(Date.now() - 600000),
      },
    },
    {
      id: "3",
      content:
        "Perfect! I've updated the velocity calculation. The new algorithm should give us more accurate predictions for future sprints. 📊",
      author: {
        id: "alex",
        name: "Alex Rivera",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
        status: "away",
      },
      timestamp: new Date(Date.now() - 600000),
      type: "text",
      pinned: true,
    },
    {
      id: "4",
      content: "🎉 Great work team! Our deployment pipeline is now 40% faster thanks to the optimizations.",
      author: {
        id: "emma",
        name: "Emma Davis",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
        status: "online",
      },
      timestamp: new Date(Date.now() - 300000),
      type: "text",
      reactions: [{ emoji: "🎉", count: 5, users: ["sarah", "mike", "alex", "john", "lisa"] }],
    },
  ])

  const [onlineUsers] = useState([
    {
      id: "sarah",
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      status: "online" as const,
      role: "Product Manager",
    },
    {
      id: "mike",
      name: "Mike Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      status: "online" as const,
      role: "Senior Developer",
    },
    {
      id: "alex",
      name: "Alex Rivera",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      status: "away" as const,
      role: "DevOps Engineer",
    },
    {
      id: "emma",
      name: "Emma Davis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      status: "online" as const,
      role: "UX Designer",
    },
  ])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Initialize WebRTC manager
    webRTCManager.current = new WebRTCManager(
      (userId, stream) => {
        // Handle remote stream
        setCallParticipants((prev) => prev.map((p) => (p.id === userId ? { ...p, stream } : p)))
      },
      (userId) => {
        // Handle user disconnected
        setCallParticipants((prev) => prev.filter((p) => p.id !== userId))
      },
    )

    return () => {
      webRTCManager.current?.disconnectAll()
    }
  }, [])

  const sendMessage = async () => {
    if (!message.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      author: {
        id: "current-user",
        name: "You",
        status: "online",
      },
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage("")

    // Send to Supabase
    try {
      await supabase.from("messages").insert({
        content: message,
        room_id: activeRoom,
        user_id: "current-user",
        type: "text",
      })
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const startVoiceCall = async () => {
    try {
      const stream = await webRTCManager.current?.initializeLocalStream(false, true)
      if (stream) {
        setLocalStream(stream)
        setIsVoiceCallActive(true)
        setCallParticipants([
          {
            id: "current-user",
            name: "You",
            isVideoOn: false,
            isAudioOn: true,
            isSpeaking: false,
            stream,
          },
        ])
      }
    } catch (error) {
      console.error("Failed to start voice call:", error)
    }
  }

  const startVideoCall = async () => {
    try {
      const stream = await webRTCManager.current?.initializeLocalStream(true, true)
      if (stream && localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        setLocalStream(stream)
        setIsVideoCallActive(true)
        setCallParticipants([
          {
            id: "current-user",
            name: "You",
            isVideoOn: true,
            isAudioOn: true,
            isSpeaking: false,
            stream,
          },
        ])
      }
    } catch (error) {
      console.error("Failed to start video call:", error)
    }
  }

  const endCall = () => {
    webRTCManager.current?.disconnectAll()
    setIsVoiceCallActive(false)
    setIsVideoCallActive(false)
    setCallParticipants([])
    setLocalStream(null)
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    webRTCManager.current?.toggleAudio(!isMuted)
  }

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
    webRTCManager.current?.toggleVideo(!isVideoEnabled)
  }

  const startScreenShare = async () => {
    try {
      const screenStream = await webRTCManager.current?.startScreenShare()
      if (screenStream) {
        setIsScreenSharing(true)
      }
    } catch (error) {
      console.error("Failed to start screen share:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "now"
  }

  const activeTeamData = teams.find((t) => t.id === activeTeam)
  const activeRoomData = activeTeamData?.rooms.find((r) => r.id === activeRoom)

  return (
    <div className="h-screen flex bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#16213E] text-white overflow-hidden">
      {/* Futuristic Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500/5 via-transparent to-cyan-500/5" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(6,182,212,0.02)_50%,transparent_75%)] animate-pulse" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-deep-navy/95 via-dark-slate/95 to-deep-navy/95 backdrop-blur-xl border-b border-gradient-to-r from-bright-purple/20 via-bright-cyan/20 to-bright-purple/20 px-6 flex items-center justify-between z-50 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-bright-purple/5 via-bright-cyan/5 to-bright-purple/5" />

        <div className="flex items-center gap-6 z-10">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="ghost"
            size="sm"
            className="text-bright-cyan hover:text-white hover:bg-bright-cyan/10 transition-all duration-300 rounded-xl px-4 py-2 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>

          <div className="w-px h-8 bg-gradient-to-b from-transparent via-bright-cyan/40 to-transparent hidden md:block" />

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-bright-cyan via-electric-blue to-bright-purple rounded-xl flex items-center justify-center shadow-lg shadow-purple-glow">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-white font-bold text-lg">Team Chat</h1>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="text-bright-cyan font-medium">#{activeRoomData?.name}</span>
                <span>•</span>
                <span>{activeRoomData?.members} members</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 z-10">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-bright-cyan/70" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-dark-slate/60 backdrop-blur-sm text-white text-sm rounded-xl pl-10 pr-4 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-bright-cyan/40 border border-bright-cyan/20 focus:border-bright-cyan/40 transition-all duration-200"
            />
          </div>

          <Button
            onClick={startVoiceCall}
            size="sm"
            variant="ghost"
            className="text-bright-cyan hover:text-white hover:bg-bright-cyan/10 transition-all duration-200"
          >
            <Phone className="w-4 h-4" />
          </Button>
          <Button
            onClick={startVideoCall}
            size="sm"
            variant="ghost"
            className="text-bright-cyan hover:text-white hover:bg-bright-cyan/10 transition-all duration-200"
          >
            <Video className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-bright-cyan hover:text-white hover:bg-bright-cyan/10 transition-all duration-200"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex pt-16 overflow-hidden">
        {/* Teams Sidebar */}
        <div className="w-20 bg-black/20 backdrop-blur-xl border-r border-green-500/10 flex flex-col items-center py-4 gap-3 shadow-lg relative z-10">
          {teams.map((team) => (
            <Button
              key={team.id}
              onClick={() => setActiveTeam(team.id)}
              className={`w-14 h-14 rounded-2xl transition-all duration-300 ${
                activeTeam === team.id
                  ? "bg-gradient-to-r from-bright-cyan to-bright-purple text-white shadow-lg scale-110 shadow-purple-glow/25"
                  : "bg-dark-slate/60 hover:bg-dark-slate/80 text-bright-cyan hover:text-white hover:rounded-xl backdrop-blur-xl border border-bright-cyan/20 hover:border-bright-cyan/40"
              }`}
              title={team.name}
            >
              <span className="text-2xl">{team.avatar}</span>
            </Button>
          ))}

          <div className="w-8 h-px bg-gradient-to-r from-transparent via-bright-cyan/50 to-transparent my-2" />

          <Button className="w-14 h-14 rounded-2xl bg-dark-slate/60 hover:bg-success/20 text-bright-cyan hover:text-success transition-all duration-300 hover:rounded-xl backdrop-blur-xl border border-bright-cyan/20 hover:border-success/40">
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        {/* Rooms Sidebar */}
        <div className="w-64 bg-black/10 backdrop-blur-xl border-r border-green-500/10 flex flex-col relative z-10">
          {/* Team Header */}
          <div className="p-4 border-b border-green-500/10 bg-black/20 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeTeamData?.avatar}</span>
              <div>
                <h2 className="font-bold text-white">{activeTeamData?.name}</h2>
                <p className="text-sm text-text-secondary">{activeTeamData?.memberCount} members</p>
              </div>
            </div>
          </div>

          {/* Rooms List */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-bright-cyan/70 uppercase tracking-wide mb-2">Channels</div>
              {activeTeamData?.rooms.map((room) => (
                <Button
                  key={room.id}
                  onClick={() => setActiveRoom(room.id)}
                  variant="ghost"
                  className={`w-full justify-start h-9 px-3 rounded-lg transition-all duration-200 ${
                    activeRoom === room.id
                      ? "bg-gradient-to-r from-bright-cyan/20 to-bright-purple/20 text-white border border-bright-cyan/30"
                      : "text-text-secondary hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Hash className="w-4 h-4 mr-2" />
                  <span className="truncate">{room.name}</span>
                  {room.unreadCount > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white text-xs min-w-5 h-5">{room.unreadCount}</Badge>
                  )}
                </Button>
              ))}

              <div className="text-xs font-semibold text-bright-cyan/70 uppercase tracking-wide mb-2 mt-4">
                Direct Messages
              </div>
              {onlineUsers.slice(0, 3).map((user) => (
                <Button
                  key={user.id}
                  variant="ghost"
                  className="w-full justify-start h-9 px-3 rounded-lg text-text-secondary hover:text-white hover:bg-white/5"
                >
                  <div className="relative mr-2">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs bg-gradient-to-r from-bright-cyan to-bright-purple text-white">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${getStatusColor(user.status)}`}
                    />
                  </div>
                  <span className="truncate">{user.name}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col relative z-10">
          {/* Call Interface */}
          {(isVoiceCallActive || isVideoCallActive) && (
            <div className="bg-black/80 backdrop-blur-xl border-b border-green-500/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-pulse">
                    {isVideoCallActive ? (
                      <VideoIcon className="w-4 h-4 text-white" />
                    ) : (
                      <PhoneCall className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">
                      {isVideoCallActive ? "Video Call" : "Voice Call"} • #{activeRoomData?.name}
                    </h3>
                    <p className="text-sm text-text-secondary">{callParticipants.length} participant(s)</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={toggleMute}
                    className={`${
                      isMuted ? "bg-red-500 hover:bg-red-600" : "bg-dark-slate/60 hover:bg-dark-slate/80"
                    } text-white`}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>

                  {isVideoCallActive && (
                    <Button
                      size="sm"
                      onClick={toggleVideo}
                      className={`${
                        !isVideoEnabled ? "bg-red-500 hover:bg-red-600" : "bg-dark-slate/60 hover:bg-dark-slate/80"
                      } text-white`}
                    >
                      {isVideoEnabled ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>
                  )}

                  <Button
                    size="sm"
                    onClick={startScreenShare}
                    className="bg-dark-slate/60 hover:bg-dark-slate/80 text-white"
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>

                  <Button size="sm" onClick={endCall} className="bg-red-500 hover:bg-red-600 text-white">
                    <PhoneOff className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Video Grid */}
              {isVideoCallActive && (
                <div className="mt-4 grid grid-cols-2 gap-2 max-h-48">
                  {callParticipants.map((participant) => (
                    <div key={participant.id} className="relative bg-dark-slate/60 rounded-lg overflow-hidden">
                      {participant.stream && participant.isVideoOn ? (
                        <video
                          ref={participant.id === "current-user" ? localVideoRef : undefined}
                          autoPlay
                          muted={participant.id === "current-user"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 flex items-center justify-center">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gradient-to-r from-bright-cyan to-bright-purple text-white text-lg">
                              {participant.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <Badge className="bg-black/60 text-white text-xs">{participant.name}</Badge>
                        <div className="flex gap-1">
                          {!participant.isAudioOn && (
                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                              <MicOff className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {participant.isSpeaking && (
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                              <Volume2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {messages.map((message, index) => {
                const showAvatar = index === 0 || messages[index - 1].author.id !== message.author.id
                const isConsecutive = index > 0 && messages[index - 1].author.id === message.author.id

                return (
                  <div
                    key={message.id}
                    className={`group flex gap-4 hover:bg-white/5 p-3 rounded-xl transition-colors ${
                      isConsecutive ? "mt-1" : "mt-6"
                    }`}
                  >
                    {showAvatar ? (
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={message.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-r from-bright-cyan to-bright-purple text-white">
                            {message.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${getStatusColor(message.author.status)}`}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center">
                        <span className="text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      {showAvatar && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white">{message.author.name}</span>
                          <span className="text-xs text-text-muted">{formatTime(message.timestamp)}</span>
                          {message.pinned && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                          {message.edited && (
                            <Badge variant="secondary" className="text-xs bg-dark-slate/60 text-text-muted">
                              edited
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        {message.type === "code" ? (
                          <div className="bg-dark-slate/80 rounded-lg p-4 overflow-x-auto border border-bright-cyan/20">
                            <pre className="text-sm text-bright-cyan">
                              <code>{message.content}</code>
                            </pre>
                          </div>
                        ) : (
                          <p className="text-text-primary leading-relaxed break-words">{message.content}</p>
                        )}

                        {/* Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {message.reactions.map((reaction, idx) => (
                              <Button
                                key={idx}
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 bg-bright-cyan/10 border-bright-cyan/30 hover:bg-bright-cyan/20 text-white"
                              >
                                <span className="mr-1">{reaction.emoji}</span>
                                <span className="text-xs">{reaction.count}</span>
                              </Button>
                            ))}
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity border-bright-cyan/30 hover:bg-bright-cyan/20"
                            >
                              <Smile className="w-3 h-3" />
                            </Button>
                          </div>
                        )}

                        {/* Thread */}
                        {message.thread && (
                          <Button size="sm" variant="ghost" className="text-bright-cyan hover:bg-bright-cyan/10">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {message.thread.count} replies
                            <span className="text-xs text-text-muted ml-2">
                              Last reply {formatTime(message.thread.lastReply)}
                            </span>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Message Actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-1">
                      <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-text-muted hover:text-white">
                        <Smile className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-text-muted hover:text-white">
                        <Reply className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-text-muted hover:text-white">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-6 border-t border-green-500/10 bg-black/10 backdrop-blur-xl">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <div className="flex items-center gap-2 mb-2">
                  <Button size="sm" variant="ghost" className="text-text-muted hover:text-bright-cyan">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-text-muted hover:text-bright-cyan">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-text-muted hover:text-bright-cyan">
                    <Code className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-text-muted hover:text-bright-cyan">
                    <Zap className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder={`Message #${activeRoomData?.name}`}
                    className="pr-20 bg-dark-slate/60 border-bright-cyan/30 text-white rounded-xl focus:border-bright-cyan/60 focus:ring-2 focus:ring-bright-cyan/20"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-text-muted hover:text-bright-cyan">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-text-muted hover:text-bright-cyan">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="bg-gradient-to-r from-bright-cyan to-bright-purple hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Online Users */}
        <div className="w-64 bg-black/10 backdrop-blur-xl border-l border-green-500/10 flex flex-col relative z-10">
          <div className="p-4 border-b border-green-500/10 bg-black/20 backdrop-blur-xl">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Users className="w-4 h-4" />
              Online — {onlineUsers.filter((u) => u.status === "online").length}
            </h3>
          </div>

          <ScrollArea className="flex-1 p-3">
            <div className="space-y-2">
              {onlineUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-bright-cyan to-bright-purple text-white text-sm">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${getStatusColor(user.status)}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-text-muted truncate">{user.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
