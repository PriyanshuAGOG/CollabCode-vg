
"use client"

import { useUser, useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { HybridDatabase } from "@/lib/database"

export function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const { signOut } = useAuth()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeUser = async () => {
      if (isLoaded && user) {
        try {
          // Check if user exists in MongoDB
          let dbUser = await HybridDatabase.getUser(user.id)
          
          if (!dbUser) {
            // Create user in MongoDB
            dbUser = await HybridDatabase.createUser({
              clerkId: user.id,
              email: user.emailAddresses[0]?.emailAddress,
              username: user.username || user.firstName + user.lastName,
              firstName: user.firstName,
              lastName: user.lastName,
              avatar: user.imageUrl,
              status: 'online',
            })
          } else {
            // Update user status to online
            await HybridDatabase.updateUser(user.id, { status: 'online' })
          }
          
          setIsInitialized(true)
        } catch (error) {
          console.error('Failed to initialize user:', error)
        }
      }
    }

    initializeUser()
  }, [isLoaded, user])

  useEffect(() => {
    if (user) {
      // Update user status to offline when user leaves
      const handleBeforeUnload = async () => {
        await HybridDatabase.updateUser(user.id, { status: 'offline' })
      }

      window.addEventListener("beforeunload", handleBeforeUnload)
      return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [user])

  if (!isLoaded || (user && !isInitialized)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return <>{children}</>
}
