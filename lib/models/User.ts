import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  id?: string
  username: string
  email: string
  password: string // hashed
  avatar_url?: string
  status: "online" | "offline" | "away" | "busy"
  last_seen: Date
  created_at: Date
  updated_at: Date
  profile?: {
    bio?: string
    location?: string
    website?: string
    github?: string
    twitter?: string
    linkedin?: string
  }
  preferences?: {
    theme: "light" | "dark" | "system"
    notifications: boolean
    email_notifications: boolean
  }
}

export interface Team {
  _id?: ObjectId
  id?: string
  name: string
  description?: string
  avatar_url?: string
  owner_id: string
  members: TeamMember[]
  created_at: Date
  updated_at: Date
  settings?: {
    is_public: boolean
    allow_invites: boolean
    max_members: number
  }
}

export interface TeamMember {
  user_id: string
  role: "owner" | "admin" | "member"
  joined_at: Date
  permissions?: string[]
}

export interface Project {
  _id?: ObjectId
  id?: string
  name: string
  description?: string
  framework: string
  repository_url?: string
  team_id?: string
  owner_id: string
  collaborators: ProjectCollaborator[]
  is_public: boolean
  status: "active" | "archived" | "paused"
  created_at: Date
  updated_at: Date
  settings?: {
    auto_save: boolean
    version_control: boolean
    deployment_url?: string
  }
}

export interface ProjectCollaborator {
  user_id: string
  role: "owner" | "admin" | "collaborator" | "viewer"
  permissions: string[]
  joined_at: Date
}

export interface Room {
  _id?: ObjectId
  id?: string
  name: string
  description?: string
  type: "channel" | "dm" | "group"
  team_id?: string
  project_id?: string
  is_private: boolean
  created_by: string
  members: RoomMember[]
  created_at: Date
  updated_at: Date
}

export interface RoomMember {
  user_id: string
  joined_at: Date
  last_read_at: Date
  role?: "admin" | "member"
}

export interface Message {
  _id?: ObjectId
  id?: string
  content: string
  type: "text" | "code" | "image" | "file" | "system"
  room_id: string
  user_id: string
  parent_id?: string // for threads
  edited_at?: Date
  pinned: boolean
  reactions: MessageReaction[]
  attachments?: MessageAttachment[]
  created_at: Date
  updated_at: Date
}

export interface MessageReaction {
  emoji: string
  user_id: string
  created_at: Date
}

export interface MessageAttachment {
  name: string
  url: string
  type: string
  size: number
}

export interface File {
  _id?: ObjectId
  id?: string
  name: string
  path: string
  content: string
  language: string
  project_id: string
  created_by: string
  last_modified_by: string
  version: number
  created_at: Date
  updated_at: Date
}

export interface CallSession {
  _id?: ObjectId
  id?: string
  room_id: string
  type: "voice" | "video"
  started_by: string
  participants: CallParticipant[]
  started_at: Date
  ended_at?: Date
  recording_url?: string
}

export interface CallParticipant {
  user_id: string
  joined_at: Date
  left_at?: Date
  is_muted: boolean
  is_video_enabled: boolean
}

export interface Notification {
  _id?: ObjectId
  id?: string
  user_id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  data?: any
  created_at: Date
}

export interface Integration {
  _id?: ObjectId
  id?: string
  name: string
  type: "github" | "vercel" | "figma" | "slack" | "docker" | "ai"
  config: any
  team_id?: string
  user_id: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}
