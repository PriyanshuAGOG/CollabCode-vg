"use client"

import type React from "react"

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#16213E]">
      {/* Completely hide main navigation */}
      <style jsx global>{`
        /* Hide all possible navigation elements */
        nav, 
        header,
        .main-nav,
        .main-navigation,
        .navigation,
        [role="navigation"],
        .navbar,
        .header,
        .top-nav {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
        }
        
        /* Ensure main content takes full space */
        main {
          padding: 0 !important;
          margin: 0 !important;
          height: 100vh !important;
          width: 100vw !important;
        }
        
        /* Hide any potential layout containers */
        .layout-container,
        .app-layout,
        .main-layout {
          padding: 0 !important;
          margin: 0 !important;
        }
        
        /* Force full screen */
        body {
          overflow: hidden !important;
        }
      `}</style>
      {children}
    </div>
  )
}
