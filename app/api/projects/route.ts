import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { createProject, getUserProjects } from "@/lib/database/projects"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const projects = await getUserProjects(user.id)
    return NextResponse.json({ projects })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { name, description, framework, teamId } = await request.json()

    if (!name || !framework) {
      return NextResponse.json({ error: "Project name and framework are required" }, { status: 400 })
    }

    const project = await createProject(name, description || "", framework, user.id, teamId)
    return NextResponse.json({ project })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 })
  }
}
