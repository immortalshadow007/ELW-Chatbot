import { checkApiKey, getServerProfile } from "../../../../lib/server/server-chat-helpers"
import { ChatAPIPayload } from "../../../../types"
import { streamText, CoreMessage } from "ai"
import { createAzure } from "@ai-sdk/azure"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  const json = await request.json()
  const { chatSettings, messages } = json as ChatAPIPayload

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.azure_openai_api_key, "Azure OpenAI")

    const ENDPOINT = profile.azure_openai_endpoint
    const KEY = profile.azure_openai_api_key

    let DEPLOYMENT_ID = ""
    switch (chatSettings.model) {
      case "gpt-3.5-turbo":
        DEPLOYMENT_ID = profile.azure_openai_35_turbo_id || ""
        break
      case "gpt-4o":
        DEPLOYMENT_ID = profile.azure_openai_45_turbo_id || ""
        break
      case "o3-mini":
        DEPLOYMENT_ID = profile.azure_openai_45_vision_id || ""
        break
      default:
        return new NextResponse(JSON.stringify({ message: "Model not found" }), {
          status: 400
        })
    }

    if (!ENDPOINT || !KEY || !DEPLOYMENT_ID) {
      return new NextResponse(
        JSON.stringify({ message: "Azure resources not found" }),
        {
          status: 400
        }
      )
    }

    const azureOpenai = createAzure({
      baseURL: `${ENDPOINT}/openai/deployments/${DEPLOYMENT_ID}?api-version=2023-12-01-preview`,
      apiKey: KEY,
      headers: { "api-key": KEY }
    })

    // Transform messages to CoreMessage format
    const formattedMessages: CoreMessage[] = messages.map((msg) => {
      // Ensure msg.role is a valid CoreMessage role
      switch (msg.role) {
        case "system":
          return { role: "system", content: msg.content as string }
        case "user":
          return { role: "user", content: msg.content as string } // Adjust if content is an array
        case "assistant":
          return { role: "assistant", content: msg.content as string }
        case "tool":
          return { role: "tool", content: [] } // Tool messages require ToolResultPart[]; adjust if needed
        default:
          throw new Error(`Invalid message role: ${msg.role}`)
      }
    })

    const result = await streamText({
      model: azureOpenai(DEPLOYMENT_ID),
      messages: formattedMessages,
      temperature: chatSettings.temperature,
      maxTokens: chatSettings.model === "gpt-4o" ? 4096 : undefined
    })

    return result.toTextStreamResponse()

  } catch (error: any) {
    const errorMessage = error.error?.message || error.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}