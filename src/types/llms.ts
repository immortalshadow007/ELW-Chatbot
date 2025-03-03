import { ModelProvider } from "."

export type LLMID =
  | OpenAILLMID
  | GoogleLLMID
  | AnthropicLLMID
  | MistralLLMID
  | LlamaLLMID
  | PerplexityLLMID

// OpenAI Models (UPDATED 5/13/24)
export type OpenAILLMID =
  // GPT Series (in approximate order of release)
  | "gpt-3.5-turbo" // GPT-3.5 Turbo
  | "gpt-4" // GPT-4
  | "gpt-4-turbo-2024-04-09" // GPT-4 Turbo (latest stable version)
  | "gpt-4o" // GPT-4o
  | "gpt-4.5" // GPT-4.5
  // "o" Series (reasoning models, in order of release)
  | "o1" // o1
  | "o1-mini" // o1-mini
  | "o3-mini" // o3-mini

// Google Models
export type GoogleLLMID =
  | "t5" // T5 (Text-to-Text Transfer Transformer)
  | "gemini-nano" // Gemini Nano
  | "gemini-pro" // Gemini Pro
  | "gemini-ultra" // Gemini Ultra
  | "gemini-1.5-flash" // Gemini 1.5 Flash
  | "gemini-1.5-pro" // Gemini 1.5 Pro
  | "gemini-2.0-flash" // Gemini 2.0 Flash
  | "gemini-2.0-flash-lite" // Gemini 2.0 Flash Lite
  | "gemini-2.0-pro-experimental" // Gemini 2.0 Pro Experimental
  | "gemini-2.0-flash-thinking-experimental" // Gemini 2.0 Flash Thinking Experimental
  | "gemma-2" // Gemma 2
  | "paligemma-2" // PaliGemma 2
  | "paligemma-2-mix"; // PaliGemma 2 Mix

// Anthropic Models
export type AnthropicLLMID =
  | "claude-3-haiku-20240307" // Claude 3 Haiku
  | "claude-3-sonnet-20240229" // Claude 3 Sonnet
  | "claude-3-opus-20240229" // Claude 3 Opus
  | "claude-3-5-sonnet-20240620" // Claude 3.5 Sonnet
  | "claude-3-5-sonnet-20241022" // Claude 3.5 Sonnet V2
  | "claude-3-5-haiku-20241022" // Claude 3.5 Haiku
  | "claude-3-7-sonnet-20250219" // Claude 3.7 Sonnet

// Mistral Models
export type MistralLLMID =
  | "mistral-7b" // Mistral - 7B
  | "mistral-small" // Mistral Small
  | "mistral-medium-latest" // Mistral Medium
  | "mistral-large-latest" // Mistral Large
  | "pixtral-large-latest" // Pixtral Large
  | "mistral-saba-latest" // Mistral SABA
  | "ministral-3b-latest" // Ministral - 3B
  | "ministral-8b-latest" // Ministral - 8B
  | "codestral" // Codestral
  | "mistral-large-2" // Ministral Large 2
  | "mistral-embed" // Mistral embed
  | "mistral-moderation-latest" // Mistral Moderation latest
  | "pixtral-12b-2409" // Pixtral - 12B
  | "mistral-nemo" // Mistral Nemo
  | "open-codestral-mamba" // Open Codestral Mamba
  | "mathstral-7b-0.1" // Mathstral - 7B

export type LlamaLLMID =
  | "llama3.3-70b" // LLaMA 3.3 - 70B
  | "llama3.2-90b-vision" // LLaMA 3.2 - 90B Vision
  | "llama3.2-11b-vision" // LLaMA 3.2 - 11B Vision
  | "llama3.2-3b" // LLaMA 3.2 - 3B
  | "llama3.2-1b" // LLaMA 3.2 - 1B
  | "llama3.1-405b" // LLaMA 3.1 - 405B
  | "llama3.1-70b" // LLaMA 3.1 - 70B
  | "llama3.1-8b" // LLaMA 3.1 - 8B
  | "llama3-70b" // LLaMA 3 - 70B
  | "llama3-8b" // LLaMA 3 - 8B

// Perplexity Models (UPDATED 1/31/24)
export type PerplexityLLMID =
  | "mixtral-8x7b-instruct" // Mixtral 8x7B Instruct
  | "mistral-7b-instruct" // Mistral 7B Instruct
  | "codellama-70b-instruct" // CodeLlama 70B Instruct
  | "llama-3.1-sonar-huge-128k-online" //Sonar Huge Online

export interface LLM {
  modelId: LLMID
  modelName: string
  provider: ModelProvider
  hostedId: string
  platformLink: string
  imageInput: boolean
  pricing?: {
    currency: string
    unit: string
    inputCost: number
    outputCost?: number
  }
}

export interface OpenRouterLLM extends LLM {
  maxContext: number
}
