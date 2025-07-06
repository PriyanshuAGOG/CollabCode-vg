import { type NextRequest, NextResponse } from "next/server"
import { createUser, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const user = await createUser(username, email, password)
    const token = generateToken({
      id: user.id!,
      username: user.username,
      email: user.email,
      avatar_url: user.avatar_url,
      status: user.status,
    })

    const response = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        status: user.status,
      },
      token,
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 400 })
  }
}
