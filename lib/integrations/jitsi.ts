// Jitsi Meet Integration - 100% Free Video Conferencing
// No API keys required, unlimited usage

export interface JitsiConfig {
  roomName: string
  displayName: string
  email?: string
  avatar?: string
  subject?: string
  password?: string
}

export interface JitsiMeetingOptions {
  width?: string | number
  height?: string | number
  parentNode?: HTMLElement
  configOverwrite?: Record<string, any>
  interfaceConfigOverwrite?: Record<string, any>
  onApiReady?: (api: any) => void
  onReadyToClose?: () => void
  userInfo?: {
    displayName: string
    email?: string
    avatarUrl?: string
  }
}

export class JitsiService {
  private api: any = null
  private domain: string
  private isLoaded = false

  constructor(domain = "meet.jit.si") {
    this.domain = domain
  }

  // Load Jitsi Meet API script
  async loadJitsiScript(): Promise<void> {
    if (this.isLoaded) return

    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.JitsiMeetExternalAPI) {
        this.isLoaded = true
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = `https://${this.domain}/external_api.js`
      script.async = true

      script.onload = () => {
        this.isLoaded = true
        resolve()
      }

      script.onerror = () => {
        reject(new Error("Failed to load Jitsi Meet API"))
      }

      document.head.appendChild(script)
    })
  }

  // Create a new meeting
  async createMeeting(config: JitsiConfig, options: JitsiMeetingOptions = {}): Promise<any> {
    await this.loadJitsiScript()

    if (!window.JitsiMeetExternalAPI) {
      throw new Error("Jitsi Meet API not available")
    }

    // Default configuration
    const defaultConfig = {
      startWithAudioMuted: false,
      startWithVideoMuted: false,
      enableWelcomePage: false,
      enableUserRolesBasedOnToken: false,
      enableFeaturesBasedOnToken: false,
      disableModeratorIndicator: false,
      startScreenSharing: false,
      enableEmailInStats: false,
      enableClosePage: false,
      disableProfile: false,
      disableInviteFunctions: false,
      doNotStoreRoom: false,
      deploymentInfo: {
        shard: "meet.jit.si",
        region: "us-east-1",
        userRegion: "us-east-1",
      },
    }

    // Default interface configuration
    const defaultInterfaceConfig = {
      TOOLBAR_BUTTONS: [
        "microphone",
        "camera",
        "closedcaptions",
        "desktop",
        "fullscreen",
        "fodeviceselection",
        "hangup",
        "profile",
        "chat",
        "recording",
        "livestreaming",
        "etherpad",
        "sharedvideo",
        "settings",
        "raisehand",
        "videoquality",
        "filmstrip",
        "invite",
        "feedback",
        "stats",
        "shortcuts",
        "tileview",
        "videobackgroundblur",
        "download",
        "help",
        "mute-everyone",
        "security",
      ],
      SETTINGS_SECTIONS: ["devices", "language", "moderator", "profile", "calendar"],
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      SHOW_BRAND_WATERMARK: false,
      BRAND_WATERMARK_LINK: "",
      SHOW_POWERED_BY: false,
      SHOW_PROMOTIONAL_CLOSE_PAGE: false,
      SHOW_CHROME_EXTENSION_BANNER: false,
      MOBILE_APP_PROMO: false,
      NATIVE_APP_NAME: "CollabCode",
      PROVIDER_NAME: "CollabCode",
      LANG_DETECTION: true,
      CONNECTION_INDICATOR_AUTO_HIDE_ENABLED: true,
      CONNECTION_INDICATOR_AUTO_HIDE_TIMEOUT: 5000,
      CONNECTION_INDICATOR_DISABLED: false,
      VIDEO_LAYOUT_FIT: "both",
      filmStripOnly: false,
      VERTICAL_FILMSTRIP: true,
      CLOSE_PAGE_GUEST_HINT: false,
      SHOW_REJECT_WITH_MESSAGE_BUTTON: false,
      DISABLE_PRESENCE_STATUS: false,
      DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
    }

    // Create container element if not provided
    let parentNode = options.parentNode
    if (!parentNode) {
      parentNode = document.createElement("div")
      parentNode.id = "jitsi-container"
      parentNode.style.width = typeof options.width === "number" ? `${options.width}px` : options.width || "100%"
      parentNode.style.height = typeof options.height === "number" ? `${options.height}px` : options.height || "400px"
      document.body.appendChild(parentNode)
    }

    // Initialize Jitsi Meet API
    this.api = new window.JitsiMeetExternalAPI(this.domain, {
      roomName: config.roomName,
      width: options.width || "100%",
      height: options.height || "100%",
      parentNode: parentNode,
      configOverwrite: {
        ...defaultConfig,
        ...options.configOverwrite,
        subject: config.subject,
        startWithAudioMuted: options.configOverwrite?.startWithAudioMuted ?? false,
        startWithVideoMuted: options.configOverwrite?.startWithVideoMuted ?? false,
      },
      interfaceConfigOverwrite: {
        ...defaultInterfaceConfig,
        ...options.interfaceConfigOverwrite,
      },
      userInfo: {
        displayName: config.displayName,
        email: config.email,
        avatarUrl: config.avatar,
        ...options.userInfo,
      },
    })

    // Set up event listeners
    this.setupEventListeners(options)

    return this.api
  }

  private setupEventListeners(options: JitsiMeetingOptions): void {
    if (!this.api) return

    // API ready event
    this.api.addEventListener("videoConferenceJoined", () => {
      console.log("✅ Joined Jitsi meeting")
      if (options.onApiReady) {
        options.onApiReady(this.api)
      }
    })

    // Meeting ended event
    this.api.addEventListener("videoConferenceLeft", () => {
      console.log("👋 Left Jitsi meeting")
      if (options.onReadyToClose) {
        options.onReadyToClose()
      }
    })

    // Participant events
    this.api.addEventListener("participantJoined", (participant: any) => {
      console.log("👤 Participant joined:", participant)
    })

    this.api.addEventListener("participantLeft", (participant: any) => {
      console.log("👤 Participant left:", participant)
    })

    // Audio/Video events
    this.api.addEventListener("audioMuteStatusChanged", (event: any) => {
      console.log("🎤 Audio mute status:", event.muted)
    })

    this.api.addEventListener("videoMuteStatusChanged", (event: any) => {
      console.log("📹 Video mute status:", event.muted)
    })

    // Screen sharing events
    this.api.addEventListener("screenSharingStatusChanged", (event: any) => {
      console.log("🖥️ Screen sharing status:", event.on)
    })

    // Chat events
    this.api.addEventListener("incomingMessage", (event: any) => {
      console.log("💬 Incoming message:", event)
    })

    // Error events
    this.api.addEventListener("errorOccurred", (error: any) => {
      console.error("❌ Jitsi error:", error)
    })
  }

  // Control methods
  toggleAudio(): void {
    this.api?.executeCommand("toggleAudio")
  }

  toggleVideo(): void {
    this.api?.executeCommand("toggleVideo")
  }

  toggleScreenShare(): void {
    this.api?.executeCommand("toggleShareScreen")
  }

  toggleChat(): void {
    this.api?.executeCommand("toggleChat")
  }

  toggleFilmStrip(): void {
    this.api?.executeCommand("toggleFilmStrip")
  }

  setVideoQuality(quality: "low" | "standard" | "high"): void {
    this.api?.executeCommand("setVideoQuality", quality)
  }

  sendChatMessage(message: string): void {
    this.api?.executeCommand("sendChatMessage", message)
  }

  setDisplayName(name: string): void {
    this.api?.executeCommand("displayName", name)
  }

  setSubject(subject: string): void {
    this.api?.executeCommand("subject", subject)
  }

  // Get meeting information
  getParticipantsInfo(): Promise<any[]> {
    return new Promise((resolve) => {
      this.api?.executeCommand("getParticipantsInfo", (participants: any[]) => {
        resolve(participants)
      })
    })
  }

  getVideoQuality(): Promise<string> {
    return new Promise((resolve) => {
      this.api?.executeCommand("getVideoQuality", (quality: string) => {
        resolve(quality)
      })
    })
  }

  isAudioMuted(): Promise<boolean> {
    return new Promise((resolve) => {
      this.api?.executeCommand("isAudioMuted", (muted: boolean) => {
        resolve(muted)
      })
    })
  }

  isVideoMuted(): Promise<boolean> {
    return new Promise((resolve) => {
      this.api?.executeCommand("isVideoMuted", (muted: boolean) => {
        resolve(muted)
      })
    })
  }

  // Destroy meeting
  dispose(): void {
    if (this.api) {
      this.api.dispose()
      this.api = null
    }

    // Remove container if we created it
    const container = document.getElementById("jitsi-container")
    if (container) {
      container.remove()
    }
  }

  // Static utility methods
  static generateRoomName(projectId: string, suffix?: string): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    const roomSuffix = suffix ? `-${suffix}` : ""
    return `collabcode-${projectId}-${timestamp}-${random}${roomSuffix}`
  }

  static isJitsiSupported(): boolean {
    // Check if browser supports WebRTC
    return !!(window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection)
  }

  static getOptimalConfig(participantCount: number): Partial<JitsiConfig> {
    if (participantCount > 10) {
      return {
        // Large meeting optimizations
      }
    } else if (participantCount > 4) {
      return {
        // Medium meeting optimizations
      }
    } else {
      return {
        // Small meeting optimizations
      }
    }
  }
}

// Export singleton instance
export const jitsiService = new JitsiService()

// React hook for Jitsi integration
export function useJitsi() {
  const createMeeting = async (config: JitsiConfig, options?: JitsiMeetingOptions) => {
    return jitsiService.createMeeting(config, options)
  }

  const disposeMeeting = () => {
    jitsiService.dispose()
  }

  return {
    createMeeting,
    disposeMeeting,
    toggleAudio: () => jitsiService.toggleAudio(),
    toggleVideo: () => jitsiService.toggleVideo(),
    toggleScreenShare: () => jitsiService.toggleScreenShare(),
    toggleChat: () => jitsiService.toggleChat(),
    sendMessage: (message: string) => jitsiService.sendChatMessage(message),
    setDisplayName: (name: string) => jitsiService.setDisplayName(name),
    isSupported: JitsiService.isJitsiSupported(),
  }
}

// Declare global types for TypeScript
declare global {
  interface Window {
    JitsiMeetExternalAPI: any
  }
}
