import { LLM } from "../../../types"

const MISTRAL_PLATFORM_LINK = "https://docs.mistral.ai/"

// Mistral Models (UPDATED 03/01/25) -----------------------------

// Mistral tiny (v24.11)
const MISTRAL_7B: LLM = {
  modelId: "mistral-7b",
  modelName: "Mistral 7B",
  provider: "mistral",
  hostedId: "mistral-7b",
  platformLink: MISTRAL_PLATFORM_LINK,
  imageInput: false
};

// Mistral Large (v24.11)
const MISTRAL_LARGE: LLM = {
  modelId: "mistral-large-latest",
  modelName: "Mistral Large",
  provider: "mistral",
  hostedId: "mistral-large-latest",
  platformLink: MISTRAL_PLATFORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 8,
    outputCost: 24
  }
}

// Pixtral Large (v24.11)
const PIXTRAL_LARGE: LLM = {
  modelId: "pixtral-large-latest",
  modelName: "Pixtral Large",
  provider: "mistral",
  hostedId: "pixtral-large-latest",
  platformLink: MISTRAL_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 10,
    outputCost: 30
  }
}

// Mistral Saba (v25.02)
const MISTRAL_SABA: LLM = {
  modelId: "mistral-saba-latest",
  modelName: "Mistral Saba",
  provider: "mistral",
  hostedId: "mistral-saba-latest",
  platformLink: MISTRAL_PLATFORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 3,
    outputCost: 9
  }
}

// Ministral 3B (v24.10)
const MINISTRAL_3B: LLM = {
  modelId: "ministral-3b-latest",
  modelName: "Ministral 3B",
  provider: "mistral",
  hostedId: "ministral-3b-latest",
  platformLink: MISTRAL_PLATFORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 1.5,
    outputCost: 4.5
  }
}

// Ministral 8B (v24.10)
const MINISTRAL_8B: LLM = {
  modelId: "ministral-8b-latest",
  modelName: "Ministral 8B",
  provider: "mistral",
  hostedId: "ministral-8b-latest",
  platformLink: MISTRAL_PLATFORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 2,
    outputCost: 6
  }
}

// Codestral (v25.01)
const CODESTRAL: LLM = {
  modelId: "codestral",
  modelName: "Codestral",
  provider: "mistral",
  hostedId: "codestral",
  platformLink: MISTRAL_PLATFORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.2,
    outputCost: 0.6,
  },
};

// Mistral Large 2
const MISTRAL_LARGE_2: LLM = {
  modelId: "mistral-large-2",
  modelName: "Mistral Large 2",
  provider: "mistral",
  hostedId: "mistral-large-2",
  platformLink: MISTRAL_PLATFORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 2,
    outputCost: 6,
  },
};

// Mistral Embed (v23.12)
const MISTRAL_EMBED: LLM = {
  modelId: "mistral-embed",
  modelName: "Mistral Embed",
  provider: "mistral",
  hostedId: "mistral-embed",
  platformLink: MISTRAL_PLATFORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.8
  }
}

// Mistral Moderation (v24.11)
const MISTRAL_MODERATION: LLM = {
  modelId: "mistral-moderation-latest",
  modelName: "Mistral Moderation",
  provider: "mistral",
  hostedId: "mistral-moderation-latest",
  platformLink: MISTRAL_PLATFORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 1
  }
}

// Mistral Small (v25.01)
const MISTRAL_SMALL: LLM = {
  modelId: "mistral-small",
  modelName: "Mistral Small",
  provider: "mistral",
  hostedId: "mistral-small",
  platformLink: MISTRAL_PLATFORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.2,
    outputCost: 0.6,
  },
};

// Pixtral (v24.09)
const PIXTRAL: LLM = {
  modelId: "pixtral-12b-2409",
  modelName: "Pixtral",
  provider: "mistral",
  hostedId: "pixtral-12b-2409",
  platformLink: MISTRAL_PLATFORM_LINK,
  imageInput: true
}

// Mistral Nemo (v24.07)
const MISTRAL_NEMO: LLM = {
  modelId: "mistral-nemo",
  modelName: "Mistral Nemo",
  provider: "mistral",
  hostedId: "mistral-nemo",
  platformLink: MISTRAL_PLATFORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.15,
    outputCost: 0.15,
  },
};

// Codestral Mamba (v0.1)
const CODESTRAL_MAMBA: LLM = {
  modelId: "open-codestral-mamba",
  modelName: "Codestral Mamba",
  provider: "mistral",
  hostedId: "open-codestral-mamba",
  platformLink: MISTRAL_PLATFORM_LINK,
  imageInput: false
}

// Mathstral 7B (v0.1)
const MATHSTRAL_7B: LLM = {
  modelId: "mathstral-7b-0.1",
  modelName: "Mathstral 7B",
  provider: "mistral",
  hostedId: "mathstral-7b-0.1",
  platformLink: MISTRAL_PLATFORM_LINK,
  imageInput: false
}

export const MISTRAL_LLM_LIST: LLM[] = [
  MISTRAL_7B,
  MISTRAL_LARGE,
  PIXTRAL_LARGE,
  MISTRAL_SABA,
  MINISTRAL_3B,
  MINISTRAL_8B,
  CODESTRAL,
  MISTRAL_LARGE_2,
  MISTRAL_EMBED,
  MISTRAL_MODERATION,
  MISTRAL_SMALL,
  PIXTRAL,
  MISTRAL_NEMO,
  CODESTRAL_MAMBA,
  MATHSTRAL_7B
]
