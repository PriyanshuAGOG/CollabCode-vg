import { type NextRequest, NextResponse } from "next/server"
import { updateUserStatus, verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (token) {
      const user = verifyToken(token)
      if (user) {
        await updateUserStatus(user.id, "offline")
      }
    }

    const response = NextResponse.json({ success: true })

    // Clear the auth cookie
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Logout failed" }, { status: 500 })
  }
}
