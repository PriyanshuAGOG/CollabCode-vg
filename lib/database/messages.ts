import { connectToDatabase } from "../mongodb"
import type { Message, Room } from "../models/User"
import { ObjectId } from "mongodb"

export async function createRoom(
  name: string,
  type: "channel" | "dm" | "group",
  createdBy: string,
  teamId?: string,
  projectId?: string,
): Promise<Room> {
  const { db } = await connectToDatabase()

  const now = new Date()
  const room: Room = {
    name,
    type,
    team_id: teamId,
    project_id: projectId,
    is_private: type === "dm",
    created_by: createdBy,
    members: [
      {
        user_id: createdBy,
        joined_at: now,
        last_read_at: now,
        role: "admin",
      },
    ],
    created_at: now,
    updated_at: now,
  }

  const result = await db.collection("rooms").insertOne(room)
  room._id = result.insertedId
  room.id = result.insertedId.toString()

  return room
}

export async function getRoomsByTeam(teamId: string): Promise<Room[]> {
  const { db } = await connectToDatabase()

  const rooms = await db.collection("rooms").find({ team_id: teamId }).sort({ created_at: 1 }).toArray()

  return rooms.map((room) => ({
    ...room,
    id: room._id.toString(),
  })) as Room[]
}

export async function getRoomById(roomId: string): Promise<Room | null> {
  const { db } = await connectToDatabase()

  const room = await db.collection("rooms").findOne({ _id: new ObjectId(roomId) })
  if (!room) return null

  return {
    ...room,
    id: room._id.toString(),
  } as Room
}

export async function addRoomMember(roomId: string, userId: string): Promise<boolean> {
  const { db } = await connectToDatabase()

  const result = await db.collection("rooms").updateOne(
    { _id: new ObjectId(roomId) },
    {
      $push: {
        members: {
          user_id: userId,
          joined_at: new Date(),
          last_read_at: new Date(),
          role: "member",
        },
      },
      $set: { updated_at: new Date() },
    },
  )

  return result.modifiedCount > 0
}

export async function sendMessage(
  roomId: string,
  userId: string,
  content: string,
  type: "text" | "code" | "image" | "file" | "system" = "text",
): Promise<Message> {
  const { db } = await connectToDatabase()

  const now = new Date()
  const message: Message = {
    content,
    type,
    room_id: roomId,
    user_id: userId,
    pinned: false,
    reactions: [],
    created_at: now,
    updated_at: now,
  }

  const result = await db.collection("messages").insertOne(message)
  message._id = result.insertedId
  message.id = result.insertedId.toString()

  return message
}

export async function getRoomMessages(roomId: string, limit = 50, before?: string): Promise<Message[]> {
  const { db } = await connectToDatabase()

  const query: any = { room_id: roomId }
  if (before) {
    query._id = { $lt: new ObjectId(before) }
  }

  const messages = await db.collection("messages").find(query).sort({ created_at: -1 }).limit(limit).toArray()

  return messages.reverse().map((message) => ({
    ...message,
    id: message._id.toString(),
  })) as Message[]
}

export async function updateMessage(messageId: string, content: string): Promise<Message | null> {
  const { db } = await connectToDatabase()

  const result = await db.collection("messages").findOneAndUpdate(
    { _id: new ObjectId(messageId) },
    {
      $set: {
        content,
        edited_at: new Date(),
        updated_at: new Date(),
      },
    },
    { returnDocument: "after" },
  )

  if (!result.value) return null

  return {
    ...result.value,
    id: result.value._id.toString(),
  } as Message
}

export async function deleteMessage(messageId: string): Promise<boolean> {
  const { db } = await connectToDatabase()

  const result = await db.collection("messages").deleteOne({ _id: new ObjectId(messageId) })
  return result.deletedCount > 0
}

export async function addMessageReaction(messageId: string, userId: string, emoji: string): Promise<boolean> {
  const { db } = await connectToDatabase()

  const result = await db.collection("messages").updateOne(
    { _id: new ObjectId(messageId) },
    {
      $push: {
        reactions: {
          emoji,
          user_id: userId,
          created_at: new Date(),
        },
      },
      $set: { updated_at: new Date() },
    },
  )

  return result.modifiedCount > 0
}

export async function removeMessageReaction(messageId: string, userId: string, emoji: string): Promise<boolean> {
  const { db } = await connectToDatabase()

  const result = await db.collection("messages").updateOne(
    { _id: new ObjectId(messageId) },
    {
      $pull: {
        reactions: {
          emoji,
          user_id: userId,
        },
      },
      $set: { updated_at: new Date() },
    },
  )

  return result.modifiedCount > 0
}
