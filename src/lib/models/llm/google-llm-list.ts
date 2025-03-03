import { LLM } from "../../../types";

const GOOGLE_PLATFORM_LINK = "https://ai.google.dev/";

// Google Models (UPDATED 03/01/25) -----------------------------

// T5 (Text-to-Text Transfer Transformer)
const T5: LLM = {
  modelId: "t5",
  modelName: "T5",
  provider: "google",
  hostedId: "t5",
  platformLink: GOOGLE_PLATFORM_LINK,
  imageInput: false,
};

// Gemini Nano
const GEMINI_NANO: LLM = {
  modelId: "gemini-nano",
  modelName: "Gemini Nano",
  provider: "google",
  hostedId: "gemini-nano",
  platformLink: GOOGLE_PLATFORM_LINK,
  imageInput: false,
};

// Gemini Pro
const GEMINI_PRO: LLM = {
  modelId: "gemini-pro",
  modelName: "Gemini Pro",
  provider: "google",
  hostedId: "gemini-pro",
  platformLink: GOOGLE_PLATFORM_LINK,
  imageInput: false,
};

// Gemini Ultra
const GEMINI_ULTRA: LLM = {
  modelId: "gemini-ultra",
  modelName: "Gemini Ultra",
  provider: "google",
  hostedId: "gemini-ultra",
  platformLink: GOOGLE_PLATFORM_LINK,
  imageInput: false,
};

// Gemini 1.5 Flash
const GEMINI_1_5_FLASH: LLM = {
  modelId: "gemini-1.5-flash",
  modelName: "Gemini 1.5 Flash",
  provider: "google",
  hostedId: "gemini-1.5-flash",
  platformLink: GOOGLE_PLATFORM_LINK,
  imageInput: true,
};

// Gemini 1.5 Pro
const GEMINI_1_5_PRO: LLM = {
  modelId: "gemini-1.5-pro",
  modelName: "Gemini 1.5 Pro",
  provider: "google",
  hostedId: "gemini-1.5-pro",
  platformLink: GOOGLE_PLATFORM_LINK,
  imageInput: true,
};

// Gemini 2.0 Flash
const GEMINI_2_0_FLASH: LLM = {
  modelId: "gemini-2.0-flash",
  modelName: "Gemini 2.0 Flash",
  provider: "google",
  hostedId: "gemini-2.0-flash",
  platformLink: GOOGLE_PLATFORM_LINK,
  imageInput: true,
};

// Gemini 2.0 Flash-Lite
const GEMINI_2_0_FLASH_LITE: LLM = {
  modelId: "gemini-2.0-flash-lite",
  modelName: "Gemini 2.0 Flash-Lite",
  provider: "google",
  hostedId: "gemini-2.0-flash-lite",
  platformLink: GOOGLE_PLATFORM_LINK,
  imageInput: true,
};

// Gemini 2.0 Pro Experimental
const GEMINI_2_0_PRO_EXPERIMENTAL: LLM = {
  modelId: "gemini-2.0-pro-experimental",
  modelName: "Gemini 2.0 Pro Experimental",
  provider: "google",
  hostedId: "gemini-2.0-pro-experimental",
  platformLink: GOOGLE_PLATFORM_LINK,
  imageInput: true,
};

// Gemini 2.0 Flash Thinking Experimental
const GEMINI_2_0_FLASH_THINKING_EXPERIMENTAL: LLM = {
  modelId: "gemini-2.0-flash-thinking-experimental",
  modelName: "Gemini 2.0 Flash Thinking Experimental",
  provider: "google",
  hostedId: "gemini-2.0-flash-thinking-experimental",
  platformLink: GOOGLE_PLATFORM_LINK,
  imageInput: true,
};

// Gemma 2
const GEMMA_2: LLM = {
  modelId: "gemma-2",
  modelName: "Gemma 2",
  provider: "google",
  hostedId: "gemma-2",
  platformLink: GOOGLE_PLATFORM_LINK,
  imageInput: false,
};

// PaliGemma 2
const PALIGEMMA_2: LLM = {
  modelId: "paligemma-2",
  modelName: "PaliGemma 2",
  provider: "google",
  hostedId: "paligemma-2",
  platformLink: GOOGLE_PLATFORM_LINK,
  imageInput: true,
};

// PaliGemma 2 Mix
const PALIGEMMA_2_MIX: LLM = {
  modelId: "paligemma-2-mix",
  modelName: "PaliGemma 2 Mix",
  provider: "google",
  hostedId: "paligemma-2-mix",
  platformLink: GOOGLE_PLATFORM_LINK,
  imageInput: true,
};

export const GOOGLE_LLM_LIST: LLM[] = [
  T5,
  GEMINI_NANO,
  GEMINI_PRO,
  GEMINI_ULTRA,
  GEMINI_1_5_FLASH,
  GEMINI_1_5_PRO,
  GEMINI_2_0_FLASH,
  GEMINI_2_0_FLASH_LITE,
  GEMINI_2_0_PRO_EXPERIMENTAL,
  GEMINI_2_0_FLASH_THINKING_EXPERIMENTAL,
  GEMMA_2,
  PALIGEMMA_2,
  PALIGEMMA_2_MIX,
];
