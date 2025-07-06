import { connectToDatabase } from "../mongodb"
import type { Team } from "../models/User"
import { ObjectId } from "mongodb"

export async function createTeam(name: string, description: string, ownerId: string): Promise<Team> {
  const { db } = await connectToDatabase()

  const now = new Date()
  const team: Team = {
    name,
    description,
    owner_id: ownerId,
    members: [
      {
        user_id: ownerId,
        role: "owner",
        joined_at: now,
        permissions: ["all"],
      },
    ],
    created_at: now,
    updated_at: now,
    settings: {
      is_public: false,
      allow_invites: true,
      max_members: 50,
    },
  }

  const result = await db.collection("teams").insertOne(team)
  team._id = result.insertedId
  team.id = result.insertedId.toString()

  return team
}

export async function getUserTeams(userId: string): Promise<Team[]> {
  const { db } = await connectToDatabase()

  const teams = await db.collection("teams").find({ "members.user_id": userId }).toArray()

  return teams.map((team) => ({
    ...team,
    id: team._id.toString(),
  })) as Team[]
}

export async function getTeamById(teamId: string): Promise<Team | null> {
  const { db } = await connectToDatabase()

  const team = await db.collection("teams").findOne({ _id: new ObjectId(teamId) })
  if (!team) return null

  return {
    ...team,
    id: team._id.toString(),
  } as Team
}

export async function addTeamMember(
  teamId: string,
  userId: string,
  role: "admin" | "member" = "member",
): Promise<boolean> {
  const { db } = await connectToDatabase()

  const result = await db.collection("teams").updateOne(
    { _id: new ObjectId(teamId) },
    {
      $push: {
        members: {
          user_id: userId,
          role,
          joined_at: new Date(),
          permissions: role === "admin" ? ["manage_members", "manage_projects"] : ["view"],
        },
      },
      $set: { updated_at: new Date() },
    },
  )

  return result.modifiedCount > 0
}

export async function removeTeamMember(teamId: string, userId: string): Promise<boolean> {
  const { db } = await connectToDatabase()

  const result = await db.collection("teams").updateOne(
    { _id: new ObjectId(teamId) },
    {
      $pull: { members: { user_id: userId } },
      $set: { updated_at: new Date() },
    },
  )

  return result.modifiedCount > 0
}

export async function updateTeamMemberRole(teamId: string, userId: string, role: "admin" | "member"): Promise<boolean> {
  const { db } = await connectToDatabase()

  const result = await db.collection("teams").updateOne(
    { _id: new ObjectId(teamId), "members.user_id": userId },
    {
      $set: {
        "members.$.role": role,
        "members.$.permissions": role === "admin" ? ["manage_members", "manage_projects"] : ["view"],
        updated_at: new Date(),
      },
    },
  )

  return result.modifiedCount > 0
}

export async function deleteTeam(teamId: string): Promise<boolean> {
  const { db } = await connectToDatabase()

  const result = await db.collection("teams").deleteOne({ _id: new ObjectId(teamId) })
  return result.deletedCount > 0
}
