const { Server } = require("socket.io")
const { createServer } = require("http")

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
})

// Store active users and rooms
const activeUsers = new Map()
const projectRooms = new Map()
const typingUsers = new Map()

console.log("🚀 Starting CollabCode WebSocket Server...")

io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`)

  // Handle user authentication
  socket.on("authenticate", (userData) => {
    activeUsers.set(socket.id, {
      ...userData,
      socketId: socket.id,
      lastSeen: new Date(),
    })

    console.log(`🔐 User authenticated: ${userData.username} (${socket.id})`)

    // Broadcast user online status
    socket.broadcast.emit("user_online", {
      userId: userData.id,
      username: userData.username,
      status: "online",
    })
  })

  // Handle joining project rooms
  socket.on("join_project", (projectId) => {
    socket.join(`project_${projectId}`)

    if (!projectRooms.has(projectId)) {
      projectRooms.set(projectId, new Set())
    }
    projectRooms.get(projectId).add(socket.id)

    const user = activeUsers.get(socket.id)
    if (user) {
      console.log(`👥 ${user.username} joined project: ${projectId}`)

      // Notify other users in the project
      socket.to(`project_${projectId}`).emit("user_joined_project", {
        userId: user.id,
        username: user.username,
        projectId,
      })

      // Send current project members
      const projectMembers = Array.from(projectRooms.get(projectId))
        .map((socketId) => activeUsers.get(socketId))
        .filter(Boolean)

      socket.emit("project_members", projectMembers)
    }
  })

  // Handle leaving project rooms
  socket.on("leave_project", (projectId) => {
    socket.leave(`project_${projectId}`)

    if (projectRooms.has(projectId)) {
      projectRooms.get(projectId).delete(socket.id)
      if (projectRooms.get(projectId).size === 0) {
        projectRooms.delete(projectId)
      }
    }

    const user = activeUsers.get(socket.id)
    if (user) {
      console.log(`👋 ${user.username} left project: ${projectId}`)
      socket.to(`project_${projectId}`).emit("user_left_project", {
        userId: user.id,
        username: user.username,
        projectId,
      })
    }
  })

  // Handle real-time code changes
  socket.on("code_change", (data) => {
    const { projectId, fileId, content, cursor, selection } = data
    const user = activeUsers.get(socket.id)

    if (user) {
      socket.to(`project_${projectId}`).emit("code_update", {
        fileId,
        content,
        cursor,
        selection,
        userId: user.id,
        username: user.username,
        timestamp: new Date(),
      })
    }
  })

  // Handle cursor movements
  socket.on("cursor_move", (data) => {
    const { projectId, fileId, cursor, selection } = data
    const user = activeUsers.get(socket.id)

    if (user) {
      socket.to(`project_${projectId}`).emit("cursor_update", {
        fileId,
        cursor,
        selection,
        userId: user.id,
        username: user.username,
        color: getUserColor(user.id),
      })
    }
  })

  // Handle typing indicators
  socket.on("typing_start", (data) => {
    const { projectId, fileId } = data
    const user = activeUsers.get(socket.id)

    if (user) {
      const typingKey = `${projectId}_${fileId}`
      if (!typingUsers.has(typingKey)) {
        typingUsers.set(typingKey, new Set())
      }
      typingUsers.get(typingKey).add(user.id)

      socket.to(`project_${projectId}`).emit("user_typing", {
        fileId,
        userId: user.id,
        username: user.username,
        isTyping: true,
      })
    }
  })

  socket.on("typing_stop", (data) => {
    const { projectId, fileId } = data
    const user = activeUsers.get(socket.id)

    if (user) {
      const typingKey = `${projectId}_${fileId}`
      if (typingUsers.has(typingKey)) {
        typingUsers.get(typingKey).delete(user.id)
        if (typingUsers.get(typingKey).size === 0) {
          typingUsers.delete(typingKey)
        }
      }

      socket.to(`project_${projectId}`).emit("user_typing", {
        fileId,
        userId: user.id,
        username: user.username,
        isTyping: false,
      })
    }
  })

  // Handle chat messages
  socket.on("send_message", (data) => {
    const { projectId, roomId, content, type = "text" } = data
    const user = activeUsers.get(socket.id)

    if (user) {
      const message = {
        id: generateId(),
        content,
        type,
        userId: user.id,
        username: user.username,
        avatar: user.avatar_url,
        timestamp: new Date(),
        roomId,
      }

      // Broadcast to project room
      io.to(`project_${projectId}`).emit("new_message", message)

      console.log(`💬 Message from ${user.username} in project ${projectId}: ${content.substring(0, 50)}...`)
    }
  })

  // Handle file operations
  socket.on("file_created", (data) => {
    const { projectId, file } = data
    const user = activeUsers.get(socket.id)

    if (user) {
      socket.to(`project_${projectId}`).emit("file_added", {
        file,
        createdBy: user.username,
        timestamp: new Date(),
      })
    }
  })

  socket.on("file_deleted", (data) => {
    const { projectId, fileId, fileName } = data
    const user = activeUsers.get(socket.id)

    if (user) {
      socket.to(`project_${projectId}`).emit("file_removed", {
        fileId,
        fileName,
        deletedBy: user.username,
        timestamp: new Date(),
      })
    }
  })

  socket.on("file_renamed", (data) => {
    const { projectId, fileId, oldName, newName } = data
    const user = activeUsers.get(socket.id)

    if (user) {
      socket.to(`project_${projectId}`).emit("file_renamed", {
        fileId,
        oldName,
        newName,
        renamedBy: user.username,
        timestamp: new Date(),
      })
    }
  })

  // Handle video call signaling
  socket.on("call_start", (data) => {
    const { projectId, roomName } = data
    const user = activeUsers.get(socket.id)

    if (user) {
      socket.to(`project_${projectId}`).emit("call_started", {
        roomName,
        startedBy: user.username,
        timestamp: new Date(),
      })
    }
  })

  socket.on("call_join", (data) => {
    const { projectId, roomName } = data
    const user = activeUsers.get(socket.id)

    if (user) {
      socket.to(`project_${projectId}`).emit("user_joined_call", {
        roomName,
        username: user.username,
        timestamp: new Date(),
      })
    }
  })

  socket.on("call_leave", (data) => {
    const { projectId, roomName } = data
    const user = activeUsers.get(socket.id)

    if (user) {
      socket.to(`project_${projectId}`).emit("user_left_call", {
        roomName,
        username: user.username,
        timestamp: new Date(),
      })
    }
  })

  // Handle screen sharing
  socket.on("screen_share_start", (data) => {
    const { projectId } = data
    const user = activeUsers.get(socket.id)

    if (user) {
      socket.to(`project_${projectId}`).emit("screen_share_started", {
        userId: user.id,
        username: user.username,
        timestamp: new Date(),
      })
    }
  })

  socket.on("screen_share_stop", (data) => {
    const { projectId } = data
    const user = activeUsers.get(socket.id)

    if (user) {
      socket.to(`project_${projectId}`).emit("screen_share_stopped", {
        userId: user.id,
        username: user.username,
        timestamp: new Date(),
      })
    }
  })

  // Handle user status updates
  socket.on("status_update", (status) => {
    const user = activeUsers.get(socket.id)
    if (user) {
      user.status = status
      user.lastSeen = new Date()

      // Broadcast status update
      socket.broadcast.emit("user_status_update", {
        userId: user.id,
        username: user.username,
        status,
        lastSeen: user.lastSeen,
      })
    }
  })

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    const user = activeUsers.get(socket.id)

    if (user) {
      console.log(`❌ User disconnected: ${user.username} (${socket.id}) - Reason: ${reason}`)

      // Remove from all project rooms
      projectRooms.forEach((members, projectId) => {
        if (members.has(socket.id)) {
          members.delete(socket.id)
          socket.to(`project_${projectId}`).emit("user_left_project", {
            userId: user.id,
            username: user.username,
            projectId,
          })

          if (members.size === 0) {
            projectRooms.delete(projectId)
          }
        }
      })

      // Remove from typing indicators
      typingUsers.forEach((users, key) => {
        users.delete(user.id)
        if (users.size === 0) {
          typingUsers.delete(key)
        }
      })

      // Broadcast user offline status
      socket.broadcast.emit("user_offline", {
        userId: user.id,
        username: user.username,
        lastSeen: new Date(),
      })

      activeUsers.delete(socket.id)
    } else {
      console.log(`❌ Unknown user disconnected: ${socket.id}`)
    }
  })

  // Handle ping/pong for connection health
  socket.on("ping", () => {
    socket.emit("pong")
  })
})

// Utility functions
function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

function getUserColor(userId) {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
  ]
  const hash = userId.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)
  return colors[Math.abs(hash) % colors.length]
}

// Periodic cleanup of inactive connections
setInterval(() => {
  const now = new Date()
  const timeout = 5 * 60 * 1000 // 5 minutes

  activeUsers.forEach((user, socketId) => {
    if (now - user.lastSeen > timeout) {
      console.log(`🧹 Cleaning up inactive user: ${user.username}`)
      activeUsers.delete(socketId)
    }
  })
}, 60000) // Check every minute

// Start the server
const PORT = process.env.WEBSOCKET_PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`🚀 CollabCode WebSocket Server running on port ${PORT}`)
  console.log(`📡 CORS enabled for: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}`)
  console.log("✅ Ready for real-time collaboration!")
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully...")
  httpServer.close(() => {
    console.log("✅ WebSocket server closed")
    process.exit(0)
  })
})

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully...")
  httpServer.close(() => {
    console.log("✅ WebSocket server closed")
    process.exit(0)
  })
})
