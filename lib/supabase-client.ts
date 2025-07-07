import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Database types
export interface Profile {
  id: string
  username: string
  email: string
  avatar_url?: string
  status: "online" | "offline" | "away" | "busy"
  last_seen: string
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  name: string
  description?: string
  avatar_url?: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  name: string
  description?: string
  type: "channel" | "dm" | "group"
  team_id: string
  is_private: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  content: string
  type: "text" | "code" | "image" | "file" | "system"
  room_id: string
  user_id: string
  parent_id?: string
  edited_at?: string
  pinned: boolean
  created_at: string
  updated_at: string
  user?: Profile
}

// Auth functions
export const signUp = async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      },
    },
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Profile functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()
  return { data, error }
}

export const updateUserStatus = async (status: "online" | "offline" | "away" | "busy") => {
  const user = await getCurrentUser()
  if (!user) return { error: "No user found" }

  const { data, error } = await supabase
    .from("profiles")
    .update({ status, last_seen: new Date().toISOString() })
    .eq("id", user.id)
  return { data, error }
}

// Team functions
export const getUserTeams = async () => {
  const user = await getCurrentUser()
  if (!user) return { data: [], error: "No user found" }

  const { data, error } = await supabase
    .from("team_members")
    .select(`
      *,
      teams:team_id (*)
    `)
    .eq("user_id", user.id)

  return { data, error }
}

export const createTeam = async (name: string, description?: string) => {
  const user = await getCurrentUser()
  if (!user) return { error: "No user found" }

  const { data: team, error: teamError } = await supabase
    .from("teams")
    .insert({
      name,
      description,
      owner_id: user.id,
    })
    .select()
    .single()

  if (teamError) return { error: teamError }

  // Add user as team member
  const { error: memberError } = await supabase.from("team_members").insert({
    team_id: team.id,
    user_id: user.id,
    role: "owner",
  })

  if (memberError) return { error: memberError }

  return { data: team, error: null }
}

// Room functions
export const getTeamRooms = async (teamId: string) => {
  const { data, error } = await supabase.from("rooms").select("*").eq("team_id", teamId).order("created_at")

  return { data, error }
}

export const createRoom = async (
  teamId: string,
  name: string,
  description?: string,
  type: "channel" | "dm" | "group" = "channel",
) => {
  const user = await getCurrentUser()
  if (!user) return { error: "No user found" }

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .insert({
      name,
      description,
      type,
      team_id: teamId,
      created_by: user.id,
    })
    .select()
    .single()

  if (roomError) return { error: roomError }

  // Add user to room
  const { error: memberError } = await supabase.from("room_members").insert({
    room_id: room.id,
    user_id: user.id,
  })

  if (memberError) return { error: memberError }

  return { data: room, error: null }
}

// Message functions
export const getRoomMessages = async (roomId: string, limit = 50) => {
  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      user:user_id (
        id,
        username,
        avatar_url,
        status
      )
    `)
    .eq("room_id", roomId)
    .order("created_at", { ascending: false })
    .limit(limit)

  return { data: data?.reverse() || [], error }
}

export const sendMessage = async (
  roomId: string,
  content: string,
  type: "text" | "code" | "image" | "file" | "system" = "text",
) => {
  const user = await getCurrentUser()
  if (!user) return { error: "No user found" }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      content,
      type,
      room_id: roomId,
      user_id: user.id,
    })
    .select(`
      *,
      user:user_id (
        id,
        username,
        avatar_url,
        status
      )
    `)
    .single()

  return { data, error }
}

// Real-time subscriptions
export const subscribeToMessages = (roomId: string, callback: (message: Message) => void) => {
  return supabase
    .channel(`room:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `room_id=eq.${roomId}`,
      },
      async (payload) => {
        // Fetch the complete message with user data
        const { data } = await supabase
          .from("messages")
          .select(`
            *,
            user:user_id (
              id,
              username,
              avatar_url,
              status
            )
          `)
          .eq("id", payload.new.id)
          .single()

        if (data) {
          callback(data as Message)
        }
      },
    )
    .subscribe()
}

export const subscribeToUserStatus = (callback: (profile: Profile) => void) => {
  return supabase
    .channel("user_status")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "profiles",
      },
      (payload) => {
        callback(payload.new as Profile)
      },
    )
    .subscribe()
}

// Call functions
export const startCall = async (roomId: string, type: "voice" | "video") => {
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("call_sessions")
    .insert({
      room_id: roomId,
      type,
      started_by: user.user.id,
      participants: [user.user.id],
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const joinCall = async (callId: string) => {
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")

  const { data: call } = await supabase.from("call_sessions").select("participants").eq("id", callId).single()

  if (!call) throw new Error("Call not found")

  const participants = [...(call.participants || []), user.user.id]

  const { data, error } = await supabase
    .from("call_sessions")
    .update({ participants })
    .eq("id", callId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const endCall = async (callId: string) => {
  const { data, error } = await supabase
    .from("call_sessions")
    .update({ ended_at: new Date().toISOString() })
    .eq("id", callId)
    .select()
    .single()

  if (error) throw error
  return data
}

// User presence
export const getOnlineUsers = async (teamId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *,
      team_members!inner (
        team_id
      )
    `)
    .eq("team_members.team_id", teamId)
    .in("status", ["online", "away", "busy"])
    .order("last_seen", { ascending: false })

  if (error) throw error
  return data
}
