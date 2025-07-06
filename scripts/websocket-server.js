// WebSocket Server for Real-time Features
// Handles chat, collaboration, and presence

const { Server } = require("socket.io")
const { createServer } = require("http")

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
})

// Store active users and rooms
const activeUsers = new Map()
const projectRooms = new Map()
const typingUsers = new Map()

console.log("🚀 Starting WebSocket server...")

io.on("connection", (socket) => {
  const { userId, username, projectId } = socket.handshake.query

  console.log(`✅ User connected: ${username} (${userId})`)

  // Store user info
  activeUsers.set(socket.id, {
    userId,
    username,
    socketId: socket.id,
    joinedAt: new Date(),
    currentProject: projectId || null,
    status: "online",
  })

  // Join project room if specified
  if (projectId) {
    socket.join(`project:${projectId}`)

    if (!projectRooms.has(projectId)) {
      projectRooms.set(projectId, new Set())
    }
    projectRooms.get(projectId).add(socket.id)

    // Notify others in the project
    socket.to(`project:${projectId}`).emit("user-joined", {
      userId,
      username,
      joinedAt: new Date(),
    })

    // Send current project users to the new user
    const projectUsers = Array.from(projectRooms.get(projectId))
      .map((socketId) => activeUsers.get(socketId))
      .filter(Boolean)

    socket.emit("presence-update", projectUsers)
  }

  // Handle project joining
  socket.on("join-project", ({ projectId: newProjectId }) => {
    // Leave current project if any
    const currentProject = activeUsers.get(socket.id)?.currentProject
    if (currentProject) {
      socket.leave(`project:${currentProject}`)
      if (projectRooms.has(currentProject)) {
        projectRooms.get(currentProject).delete(socket.id)
        socket.to(`project:${currentProject}`).emit("user-left", userId)
      }
    }

    // Join new project
    socket.join(`project:${newProjectId}`)
    if (!projectRooms.has(newProjectId)) {
      projectRooms.set(newProjectId, new Set())
    }
    projectRooms.get(newProjectId).add(socket.id)

    // Update user's current project
    const user = activeUsers.get(socket.id)
    if (user) {
      user.currentProject = newProjectId
    }

    // Notify others
    socket.to(`project:${newProjectId}`).emit("user-joined", {
      userId,
      username,
      joinedAt: new Date(),
    })

    // Send current project users
    const projectUsers = Array.from(projectRooms.get(newProjectId))
      .map((socketId) => activeUsers.get(socketId))
      .filter(Boolean)

    socket.emit("presence-update", projectUsers)
  })

  // Handle project leaving
  socket.on("leave-project", ({ projectId: leaveProjectId }) => {
    socket.leave(`project:${leaveProjectId}`)
    if (projectRooms.has(leaveProjectId)) {
      projectRooms.get(leaveProjectId).delete(socket.id)
      socket.to(`project:${leaveProjectId}`).emit("user-left", userId)
    }

    const user = activeUsers.get(socket.id)
    if (user) {
      user.currentProject = null
    }
  })

  // Handle chat messages
  socket.on("message", (messageData) => {
    const user = activeUsers.get(socket.id)
    if (!user || !user.currentProject) return

    const message = {
      ...messageData,
      timestamp: new Date(),
      socketId: socket.id,
    }

    // Broadcast to project room
    socket.to(`project:${user.currentProject}`).emit("message", message)

    console.log(`💬 Message from ${username} in project ${user.currentProject}: ${messageData.message}`)
  })

  // Handle typing indicators
  socket.on("typing", ({ isTyping }) => {
    const user = activeUsers.get(socket.id)
    if (!user || !user.currentProject) return

    const typingKey = `${user.currentProject}:${userId}`

    if (isTyping) {
      typingUsers.set(typingKey, {
        userId,
        username,
        projectId: user.currentProject,
        startedAt: new Date(),
      })
    } else {
      typingUsers.delete(typingKey)
    }

    // Broadcast typing status to project room
    socket.to(`project:${user.currentProject}`).emit("typing", {
      userId,
      username,
      isTyping,
    })
  })

  // Handle cursor updates
  socket.on("cursor-update", ({ cursor }) => {
    const user = activeUsers.get(socket.id)
    if (!user || !user.currentProject) return

    socket.to(`project:${user.currentProject}`).emit("cursor-update", {
      userId,
      username,
      cursor,
      timestamp: new Date(),
    })
  })

  // Handle code changes
  socket.on("code-change", ({ changes }) => {
    const user = activeUsers.get(socket.id)
    if (!user || !user.currentProject) return

    socket.to(`project:${user.currentProject}`).emit("code-change", {
      userId,
      username,
      changes,
      timestamp: new Date(),
    })
  })

  // Handle selection updates
  socket.on("selection-update", ({ selection }) => {
    const user = activeUsers.get(socket.id)
    if (!user || !user.currentProject) return

    socket.to(`project:${user.currentProject}`).emit("selection-update", {
      userId,
      username,
      selection,
      timestamp: new Date(),
    })
  })

  // Handle presence updates
  socket.on("presence-update", ({ status, metadata }) => {
    const user = activeUsers.get(socket.id)
    if (!user) return

    user.status = status
    user.metadata = metadata
    user.lastSeen = new Date()

    if (user.currentProject) {
      const projectUsers = Array.from(projectRooms.get(user.currentProject))
        .map((socketId) => activeUsers.get(socketId))
        .filter(Boolean)

      io.to(`project:${user.currentProject}`).emit("presence-update", projectUsers)
    }
  })

  // Handle current file updates
  socket.on("current-file", ({ filename }) => {
    const user = activeUsers.get(socket.id)
    if (!user) return

    user.currentFile = filename
    user.lastActivity = new Date()

    if (user.currentProject) {
      socket.to(`project:${user.currentProject}`).emit("file-change", {
        userId,
        username,
        filename,
        timestamp: new Date(),
      })
    }
  })

  // Handle file sharing
  socket.on("file-share", (fileData) => {
    const user = activeUsers.get(socket.id)
    if (!user || !user.currentProject) return

    const message = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      username,
      type: "file",
      message: `Shared a file: ${fileData.name}`,
      metadata: {
        filename: fileData.name,
        size: fileData.size,
        type: fileData.type,
        url: fileData.url || "#",
      },
      timestamp: new Date(),
    }

    io.to(`project:${user.currentProject}`).emit("message", message)
  })

  // Handle screen sharing
  socket.on("screen-share-start", () => {
    const user = activeUsers.get(socket.id)
    if (!user || !user.currentProject) return

    socket.to(`project:${user.currentProject}`).emit("screen-share-started", {
      userId,
      username,
      timestamp: new Date(),
    })
  })

  socket.on("screen-share-stop", () => {
    const user = activeUsers.get(socket.id)
    if (!user || !user.currentProject) return

    socket.to(`project:${user.currentProject}`).emit("screen-share-stopped", {
      userId,
      username,
      timestamp: new Date(),
    })
  })

  // Handle voice chat
  socket.on("voice-chat-start", () => {
    const user = activeUsers.get(socket.id)
    if (!user || !user.currentProject) return

    socket.to(`project:${user.currentProject}`).emit("voice-chat-started", {
      userId,
      username,
      timestamp: new Date(),
    })
  })

  socket.on("voice-chat-stop", () => {
    const user = activeUsers.get(socket.id)
    if (!user || !user.currentProject) return

    socket.to(`project:${user.currentProject}`).emit("voice-chat-stopped", {
      userId,
      username,
      timestamp: new Date(),
    })
  })

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    const user = activeUsers.get(socket.id)
    if (!user) return

    console.log(`❌ User disconnected: ${user.username} (${reason})`)

    // Remove from project room
    if (user.currentProject && projectRooms.has(user.currentProject)) {
      projectRooms.get(user.currentProject).delete(socket.id)
      socket.to(`project:${user.currentProject}`).emit("user-left", user.userId)

      // Update presence for remaining users
      const projectUsers = Array.from(projectRooms.get(user.currentProject))
        .map((socketId) => activeUsers.get(socketId))
        .filter(Boolean)

      socket.to(`project:${user.currentProject}`).emit("presence-update", projectUsers)
    }

    // Clean up typing indicators
    for (const [key, typingUser] of typingUsers.entries()) {
      if (typingUser.userId === user.userId) {
        typingUsers.delete(key)
      }
    }

    // Remove user
    activeUsers.delete(socket.id)
  })

  // Send welcome message
  socket.emit("connection-established", {
    message: "Connected to CollabCode WebSocket server",
    userId,
    username,
    timestamp: new Date(),
  })
})

