
"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  Settings, 
  Users,
  MessageSquare,
  MoreVertical
} from "lucide-react"
import { startCall, joinCall, endCall } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

interface MeetingPaneProps {
  roomId: string
  participants: Array<{
    id: string
    username: string
    avatar_url?: string
    status: string
  }>
}

export function FuturisticMeetingPane({ roomId, participants }: MeetingPaneProps) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [callType, setCallType] = useState<"voice" | "video">("video")
  const [currentCall, setCurrentCall] = useState<any>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map())
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map())
  const { toast } = useToast()

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
      }
      peerConnections.current.forEach(pc => pc.close())
    }
  }, [localStream])

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setLocalStream(stream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      const { data: call, error } = await startCall(roomId, "video")
      if (error) throw error
      
      setCurrentCall(call)
      setIsCallActive(true)
      setCallType("video")
      
      toast({
        title: "Video call started",
        description: "Waiting for others to join...",
      })
    } catch (error) {
      console.error("Error starting video call:", error)
      toast({
        title: "Error",
        description: "Failed to start video call",
        variant: "destructive",
      })
    }
  }

  const startVoiceCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      })
      
      setLocalStream(stream)
      
      const { data: call, error } = await startCall(roomId, "voice")
      if (error) throw error
      
      setCurrentCall(call)
      setIsCallActive(true)
      setCallType("voice")
      
      toast({
        title: "Voice call started",
        description: "Waiting for others to join...",
      })
    } catch (error) {
      console.error("Error starting voice call:", error)
      toast({
        title: "Error",
        description: "Failed to start voice call",
        variant: "destructive",
      })
    }
  }

  const joinVideoCall = async (callId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setLocalStream(stream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      const { data: call, error } = await joinCall(callId)
      if (error) throw error
      
      setCurrentCall(call)
      setIsCallActive(true)
      setCallType("video")
      
      toast({
        title: "Joined video call",
        description: "Connected to the call",
      })
    } catch (error) {
      console.error("Error joining video call:", error)
      toast({
        title: "Error",
        description: "Failed to join video call",
        variant: "destructive",
      })
    }
  }

  const endVideoCall = async () => {
    try {
      if (currentCall) {
        await endCall(currentCall.id)
      }
      
      // Stop local stream
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
        setLocalStream(null)
      }
      
      // Close peer connections
      peerConnections.current.forEach(pc => pc.close())
      peerConnections.current.clear()
      
      setIsCallActive(false)
      setCurrentCall(null)
      setRemoteStreams(new Map())
      
      toast({
        title: "Call ended",
        description: "You left the call",
      })
    } catch (error) {
      console.error("Error ending call:", error)
      toast({
        title: "Error",
        description: "Failed to end call",
        variant: "destructive",
      })
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })
        setIsScreenSharing(true)
        // Handle screen sharing logic here
      } catch (error) {
        console.error("Error sharing screen:", error)
        toast({
          title: "Error",
          description: "Failed to share screen",
          variant: "destructive",
        })
      }
    } else {
      setIsScreenSharing(false)
      // Stop screen sharing
    }
  }

  if (!isCallActive) {
    return (
      <Card className="h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Meeting Room
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="mb-4">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ready to connect?
              </h3>
              <p className="text-sm text-gray-500">
                Start a call with your team members
              </p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button onClick={startVideoCall} className="w-full">
                <Video className="h-4 w-4 mr-2" />
                Start Video Call
              </Button>
              <Button onClick={startVoiceCall} variant="outline" className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                Start Voice Call
              </Button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Team Members</h4>
            <div className="space-y-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.avatar_url} />
                      <AvatarFallback>
                        {participant.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{participant.username}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      participant.status === 'online' ? 'text-green-600 border-green-600' :
                      participant.status === 'away' ? 'text-yellow-600 border-yellow-600' :
                      participant.status === 'busy' ? 'text-red-600 border-red-600' :
                      'text-gray-600 border-gray-600'
                    }`}
                  >
                    {participant.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full bg-black text-white">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Video Grid */}
        <div className="flex-1 relative">
          {callType === "video" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 h-full">
              {/* Local Video */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs">
                  You {!isVideoEnabled && "(video off)"}
                </div>
              </div>
              
              {/* Remote Videos */}
              {Array.from(remoteStreams.entries()).map(([participantId, stream]) => (
                <div key={participantId} className="relative bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    ref={(el) => {
                      if (el) {
                        remoteVideoRefs.current.set(participantId, el)
                        el.srcObject = stream
                      }
                    }}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs">
                    Participant {participantId}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {callType === "voice" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Phone className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold mb-2">Voice Call Active</h3>
                <p className="text-gray-400">Audio only call in progress</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Call Controls */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant={isAudioEnabled ? "default" : "destructive"}
              size="sm"
              onClick={toggleAudio}
            >
              {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
            
            {callType === "video" && (
              <Button
                variant={isVideoEnabled ? "default" : "destructive"}
                size="sm"
                onClick={toggleVideo}
              >
                {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
            )}
            
            <Button
              variant={isScreenSharing ? "destructive" : "outline"}
              size="sm"
              onClick={toggleScreenShare}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button variant="destructive" size="sm" onClick={endVideoCall}>
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
