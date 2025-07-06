"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sparkles } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const protectedRoutes = [
    "/dashboard",
    "/chat",
    "/teams",
    "/explore",
    "/community",
    "/project",
    "/profile",
    "/settings",
  ]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated")
      setIsAuthenticated(authStatus === "true")

      if (isProtectedRoute && authStatus !== "true") {
        router.push("/auth")
      }
    }

    checkAuth()
  }, [pathname, router, isProtectedRoute])

  if (isProtectedRoute && isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1C3A] to-[#1a2332] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#00C4B4] to-[#E8B923] rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Loading CollabCode</h2>
          <p className="text-white/70">Preparing your premium workspace...</p>
        </div>
      </div>
    )
  }

  if (isProtectedRoute && !isAuthenticated) {
    return null // Will redirect to auth
  }

  return <>{children}</>
}
