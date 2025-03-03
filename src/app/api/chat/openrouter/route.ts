import { checkApiKey, getServerProfile } from "../../../../lib/server/server-chat-helpers"
import { ChatSettings } from "../../../../types"
import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.openrouter_api_key, "OpenRouter")

    // Configure OpenRouter as an OpenAI-compatible provider
    const openai = createOpenAI({
      apiKey: profile.openrouter_api_key || "",
      baseURL: "https://openrouter.ai/api/v1"
    })

    // Stream the response using AI SDK
    const result = await streamText({
      model: openai(chatSettings.model),
      messages: messages, // Assuming messages are compatible; adjust if needed
      temperature: chatSettings.temperature,
      maxTokens: undefined // Kept as undefined per original
    })

    return result.toTextStreamResponse()

  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "OpenRouter API Key not found. Please set it in your profile settings."
    }

    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}