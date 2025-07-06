import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "./mongodb"
import type { User } from "./models/User"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

export interface AuthUser {
  id: string
  username: string
  email: string
  avatar_url?: string
  status: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      avatar_url: decoded.avatar_url,
      status: decoded.status || "offline",
    }
  } catch (error) {
    return null
  }
}

export async function createUser(username: string, email: string, password: string): Promise<User> {
  const { db } = await connectToDatabase()

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({
    $or: [{ email }, { username }],
  })

  if (existingUser) {
    throw new Error("User already exists")
  }

  const hashedPassword = await hashPassword(password)
  const now = new Date()

  const user: User = {
    username,
    email,
    password: hashedPassword,
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    status: "offline",
    last_seen: now,
    created_at: now,
    updated_at: now,
    preferences: {
      theme: "dark",
      notifications: true,
      email_notifications: true,
    },
  }

  const result = await db.collection("users").insertOne(user)
  user._id = result.insertedId
  user.id = result.insertedId.toString()

  return user
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  const { db } = await connectToDatabase()

  const user = await db.collection("users").findOne({ email })
  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    return null
  }

  // Update last seen
  await db.collection("users").updateOne(
    { _id: user._id },
    {
      $set: {
        last_seen: new Date(),
        status: "online",
        updated_at: new Date(),
      },
    },
  )

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    avatar_url: user.avatar_url,
    status: "online",
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const { db } = await connectToDatabase()

  const user = await db.collection("users").findOne({ _id: new ObjectId(id) })
  if (!user) {
    return null
  }

  user.id = user._id.toString()
  return user as User
}

export async function updateUserStatus(userId: string, status: "online" | "offline" | "away" | "busy"): Promise<void> {
  const { db } = await connectToDatabase()

  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        status,
        last_seen: new Date(),
        updated_at: new Date(),
      },
    },
  )
}

/**
 * Verify an incoming Bearer-token string (e.g. from the Authorization header)
 * and return the decoded AuthUser or null.
 *
 * Usage in a route handler:
 *   const authUser = verifyAuth(request.headers.get("authorization"))
 *   if (!authUser) return new Response("Unauthorized", { status: 401 })
 */
export function verifyAuth(bearerToken?: string | null): AuthUser | null {
  if (!bearerToken) return null

  // Strip the "Bearer " prefix if present
  const token = bearerToken.replace(/^Bearer\s+/i, "")
  return verifyToken(token)
}
