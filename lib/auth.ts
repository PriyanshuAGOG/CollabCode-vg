import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "./mongodb"
import { getUserByEmail, createUser } from "./database/users"
import type { User } from "./models/User"

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key-change-in-production"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  message?: string
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded
  } catch (error) {
    return null
  }
}

export async function registerUser(email: string, username: string, password: string): Promise<AuthResult> {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return { success: false, message: "User already exists with this email" }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await createUser({
      email,
      username,
      password: hashedPassword,
      status: "online",
      last_seen: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      preferences: {
        theme: "dark",
        notifications: true,
        email_notifications: true,
      },
    })

    // Generate token
    const token = generateToken(user.id!)

    return {
      success: true,
      user: { ...user, password: undefined }, // Don't return password
      token,
      message: "User registered successfully",
    }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, message: "Registration failed" }
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  try {
    // Get user by email
    const user = await getUserByEmail(email)
    if (!user) {
      return { success: false, message: "Invalid email or password" }
    }

    // Compare password
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return { success: false, message: "Invalid email or password" }
    }

    // Generate token
    const token = generateToken(user.id!)

    return {
      success: true,
      user: { ...user, password: undefined }, // Don't return password
      token,
      message: "Login successful",
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "Login failed" }
  }
}

export async function verifyAuth(token: string): Promise<User | null> {
  try {
    const decoded = verifyToken(token)
    if (!decoded) {
      return null
    }

    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({ _id: decoded.userId }, { projection: { password: 0 } })

    if (!user) {
      return null
    }

    return {
      ...user,
      id: user._id.toString(),
    } as User
  } catch (error) {
    console.error("Auth verification error:", error)
    return null
  }
}

export async function getCurrentUser(request: Request): Promise<User | null> {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    const token = authHeader.substring(7)
    return await verifyAuth(token)
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}
