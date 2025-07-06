"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { WebSocketManager, type CollaboratorCursor, type CodeChange, type CollaboratorPresence } from "@/lib/websocket"

interface CollaborationContextType {
  wsManager: WebSocketManager | null
  collaborators: CollaboratorPresence[]
  cursors: CollaboratorCursor[]
  isConnected: boolean
  connectionStatus: "connecting" | "connected" | "disconnected" | "error"
  sendCodeChange: (change: Omit<CodeChange, "id" | "timestamp" | "userId" | "username">) => void
  sendCursorUpdate: (file: string, position: { line: number; column: number }, selection?: any) => void
  sendFileChange: (file: string) => void
}

const CollaborationContext = createContext<CollaborationContextType | null>(null)

export const useCollaboration = () => {
  const context = useContext(CollaborationContext)
  if (!context) {
    throw new Error("useCollaboration must be used within a CollaborationProvider")
  }
  return context
}

interface CollaborationProviderProps {
  children: React.ReactNode
  projectId: string
  userId: string
  username: string
}

const COLLABORATOR_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#84CC16", // Lime
]

export function CollaborationProvider({ children, projectId, userId, username }: CollaborationProviderProps) {
  const [wsManager, setWsManager] = useState<WebSocketManager | null>(null)
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([])
  const [cursors, setCursors] = useState<CollaboratorCursor[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected" | "error">(
    "connecting",
  )

  useEffect(() => {
    const manager = new WebSocketManager(projectId, userId, username)
    setWsManager(manager)

    // Connection events
    manager.on("connected", () => {
      setIsConnected(true)
      setConnectionStatus("connected")
    })

    manager.on("disconnected", () => {
      setIsConnected(false)
      setConnectionStatus("disconnected")
    })

    manager.on("error", () => {
      setConnectionStatus("error")
    })

    // Collaboration events
    manager.on("user_joined", (data: { userId: string; username: string }) => {
      const color = COLLABORATOR_COLORS[collaborators.length % COLLABORATOR_COLORS.length]
      setCollaborators((prev) => [
        ...prev.filter((c) => c.userId !== data.userId),
        {
          userId: data.userId,
          username: data.username,
          color,
          isActive: true,
          lastSeen: Date.now(),
        },
      ])
    })

    manager.on("user_left", (data: { userId: string }) => {
      setCollaborators((prev) => prev.filter((c) => c.userId !== data.userId))
      setCursors((prev) => prev.filter((c) => c.userId !== data.userId))
    })

    manager.on(
      "cursor_update",
      (data: {
        userId: string
        username: string
        file: string
        position: { line: number; column: number }
        selection?: any
      }) => {
        if (data.userId === userId) return // Don't show own cursor

        const collaborator = collaborators.find((c) => c.userId === data.userId)
        const color = collaborator?.color || COLLABORATOR_COLORS[0]

        setCursors((prev) => [
          ...prev.filter((c) => c.userId !== data.userId),
          {
            userId: data.userId,
            username: data.username,
            color,
            position: data.position,
            selection: data.selection,
          },
        ])
      },
    )

    manager.on("code_change", (change: CodeChange) => {
      // Handle incoming code changes
      window.dispatchEvent(new CustomEvent("collaboration:code_change", { detail: change }))
    })

    manager.on("file_change", (data: { userId: string; username: string; file: string }) => {
      // Update collaborator's current file
      setCollaborators((prev) =>
        prev.map((c) => (c.userId === data.userId ? { ...c, currentFile: data.file, lastSeen: Date.now() } : c)),
      )
    })

    return () => {
      manager.disconnect()
    }
  }, [projectId, userId, username])

  const sendCodeChange = useCallback(
    (change: Omit<CodeChange, "id" | "timestamp" | "userId" | "username">) => {
      wsManager?.sendCodeChange({
        ...change,
        userId,
        username,
      })
    },
    [wsManager, userId, username],
  )

  const sendCursorUpdate = useCallback(
    (file: string, position: { line: number; column: number }, selection?: any) => {
      wsManager?.sendCursorPosition(file, position, selection)
    },
    [wsManager],
  )

  const sendFileChange = useCallback(
    (file: string) => {
      wsManager?.sendFileChange(file)
    },
    [wsManager],
  )

  return (
    <CollaborationContext.Provider
      value={{
        wsManager,
        collaborators,
        cursors,
        isConnected,
        connectionStatus,
        sendCodeChange,
        sendCursorUpdate,
        sendFileChange,
      }}
    >
      {children}
    </CollaborationContext.Provider>
  )
}
