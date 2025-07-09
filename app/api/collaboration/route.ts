
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { HybridDatabase, supabase } from "@/lib/database"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, payload } = await request.json()

    switch (action) {
      case "send_message":
        const message = await HybridDatabase.createMessage({
          ...payload,
          userId,
          createdAt: new Date(),
        })
        return NextResponse.json({ success: true, message })

      case "update_file":
        const project = await HybridDatabase.updateProject(payload.projectId, {
          [`files.${payload.fileIndex}.content`]: payload.content,
          [`files.${payload.fileIndex}.lastModified`]: new Date(),
          [`files.${payload.fileIndex}.lastModifiedBy`]: userId,
        })
        
        // Broadcast to Supabase for real-time updates
        await supabase.channel(`project:${payload.projectId}`).send({
          type: "broadcast",
          event: "file_updated",
          payload: {
            projectId: payload.projectId,
            fileIndex: payload.fileIndex,
            content: payload.content,
            userId,
          },
        })
        
        return NextResponse.json({ success: true, project })

      case "update_cursor":
        await supabase.channel(`project:${payload.projectId}`).send({
          type: "broadcast",
          event: "cursor_updated",
          payload: {
            userId,
            position: payload.position,
            file: payload.file,
          },
        })
        return NextResponse.json({ success: true })

      case "join_room":
        await HybridDatabase.updateUser(userId, {
          status: "online",
          lastSeen: new Date(),
        })
        
        await supabase.channel(`room:${payload.roomId}`).send({
          type: "broadcast",
          event: "user_joined",
          payload: { userId },
        })
        
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Collaboration API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const action = url.searchParams.get("action")
    const projectId = url.searchParams.get("projectId")
    const roomId = url.searchParams.get("roomId")

    switch (action) {
      case "get_messages":
        const messages = await HybridDatabase.getRoomMessages(roomId!, 50)
        return NextResponse.json({ messages })

      case "get_project":
        const project = await HybridDatabase.getProject(projectId!)
        return NextResponse.json({ project })

      case "get_user_projects":
        const projects = await HybridDatabase.getUserProjects(userId)
        return NextResponse.json({ projects })

      case "get_user_teams":
        const teams = await HybridDatabase.getUserTeams(userId)
        return NextResponse.json({ teams })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Collaboration API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
