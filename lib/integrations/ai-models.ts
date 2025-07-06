export interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  maxTokens: number
  costPer1kTokens: number
  capabilities: string[]
}

export const AI_MODELS: AIModel[] = [
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    description: "Most capable GPT-4 model with 128k context",
    maxTokens: 128000,
    costPer1kTokens: 0.01,
    capabilities: ["text", "code", "analysis", "reasoning"],
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    description: "Most powerful Claude model for complex tasks",
    maxTokens: 200000,
    costPer1kTokens: 0.015,
    capabilities: ["text", "code", "analysis", "reasoning", "long-context"],
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    description: "Google's most capable multimodal model",
    maxTokens: 32000,
    costPer1kTokens: 0.0005,
    capabilities: ["text", "code", "vision", "multimodal"],
  },
  {
    id: "llama-3-70b",
    name: "Llama 3 70B",
    provider: "Meta",
    description: "Open-source model with strong performance",
    maxTokens: 8000,
    costPer1kTokens: 0.0008,
    capabilities: ["text", "code", "reasoning"],
  },
  {
    id: "mixtral-8x7b",
    name: "Mixtral 8x7B",
    provider: "Mistral",
    description: "Mixture of experts model with multilingual support",
    maxTokens: 32000,
    costPer1kTokens: 0.0006,
    capabilities: ["text", "code", "multilingual"],
  },
  {
    id: "codellama-34b",
    name: "CodeLlama 34B",
    provider: "Meta",
    description: "Specialized code generation model",
    maxTokens: 16000,
    costPer1kTokens: 0.0008,
    capabilities: ["code", "programming", "debugging"],
  },
]

export interface AIRequest {
  model: string
  messages: Array<{
    role: "system" | "user" | "assistant"
    content: string
  }>
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface AIResponse {
  id: string
  model: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export const aiIntegration = {
  async generateResponse(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("AI Generation Error:", error)
      throw error
    }
  },

  async generateCode(prompt: string, language: string, model = "codellama-34b"): Promise<string> {
    const request: AIRequest = {
      model,
      messages: [
        {
          role: "system",
          content: `You are an expert ${language} programmer. Generate clean, efficient, and well-documented code.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      maxTokens: 2000,
    }

    const response = await this.generateResponse(request)
    return response.choices[0]?.message?.content || ""
  },

  async reviewCode(code: string, language: string, model = "gpt-4-turbo"): Promise<string> {
    const request: AIRequest = {
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a senior code reviewer. Provide constructive feedback on code quality, performance, security, and best practices.",
        },
        {
          role: "user",
          content: `Please review this ${language} code:\n\n${code}`,
        },
      ],
      temperature: 0.3,
      maxTokens: 1500,
    }

    const response = await this.generateResponse(request)
    return response.choices[0]?.message?.content || ""
  },

  async explainCode(code: string, language: string, model = "claude-3-opus"): Promise<string> {
    const request: AIRequest = {
      model,
      messages: [
        {
          role: "system",
          content: "You are a programming tutor. Explain code in a clear, educational manner.",
        },
        {
          role: "user",
          content: `Please explain this ${language} code:\n\n${code}`,
        },
      ],
      temperature: 0.4,
      maxTokens: 1000,
    }

    const response = await this.generateResponse(request)
    return response.choices[0]?.message?.content || ""
  },
}
