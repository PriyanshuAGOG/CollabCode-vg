/**
 * Tiny standalone WebSocket server for local development
 * ------------------------------------------------------
 * 1.  `pnpm add -D ws`
 * 2.  `npx ts-node scripts/dev-ws-server.ts`
 */
import { WebSocketServer } from "ws"

const PORT = process.env.WS_PORT ? Number(process.env.WS_PORT) : 4001

const wss = new WebSocketServer({ port: PORT, path: "/ws" })
console.log(`🛜  Local WebSocket server listening on ws://localhost:${PORT}/ws/:projectId`)

wss.on("connection", (socket, req) => {
  const url = new URL(req.url ?? "", `ws://${req.headers.host}`)
  const projectId = url.pathname.split("/").pop() ?? "unknown"
  console.log(`🔗  Client joined project ${projectId}`)

  socket.on("message", (msg) => {
    // Fan-out every message to everyone else in the same project
    wss.clients.forEach((client) => {
      if (client !== socket && client.readyState === client.OPEN) {
        client.send(msg)
      }
    })
  })
})
