"use client"

import type React from "react"

import { createContext, useContext, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { useSupabaseAuth } from "@/lib/hooks/useSupabaseAuth"
import { updateUserStatus } from "@/lib/supabase-client"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, username: string) => Promise<any>
  signOut: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useSupabaseAuth()

  useEffect(() => {
    if (auth.user) {
      // Update user status to online when authenticated
      updateUserStatus("online")

      // Update status to offline when user leaves
      const handleBeforeUnload = () => {
        updateUserStatus("offline")
      }

      window.addEventListener("beforeunload", handleBeforeUnload)
      return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [auth.user])

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
