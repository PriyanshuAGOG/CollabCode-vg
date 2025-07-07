import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
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

// Database helpers
export const createUserProfile = async (userId: string, username: string, email: string) => {
  const { data, error } = await supabase.from("profiles").insert([
    {
      id: userId,
      username,
      email,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      status: "online",
      created_at: new Date().toISOString(),
    },
  ])
  return { data, error }
}

export const updateUserStatus = async (userId: string, status: "online" | "offline" | "away" | "busy") => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ status, last_seen: new Date().toISOString() })
    .eq("id", userId)
  return { data, error }
}
