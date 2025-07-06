import { type NextRequest, NextResponse } from "next/server"
import { OpenRouterClient } from "@/lib/integrations/openrouter"

export async function POST(request: NextRequest) {
  try {
    const { messages, model = "openai/gpt-4" } = await request.json()

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 })
    }

    const client = new OpenRouterClient(apiKey)
    const response = await client.chat(messages, model)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("AI Chat API error:", error)
    return NextResponse.json({ error: "Failed to process AI request" }, { status: 500 })
  }
}
