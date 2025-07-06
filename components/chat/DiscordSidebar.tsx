"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Hash, Volume2, Video, Plus, Settings, UserPlus, Search, Crown, Shield, Mic, Headphones } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth/AuthProvider"

interface Server {
  id: string
  name: string
  icon_url?: string
  owner_id: string
}

interface Channel {
  id: string
  name: string
  type: "text" | "voice" | "video"
  server_id: string
}

interface Member {
  id: string
  username: string
  avatar_url?: string
  status: "online" | "offline" | "away" | "busy"
  role: "owner" | "admin" | "moderator" | "member"
}

interface DirectMessage {
  id: string
  user: {
    id: string
    username: string
    avatar_url?: string
    status: string
  }
  last_message?: string
  unread_count: number
}

interface DiscordSidebarProps {
  selectedServer: string | null
  selectedChannel: string | null
  selectedDM: string | null
  onServerSelect: (serverId: string) => void
  onChannelSelect: (channelId: string, type: "channel" | "dm") => void
}

export function DiscordSidebar({
  selectedServer,
  selectedChannel,
  selectedDM,
  onServerSelect,
  onChannelSelect,
}: DiscordSidebarProps) {
  const { user } = useAuth()
  const [servers, setServers] = useState<Server[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (user) {
      loadServers()
      loadDirectMessages()
    }
  }, [user])

  useEffect(() => {
    if (selectedServer) {
      loadChannels(selectedServer)
      loadMembers(selectedServer)
    }
  }, [selectedServer])

  const loadServers = async () => {
    const { data, error } = await supabase
      .from("servers")
      .select(`
        *,
        server_members!inner(user_id)
      `)
      .eq("server_members.user_id", user?.id)

    if (!error && data) {
      setServers(data)
      if (data.length > 0 && !selectedServer) {
        onServerSelect(data[0].id)
      }
    }
  }

  const loadChannels = async (serverId: string) => {
    const { data, error } = await supabase.from("channels").select("*").eq("server_id", serverId).order("position")

    if (!error && data) {
      setChannels(data)
    }
  }

  const loadMembers = async (serverId: string) => {
    const { data, error } = await supabase
      .from("server_members")
      .select(`
        role,
        profiles (
          id,
          username,
          avatar_url,
          status
        )
      `)
      .eq("server_id", serverId)

    if (!error && data) {
      const membersList = data.map((item) => ({
        id: item.profiles.id,
        username: item.profiles.username,
        avatar_url: item.profiles.avatar_url,
        status: item.profiles.status,
        role: item.role,
      }))
      setMembers(membersList)
    }
  }

  const loadDirectMessages = async () => {
    // This would load recent DMs - simplified for now
    const mockDMs: DirectMessage[] = [
      {
        id: "1",
        user: {
          id: "2",
          username: "Sarah Wilson",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
          status: "online",
        },
        last_message: "Hey, how's the project going?",
        unread_count: 2,
      },
      {
        id: "2",
        user: {
          id: "3",
          username: "Mike Johnson",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
          status: "away",
        },
        last_message: "Can we schedule a call?",
        unread_count: 0,
      },
    ]
    setDirectMessages(mockDMs)
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-3 h-3 text-yellow-500" />
      case "admin":
        return <Shield className="w-3 h-3 text-red-500" />
      case "moderator":
        return <Shield className="w-3 h-3 text-blue-500" />
      default:
        return null
    }
  }

  const textChannels = channels.filter((c) => c.type === "text")
  const voiceChannels = channels.filter((c) => c.type === "voice" || c.type === "video")
  const onlineMembers = members.filter((m) => m.status === "online")
  const offlineMembers = members.filter((m) => m.status !== "online")

  return (
    <div className="flex h-full bg-gradient-to-b from-[#0A0A0F] to-[#1A1A2E]">
      {/* Server List */}
      <div className="w-16 bg-black/40 backdrop-blur-xl border-r border-purple-500/20 flex flex-col items-center py-3 gap-2">
        {/* Home/DM Button */}
        <Button
          size="sm"
          onClick={() => onServerSelect("")}
          className={`w-12 h-12 rounded-2xl transition-all duration-200 ${
            !selectedServer
              ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/25"
              : "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:rounded-xl"
          }`}
        >
          <Hash className="w-5 h-5" />
        </Button>

        <div className="w-8 h-px bg-gray-600/50 my-1" />

        {/* Server Icons */}
        <ScrollArea className="flex-1 w-full">
          <div className="flex flex-col items-center gap-2 px-2">
            {servers.map((server) => (
              <Button
                key={server.id}
                size="sm"
                onClick={() => onServerSelect(server.id)}
                className={`w-12 h-12 rounded-2xl transition-all duration-200 ${
                  selectedServer === server.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:rounded-xl"
                }`}
              >
                {server.icon_url ? (
                  <img src={server.icon_url || "/placeholder.svg"} alt={server.name} className="w-8 h-8 rounded-xl" />
                ) : (
                  <span className="font-bold text-sm">{server.name.charAt(0)}</span>
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Add Server Button */}
        <Button
          size="sm"
          className="w-12 h-12 rounded-2xl bg-gray-700/50 hover:bg-green-600/50 text-gray-300 hover:text-white transition-all duration-200 hover:rounded-xl"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Sidebar */}
      <div className="flex-1 flex flex-col bg-black/20 backdrop-blur-sm">
        {selectedServer ? (
          // Server View
          <>
            {/* Server Header */}
            <div className="p-4 border-b border-gray-700/30 bg-black/30 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-lg truncate">
                  {servers.find((s) => s.id === selectedServer)?.name}
                </h2>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-3 space-y-4">
                {/* Text Channels */}
                {textChannels.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Text Channels</h3>
                      <Button size="sm" variant="ghost" className="w-4 h-4 p-0 text-gray-400 hover:text-white">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {textChannels.map((channel) => (
                        <Button
                          key={channel.id}
                          variant="ghost"
                          onClick={() => onChannelSelect(channel.id, "channel")}
                          className={`w-full justify-start h-8 px-2 rounded-lg transition-all duration-200 ${
                            selectedChannel === channel.id
                              ? "bg-gray-600/50 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                          }`}
                        >
                          <Hash className="w-4 h-4 mr-2" />
                          <span className="truncate">{channel.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Voice Channels */}
                {voiceChannels.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Voice Channels</h3>
                      <Button size="sm" variant="ghost" className="w-4 h-4 p-0 text-gray-400 hover:text-white">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {voiceChannels.map((channel) => (
                        <Button
                          key={channel.id}
                          variant="ghost"
                          onClick={() => onChannelSelect(channel.id, "channel")}
                          className={`w-full justify-start h-8 px-2 rounded-lg transition-all duration-200 ${
                            selectedChannel === channel.id
                              ? "bg-gray-600/50 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                          }`}
                        >
                          {channel.type === "video" ? (
                            <Video className="w-4 h-4 mr-2" />
                          ) : (
                            <Volume2 className="w-4 h-4 mr-2" />
                          )}
                          <span className="truncate">{channel.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          // Direct Messages View
          <>
            {/* DM Header */}
            <div className="p-4 border-b border-gray-700/30 bg-black/30 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-bold text-lg">Direct Messages</h2>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search conversations"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/50 border-gray-600/30 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
                {directMessages.map((dm) => (
                  <Button
                    key={dm.id}
                    variant="ghost"
                    onClick={() => onChannelSelect(dm.id, "dm")}
                    className={`w-full justify-start h-12 px-3 rounded-lg transition-all duration-200 ${
                      selectedDM === dm.id
                        ? "bg-gray-600/50 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                    }`}
                  >
                    <div className="relative mr-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={dm.user.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                          {dm.user.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(dm.user.status)}`}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{dm.user.username}</span>
                        {dm.unread_count > 0 && (
                          <Badge className="bg-red-500 text-white text-xs min-w-5 h-5">{dm.unread_count}</Badge>
                        )}
                      </div>
                      {dm.last_message && <p className="text-xs text-gray-500 truncate">{dm.last_message}</p>}
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </>
        )}

        {/* Members List (for servers) */}
        {selectedServer && (
          <div className="w-60 border-l border-gray-700/30 bg-black/20 backdrop-blur-sm">
            <div className="p-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Members — {members.length}
              </h3>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {/* Online Members */}
                  {onlineMembers.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Online — {onlineMembers.length}
                      </h4>
                      <div className="space-y-1">
                        {onlineMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-2 p-1 rounded hover:bg-gray-700/30 transition-colors"
                          >
                            <div className="relative">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={member.avatar_url || "/placeholder.svg"} />
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                                  {member.username.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(member.status)}`}
                              />
                            </div>
                            <div className="flex-1 flex items-center gap-1">
                              {getRoleIcon(member.role)}
                              <span className="text-sm text-gray-300 truncate">{member.username}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Offline Members */}
                  {offlineMembers.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Offline — {offlineMembers.length}
                      </h4>
                      <div className="space-y-1">
                        {offlineMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-2 p-1 rounded hover:bg-gray-700/30 transition-colors opacity-50"
                          >
                            <div className="relative">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={member.avatar_url || "/placeholder.svg"} />
                                <AvatarFallback className="bg-gray-600 text-white text-xs">
                                  {member.username.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(member.status)}`}
                              />
                            </div>
                            <div className="flex-1 flex items-center gap-1">
                              {getRoleIcon(member.role)}
                              <span className="text-sm text-gray-400 truncate">{member.username}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* User Panel */}
        <div className="p-3 border-t border-gray-700/30 bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm">
                  {user?.user_metadata?.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium truncate">{user?.user_metadata?.username || "User"}</p>
              <p className="text-gray-400 text-xs">Online</p>
            </div>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-gray-400 hover:text-white">
                <Mic className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-gray-400 hover:text-white">
                <Headphones className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-gray-400 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
