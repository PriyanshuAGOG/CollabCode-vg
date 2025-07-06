import { type NextRequest, NextResponse } from "next/server"
import { aiIntegration } from "@/lib/integrations/ai-models"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, prompt, code, language, model } = body

    switch (action) {
      case "generate":
        const response = await aiIntegration.generateResponse(body)
        return NextResponse.json(response)

      case "generate-code":
        const generatedCode = await aiIntegration.generateCode(prompt, language, model)
        return NextResponse.json({ code: generatedCode })

      case "review-code":
        const review = await aiIntegration.reviewCode(code, language, model)
        return NextResponse.json({ review })

      case "explain-code":
        const explanation = await aiIntegration.explainCode(code, language, model)
        return NextResponse.json({ explanation })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("AI API Error:", error)
    return NextResponse.json({ error: "AI request failed" }, { status: 500 })
  }
}
