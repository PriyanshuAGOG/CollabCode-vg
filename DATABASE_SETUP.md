# CollabCode Database Setup Guide

## MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 Sandbox is free)
4. Choose your preferred cloud provider and region

### 2. Database Configuration
1. **Database Name**: `collabcode`
2. **Collections**: The application will automatically create these collections:
   - `users` - User accounts and profiles
   - `teams` - Team information and members
   - `projects` - Project data and collaborators
   - `rooms` - Chat rooms and channels
   - `messages` - Chat messages and reactions
   - `files` - Project files and code
   - `notifications` - User notifications
   - `integrations` - Third-party integrations
   - `call_sessions` - Video/voice call data

### 3. Security Setup
1. **Network Access**: Add your IP address to the whitelist
2. **Database User**: Create a database user with read/write permissions
3. **Connection String**: Get your MongoDB URI from the "Connect" button

### 4. Environment Variables
Add these to your `.env.local` file:
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/collabcode?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
\`\`\`

## Database Schema

### Users Collection
\`\`\`javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  avatar_url: String,
  status: String, // 'online', 'offline', 'away', 'busy'
  last_seen: Date,
  created_at: Date,
  updated_at: Date,
  profile: {
    bio: String,
    location: String,
    website: String,
    github: String,
    twitter: String,
    linkedin: String
  },
  preferences: {
    theme: String, // 'light', 'dark', 'system'
    notifications: Boolean,
    email_notifications: Boolean
  }
}
\`\`\`

### Teams Collection
\`\`\`javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  avatar_url: String,
  owner_id: String,
  members: [{
    user_id: String,
    role: String, // 'owner', 'admin', 'member'
    joined_at: Date,
    permissions: [String]
  }],
  created_at: Date,
  updated_at: Date,
  settings: {
    is_public: Boolean,
    allow_invites: Boolean,
    max_members: Number
  }
}
\`\`\`

### Projects Collection
\`\`\`javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  framework: String,
  repository_url: String,
  team_id: String,
  owner_id: String,
  collaborators: [{
    user_id: String,
    role: String, // 'owner', 'admin', 'collaborator', 'viewer'
    permissions: [String],
    joined_at: Date
  }],
  is_public: Boolean,
  status: String, // 'active', 'archived', 'paused'
  created_at: Date,
  updated_at: Date,
  settings: {
    auto_save: Boolean,
    version_control: Boolean,
    deployment_url: String
  }
}
\`\`\`

### Messages Collection
\`\`\`javascript
{
  _id: ObjectId,
  content: String,
  type: String, // 'text', 'code', 'image', 'file', 'system'
  room_id: String,
  user_id: String,
  parent_id: String, // for threads
  edited_at: Date,
  pinned: Boolean,
  reactions: [{
    emoji: String,
    user_id: String,
    created_at: Date
  }],
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }],
  created_at: Date,
  updated_at: Date
}
\`\`\`

## Indexes for Performance

Create these indexes in MongoDB Atlas:

\`\`\`javascript
// Users
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "status": 1 })

// Teams
db.teams.createIndex({ "owner_id": 1 })
db.teams.createIndex({ "members.user_id": 1 })

// Projects
db.projects.createIndex({ "owner_id": 1 })
db.projects.createIndex({ "team_id": 1 })
db.projects.createIndex({ "collaborators.user_id": 1 })
db.projects.createIndex({ "is_public": 1 })

// Messages
db.messages.createIndex({ "room_id": 1, "created_at": -1 })
db.messages.createIndex({ "user_id": 1 })
db.messages.createIndex({ "parent_id": 1 })

// Rooms
db.rooms.createIndex({ "team_id": 1 })
db.rooms.createIndex({ "members.user_id": 1 })

// Files
db.files.createIndex({ "project_id": 1 })
db.files.createIndex({ "created_by": 1 })

// Notifications
db.notifications.createIndex({ "user_id": 1, "read": 1 })
db.notifications.createIndex({ "created_at": -1 })
\`\`\`

## Backend Architecture

### 1. Authentication System
- **JWT-based authentication** with HTTP-only cookies
- **Password hashing** using bcryptjs
- **Session management** with automatic token refresh
- **Role-based access control** for teams and projects

### 2. API Structure
\`\`\`
/api/auth/
  - POST /register - User registration
  - POST /login - User login
  - POST /logout - User logout
  - GET /me - Get current user

/api/users/
  - GET / - Get all users
  - GET /:id - Get user by ID
  - PUT /:id - Update user
  - DELETE /:id - Delete user

/api/teams/
  - GET / - Get user teams
  - POST / - Create team
  - GET /:id - Get team details
  - PUT /:id - Update team
  - DELETE /:id - Delete team
  - POST /:id/members - Add team member
  - DELETE /:id/members/:userId - Remove team member

/api/projects/
  - GET / - Get user projects
  - POST / - Create project
  - GET /:id - Get project details
  - PUT /:id - Update project
  - DELETE /:id - Delete project
  - POST /:id/collaborators - Add collaborator
  - DELETE /:id/collaborators/:userId - Remove collaborator

/api/rooms/
  - GET /team/:teamId - Get team rooms
  - POST / - Create room
  - GET /:id/messages - Get room messages
  - POST /:id/messages - Send message
  - PUT /messages/:id - Update message
  - DELETE /messages/:id - Delete message

/api/files/
  - GET /project/:projectId - Get project files
  - POST / - Create/upload file
  - GET /:id - Get file content
  - PUT /:id - Update file
  - DELETE /:id - Delete file
\`\`\`

### 3. Real-time Features
- **WebSocket server** for real-time collaboration
- **Message broadcasting** for chat functionality
- **Presence indicators** for online users
- **Live cursor tracking** for code editing
- **Voice/video calling** with WebRTC

### 4. File Management
- **Code file storage** in MongoDB GridFS or cloud storage
- **Version control** with file history
- **Collaborative editing** with operational transformation
- **Auto-save** functionality

### 5. Security Features
- **Input validation** and sanitization
- **Rate limiting** for API endpoints
- **CORS configuration** for cross-origin requests
- **Environment variable protection**
- **SQL injection prevention** (NoSQL injection for MongoDB)

### 6. Performance Optimizations
- **Database indexing** for fast queries
- **Connection pooling** for MongoDB
- **Caching** with Redis (optional)
- **Image optimization** for avatars and files
- **Lazy loading** for large datasets

## Required Dependencies

Add these to your `package.json`:

\`\`\`json
{
  "dependencies": {
    "mongodb": "^6.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
\`\`\`

## Deployment Considerations

### 1. Environment Variables
- Use different MongoDB clusters for development/production
- Secure JWT secrets in production
- Configure proper CORS origins

### 2. Scaling
- Use MongoDB Atlas auto-scaling
- Implement horizontal scaling for API routes
- Consider CDN for static assets

### 3. Monitoring
- Set up MongoDB Atlas monitoring
- Implement error logging
- Add performance metrics

### 4. Backup Strategy
- Enable MongoDB Atlas automated backups
- Regular data exports for critical data
- Test restore procedures

This setup provides a robust foundation for the CollabCode platform with MongoDB Atlas as the primary database.
