import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { createTeam, getUserTeams } from "@/lib/database/teams"

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

    const teams = await getUserTeams(user.id)
    return NextResponse.json({ teams })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch teams" }, { status: 500 })
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

    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Team name is required" }, { status: 400 })
    }

    const team = await createTeam(name, description || "", user.id)
    return NextResponse.json({ team })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create team" }, { status: 500 })
  }
}
