export class WebRTCManager {
  private localStream: MediaStream | null = null
  private peerConnections: Map<string, RTCPeerConnection> = new Map()
  private onRemoteStream?: (userId: string, stream: MediaStream) => void
  private onUserDisconnected?: (userId: string) => void

  constructor(
    onRemoteStream?: (userId: string, stream: MediaStream) => void,
    onUserDisconnected?: (userId: string) => void,
  ) {
    this.onRemoteStream = onRemoteStream
    this.onUserDisconnected = onUserDisconnected
  }

  async initializeLocalStream(video = true, audio = true): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video,
        audio,
      })
      return this.localStream
    } catch (error) {
      console.error("Failed to get user media:", error)
      throw error
    }
  }

  async createPeerConnection(userId: string): Promise<RTCPeerConnection> {
    const configuration: RTCConfiguration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
    }

    const peerConnection = new RTCPeerConnection(configuration)

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, this.localStream!)
      })
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams
      this.onRemoteStream?.(userId, remoteStream)
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to remote peer via signaling server
        this.sendSignalingMessage(userId, {
          type: "ice-candidate",
          candidate: event.candidate,
        })
      }
    }

    this.peerConnections.set(userId, peerConnection)
    return peerConnection
  }

  async createOffer(userId: string): Promise<RTCSessionDescriptionInit> {
    const peerConnection = this.peerConnections.get(userId)
    if (!peerConnection) throw new Error("Peer connection not found")

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    // Send offer to remote peer via signaling server
    this.sendSignalingMessage(userId, {
      type: "offer",
      offer,
    })

    return offer
  }

  async handleOffer(userId: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    const peerConnection = this.peerConnections.get(userId) || (await this.createPeerConnection(userId))

    await peerConnection.setRemoteDescription(offer)
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    // Send answer to remote peer via signaling server
    this.sendSignalingMessage(userId, {
      type: "answer",
      answer,
    })

    return answer
  }

  async handleAnswer(userId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const peerConnection = this.peerConnections.get(userId)
    if (!peerConnection) throw new Error("Peer connection not found")

    await peerConnection.setRemoteDescription(answer)
  }

  async handleIceCandidate(userId: string, candidate: RTCIceCandidate): Promise<void> {
    const peerConnection = this.peerConnections.get(userId)
    if (!peerConnection) throw new Error("Peer connection not found")

    await peerConnection.addIceCandidate(candidate)
  }

  toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled
      })
    }
  }

  toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled
      })
    }
  }

  async startScreenShare(): Promise<MediaStream> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      })

      // Replace video track in all peer connections
      const videoTrack = screenStream.getVideoTracks()[0]
      this.peerConnections.forEach((peerConnection) => {
        const sender = peerConnection.getSenders().find((s) => s.track?.kind === "video")
        if (sender) {
          sender.replaceTrack(videoTrack)
        }
      })

      return screenStream
    } catch (error) {
      console.error("Failed to start screen share:", error)
      throw error
    }
  }

  disconnect(userId: string): void {
    const peerConnection = this.peerConnections.get(userId)
    if (peerConnection) {
      peerConnection.close()
      this.peerConnections.delete(userId)
      this.onUserDisconnected?.(userId)
    }
  }

  disconnectAll(): void {
    this.peerConnections.forEach((peerConnection, userId) => {
      peerConnection.close()
      this.onUserDisconnected?.(userId)
    })
    this.peerConnections.clear()

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }
  }

  private sendSignalingMessage(userId: string, message: any): void {
    // This would send the message via WebSocket to the signaling server
    // Implementation depends on your signaling server setup
    console.log("Sending signaling message to", userId, message)
  }
}
