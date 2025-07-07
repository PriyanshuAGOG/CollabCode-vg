import { connectToDatabase } from "../mongodb"
import type { User } from "../models/User"
import { ObjectId } from "mongodb"

export async function createUser(userData: Omit<User, "_id" | "id">): Promise<User> {
  const { db } = await connectToDatabase()

  const result = await db.collection("users").insertOne(userData)

  return {
    ...userData,
    _id: result.insertedId,
    id: result.insertedId.toString(),
  }
}

export async function getAllUsers(limit = 50): Promise<User[]> {
  const { db } = await connectToDatabase()

  const users = await db
    .collection("users")
    .find({}, { projection: { password: 0 } })
    .limit(limit)
    .toArray()

  return users.map((user) => ({
    ...user,
    id: user._id.toString(),
  })) as User[]
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { db } = await connectToDatabase()

  const user = await db.collection("users").findOne({ email })
  if (!user) return null

  return {
    ...user,
    id: user._id.toString(),
  } as User
}

export async function getUserById(userId: string): Promise<User | null> {
  const { db } = await connectToDatabase()

  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
  if (!user) return null

  return {
    ...user,
    id: user._id.toString(),
  } as User
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const { db } = await connectToDatabase()

  const user = await db.collection("users").findOne({ username })
  if (!user) return null

  return {
    ...user,
    id: user._id.toString(),
  } as User
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const { db } = await connectToDatabase()

  const result = await db.collection("users").findOneAndUpdate(
    { _id: new ObjectId(userId) },
    {
      $set: {
        ...updates,
        updated_at: new Date(),
      },
    },
    { returnDocument: "after", projection: { password: 0 } },
  )

  if (!result.value) return null

  return {
    ...result.value,
    id: result.value._id.toString(),
  } as User
}

export async function deleteUser(userId: string): Promise<boolean> {
  const { db } = await connectToDatabase()

  const result = await db.collection("users").deleteOne({ _id: new ObjectId(userId) })
  return result.deletedCount > 0
}

export async function getOnlineUsers(): Promise<User[]> {
  const { db } = await connectToDatabase()

  const users = await db
    .collection("users")
    .find({ status: { $in: ["online", "away", "busy"] } }, { projection: { password: 0 } })
    .sort({ last_seen: -1 })
    .toArray()

  return users.map((user) => ({
    ...user,
    id: user._id.toString(),
  })) as User[]
}

export async function updateUserStatus(
  userId: string,
  status: "online" | "offline" | "away" | "busy",
): Promise<boolean> {
  const { db } = await connectToDatabase()

  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        status,
        last_seen: new Date(),
        updated_at: new Date(),
      },
    },
  )

  return result.modifiedCount > 0
}
