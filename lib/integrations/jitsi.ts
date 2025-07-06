// Jitsi Meet Integration - Completely Free Video Calling
// Supports unlimited HD video calls with up to 75 participants

export interface JitsiConfig {
  roomName: string
  displayName: string
  email?: string
  avatar?: string
  subject?: string
  password?: string
}

export interface JitsiMeetAPI {
  executeCommand: (command: string, ...args: any[]) => void
  addListener: (event: string, listener: Function) => void
  removeListener: (event: string, listener: Function) => void
  dispose: () => void
  getParticipantsInfo: () => any[]
  isAudioMuted: () => boolean
  isVideoMuted: () => boolean
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any
  }
}

export class JitsiMeetService {
  private api: JitsiMeetAPI | null = null
  private domain = "meet.jit.si" // Free Jitsi server
  private container: HTMLElement | null = null

  constructor() {
    this.loadJitsiScript()
  }

  private async loadJitsiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.JitsiMeetExternalAPI) {
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = `https://${this.domain}/external_api.js`
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("Failed to load Jitsi Meet API"))
      document.head.appendChild(script)
    })
  }

  async createMeeting(config: JitsiConfig, containerId: string): Promise<JitsiMeetAPI> {
    await this.loadJitsiScript()

    this.container = document.getElementById(containerId)
    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`)
    }

    const options = {
      roomName: config.roomName,
      width: "100%",
      height: "100%",
      parentNode: this.container,
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        enableUserRolesBasedOnToken: false,
        prejoinPageEnabled: false,
        disableInviteFunctions: false,
        doNotStoreRoom: true,
        // UI customization
        toolbarButtons: [
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
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        BRAND_WATERMARK_LINK: "",
        SHOW_POWERED_BY: false,
        DISPLAY_WELCOME_PAGE_CONTENT: false,
        DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
        APP_NAME: "CollabCode Meeting",
        NATIVE_APP_NAME: "CollabCode",
        PROVIDER_NAME: "CollabCode",
        LANG_DETECTION: true,
        CONNECTION_INDICATOR_AUTO_HIDE_ENABLED: true,
        CONNECTION_INDICATOR_AUTO_HIDE_TIMEOUT: 5000,
        MAXIMUM_ZOOMING_COEFFICIENT: 1.3,
        FILM_STRIP_MAX_HEIGHT: 120,
        ENABLE_FEEDBACK_ANIMATION: false,
        DISABLE_FOCUS_INDICATOR: false,
        DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
        DISABLE_TRANSCRIPTION_SUBTITLES: false,
        DISABLE_RINGING: false,
        AUDIO_LEVEL_PRIMARY_COLOR: "rgba(255,255,255,0.4)",
        AUDIO_LEVEL_SECONDARY_COLOR: "rgba(255,255,255,0.2)",
        POLICY_LOGO: null,
        LOCAL_THUMBNAIL_RATIO: 16 / 9,
        REMOTE_THUMBNAIL_RATIO: 1,
        LIVE_STREAMING_HELP_LINK: "https://jitsi.org/live",
        MOBILE_APP_PROMO: false,
        ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT: 15000,
      },
      userInfo: {
        displayName: config.displayName,
        email: config.email || "",
        avatarURL: config.avatar || "",
      },
    }

    this.api = new window.JitsiMeetExternalAPI(this.domain, options)

    // Set up event listeners
    this.setupEventListeners()

    // Set subject if provided
    if (config.subject) {
      this.api.executeCommand("subject", config.subject)
    }

    // Set password if provided
    if (config.password) {
      this.api.executeCommand("password", config.password)
    }

    return this.api
  }

  private setupEventListeners(): void {
    if (!this.api) return

    // Meeting events
    this.api.addListener("videoConferenceJoined", (event: any) => {
      console.log("User joined the meeting:", event)
    })

    this.api.addListener("videoConferenceLeft", (event: any) => {
      console.log("User left the meeting:", event)
    })

    this.api.addListener("participantJoined", (event: any) => {
      console.log("Participant joined:", event)
    })

    this.api.addListener("participantLeft", (event: any) => {
      console.log("Participant left:", event)
    })

    // Audio/Video events
    this.api.addListener("audioMuteStatusChanged", (event: any) => {
      console.log("Audio mute status changed:", event)
    })

    this.api.addListener("videoMuteStatusChanged", (event: any) => {
      console.log("Video mute status changed:", event)
    })

    // Screen sharing events
    this.api.addListener("screenSharingStatusChanged", (event: any) => {
      console.log("Screen sharing status changed:", event)
    })

    // Chat events
    this.api.addListener("incomingMessage", (event: any) => {
      console.log("Incoming chat message:", event)
    })

    // Error handling
    this.api.addListener("readyToClose", () => {
      console.log("Meeting is ready to close")
    })
  }

  // Meeting controls
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

  hangUp(): void {
    this.api?.executeCommand("hangup")
  }

  setSubject(subject: string): void {
    this.api?.executeCommand("subject", subject)
  }

  sendChatMessage(message: string): void {
    this.api?.executeCommand("sendChatMessage", message)
  }

  // Get meeting info
  getParticipants(): any[] {
    return this.api?.getParticipantsInfo() || []
  }

  isAudioMuted(): boolean {
    return this.api?.isAudioMuted() || false
  }

  isVideoMuted(): boolean {
    return this.api?.isVideoMuted() || false
  }

  // Cleanup
  dispose(): void {
    if (this.api) {
      this.api.dispose()
      this.api = null
    }
    if (this.container) {
      this.container.innerHTML = ""
    }
  }

  // Utility methods
  generateRoomName(projectId: string, teamId?: string): string {
    const prefix = "collabcode"
    const suffix = teamId ? `${projectId}-${teamId}` : projectId
    return `${prefix}-${suffix}-${Date.now()}`
  }

  createMeetingUrl(roomName: string): string {
    return `https://${this.domain}/${roomName}`
  }

  // Advanced features
  setPassword(password: string): void {
    this.api?.executeCommand("password", password)
  }

  startRecording(): void {
    this.api?.executeCommand("startRecording", {
      mode: "stream",
    })
  }

  stopRecording(): void {
    this.api?.executeCommand("stopRecording", "stream")
  }

  startLiveStream(streamKey: string, streamUrl: string): void {
    this.api?.executeCommand("startLiveStream", streamKey, streamUrl)
  }

  stopLiveStream(): void {
    this.api?.executeCommand("stopLiveStream")
  }

  // Moderator controls
  muteEveryone(): void {
    this.api?.executeCommand("muteEveryone")
  }

  kickParticipant(participantId: string): void {
    this.api?.executeCommand("kickParticipant", participantId)
  }

  grantModerator(participantId: string): void {
    this.api?.executeCommand("grantModerator", participantId)
  }
}

// Export singleton instance
export const jitsiService = new JitsiMeetService()

// React hook for Jitsi integration
export function useJitsiMeet() {
  const createMeeting = async (config: JitsiConfig, containerId: string) => {
    return await jitsiService.createMeeting(config, containerId)
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
    hangUp: () => jitsiService.hangUp(),
    getParticipants: () => jitsiService.getParticipants(),
    isAudioMuted: () => jitsiService.isAudioMuted(),
    isVideoMuted: () => jitsiService.isVideoMuted(),
    generateRoomName: (projectId: string, teamId?: string) => jitsiService.generateRoomName(projectId, teamId),
    createMeetingUrl: (roomName: string) => jitsiService.createMeetingUrl(roomName),
  }
}
