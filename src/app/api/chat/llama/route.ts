import { CHAT_SETTING_LIMITS } from "../../../../lib/chat-setting-limits"
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

    checkApiKey(profile.llama_api_key, "Llama-API")

    // Configure Llama-API as an OpenAI-compatible provider
    const llamaApi = createOpenAI({
      apiKey: profile.llama_api_key ?? undefined,
      baseURL: "https://www.llama-api.com"
    })

    // Stream the response using AI SDK
    const result = await streamText({
      model: llamaApi(chatSettings.model),
      messages,
      maxTokens: CHAT_SETTING_LIMITS[chatSettings.model]?.MAX_TOKEN_OUTPUT_LENGTH ?? undefined,
      temperature: chatSettings.temperature
    })

    return result.toTextStreamResponse()

  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Llama-API Key not found. Please set it in your profile settings."
    } else if (errorCode === 401) {
      errorMessage =
        "Llama-API Key is incorrect. Please fix it in your profile settings."
    }

    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}