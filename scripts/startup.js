
const { spawn } = require('child_process')
const path = require('path')

// Environment check
const requiredEnvVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'MONGODB_URI',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:')
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`)
  })
  console.error('\nPlease set these environment variables before starting the application.')
  process.exit(1)
}

console.log('✅ Environment variables check passed')

// Start the application
console.log('🚀 Starting CollabCode application...')

const nextProcess = spawn('npm', ['run', 'dev'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: process.env.PORT || '3000'
  }
})

nextProcess.on('close', (code) => {
  console.log(`Application exited with code ${code}`)
  process.exit(code)
})

nextProcess.on('error', (error) => {
  console.error('Failed to start application:', error)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...')
  nextProcess.kill('SIGINT')
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...')
  nextProcess.kill('SIGTERM')
})
