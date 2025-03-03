import { CHAT_SETTING_LIMITS } from "../../../../lib/chat-setting-limits"
import { checkApiKey, getServerProfile } from "../../../../lib/server/server-chat-helpers"
import { ChatSettings } from "../../../../types"
import { streamText, CoreMessage } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { NextRequest, NextResponse } from "next/server"

type MessageContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } }

interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool"
  content: string | MessageContentPart[]
}

export const runtime = "edge"

export async function POST(request: NextRequest) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: ChatMessage[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.mistral_api_key, "Mistral")

    const mistral = createOpenAI({
      apiKey: profile.mistral_api_key || "",
      baseURL: "https://api.mistral.ai/v1"
    })

    // Transform messages to CoreMessage format
    const formattedMessages: CoreMessage[] = messages.map((msg) => {
      if (Array.isArray(msg.content)) {
        switch (msg.role) {
          case "system":
            throw new Error("System messages cannot have array content")
          case "user":
            return {
              role: "user",
              content: msg.content.map((part: MessageContentPart) =>
                part.type === "image_url"
                  ? { type: "image", image: part.image_url.url }
                  : { type: "text", text: part.text }
              )
            }
          case "assistant":
            // Assistant messages: concatenate text parts, ignore images
            return {
              role: "assistant",
              content: msg.content
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join(" ")
            }
          case "tool":
            throw new Error("Tool messages require tool result content")
          default:
            throw new Error(`Invalid message role: ${msg.role}`)
        }
      }
      switch (msg.role) {
        case "system":
          return { role: "system", content: msg.content as string }
        case "user":
          return { role: "user", content: msg.content as string }
        case "assistant":
          return { role: "assistant", content: msg.content as string }
        case "tool":
          return { role: "tool", content: [] } // Adjust if tool results are provided
        default:
          throw new Error(`Invalid message role: ${msg.role}`)
      }
    })

    const result = await streamText({
      model: mistral(chatSettings.model),
      messages: formattedMessages,
      maxTokens: CHAT_SETTING_LIMITS[chatSettings.model].MAX_TOKEN_OUTPUT_LENGTH,
      temperature: chatSettings.temperature
    })

    return result.toTextStreamResponse()

  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Mistral API Key not found. Please set it in your profile settings."
    } else if (errorCode === 401) {
      errorMessage =
        "Mistral API Key is incorrect. Please fix it in your profile settings."
    }

    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}