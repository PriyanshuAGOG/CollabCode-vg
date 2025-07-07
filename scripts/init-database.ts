import { connectToDatabase } from "../lib/mongodb"

async function initializeDatabase() {
  try {
    console.log("🚀 Initializing CollabCode database...")

    const { db } = await connectToDatabase()

    // Create collections with validation schemas
    console.log("📋 Creating collections...")

    // Users collection
    try {
      await db.createCollection("users", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["username", "email", "password", "status", "created_at"],
            properties: {
              username: { bsonType: "string", minLength: 2, maxLength: 50 },
              email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
              password: { bsonType: "string", minLength: 6 },
              status: { enum: ["online", "offline", "away", "busy"] },
              avatar_url: { bsonType: "string" },
              last_seen: { bsonType: "date" },
              created_at: { bsonType: "date" },
              updated_at: { bsonType: "date" },
              profile: {
                bsonType: "object",
                properties: {
                  bio: { bsonType: "string", maxLength: 500 },
                  location: { bsonType: "string", maxLength: 100 },
                  website: { bsonType: "string" },
                  github: { bsonType: "string" },
                  twitter: { bsonType: "string" },
                  linkedin: { bsonType: "string" },
                },
              },
              preferences: {
                bsonType: "object",
                properties: {
                  theme: { enum: ["light", "dark", "system"] },
                  notifications: { bsonType: "bool" },
                  email_notifications: { bsonType: "bool" },
                },
              },
            },
          },
        },
      })
      console.log("✅ Users collection created")
    } catch (error: any) {
      if (error.code === 48) {
        console.log("ℹ️  Users collection already exists")
      } else {
        throw error
      }
    }

    // Teams collection
    try {
      await db.createCollection("teams", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["name", "owner_id", "members", "created_at"],
            properties: {
              name: { bsonType: "string", minLength: 1, maxLength: 100 },
              description: { bsonType: "string", maxLength: 500 },
              avatar_url: { bsonType: "string" },
              owner_id: { bsonType: "string" },
              members: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["user_id", "role", "joined_at"],
                  properties: {
                    user_id: { bsonType: "string" },
                    role: { enum: ["owner", "admin", "member"] },
                    joined_at: { bsonType: "date" },
                    permissions: { bsonType: "array", items: { bsonType: "string" } },
                  },
                },
              },
              created_at: { bsonType: "date" },
              updated_at: { bsonType: "date" },
            },
          },
        },
      })
      console.log("✅ Teams collection created")
    } catch (error: any) {
      if (error.code === 48) {
        console.log("ℹ️  Teams collection already exists")
      } else {
        throw error
      }
    }

    // Projects collection
    try {
      await db.createCollection("projects", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["name", "framework", "owner_id", "collaborators", "is_public", "status", "created_at"],
            properties: {
              name: { bsonType: "string", minLength: 1, maxLength: 100 },
              description: { bsonType: "string", maxLength: 1000 },
              framework: { bsonType: "string" },
              repository_url: { bsonType: "string" },
              team_id: { bsonType: "string" },
              owner_id: { bsonType: "string" },
              collaborators: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["user_id", "role", "permissions", "joined_at"],
                  properties: {
                    user_id: { bsonType: "string" },
                    role: { enum: ["owner", "admin", "collaborator", "viewer"] },
                    permissions: { bsonType: "array", items: { bsonType: "string" } },
                    joined_at: { bsonType: "date" },
                  },
                },
              },
              is_public: { bsonType: "bool" },
              status: { enum: ["active", "archived", "paused"] },
              created_at: { bsonType: "date" },
              updated_at: { bsonType: "date" },
            },
          },
        },
      })
      console.log("✅ Projects collection created")
    } catch (error: any) {
      if (error.code === 48) {
        console.log("ℹ️  Projects collection already exists")
      } else {
        throw error
      }
    }

    // Rooms collection
    try {
      await db.createCollection("rooms", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["name", "type", "is_private", "created_by", "members", "created_at"],
            properties: {
              name: { bsonType: "string", minLength: 1, maxLength: 100 },
              description: { bsonType: "string", maxLength: 500 },
              type: { enum: ["channel", "dm", "group"] },
              team_id: { bsonType: "string" },
              project_id: { bsonType: "string" },
              is_private: { bsonType: "bool" },
              created_by: { bsonType: "string" },
              members: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["user_id", "joined_at", "last_read_at"],
                  properties: {
                    user_id: { bsonType: "string" },
                    joined_at: { bsonType: "date" },
                    last_read_at: { bsonType: "date" },
                    role: { enum: ["admin", "member"] },
                  },
                },
              },
              created_at: { bsonType: "date" },
              updated_at: { bsonType: "date" },
            },
          },
        },
      })
      console.log("✅ Rooms collection created")
    } catch (error: any) {
      if (error.code === 48) {
        console.log("ℹ️  Rooms collection already exists")
      } else {
        throw error
      }
    }

    // Messages collection
    try {
      await db.createCollection("messages", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["content", "type", "room_id", "user_id", "pinned", "reactions", "created_at"],
            properties: {
              content: { bsonType: "string", minLength: 1, maxLength: 10000 },
              type: { enum: ["text", "code", "image", "file", "system"] },
              room_id: { bsonType: "string" },
              user_id: { bsonType: "string" },
              parent_id: { bsonType: "string" },
              edited_at: { bsonType: "date" },
              pinned: { bsonType: "bool" },
              reactions: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["emoji", "user_id", "created_at"],
                  properties: {
                    emoji: { bsonType: "string" },
                    user_id: { bsonType: "string" },
                    created_at: { bsonType: "date" },
                  },
                },
              },
              attachments: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["name", "url", "type", "size"],
                  properties: {
                    name: { bsonType: "string" },
                    url: { bsonType: "string" },
                    type: { bsonType: "string" },
                    size: { bsonType: "number" },
                  },
                },
              },
              created_at: { bsonType: "date" },
              updated_at: { bsonType: "date" },
            },
          },
        },
      })
      console.log("✅ Messages collection created")
    } catch (error: any) {
      if (error.code === 48) {
        console.log("ℹ️  Messages collection already exists")
      } else {
        throw error
      }
    }

    // Files collection
    try {
      await db.createCollection("files", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: [
              "name",
              "path",
              "content",
              "language",
              "project_id",
              "created_by",
              "last_modified_by",
              "version",
              "created_at",
            ],
            properties: {
              name: { bsonType: "string", minLength: 1, maxLength: 255 },
              path: { bsonType: "string", minLength: 1, maxLength: 1000 },
              content: { bsonType: "string" },
              language: { bsonType: "string" },
              project_id: { bsonType: "string" },
              created_by: { bsonType: "string" },
              last_modified_by: { bsonType: "string" },
              version: { bsonType: "number", minimum: 1 },
              created_at: { bsonType: "date" },
              updated_at: { bsonType: "date" },
            },
          },
        },
      })
      console.log("✅ Files collection created")
    } catch (error: any) {
      if (error.code === 48) {
        console.log("ℹ️  Files collection already exists")
      } else {
        throw error
      }
    }

    // Notifications collection
    try {
      await db.createCollection("notifications", {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["user_id", "title", "message", "type", "read", "created_at"],
            properties: {
              user_id: { bsonType: "string" },
              title: { bsonType: "string", minLength: 1, maxLength: 200 },
              message: { bsonType: "string", minLength: 1, maxLength: 1000 },
              type: { enum: ["info", "success", "warning", "error"] },
              read: { bsonType: "bool" },
              data: { bsonType: "object" },
              created_at: { bsonType: "date" },
            },
          },
        },
      })
      console.log("✅ Notifications collection created")
    } catch (error: any) {
      if (error.code === 48) {
        console.log("ℹ️  Notifications collection already exists")
      } else {
        throw error
      }
    }

    // Create indexes for better performance
    console.log("🔍 Creating indexes...")

    // Users indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("users").createIndex({ username: 1 }, { unique: true })
    await db.collection("users").createIndex({ status: 1 })
    await db.collection("users").createIndex({ last_seen: -1 })

    // Teams indexes
    await db.collection("teams").createIndex({ owner_id: 1 })
    await db.collection("teams").createIndex({ "members.user_id": 1 })
    await db.collection("teams").createIndex({ created_at: -1 })

    // Projects indexes
    await db.collection("projects").createIndex({ owner_id: 1 })
    await db.collection("projects").createIndex({ team_id: 1 })
    await db.collection("projects").createIndex({ "collaborators.user_id": 1 })
    await db.collection("projects").createIndex({ is_public: 1 })
    await db.collection("projects").createIndex({ status: 1 })
    await db.collection("projects").createIndex({ updated_at: -1 })

    // Rooms indexes
    await db.collection("rooms").createIndex({ team_id: 1 })
    await db.collection("rooms").createIndex({ project_id: 1 })
    await db.collection("rooms").createIndex({ created_by: 1 })
    await db.collection("rooms").createIndex({ "members.user_id": 1 })
    await db.collection("rooms").createIndex({ type: 1 })

    // Messages indexes
    await db.collection("messages").createIndex({ room_id: 1, created_at: -1 })
    await db.collection("messages").createIndex({ user_id: 1 })
    await db.collection("messages").createIndex({ type: 1 })
    await db.collection("messages").createIndex({ pinned: 1 })

    // Files indexes
    await db.collection("files").createIndex({ project_id: 1 })
    await db.collection("files").createIndex({ created_by: 1 })
    await db.collection("files").createIndex({ path: 1, project_id: 1 }, { unique: true })
    await db.collection("files").createIndex({ updated_at: -1 })

    // Notifications indexes
    await db.collection("notifications").createIndex({ user_id: 1, created_at: -1 })
    await db.collection("notifications").createIndex({ read: 1 })
    await db.collection("notifications").createIndex({ type: 1 })

    console.log("✅ All indexes created")

    // Insert sample data
    console.log("📝 Inserting sample data...")

    // Check if we already have users
    const userCount = await db.collection("users").countDocuments()

    if (userCount === 0) {
      // Create sample users
      const sampleUsers = [
        {
          username: "demo_user",
          email: "demo@collabcode.dev",
          password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm", // password: demo123
          status: "online",
          last_seen: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          profile: {
            bio: "Demo user for CollabCode platform",
            location: "San Francisco, CA",
          },
          preferences: {
            theme: "dark",
            notifications: true,
            email_notifications: true,
          },
        },
      ]

      await db.collection("users").insertMany(sampleUsers)
      console.log("✅ Sample users created")

      // Create a sample project
      const demoUser = await db.collection("users").findOne({ email: "demo@collabcode.dev" })
      if (demoUser) {
        const sampleProject = {
          name: "Welcome to CollabCode",
          description: "A sample project to get you started with collaborative coding",
          framework: "react",
          owner_id: demoUser._id.toString(),
          collaborators: [
            {
              user_id: demoUser._id.toString(),
              role: "owner",
              permissions: ["all"],
              joined_at: new Date(),
            },
          ],
          is_public: true,
          status: "active",
          created_at: new Date(),
          updated_at: new Date(),
          settings: {
            auto_save: true,
            version_control: true,
          },
        }

        const projectResult = await db.collection("projects").insertOne(sampleProject)
        console.log("✅ Sample project created")

        // Create sample files for the project
        const sampleFiles = [
          {
            name: "index.html",
            path: "/index.html",
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to CollabCode</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            max-width: 600px;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 40px;
        }
        .feature {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to CollabCode</h1>
        <p>The ultimate platform for real-time collaborative coding</p>
        
        <div class="features">
            <div class="feature">
                <h3>💬 Real-time Chat</h3>
                <p>Communicate instantly with your team</p>
            </div>
            <div class="feature">
                <h3>🎥 Video Calls</h3>
                <p>Face-to-face collaboration</p>
            </div>
            <div class="feature">
                <h3>📁 File Sharing</h3>
                <p>Share files seamlessly</p>
            </div>
            <div class="feature">
                <h3>⚡ Live Coding</h3>
                <p>Code together in real-time</p>
            </div>
        </div>
    </div>
</body>
</html>`,
            language: "html",
            project_id: projectResult.insertedId.toString(),
            created_by: demoUser._id.toString(),
            last_modified_by: demoUser._id.toString(),
            version: 1,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            name: "app.js",
            path: "/app.js",
            content: `// Welcome to CollabCode!
// This is a sample JavaScript file to get you started

console.log('🚀 Welcome to CollabCode!');

// Sample function to demonstrate collaborative coding
function welcomeMessage(name = 'Developer') {
    return \`Hello \${name}! Welcome to the future of collaborative coding.\`;
}

// Event listener for when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log(welcomeMessage('CollabCode User'));
    
    // Add some interactivity
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.addEventListener('click', () => {
            feature.style.transform = 'scale(1.05)';
            feature.style.transition = 'transform 0.2s ease';
            
            setTimeout(() => {
                feature.style.transform = 'scale(1)';
            }, 200);
        });
    });
});

// Sample class for project management
class CollabProject {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.collaborators = [];
        this.files = [];
        this.createdAt = new Date();
    }
    
    addCollaborator(user) {
        this.collaborators.push(user);
        console.log(\`\${user} joined the project: \${this.name}\`);
    }
    
    addFile(filename, content) {
        this.files.push({ filename, content, lastModified: new Date() });
        console.log(\`File added: \${filename}\`);
    }
    
    getProjectInfo() {
        return {
            name: this.name,
            description: this.description,
            collaboratorCount: this.collaborators.length,
            fileCount: this.files.length,
            createdAt: this.createdAt
        };
    }
}

// Create a sample project instance
const myProject = new CollabProject(
    'My Awesome Project',
    'Building something amazing with CollabCode'
);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CollabProject, welcomeMessage };
}`,
            language: "javascript",
            project_id: projectResult.insertedId.toString(),
            created_by: demoUser._id.toString(),
            last_modified_by: demoUser._id.toString(),
            version: 1,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            name: "README.md",
            path: "/README.md",
            content: `# Welcome to CollabCode! 🚀

This is your first project on CollabCode - the ultimate platform for real-time collaborative coding.

## Features

### 💬 Real-time Chat
- Instant messaging with your team
- Code snippets sharing
- Emoji reactions and threads

### 🎥 Video Calls
- HD video conferencing with Jitsi Meet
- Screen sharing capabilities
- Up to 75 participants
- No time limits!

### 📁 File Management
- Upload and share files instantly
- Support for images, documents, and code files
- Cloud storage with Cloudinary integration

### ⚡ Live Collaboration
- Real-time code editing
- Cursor tracking and presence indicators
- Conflict resolution
- Auto-save functionality

## Getting Started

1. **Invite Collaborators**: Share your project with team members
2. **Start Coding**: Create files and start coding together
3. **Communicate**: Use the built-in chat and video calling
4. **Share Files**: Upload and share resources with your team

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, MongoDB, Socket.io
- **Real-time**: WebSocket connections for live collaboration
- **Video**: Jitsi Meet integration
- **Storage**: Local storage + Cloudinary cloud storage
- **Authentication**: JWT with bcrypt password hashing

## Free Tools Used

- ✅ **MongoDB Atlas**: Free 512MB database
- ✅ **Jitsi Meet**: Unlimited video calls
- ✅ **Cloudinary**: 25GB free storage
- ✅ **Vercel**: Free hosting and deployment
- ✅ **Socket.io**: Real-time communication

## Commands

\`\`\`bash
# Start development server
npm run dev

# Start WebSocket server
npm run ws-server

# Start both together
npm run dev:full

# Build for production
npm run build
\`\`\`

## Environment Variables

\`\`\`env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3001
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

- 📧 Email: support@collabcode.dev
- 💬 Discord: Coming soon
- 📖 Documentation: Check the wiki

---

**Happy Coding!** 🎉

Built with ❤️ by the CollabCode team`,
            language: "markdown",
            project_id: projectResult.insertedId.toString(),
            created_by: demoUser._id.toString(),
            last_modified_by: demoUser._id.toString(),
            version: 1,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ]

        await db.collection("files").insertMany(sampleFiles)
        console.log("✅ Sample files created")
      }
    } else {
      console.log("ℹ️  Database already has users, skipping sample data")
    }

    console.log("🎉 Database initialization completed successfully!")
    console.log("")
    console.log("📊 Database Summary:")
    console.log(`   Users: ${await db.collection("users").countDocuments()}`)
    console.log(`   Teams: ${await db.collection("teams").countDocuments()}`)
    console.log(`   Projects: ${await db.collection("projects").countDocuments()}`)
    console.log(`   Rooms: ${await db.collection("rooms").countDocuments()}`)
    console.log(`   Messages: ${await db.collection("messages").countDocuments()}`)
    console.log(`   Files: ${await db.collection("files").countDocuments()}`)
    console.log(`   Notifications: ${await db.collection("notifications").countDocuments()}`)
    console.log("")
    console.log("🚀 Your CollabCode database is ready!")
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    process.exit(1)
  }
}

// Run the initialization
initializeDatabase()
