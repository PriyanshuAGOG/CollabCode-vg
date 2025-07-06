"use client"

import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import {
  supabase,
  signIn as supabaseSignIn,
  signUp as supabaseSignUp,
  signOut as supabaseSignOut,
} from "@/lib/supabase-client"

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const result = await supabaseSignIn(email, password)
    setLoading(false)
    return result
  }

  const signUp = async (email: string, password: string, username: string) => {
    setLoading(true)
    const result = await supabaseSignUp(email, password, username)
    setLoading(false)
    return result
  }

  const signOut = async () => {
    setLoading(true)
    const result = await supabaseSignOut()
    setLoading(false)
    return result
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}
