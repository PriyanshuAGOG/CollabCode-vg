# Complete Setup Guide - CollabCode with Free Tools

## 🚀 Quick Start (5 Minutes)

### Step 1: Clone and Install
\`\`\`bash
git clone <your-repo>
cd collabcode
npm install
\`\`\`

### Step 2: Environment Setup
Copy `.env.example` to `.env.local` and fill in the values:

\`\`\`bash
cp .env.example .env.local
\`\`\`

### Step 3: Database Setup (MongoDB Atlas - FREE)

#### 3.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create account
3. Create a new cluster (M0 Sandbox - FREE FOREVER)
4. Choose AWS, Google Cloud, or Azure (any region)
5. Cluster Name: `collabcode-cluster`

#### 3.2 Configure Database Access
1. **Database Access**: Create user
   - Username: `collabcode-user`
   - Password: Generate secure password
   - Database User Privileges: `Read and write to any database`

2. **Network Access**: Add IP Address
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add your specific IP for security

#### 3.3 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your user password
5. Add to `.env.local` as `MONGODB_URI`

### Step 4: File Storage Setup (Choose One)

#### Option A: Local Storage (Completely Free)
\`\`\`env
STORAGE_TYPE=local
UPLOAD_DIR=./uploads
\`\`\`

#### Option B: Cloudinary (25GB Free)
1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for free account
3. Get your credentials from dashboard
4. Add to `.env.local`:
\`\`\`env
STORAGE_TYPE=cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

### Step 5: Start the Application

#### 5.1 Start WebSocket Server (Terminal 1)
\`\`\`bash
npm run ws-server
\`\`\`

#### 5.2 Start Next.js App (Terminal 2)
\`\`\`bash
npm run dev
\`\`\`

### Step 6: Access the Application
- Open http://localhost:3000
- Create an account
- Start collaborating!

## 🛠 Advanced Configuration

### Video Calls (Jitsi Meet - FREE)
- No setup required
- Unlimited HD video calls
- Up to 75 participants
- Screen sharing included

### Real-time Features (Socket.io - FREE)
- WebSocket server included
- Live collaboration
- Real-time chat
- Presence indicators

### Authentication (JWT - FREE)
- Secure password hashing with bcrypt
- HTTP-only cookies
- Session management
- No external service required

## 📊 Free Tier Limits

### MongoDB Atlas (M0 Sandbox)
- ✅ 512MB storage
- ✅ Shared RAM
- ✅ No time limit
- ✅ Perfect for development and small teams

### Cloudinary (Free Tier)
- ✅ 25GB storage
- ✅ 25GB monthly bandwidth
- ✅ Image/video transformations
- ✅ CDN delivery

### Jitsi Meet
- ✅ Unlimited video calls
- ✅ No time limits
- ✅ HD video quality
- ✅ Screen sharing
- ✅ Up to 75 participants

## 🔧 Troubleshooting

### MongoDB Connection Issues
\`\`\`bash
# Test connection
node -e "
const { MongoClient } = require('mongodb');
const client = new MongoClient('YOUR_MONGODB_URI');
client.connect().then(() => {
  console.log('✅ MongoDB connected successfully');
  client.close();
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
});
"
\`\`\`

### WebSocket Server Issues
- Make sure port 3001 is available
- Check firewall settings
- Restart the WebSocket server

### File Upload Issues
- Check upload directory permissions (local storage)
- Verify Cloudinary credentials
- Check file size limits

## 🚀 Production Deployment

### Vercel (Recommended - FREE)
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### Railway (Alternative - FREE)
1. Connect GitHub repository
2. Add environment variables
3. Deploy with one click

### Environment Variables for Production
\`\`\`env
# Database
MONGODB_URI=your_production_mongodb_uri

# Authentication
JWT_SECRET=your_super_secret_jwt_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.com

# Storage (if using Cloudinary)
STORAGE_TYPE=cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# WebSocket (for production)
WEBSOCKET_URL=wss://your-websocket-server.com
\`\`\`

## 📈 Scaling Options

### When you outgrow free tiers:

#### MongoDB Atlas
- M2: $9/month (2GB storage)
- M5: $25/month (5GB storage)

#### Cloudinary
- Plus: $89/month (75GB storage)
- Advanced: $224/month (150GB storage)

#### Video Calling Alternatives
- Daily.co: $0.002/minute
- Agora: $0.99/1000 minutes
- Twilio Video: $0.004/minute

## 🎯 Next Steps

1. **Customize the UI**: Modify components in `/components`
2. **Add Features**: Extend the API routes
3. **Configure Integrations**: Add GitHub, Figma, etc.
4. **Set up CI/CD**: Automate deployments
5. **Monitor Performance**: Add analytics

## 📞 Support

- GitHub Issues: Create an issue for bugs
- Documentation: Check the README.md
- Community: Join our Discord (coming soon)

---

**Total Setup Time**: ~15 minutes
**Monthly Cost**: $0 (with free tiers)
**Scalability**: Handles 100+ concurrent users
