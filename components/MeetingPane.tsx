"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, PhoneOff, Users } from "lucide-react"

interface Participant {
  id: string
  name: string
  isVideoOn: boolean
  isAudioOn: boolean
  isScreenSharing: boolean
}

export function MeetingPane() {
  const [isInMeeting, setIsInMeeting] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [participants] = useState<Participant[]>([
    { id: "1", name: "Jane Smith", isVideoOn: true, isAudioOn: true, isScreenSharing: false },
    { id: "2", name: "Mike Johnson", isVideoOn: false, isAudioOn: true, isScreenSharing: false },
    { id: "3", name: "Sarah Wilson", isVideoOn: true, isAudioOn: false, isScreenSharing: true },
  ])

  const startMeeting = () => {
    setIsInMeeting(true)
  }

  const endMeeting = () => {
    setIsInMeeting(false)
    setIsScreenSharing(false)
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
  }

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn)
  }

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
  }

  if (!isInMeeting) {
    return (
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={startMeeting} className="bg-green-500 hover:bg-green-600 text-white">
          <Video className="w-4 h-4 mr-1" />
          Start Meeting
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {/* Video Feeds */}
      <div className="flex gap-1">
        {participants.slice(0, 3).map((participant) => (
          <div
            key={participant.id}
            className="w-12 h-8 bg-gray-700 rounded border border-gray-600 relative overflow-hidden"
          >
            {participant.isVideoOn ? (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs text-white font-medium">
                {participant.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <VideoOff className="w-3 h-3 text-gray-500" />
              </div>
            )}
            {!participant.isAudioOn && (
              <MicOff className="absolute bottom-0 right-0 w-2 h-2 text-red-400 bg-black rounded-full p-0.5" />
            )}
            {participant.isScreenSharing && (
              <Monitor className="absolute top-0 left-0 w-2 h-2 text-green-400 bg-black rounded-full p-0.5" />
            )}
          </div>
        ))}
        {participants.length > 3 && (
          <div className="w-12 h-8 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
            <span className="text-xs text-gray-400">+{participants.length - 3}</span>
          </div>
        )}
      </div>

      {/* Meeting Controls */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={toggleVideo}
          className={`${isVideoOn ? "bg-blue-500 border-blue-500" : "bg-red-500 border-red-500"} text-white`}
        >
          {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={toggleAudio}
          className={`${isAudioOn ? "bg-blue-500 border-blue-500" : "bg-red-500 border-red-500"} text-white`}
        >
          {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={toggleScreenShare}
          className={`${isScreenSharing ? "bg-green-500 border-green-500" : "border-gray-600"} text-white hover:bg-green-500`}
        >
          {isScreenSharing ? <Monitor className="w-4 h-4" /> : <MonitorOff className="w-4 h-4" />}
        </Button>

        <Badge variant="outline" className="border-gray-600 text-gray-400">
          <Users className="w-3 h-3 mr-1" />
          {participants.length + 1}
        </Badge>

        <Button size="sm" onClick={endMeeting} className="bg-red-500 hover:bg-red-600 text-white">
          <PhoneOff className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
