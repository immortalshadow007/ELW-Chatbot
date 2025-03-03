import { LLM } from "../../../types"

const ANTHROPIC_PLATFORM_LINK =
  "https://docs.anthropic.com/claude/reference/getting-started-with-the-api"

// Anthropic Models (UPDATED 06/20/24) -----------------------------

// Claude 3 Haiku (UPDATED 03/13/24)
const CLAUDE_3_HAIKU: LLM = {
  modelId: "claude-3-haiku-20240307",
  modelName: "Claude 3 Haiku",
  provider: "anthropic",
  hostedId: "claude-3-haiku-20240307",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.25,
    outputCost: 1.25
  }
}

// Claude 3 Sonnet (UPDATED 03/04/24)
const CLAUDE_3_SONNET: LLM = {
  modelId: "claude-3-sonnet-20240229",
  modelName: "Claude 3 Sonnet",
  provider: "anthropic",
  hostedId: "claude-3-sonnet-20240229",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 3,
    outputCost: 15
  }
}

// Claude 3 Opus (UPDATED 03/04/24)
const CLAUDE_3_OPUS: LLM = {
  modelId: "claude-3-opus-20240229",
  modelName: "Claude 3 Opus",
  provider: "anthropic",
  hostedId: "claude-3-opus-20240229",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 15,
    outputCost: 75
  }
}

// Claude 3.5 Sonnet (UPDATED 06/20/24)
const CLAUDE_3_5_SONNET: LLM = {
  modelId: "claude-3-5-sonnet-20240620",
  modelName: "Claude 3.5 Sonnet",
  provider: "anthropic",
  hostedId: "claude-3-5-sonnet-20240620",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 3,
    outputCost: 15
  }
}

// Claude 3.5 Sonnet V2 (UPDATED 10/22/2024)
const CLAUDE_3_5_SONNET_V2: LLM = {
  modelId: "claude-3-5-sonnet-20241022",
  modelName: "Claude 3.5 Sonnet v2",
  provider: "anthropic",
  hostedId: "claude-3-5-sonnet-20241022",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 3,
    outputCost: 15
  }
};


const CLAUDE_3_5_HAIKU: LLM = {
  modelId: "claude-3-5-haiku-20241022",
  modelName: "Claude 3.5 Haiku",
  provider: "anthropic",
  hostedId: "claude-3-5-haiku-20241022",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.8,
    outputCost: 4
  }
};

const CLAUDE_3_7_SONNET: LLM = {
  modelId: "claude-3-7-sonnet-20250219",
  modelName: "Claude 3.7 Sonnet",
  provider: "anthropic",
  hostedId: "claude-3-7-sonnet-20250219",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 3,
    outputCost: 15
  }
};

export const ANTHROPIC_LLM_LIST: LLM[] = [
  CLAUDE_3_HAIKU,
  CLAUDE_3_SONNET,
  CLAUDE_3_OPUS,
  CLAUDE_3_5_SONNET,
  CLAUDE_3_5_SONNET_V2,
]