// Clean up inactive typing indicators every 10 seconds
setInterval(() => {
  const now = new Date()
  for (const [key, typingUser] of typingUsers.entries()) {
    if (now.getTime() - typingUser.startedAt.getTime() > 10000) {
      typingUsers.delete(key)

      // Notify project room that user stopped typing
      io.to(`project:${typingUser.projectId}`).emit("typing", {
        userId: typingUser.userId,
        username: typingUser.username,
        isTyping: false,
      })
    }
  }
}, 10000)

// Server status endpoint
httpServer.on("request", (req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(
      JSON.stringify({
        status: "healthy",
        activeUsers: activeUsers.size,
        activeProjects: projectRooms.size,
        uptime: process.uptime(),
        timestamp: new Date(),
      }),
    )
  } else {
    res.writeHead(404)
    res.end("Not Found")
  }
})

const PORT = process.env.WEBSOCKET_PORT || 3001

httpServer.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`)
  console.log(`📊 Health check available at http://localhost:${PORT}/health`)
  console.log(`🔗 WebSocket endpoint: ws://localhost:${PORT}`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Shutting down WebSocket server...")
  httpServer.close(() => {
    console.log("✅ WebSocket server closed")
    process.exit(0)
  })
})

process.on("SIGINT", () => {
  console.log("🛑 Shutting down WebSocket server...")
  httpServer.close(() => {
    console.log("✅ WebSocket server closed")
    process.exit(0)
  })
})
