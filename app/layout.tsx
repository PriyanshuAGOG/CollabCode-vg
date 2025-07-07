import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { PremiumNavigation } from "@/components/PremiumNavigation"
import { AuthGuard } from "@/components/AuthGuard"
import { AuthProvider } from "@/components/auth/AuthProvider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CollabCode - Premium Collaborative Development Platform",
  description:
    "The ultimate platform for developers, designers, and entrepreneurs to collaborate, create, and innovate together.",
  keywords: "collaboration, development, design, coding, teamwork, premium",
  authors: [{ name: "CollabCode Team" }],
  creator: "CollabCode",
  publisher: "CollabCode",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://collabcode.dev"),
  openGraph: {
    title: "CollabCode - Premium Collaborative Development Platform",
    description:
      "The ultimate platform for developers, designers, and entrepreneurs to collaborate, create, and innovate together.",
    url: "https://collabcode.dev",
    siteName: "CollabCode",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CollabCode Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CollabCode - Premium Collaborative Development Platform",
    description:
      "The ultimate platform for developers, designers, and entrepreneurs to collaborate, create, and innovate together.",
    images: ["/og-image.jpg"],
    creator: "@collabcode",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-deep-navy text-text-primary font-inter antialiased">
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
