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

    checkApiKey(profile.openai_api_key, "OpenAI")

    // Configure OpenAI provider using AI SDK
    const openai = createOpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id || undefined,
    })

    // Stream the response using AI SDK
    const result = await streamText({
      model: openai(chatSettings.model),
      messages: messages, // Assuming messages are compatible; adjust if needed
      temperature: chatSettings.temperature,
      maxTokens:
        chatSettings.model === "o3-mini" || chatSettings.model === "gpt-4o"
          ? 4096
          : undefined // Updated to undefined instead of null for consistency
    })

    return result.toTextStreamResponse()

  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "OpenAI API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("incorrect api key")) {
      errorMessage =
        "OpenAI API Key is incorrect. Please fix it in your profile settings."
    }

    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}