
import { NextRequest } from "next/server"
import { WebSocketServer } from "ws"
import { collaborationServer } from "@/lib/websocket"

let wss: WebSocketServer | null = null

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("projectId")
  const userId = searchParams.get("userId")
  const username = searchParams.get("username")

  if (!projectId || !userId || !username) {
    return new Response("Missing required parameters", { status: 400 })
  }

  // Initialize WebSocket server if not already done
  if (!wss) {
    wss = new WebSocketServer({ port: 8080 })
    
    wss.on("connection", (ws, req) => {
      const url = new URL(req.url || "", `http://${req.headers.host}`)
      const params = url.searchParams
      
      const projectId = params.get("projectId")
      const userId = params.get("userId")
      const username = params.get("username")
      
      if (projectId && userId && username) {
        collaborationServer.handleConnection(ws, projectId, userId, username)
      }
    })
  }

  return new Response("WebSocket server running on port 8080", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
