// WebSocket Integration for Real-time Features
// Using Socket.io for reliable real-time communication

import { io, type Socket } from "socket.io-client"

export interface WebSocketConfig {
  url: string
  projectId?: string
  userId: string
  username: string
}

export interface ChatMessage {
  id: string
  userId: string
  username: string
  message: string
  timestamp: Date
  type: "text" | "code" | "file" | "system"
  metadata?: any
}

export interface CollaborationEvent {
  type: "cursor" | "selection" | "edit" | "presence"
  userId: string
  username: string
  data: any
  timestamp: Date
}

export interface UserPresence {
  userId: string
  username: string
  avatar?: string
  status: "online" | "away" | "busy" | "offline"
  lastSeen: Date
  currentFile?: string
  cursor?: { line: number; column: number }
}

export class WebSocketService {
  private socket: Socket | null = null
  private config: WebSocketConfig | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  // Event listeners
  private messageListeners: ((message: ChatMessage) => void)[] = []
  private collaborationListeners: ((event: CollaborationEvent) => void)[] = []
  private presenceListeners: ((users: UserPresence[]) => void)[] = []
  private connectionListeners: ((connected: boolean) => void)[] = []

  connect(config: WebSocketConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      this.config = config

      // Use environment variable or fallback to localhost
      const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3001"

      this.socket = io(wsUrl, {
        transports: ["websocket", "polling"],
        timeout: 20000,
        forceNew: true,
        query: {
          userId: config.userId,
          username: config.username,
          projectId: config.projectId || "",
        },
      })

      // Connection events
      this.socket.on("connect", () => {
        console.log("✅ WebSocket connected")
        this.reconnectAttempts = 0
        this.notifyConnectionListeners(true)

        // Join project room if specified
        if (config.projectId) {
          this.joinProject(config.projectId)
        }

        resolve()
      })

      this.socket.on("disconnect", (reason) => {
        console.log("❌ WebSocket disconnected:", reason)
        this.notifyConnectionListeners(false)

        // Auto-reconnect logic
        if (reason === "io server disconnect") {
          // Server initiated disconnect, don't reconnect
          return
        }

        this.attemptReconnect()
      })

      this.socket.on("connect_error", (error) => {
        console.error("❌ WebSocket connection error:", error)
        this.notifyConnectionListeners(false)
        reject(error)
      })

      // Message events
      this.socket.on("message", (message: ChatMessage) => {
        this.notifyMessageListeners(message)
      })

      this.socket.on("typing", (data: { userId: string; username: string; isTyping: boolean }) => {
        // Handle typing indicators
        console.log("Typing indicator:", data)
      })

      // Collaboration events
      this.socket.on("collaboration", (event: CollaborationEvent) => {
        this.notifyCollaborationListeners(event)
      })

      this.socket.on("cursor-update", (data: { userId: string; cursor: any }) => {
        const event: CollaborationEvent = {
          type: "cursor",
          userId: data.userId,
          username: "", // Will be filled by the client
          data: data.cursor,
          timestamp: new Date(),
        }
        this.notifyCollaborationListeners(event)
      })

      this.socket.on("code-change", (data: { userId: string; changes: any }) => {
        const event: CollaborationEvent = {
          type: "edit",
          userId: data.userId,
          username: "", // Will be filled by the client
          data: data.changes,
          timestamp: new Date(),
        }
        this.notifyCollaborationListeners(event)
      })

      // Presence events
      this.socket.on("presence-update", (users: UserPresence[]) => {
        this.notifyPresenceListeners(users)
      })

      this.socket.on("user-joined", (user: UserPresence) => {
        console.log("User joined:", user)
      })

      this.socket.on("user-left", (userId: string) => {
        console.log("User left:", userId)
      })
    })
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("❌ Max reconnection attempts reached")
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`)

    setTimeout(() => {
      if (this.config) {
        this.connect(this.config).catch(console.error)
      }
    }, delay)
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.config = null
    this.reconnectAttempts = 0
  }

  // Project management
  joinProject(projectId: string): void {
    this.socket?.emit("join-project", { projectId })
  }

  leaveProject(projectId: string): void {
    this.socket?.emit("leave-project", { projectId })
  }

  // Chat functionality
  sendMessage(message: Omit<ChatMessage, "id" | "timestamp">): void {
    if (!this.socket?.connected) {
      console.error("❌ Cannot send message: WebSocket not connected")
      return
    }

    const fullMessage: ChatMessage = {
      ...message,
      id: this.generateId(),
      timestamp: new Date(),
    }

    this.socket.emit("message", fullMessage)
  }

  sendTypingIndicator(isTyping: boolean): void {
    this.socket?.emit("typing", { isTyping })
  }

  // Collaboration functionality
  sendCursorUpdate(cursor: { line: number; column: number; file?: string }): void {
    this.socket?.emit("cursor-update", { cursor })
  }

  sendCodeChange(changes: any): void {
    this.socket?.emit("code-change", { changes })
  }

  sendSelection(selection: any): void {
    this.socket?.emit("selection-update", { selection })
  }

  // Presence functionality
  updatePresence(status: UserPresence["status"], metadata?: any): void {
    this.socket?.emit("presence-update", { status, metadata })
  }

  setCurrentFile(filename: string): void {
    this.socket?.emit("current-file", { filename })
  }

  // Event listeners
  onMessage(listener: (message: ChatMessage) => void): () => void {
    this.messageListeners.push(listener)
    return () => {
      const index = this.messageListeners.indexOf(listener)
      if (index > -1) {
        this.messageListeners.splice(index, 1)
      }
    }
  }

  onCollaboration(listener: (event: CollaborationEvent) => void): () => void {
    this.collaborationListeners.push(listener)
    return () => {
      const index = this.collaborationListeners.indexOf(listener)
      if (index > -1) {
        this.collaborationListeners.splice(index, 1)
      }
    }
  }

  onPresence(listener: (users: UserPresence[]) => void): () => void {
    this.presenceListeners.push(listener)
    return () => {
      const index = this.presenceListeners.indexOf(listener)
      if (index > -1) {
        this.presenceListeners.splice(index, 1)
      }
    }
  }

  onConnection(listener: (connected: boolean) => void): () => void {
    this.connectionListeners.push(listener)
    return () => {
      const index = this.connectionListeners.indexOf(listener)
      if (index > -1) {
        this.connectionListeners.splice(index, 1)
      }
    }
  }

  // Notification methods
  private notifyMessageListeners(message: ChatMessage): void {
    this.messageListeners.forEach((listener) => listener(message))
  }

  private notifyCollaborationListeners(event: CollaborationEvent): void {
    this.collaborationListeners.forEach((listener) => listener(event))
  }

  private notifyPresenceListeners(users: UserPresence[]): void {
    this.presenceListeners.forEach((listener) => listener(users))
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach((listener) => listener(connected))
  }

  // Utility methods
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }

  getConnectionState(): string {
    if (!this.socket) return "disconnected"
    return this.socket.connected ? "connected" : "disconnected"
  }

  // File sharing
  sendFile(file: File, metadata?: any): void {
    const reader = new FileReader()
    reader.onload = (e) => {
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        data: e.target?.result,
        metadata,
      }
      this.socket?.emit("file-share", fileData)
    }
    reader.readAsDataURL(file)
  }

  // Screen sharing coordination
  startScreenShare(): void {
    this.socket?.emit("screen-share-start")
  }

  stopScreenShare(): void {
    this.socket?.emit("screen-share-stop")
  }

  // Voice chat coordination
  startVoiceChat(): void {
    this.socket?.emit("voice-chat-start")
  }

  stopVoiceChat(): void {
    this.socket?.emit("voice-chat-stop")
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService()

// React hook for WebSocket
export function useWebSocket(config: WebSocketConfig) {
  const connect = () => webSocketService.connect(config)
  const disconnect = () => webSocketService.disconnect()

  return {
    connect,
    disconnect,
    sendMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => webSocketService.sendMessage(message),
    sendTypingIndicator: (isTyping: boolean) => webSocketService.sendTypingIndicator(isTyping),
    sendCursorUpdate: (cursor: { line: number; column: number; file?: string }) =>
      webSocketService.sendCursorUpdate(cursor),
    sendCodeChange: (changes: any) => webSocketService.sendCodeChange(changes),
    updatePresence: (status: UserPresence["status"], metadata?: any) =>
      webSocketService.updatePresence(status, metadata),
    onMessage: (listener: (message: ChatMessage) => void) => webSocketService.onMessage(listener),
    onCollaboration: (listener: (event: CollaborationEvent) => void) => webSocketService.onCollaboration(listener),
    onPresence: (listener: (users: UserPresence[]) => void) => webSocketService.onPresence(listener),
    onConnection: (listener: (connected: boolean) => void) => webSocketService.onConnection(listener),
    isConnected: () => webSocketService.isConnected(),
    getConnectionState: () => webSocketService.getConnectionState(),
  }
}
