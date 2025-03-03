import { LLM } from "../../../types"

// Define the platform link for LLaMA API
const LLAMA_API_PLATFORM_LINK = "https://www.llama-api.com/"

// LLaMA 3.3 - 70B Model
const LLaMA3_3_70B: LLM = {
  modelId: "llama3.3-70b",
  modelName: "LLaMA 3.3 - 70B",
  provider: "llama-api",
  hostedId: "llama3.3-70b",
  platformLink: LLAMA_API_PLATFORM_LINK,
  imageInput: false // This model does not support image input
}

// LLaMA 3.2 - 90B Vision Model (Supports image input)
const LLaMA3_2_90B_VISION: LLM = {
  modelId: "llama3.2-90b-vision",
  modelName: "LLaMA 3.2 - 90B Vision",
  provider: "llama-api",
  hostedId: "llama3.2-90b-vision",
  platformLink: LLAMA_API_PLATFORM_LINK,
  imageInput: true // This model supports image input
}

// LLaMA 3.2 - 11B Vision Model (Supports image input)
const LLaMA3_2_11B_VISION: LLM = {
  modelId: "llama3.2-11b-vision",
  modelName: "LLaMA 3.2 - 11B Vision",
  provider: "llama-api",
  hostedId: "llama3.2-11b-vision",
  platformLink: LLAMA_API_PLATFORM_LINK,
  imageInput: true // This model supports image input
}

// LLaMA 3.2 - 3B Model
const LLaMA3_2_3B: LLM = {
  modelId: "llama3.2-3b",
  modelName: "LLaMA 3.2 - 3B",
  provider: "llama-api",
  hostedId: "llama3.2-3b",
  platformLink: LLAMA_API_PLATFORM_LINK,
  imageInput: false
}

// LLaMA 3.2 - 1B Model
const LLaMA3_2_1B: LLM = {
  modelId: "llama3.2-1b",
  modelName: "LLaMA 3.2 - 1B",
  provider: "llama-api",
  hostedId: "llama3.2-1b",
  platformLink: LLAMA_API_PLATFORM_LINK,
  imageInput: false
}

// LLaMA 3.1 - 405B Model (Largest LLaMA model in this list)
const LLaMA3_1_405B: LLM = {
  modelId: "llama3.1-405b",
  modelName: "LLaMA 3.1 - 405B",
  provider: "llama-api",
  hostedId: "llama3.1-405b",
  platformLink: LLAMA_API_PLATFORM_LINK,
  imageInput: false
}

// LLaMA 3.1 - 70B Model
const LLaMA3_1_70B: LLM = {
  modelId: "llama3.1-70b",
  modelName: "LLaMA 3.1 - 70B",
  provider: "llama-api",
  hostedId: "llama3.1-70b",
  platformLink: LLAMA_API_PLATFORM_LINK,
  imageInput: false
}

// LLaMA 3.1 - 8B Model
const LLaMA3_1_8B: LLM = {
  modelId: "llama3.1-8b",
  modelName: "LLaMA 3.1 - 8B",
  provider: "llama-api",
  hostedId: "llama3.1-8b",
  platformLink: LLAMA_API_PLATFORM_LINK,
  imageInput: false
}

// LLaMA 3 - 70B Model
const LLaMA3_70B: LLM = {
  modelId: "llama3-70b",
  modelName: "LLaMA 3 - 70B",
  provider: "llama-api",
  hostedId: "llama3-70b",
  platformLink: LLAMA_API_PLATFORM_LINK,
  imageInput: false
}

// LLaMA 3 - 8B Model
const LLaMA3_8B: LLM = {
  modelId: "llama3-8b",
  modelName: "LLaMA 3 - 8B",
  provider: "llama-api",
  hostedId: "llama3-8b",
  platformLink: LLAMA_API_PLATFORM_LINK,
  imageInput: false
}

// Exporting all LLaMA models in an array
export const LLAMA_LLM_LIST: LLM[] = [
  LLaMA3_3_70B,
  LLaMA3_2_90B_VISION,
  LLaMA3_2_11B_VISION,
  LLaMA3_2_3B,
  LLaMA3_2_1B,
  LLaMA3_1_405B,
  LLaMA3_1_70B,
  LLaMA3_1_8B,
  LLaMA3_70B,
  LLaMA3_8B
]
