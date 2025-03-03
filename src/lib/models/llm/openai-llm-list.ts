import { LLM } from "../../../types"

const OPENAI_PLATFORM_LINK = "https://platform.openai.com/docs/models"

// OpenAI Models (UPDATED 03/01/25) -----------------------------

// GPT Series (in approximate order of release) -----------------------------

// GPT-3.5 Turbo (UPDATED 03/01/25)
const GPT3_5Turbo: LLM = {
  modelId: "gpt-3.5-turbo",
  modelName: "GPT-3.5 Turbo",
  provider: "openai",
  hostedId: "gpt-3.5-turbo",
  platformLink: OPENAI_PLATFORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.5,
    outputCost: 1.5
  }
}

// GPT-4 (UPDATED 03/01/25)
const GPT4: LLM = {
  modelId: "gpt-4",
  modelName: "GPT-4",
  provider: "openai",
  hostedId: "gpt-4",
  platformLink: OPENAI_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 30,
    outputCost: 60
  }
}

// GPT-4 Turbo (UPDATED 03/01/25)
const GPT4Turbo: LLM = {
  modelId: "gpt-4-turbo-2024-04-09",
  modelName: "GPT-4 Turbo",
  provider: "openai",
  hostedId: "gpt-4-turbo-2024-04-09",
  platformLink: OPENAI_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 10,
    outputCost: 30
  }
}

// GPT-4o (UPDATED 03/01/25)
const GPT4o: LLM = {
  modelId: "gpt-4o",
  modelName: "GPT-4o",
  provider: "openai",
  hostedId: "gpt-4o",
  platformLink: OPENAI_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 5,
    outputCost: 15
  }
}

// GPT-4.5 (UPDATED 03/01/25)
const GPT4_5: LLM = {
  modelId: "gpt-4.5",
  modelName: "GPT-4.5",
  provider: "openai",
  hostedId: "gpt-4.5",
  platformLink: OPENAI_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 75,
    outputCost: 150
  }
}

// "o" Series (reasoning models, in order of release) -----------------------------

// o1 (UPDATED 03/01/25)
const O1: LLM = {
  modelId: "o1",
  modelName: "o1",
  provider: "openai",
  hostedId: "o1",
  platformLink: OPENAI_PLATFORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 15,
    outputCost: 60
  }
}

// o1-mini (UPDATED 03/01/25)
const O1Mini: LLM = {
  modelId: "o1-mini",
  modelName: "o1-mini",
  provider: "openai",
  hostedId: "o1-mini",
  platformLink: OPENAI_PLATFORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 3,
    outputCost: 12
  }
}

// o3-mini (UPDATED 03/01/25)
const O3Mini: LLM = {
  modelId: "o3-mini",
  modelName: "o3-mini",
  provider: "openai",
  hostedId: "o3-mini",
  platformLink: OPENAI_PLATFORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 6, // Estimated based on scaling from o1-mini
    outputCost: 24
  }
}

export const OPENAI_LLM_LIST: LLM[] = [
  GPT3_5Turbo,
  GPT4,
  GPT4Turbo,
  GPT4o,
  GPT4_5,
  O1,
  O1Mini,
  O3Mini
]