
import { createClient } from "@supabase/supabase-js"
import { MongoClient, Db } from "mongodb"
import mongoose from "mongoose"

// Supabase client for real-time features and auth
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// MongoDB client for complex data operations
let mongoClient: MongoClient | null = null
let mongoDb: Db | null = null

export async function connectToMongoDB() {
  if (mongoClient && mongoDb) {
    return { client: mongoClient, db: mongoDb }
  }

  try {
    const uri = process.env.MONGODB_URI!
    mongoClient = new MongoClient(uri)
    await mongoClient.connect()
    mongoDb = mongoClient.db(process.env.MONGODB_DB_NAME || "collabcode")
    
    console.log("Connected to MongoDB Atlas")
    return { client: mongoClient, db: mongoDb }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw error
  }
}

// Mongoose connection for ODM
let isMongooseConnected = false

export async function connectToMongoose() {
  if (isMongooseConnected) {
    return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    isMongooseConnected = true
    console.log("Connected to MongoDB via Mongoose")
  } catch (error) {
    console.error("Failed to connect to MongoDB via Mongoose:", error)
    throw error
  }
}

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  avatar: String,
  status: { type: String, enum: ['online', 'offline', 'away', 'busy'], default: 'offline' },
  lastSeen: { type: Date, default: Date.now },
  preferences: {
    theme: { type: String, default: 'dark' },
    language: { type: String, default: 'en' },
    notifications: { type: Boolean, default: true },
  },
  subscription: {
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    startDate: Date,
    endDate: Date,
    features: [String],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  framework: String,
  language: String,
  ownerId: { type: String, required: true },
  teamId: String,
  collaborators: [{
    userId: String,
    role: { type: String, enum: ['owner', 'admin', 'editor', 'viewer'], default: 'viewer' },
    joinedAt: { type: Date, default: Date.now },
  }],
  repository: {
    url: String,
    branch: { type: String, default: 'main' },
    lastSync: Date,
  },
  files: [{
    path: String,
    content: String,
    language: String,
    lastModified: Date,
    lastModifiedBy: String,
  }],
  settings: {
    isPublic: { type: Boolean, default: false },
    allowForking: { type: Boolean, default: true },
    allowComments: { type: Boolean, default: true },
    aiAssistance: { type: Boolean, default: true },
  },
  stats: {
    views: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'code', 'image', 'file', 'system'], default: 'text' },
  roomId: { type: String, required: true },
  userId: { type: String, required: true },
  parentId: String,
  reactions: [{
    userId: String,
    emoji: String,
    createdAt: { type: Date, default: Date.now },
  }],
  attachments: [{
    name: String,
    url: String,
    size: Number,
    type: String,
  }],
  mentions: [String],
  isEdited: { type: Boolean, default: false },
  editedAt: Date,
  isPinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  avatar: String,
  ownerId: { type: String, required: true },
  members: [{
    userId: String,
    role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
    permissions: [String],
  }],
  channels: [{
    name: String,
    description: String,
    type: { type: String, enum: ['text', 'voice', 'video'], default: 'text' },
    isPrivate: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }],
  settings: {
    isPublic: { type: Boolean, default: false },
    allowInvites: { type: Boolean, default: true },
    defaultRole: { type: String, default: 'member' },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Export models
export const User = mongoose.models.User || mongoose.model('User', userSchema)
export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema)
export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema)
export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema)

// Hybrid database operations
export class HybridDatabase {
  static async getUser(clerkId: string) {
    await connectToMongoose()
    return await User.findOne({ clerkId })
  }

  static async createUser(userData: any) {
    await connectToMongoose()
    return await User.create(userData)
  }

  static async updateUser(clerkId: string, updates: any) {
    await connectToMongoose()
    return await User.findOneAndUpdate({ clerkId }, { ...updates, updatedAt: new Date() }, { new: true })
  }

  static async getUserProjects(userId: string) {
    await connectToMongoose()
    return await Project.find({ ownerId: userId }).sort({ updatedAt: -1 })
  }

  static async createProject(projectData: any) {
    await connectToMongoose()
    return await Project.create(projectData)
  }

  static async getProject(projectId: string) {
    await connectToMongoose()
    return await Project.findById(projectId)
  }

  static async updateProject(projectId: string, updates: any) {
    await connectToMongoose()
    return await Project.findByIdAndUpdate(projectId, { ...updates, updatedAt: new Date() }, { new: true })
  }

  static async getRoomMessages(roomId: string, limit = 50) {
    await connectToMongoose()
    return await Message.find({ roomId }).sort({ createdAt: -1 }).limit(limit)
  }

  static async createMessage(messageData: any) {
    await connectToMongoose()
    const message = await Message.create(messageData)
    
    // Also send to Supabase for real-time updates
    await supabase.from('messages').insert({
      id: message._id.toString(),
      content: messageData.content,
      type: messageData.type,
      room_id: messageData.roomId,
      user_id: messageData.userId,
      created_at: messageData.createdAt,
    })
    
    return message
  }

  static async getUserTeams(userId: string) {
    await connectToMongoose()
    return await Team.find({ 'members.userId': userId })
  }

  static async createTeam(teamData: any) {
    await connectToMongoose()
    return await Team.create(teamData)
  }
}
