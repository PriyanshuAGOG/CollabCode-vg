import { connectToDatabase } from "../mongodb"
import type { Project } from "../models/User"
import { ObjectId } from "mongodb"

export async function createProject(
  name: string,
  description: string,
  framework: string,
  ownerId: string,
  teamId?: string,
): Promise<Project> {
  const { db } = await connectToDatabase()

  const now = new Date()
  const project: Project = {
    name,
    description,
    framework,
    team_id: teamId,
    owner_id: ownerId,
    collaborators: [
      {
        user_id: ownerId,
        role: "owner",
        permissions: ["all"],
        joined_at: now,
      },
    ],
    is_public: false,
    status: "active",
    created_at: now,
    updated_at: now,
    settings: {
      auto_save: true,
      version_control: true,
    },
  }

  const result = await db.collection("projects").insertOne(project)
  project._id = result.insertedId
  project.id = result.insertedId.toString()

  return project
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  const { db } = await connectToDatabase()

  const projects = await db
    .collection("projects")
    .find({
      $or: [{ owner_id: userId }, { "collaborators.user_id": userId }, { is_public: true }],
    })
    .sort({ updated_at: -1 })
    .toArray()

  return projects.map((project) => ({
    ...project,
    id: project._id.toString(),
  })) as Project[]
}

export async function getProjectById(projectId: string): Promise<Project | null> {
  const { db } = await connectToDatabase()

  const project = await db.collection("projects").findOne({ _id: new ObjectId(projectId) })
  if (!project) return null

  return {
    ...project,
    id: project._id.toString(),
  } as Project
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<Project | null> {
  const { db } = await connectToDatabase()

  const result = await db.collection("projects").findOneAndUpdate(
    { _id: new ObjectId(projectId) },
    {
      $set: {
        ...updates,
        updated_at: new Date(),
      },
    },
    { returnDocument: "after" },
  )

  if (!result.value) return null

  return {
    ...result.value,
    id: result.value._id.toString(),
  } as Project
}

export async function addProjectCollaborator(
  projectId: string,
  userId: string,
  role: "admin" | "collaborator" | "viewer" = "collaborator",
): Promise<boolean> {
  const { db } = await connectToDatabase()

  const permissions =
    role === "admin" ? ["read", "write", "manage"] : role === "collaborator" ? ["read", "write"] : ["read"]

  const result = await db.collection("projects").updateOne(
    { _id: new ObjectId(projectId) },
    {
      $push: {
        collaborators: {
          user_id: userId,
          role,
          permissions,
          joined_at: new Date(),
        },
      },
      $set: { updated_at: new Date() },
    },
  )

  return result.modifiedCount > 0
}

export async function removeProjectCollaborator(projectId: string, userId: string): Promise<boolean> {
  const { db } = await connectToDatabase()

  const result = await db.collection("projects").updateOne(
    { _id: new ObjectId(projectId) },
    {
      $pull: { collaborators: { user_id: userId } },
      $set: { updated_at: new Date() },
    },
  )

  return result.modifiedCount > 0
}

export async function deleteProject(projectId: string): Promise<boolean> {
  const { db } = await connectToDatabase()

  // Also delete related files
  await db.collection("files").deleteMany({ project_id: projectId })

  const result = await db.collection("projects").deleteOne({ _id: new ObjectId(projectId) })
  return result.deletedCount > 0
}
