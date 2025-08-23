"use client"

import { useState, useEffect } from "react"
import { Models } from "appwrite"
import {
  account,
  signIn as appwriteSignIn,
  signUp as appwriteSignUp,
  signOut as appwriteSignOut,
  getCurrentUser,
} from "@/lib/appwrite"

export function useAppwriteAuth() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const result = await appwriteSignIn(email, password)
    if (result.data) {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }
    setLoading(false)
    return result
  }

  const signUp = async (email: string, password: string, username: string) => {
    setLoading(true)
    const result = await appwriteSignUp(email, password, username)
    setLoading(false)
    return result
  }

  const signOut = async () => {
    setLoading(true)
    await appwriteSignOut()
    setUser(null)
    setLoading(false)
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}
