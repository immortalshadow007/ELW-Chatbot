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

    checkApiKey(profile.perplexity_api_key, "Perplexity")

    // Configure Perplexity as an OpenAI-compatible provider
    const perplexity = createOpenAI({
      apiKey: profile.perplexity_api_key || "",
      baseURL: "https://api.perplexity.ai/"
    })

    // Stream the response using AI SDK
    const result = await streamText({
      model: perplexity(chatSettings.model),
      messages: messages, // Assuming messages are compatible; adjust if needed
      temperature: chatSettings.temperature
    })

    return result.toTextStreamResponse()

  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Perplexity API Key not found. Please set it in your profile settings."
    } else if (errorCode === 401) {
      errorMessage =
        "Perplexity API Key is incorrect. Please fix it in your profile settings."
    }

    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}