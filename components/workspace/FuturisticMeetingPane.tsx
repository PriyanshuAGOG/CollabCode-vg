"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Video, VideoOff, Mic, MicOff, Monitor, PhoneOff, Settings, Maximize2, Volume2, Zap } from "lucide-react"

interface Participant {
  id: string
  name: string
  avatar: string
  isVideoOn: boolean
  isAudioOn: boolean
  isSpeaking: boolean
  isScreenSharing: boolean
}

interface FuturisticMeetingPaneProps {
  isActive: boolean
  onEnd: () => void
}

export function FuturisticMeetingPane({ isActive, onEnd }: FuturisticMeetingPaneProps) {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  const [participants] = useState<Participant[]>([
    {
      id: "1",
      name: "You",
      avatar: "YO",
      isVideoOn: true,
      isAudioOn: true,
      isSpeaking: false,
      isScreenSharing: false,
    },
    {
      id: "2",
      name: "Sarah Wilson",
      avatar: "SW",
      isVideoOn: true,
      isAudioOn: true,
      isSpeaking: true,
      isScreenSharing: false,
    },
    {
      id: "3",
      name: "Mike Johnson",
      avatar: "MJ",
      isVideoOn: false,
      isAudioOn: true,
      isSpeaking: false,
      isScreenSharing: false,
    },
  ])

  if (!isActive) return null

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Futuristic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#16213E]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-blue-500/10" />

      {/* Meeting Header */}
      <div className="relative p-4 border-b border-green-500/20 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-black" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Hologram Session
              </h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-300 font-medium">Live • {participants.length} connected</span>
              </div>
            </div>
          </div>

          <Button
            size="sm"
            variant="ghost"
            className="text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-all duration-200"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4 relative">
        <div className="grid grid-cols-2 gap-3 h-full">
          {participants.slice(0, 4).map((participant) => (
            <div
              key={participant.id}
              className={`relative bg-black/30 rounded-2xl overflow-hidden border-2 backdrop-blur-sm transition-all duration-300 ${
                participant.isSpeaking
                  ? "border-green-400 shadow-lg shadow-green-400/20"
                  : "border-cyan-500/20 hover:border-cyan-400/40"
              }`}
            >
              {participant.isVideoOn ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-cyan-500/20 flex items-center justify-center relative">
                  <Avatar className="w-16 h-16 border-2 border-white/20">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold">
                      {participant.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {/* Holographic effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-500/5 to-transparent animate-pulse" />
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex items-center justify-center">
                  <Avatar className="w-20 h-20 border-2 border-gray-500/30">
                    <AvatarFallback className="bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xl font-bold">
                      {participant.avatar}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}

              {/* Participant Info */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-black/60 text-white text-xs backdrop-blur-sm border border-cyan-500/30">
                    {participant.name}
                  </Badge>

                  <div className="flex items-center gap-1">
                    {!participant.isAudioOn && (
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <MicOff className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {!participant.isVideoOn && (
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center shadow-lg">
                        <VideoOff className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Speaking Indicator */}
              {participant.isSpeaking && (
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-green-400/50">
                    <Volume2 className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Neural activity indicator */}
              <div className="absolute top-3 left-3">
                <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center animate-spin shadow-lg">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meeting Controls */}
      <div className="relative p-4 border-t border-green-500/20 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center justify-center gap-3">
          <Button
            size="sm"
            onClick={() => setIsAudioOn(!isAudioOn)}
            className={`h-12 w-12 rounded-2xl transition-all duration-300 ${
              isAudioOn
                ? "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white shadow-lg"
                : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25"
            }`}
          >
            {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>

          <Button
            size="sm"
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`h-12 w-12 rounded-2xl transition-all duration-300 ${
              isVideoOn
                ? "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white shadow-lg"
                : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25"
            }`}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>

          <Button
            size="sm"
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`h-12 w-12 rounded-2xl transition-all duration-300 ${
              isScreenSharing
                ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
                : "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white shadow-lg"
            }`}
          >
            <Monitor className="w-5 h-5" />
          </Button>

          <Button
            size="sm"
            className="h-12 w-12 rounded-2xl bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white shadow-lg transition-all duration-300"
          >
            <Settings className="w-5 h-5" />
          </Button>

          <div className="w-px h-8 bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent mx-2" />

          <Button
            size="sm"
            onClick={onEnd}
            className="h-12 px-6 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg shadow-red-500/25 transition-all duration-300"
          >
            <PhoneOff className="w-5 h-5 mr-2" />
            End
          </Button>
        </div>
      </div>
    </div>
  )
}
