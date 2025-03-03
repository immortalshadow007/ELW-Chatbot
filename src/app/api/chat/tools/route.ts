import { openapiToFunctions } from "../../../../lib/openapi-conversion"
import { checkApiKey, getServerProfile } from "../../../../lib/server/server-chat-helpers"
import { Tables } from "../../../../supabase/types"
import { ChatSettings } from "../../../../types"
import { streamText, CoreMessage } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

type MessageContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } }

interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool"
  content: string | MessageContentPart[]
  tool_call_id?: string
  name?: string
  tool_calls?: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[]
}

export const runtime = "edge"

export async function POST(request: NextRequest) {
  const json = await request.json()
  const { chatSettings, messages, selectedTools } = json as {
    chatSettings: ChatSettings
    messages: ChatMessage[]
    selectedTools: Tables<"tools">[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.openai_api_key, "OpenAI")

    const openaiLegacy = new OpenAI({
      apiKey: profile.openai_api_key ?? undefined,
      organization: profile.openai_organization_id
    })

    const openai = createOpenAI({
      apiKey: profile.openai_api_key ?? undefined,
      organization: profile.openai_organization_id || undefined,
    })

    let allTools: OpenAI.Chat.Completions.ChatCompletionTool[] = []
    let allRouteMaps = {}
    let schemaDetails: {
      title: string
      description: string
      url: string
      headers: string | undefined
      routeMap: Record<string, string>
      requestInBody: boolean
    }[] = []

    for (const selectedTool of selectedTools) {
      try {
        const convertedSchema = await openapiToFunctions(
          JSON.parse(selectedTool.schema as string)
        )
        const tools = convertedSchema.functions || []
        allTools = allTools.concat(tools)

        const routeMap = convertedSchema.routes.reduce(
          (map: Record<string, string>, route) => {
            map[route.path.replace(/{(\w+)}/g, ":$1")] = route.operationId
            return map
          },
          {}
        )

        allRouteMaps = { ...allRouteMaps, ...routeMap }

        schemaDetails.push({
          title: convertedSchema.info.title,
          description: convertedSchema.info.description,
          url: convertedSchema.info.server,
          headers:
            typeof selectedTool.custom_headers === "string"
              ? selectedTool.custom_headers
              : undefined,
          routeMap,
          requestInBody: convertedSchema.routes[0]?.requestInBody ?? false
        })
      } catch (error: any) {
        console.error("Error converting schema", error)
      }
    }

    // Transform messages for OpenAI legacy API
    const legacyMessages: OpenAI.Chat.CompletionCreateParams["messages"] = messages.map(
      (msg) => {
        const content = Array.isArray(msg.content)
          ? msg.content
              .filter((part) => part.type === "text")
              .map((part) => part.text)
              .join(" ") || ""
          : msg.content

        switch (msg.role) {
          case "system":
            return { role: "system", content }
          case "user":
            return { role: "user", content }
          case "assistant":
            return {
              role: "assistant",
              content,
              tool_calls: msg.tool_calls
            }
          case "tool":
            if (!msg.tool_call_id) {
              throw new Error("tool_call_id is required for tool messages")
            }
            return {
              role: "tool",
              content,
              tool_call_id: msg.tool_call_id,
              name: msg.name
            }
          default:
            throw new Error(`Invalid message role: ${msg.role}`)
        }
      }
    )

    const firstResponse = await openaiLegacy.chat.completions.create({
      model: chatSettings.model,
      messages: legacyMessages,
      tools: allTools.length > 0 ? allTools : undefined
    })

    const message = firstResponse.choices[0].message
    messages.push({
      role: message.role,
      content: message.content ?? "",
      tool_calls: message.tool_calls,
      tool_call_id: message.tool_calls?.[0]?.id,
      name: message.tool_calls?.[0]?.function.name
    })
    const toolCalls = message.tool_calls || []

    if (toolCalls.length === 0) {
      return new NextResponse(message.content ?? "", {
        headers: { "Content-Type": "application/json" }
      })
    }

    for (const toolCall of toolCalls) {
      const functionCall = toolCall.function
      const functionName = functionCall.name
      const argumentsString = toolCall.function.arguments.trim()
      const parsedArgs = JSON.parse(argumentsString)

      const schemaDetail = schemaDetails.find(detail =>
        Object.values(detail.routeMap).includes(functionName)
      )

      if (!schemaDetail) {
        throw new Error(`Function ${functionName} not found in any schema`)
      }

      const pathTemplate = Object.keys(schemaDetail.routeMap).find(
        key => schemaDetail.routeMap[key] === functionName
      )

      if (!pathTemplate) {
        throw new Error(`Path for function ${functionName} not found`)
      }

      const path = pathTemplate.replace(/:(\w+)/g, (_, paramName) => {
        const value = parsedArgs.parameters[paramName]
        if (!value) {
          throw new Error(
            `Parameter ${paramName} not found for function ${functionName}`
          )
        }
        return encodeURIComponent(value)
      })

      let data = {}

      if (schemaDetail.requestInBody) {
        let headers = { "Content-Type": "application/json" }
        const customHeaders = schemaDetail.headers
        if (customHeaders && typeof customHeaders === "string") {
          headers = { ...headers, ...JSON.parse(customHeaders) }
        }

        const fullUrl = schemaDetail.url + path
        const bodyContent = parsedArgs.requestBody || parsedArgs

        const response = await fetch(fullUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(bodyContent)
        })

        data = response.ok ? await response.json() : { error: response.statusText }
      } else {
        const queryParams = new URLSearchParams(parsedArgs.parameters).toString()
        const fullUrl = schemaDetail.url + path + (queryParams ? "?" + queryParams : "")
        let headers = {}
        const customHeaders = schemaDetail.headers
        if (customHeaders && typeof customHeaders === "string") {
          headers = JSON.parse(customHeaders)
        }

        const response = await fetch(fullUrl, {
          method: "GET",
          headers
        })

        data = response.ok ? await response.json() : { error: response.statusText }
      }

      messages.push({
        tool_call_id: toolCall.id,
        role: "tool",
        name: functionName,
        content: JSON.stringify(data)
      })
    }

    // Transform messages for streaming
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
            return {
              role: "assistant",
              content: msg.content
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join(" ")
            }
          case "tool":
            return {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolCallId: msg.tool_call_id ?? "",
                  toolName: msg.name ?? "",
                  result: JSON.stringify(msg.content)
                }
              ]
            }
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
          return {
            role: "assistant",
            content: msg.content as string,
            tool_calls: msg.tool_calls
          }
        case "tool":
          return {
            role: "tool",
            content: [
              {
                type: "tool-result",
                toolCallId: msg.tool_call_id ?? "",
                toolName: msg.name ?? "",
                result: msg.content as string
              }
            ]
          }
        default:
          throw new Error(`Invalid message role: ${msg.role}`)
      }
    })

    const result = await streamText({
      model: openai(chatSettings.model),
      messages: formattedMessages,
      temperature: chatSettings.temperature
    })

    return result.toTextStreamResponse()

  } catch (error: any) {
    console.error(error)
    const errorMessage = error.error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}