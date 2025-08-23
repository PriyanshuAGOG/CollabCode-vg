"use client"

import type React from "react"

import { createContext, useContext, useEffect } from "react"
import { Models } from "appwrite"
import { useAppwriteAuth } from "@/lib/hooks/useAppwriteAuth"
// import { updateUserStatus } from "@/lib/appwrite" // TODO: Implement this

interface AuthContextType {
  user: Models.User<Models.Preferences> | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, username: string) => Promise<any>
  signOut: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAppwriteAuth()

  // useEffect(() => {
  //   if (auth.user) {
  //     // TODO: Implement updateUserStatus
  //     // Update user status to online when authenticated
  //     updateUserStatus("online")
  //
  //     // Update status to offline when user leaves
  //     const handleBeforeUnload = () => {
  //       updateUserStatus("offline")
  //     }
  //
  //     window.addEventListener("beforeunload", handleBeforeUnload)
  //     return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  //   }
  // }, [auth.user])

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
