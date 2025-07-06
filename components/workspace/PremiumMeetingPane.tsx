"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Video, VideoOff, Mic, MicOff, Monitor, PhoneOff, Settings, Maximize2, Volume2 } from "lucide-react"

interface Participant {
  id: string
  name: string
  avatar: string
  isVideoOn: boolean
  isAudioOn: boolean
  isSpeaking: boolean
  isScreenSharing: boolean
}

interface PremiumMeetingPaneProps {
  isActive: boolean
  onEnd: () => void
}

export function PremiumMeetingPane({ isActive, onEnd }: PremiumMeetingPaneProps) {
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
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-sm">
      {/* Meeting Header */}
      <div className="p-3 border-b border-gray-700/30 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Team Meeting</h4>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-400">Live • {participants.length} participants</span>
              </div>
            </div>
          </div>

          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-3">
        <div className="grid grid-cols-2 gap-2 h-full">
          {participants.slice(0, 4).map((participant) => (
            <div
              key={participant.id}
              className={`relative bg-gray-800/50 rounded-xl overflow-hidden border-2 ${
                participant.isSpeaking ? "border-green-500" : "border-gray-700/30"
              }`}
            >
              {participant.isVideoOn ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gray-700 text-white">{participant.avatar}</AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-gray-600 text-white text-lg">{participant.avatar}</AvatarFallback>
                  </Avatar>
                </div>
              )}

              {/* Participant Info */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-black/60 text-white text-xs backdrop-blur-sm">
                    {participant.name}
                  </Badge>

                  <div className="flex items-center gap-1">
                    {!participant.isAudioOn && (
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <MicOff className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {!participant.isVideoOn && (
                      <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                        <VideoOff className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Speaking Indicator */}
              {participant.isSpeaking && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <Volume2 className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Meeting Controls */}
      <div className="p-3 border-t border-gray-700/30 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsAudioOn(!isAudioOn)}
            className={`${
              isAudioOn ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </Button>

          <Button
            size="sm"
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`${
              isVideoOn ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </Button>

          <Button
            size="sm"
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`${
              isScreenSharing ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
          >
            <Monitor className="w-4 h-4" />
          </Button>

          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
            <Settings className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-600 mx-1" />

          <Button size="sm" onClick={onEnd} className="bg-red-600 hover:bg-red-700 text-white">
            <PhoneOff className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
