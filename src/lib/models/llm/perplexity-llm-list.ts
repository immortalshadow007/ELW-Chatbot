import { LLM } from "../../../types"

const PERPLEXITY_PLATFORM_LINK =
  "https://docs.perplexity.ai/docs/getting-started"

// Perplexity Models (UPDATED 2/25/24) -----------------------------
// Model Deprecation Notice
// Please note that on March 15, the pplx-70b-chat, pplx-70b-online, llama-2-70b-chat, and codellama-34b-instruct models will no longer be available through the Perplexity API.

// Mixtral 8x7B Instruct (UPDATED 1/31/24)
const MIXTRAL_8X7B_INSTRUCT: LLM = {
  modelId: "mixtral-8x7b-instruct",
  modelName: "Mixtral 8x7B Instruct",
  provider: "perplexity",
  hostedId: "mixtral-8x7b-instruct",
  platformLink: PERPLEXITY_PLATFORM_LINK,
  imageInput: false
}

// Mistral 7B Instruct (UPDATED 1/31/24)
const MISTRAL_7B_INSTRUCT: LLM = {
  modelId: "mistral-7b-instruct",
  modelName: "Mistral 7B Instruct",
  provider: "perplexity",
  hostedId: "mistral-7b-instruct",
  platformLink: PERPLEXITY_PLATFORM_LINK,
  imageInput: false
}

// CodeLlama 70B Instruct (UPDATED 1/31/24)
const CODELLAMA_70B_INSTRUCT: LLM = {
  modelId: "codellama-70b-instruct",
  modelName: "CodeLlama 70B Instruct",
  provider: "perplexity",
  hostedId: "codellama-70b-instruct",
  platformLink: PERPLEXITY_PLATFORM_LINK,
  imageInput: false
}

// Sonar Huge Online (Llama 3.1 405B) (UPDATED 03/03/25)
const SONAR_HUGE_ONLINE: LLM = {
  modelId: "llama-3.1-sonar-huge-128k-online",
  modelName: "Sonar Huge Online (Llama 3.1 405B)",
  provider: "perplexity",
  hostedId: "llama-3.1-sonar-huge-128k-online",
  platformLink: PERPLEXITY_PLATFORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 5.0, // Official pricing from docs
    outputCost: 5.0
  }
}

export const PERPLEXITY_LLM_LIST: LLM[] = [
  MIXTRAL_8X7B_INSTRUCT,
  MISTRAL_7B_INSTRUCT,
  CODELLAMA_70B_INSTRUCT,
  SONAR_HUGE_ONLINE
]
