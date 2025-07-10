export interface CollaboratorCursor {
  userId: string
  username: string
  color: string
  position: { line: number; column: number }
  selection?: { start: { line: number; column: number }; end: { line: number; column: number } }
}

export interface CodeChange {
  id: string
  userId: string
  username: string
  timestamp: number
  operation: "insert" | "delete" | "replace"
  position: { line: number; column: number }
  content: string
  length?: number
}

export interface CollaboratorPresence {
  userId: string
  username: string
  avatar?: string
  color: string
  isActive: boolean
  lastSeen: number
  currentFile?: string
}

const WS_ORIGIN =
  (typeof window !== "undefined" && window?.env?.NEXT_PUBLIC_WS_ORIGIN) || process.env.NEXT_PUBLIC_WS_ORIGIN || ""

export class WebSocketManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private heartbeatInterval: NodeJS.Timeout | null = null
  private callbacks: Map<string, Function[]> = new Map()

  constructor(
    private projectId: string,
    private userId: string,
    private username: string,
  ) {
    this.connect()
  }

  private connect() {
    try {
      /*
        1.  Use a dedicated WS origin (e.g.  ws://localhost:4001  or
            wss://collabcode-ws.fly.dev ) instead of hitting the
            Next.js route that cannot upgrade.
        2.  Fallback to same-origin <scheme>://<host> if the env var
            is not provided — handy for quick local tests with
            `npm run dev:ws`.
      */
      const host = WS_ORIGIN || `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}`
      const wsUrl = `${host}/ws/${this.projectId}`

      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = this.handleOpen.bind(this)
      this.ws.onmessage = this.handleMessage.bind(this)
      this.ws.onclose = this.handleClose.bind(this)
      this.ws.onerror = this.handleError.bind(this)
    } catch (error) {
      console.error("WebSocket connection failed:", error)
      this.scheduleReconnect()
    }
  }

  private handleOpen() {
    console.log("WebSocket connected")
    this.reconnectAttempts = 0

    // Send initial presence
    this.send("user_join", {
      userId: this.userId,
      username: this.username,
      timestamp: Date.now(),
    })

    // Start heartbeat
    this.startHeartbeat()

    this.emit("connected")
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data)
      this.emit(data.type, data.payload)
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error)
    }
  }

  private handleClose() {
    console.log("WebSocket disconnected")
    this.stopHeartbeat()
    this.emit("disconnected")

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect()
    }
  }

  private handleError(error: Event) {
    // Browsers give very little detail – just mark status and start reconnect
    console.warn("WebSocket transport error, will retry…")
    this.emit("error")
    this.scheduleReconnect()
  }

  private scheduleReconnect() {
    setTimeout(() => {
      this.reconnectAttempts++
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)
      this.connect()
    }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts))
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send("ping", { timestamp: Date.now() })
      }
    }, 30000) // 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  public send(type: string, payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    }
  }

  public on(event: string, callback: Function) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, [])
    }
    this.callbacks.get(event)!.push(callback)
  }

  public off(event: string, callback: Function) {
    const callbacks = this.callbacks.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  private emit(event: string, data?: any) {
    const callbacks = this.callbacks.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => callback(data))
    }
  }

  public sendCodeChange(change: Omit<CodeChange, "id" | "timestamp">) {
    this.send("code_change", {
      ...change,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    })
  }

  public sendCursorPosition(file: string, position: { line: number; column: number }, selection?: any) {
    this.send("cursor_update", {
      userId: this.userId,
      username: this.username,
      file,
      position,
      selection,
      timestamp: Date.now(),
    })
  }

  public sendFileChange(file: string) {
    this.send("file_change", {
      userId: this.userId,
      username: this.username,
      file,
      timestamp: Date.now(),
    })
  }

  public disconnect() {
    this.stopHeartbeat()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}
