import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PremiumNavigation } from "@/components/PremiumNavigation"
import { AuthGuard } from "@/components/AuthGuard"
import { AuthProvider } from "@/lib/hooks/useAuth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CollabCode - Collaborative Development Platform",
  description: "Build, collaborate, and deploy together with AI-powered development tools",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PremiumNavigation />
          <AuthGuard>
            <main>{children}</main>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  )
}
