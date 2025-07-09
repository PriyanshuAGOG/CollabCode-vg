
import { NextRequest, NextResponse } from "next/server"
import { OpenRouterClient } from "@/lib/integrations/openrouter"

export async function POST(request: NextRequest) {
  try {
    const { code, language, prompt, type } = await request.json()

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 })
    }

    const client = new OpenRouterClient(apiKey)
    
    let messages = []
    
    switch (type) {
      case "complete":
        messages = [
          { role: "system", content: `You are a ${language} code completion assistant. Complete the following code naturally and accurately.` },
          { role: "user", content: `Complete this ${language} code:\n\n${code}` }
        ]
        break
      case "explain":
        messages = [
          { role: "system", content: `You are a code explanation assistant. Explain code clearly and concisely.` },
          { role: "user", content: `Explain this ${language} code:\n\n${code}` }
        ]
        break
      case "fix":
        messages = [
          { role: "system", content: `You are a code debugging assistant. Fix bugs and suggest improvements.` },
          { role: "user", content: `Fix any issues in this ${language} code and explain what was wrong:\n\n${code}` }
        ]
        break
      case "generate":
        messages = [
          { role: "system", content: `You are a code generation assistant. Generate clean, efficient ${language} code.` },
          { role: "user", content: `Generate ${language} code for: ${prompt}` }
        ]
        break
      default:
        messages = [
          { role: "system", content: `You are a helpful programming assistant.` },
          { role: "user", content: prompt || `Help me with this ${language} code:\n\n${code}` }
        ]
    }

    const response = await client.chat(messages, "openai/gpt-4")

    return NextResponse.json({ response })
  } catch (error) {
    console.error("AI Code API error:", error)
    return NextResponse.json({ error: "Failed to process AI request" }, { status: 500 })
  }
}
