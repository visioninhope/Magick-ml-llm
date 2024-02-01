import {
  alephAlphaModelsArray,
  anthropicModelsArray,
  anyscaleModelsArray,
  baseTenModelsArray,
  bedrockModelsArray,
  deepInfraChatModelsArray,
  openRouterModelsArray,
  perplexityAIModelsArray,
  petalsModelsArray,
  sageMakerModelsArray,
  togetherAIModelsArray,
  vllmModelsArray,
  voyageAIModelsArray,
  xinferenceModelsArray,
  cloudflareWorkersAIModelsArray,
  ai21ModelsArray,
  nlpCloudModelsArray,
  vertexAIGoogleModelsArray,
  huggingFaceModelsWithPromptFormattingArray,
  mistralAIModelsArray,
  replicateModelsArray,
  palmModelsArray,
  allOllamaModelsArray,
  googleAIStudioModelsArray,
  allOpenAICompletionModelsArray,
} from '../constants/completionModelArrays'
import {
  openAIEmbeddingModelsArray,
  bedrockEmbeddingModelsArray,
  cohereEmbeddingModelsArray,
  huggingFaceEmbeddingModelsArray,
  voyageEmbeddingModelsArray,
  mistralEmbeddingModelsArray,
} from '../constants/embeddingModelArrays'

import {
  LLMProviderDisplayNames,
  LLMProviderKeys,
  LLMProviders,
  LLMProviderPrefixes,
  ProviderRecord,
} from './providerTypes'

export const providers: Record<LLMProviders, ProviderRecord> = {
  [LLMProviders.OpenAI]: {
    provider: LLMProviders.OpenAI,
    displayName: LLMProviderDisplayNames.OpenAI,
    keyName: LLMProviderKeys.OpenAI,
    completionModels: allOpenAICompletionModelsArray, // Add the specific models here
    embeddingModels: openAIEmbeddingModelsArray,
    allModels: [
      ...allOpenAICompletionModelsArray,
      ...openAIEmbeddingModelsArray,
    ],
    vendorModelPrefix: '',
  },
  [LLMProviders.Azure]: {
    provider: LLMProviders.Azure,
    displayName: LLMProviderDisplayNames.Azure,
    keyName: LLMProviderKeys.Azure,
    completionModels: [],
    embeddingModels: [],
    allModels: [],
    vendorModelPrefix: LLMProviderPrefixes.Azure,
  },
  [LLMProviders.Anthropic]: {
    provider: LLMProviders.Anthropic,
    displayName: LLMProviderDisplayNames.Anthropic,
    keyName: LLMProviderKeys.Anthropic,
    completionModels: anthropicModelsArray,
    embeddingModels: [],
    allModels: anthropicModelsArray,
    vendorModelPrefix: '',
  },
  [LLMProviders.Sagemaker]: {
    provider: LLMProviders.Sagemaker,
    displayName: LLMProviderDisplayNames.Sagemaker,
    keyName: LLMProviderKeys.Sagemaker,
    completionModels: sageMakerModelsArray,
    embeddingModels: [],
    allModels: sageMakerModelsArray,
    vendorModelPrefix: LLMProviderPrefixes.Sagemaker,
  },
  [LLMProviders.Bedrock]: {
    provider: LLMProviders.Bedrock,
    displayName: LLMProviderDisplayNames.Bedrock,
    keyName: LLMProviderKeys.Bedrock,
    completionModels: bedrockModelsArray,
    embeddingModels: bedrockEmbeddingModelsArray,
    allModels: [...bedrockModelsArray, ...bedrockEmbeddingModelsArray],
    vendorModelPrefix: LLMProviderPrefixes.Bedrock,
  },
  [LLMProviders.Anyscale]: {
    provider: LLMProviders.Anyscale,
    displayName: LLMProviderDisplayNames.Anyscale,
    keyName: LLMProviderKeys.Anyscale,
    completionModels: anyscaleModelsArray,
    embeddingModels: [],
    allModels: anyscaleModelsArray,
    vendorModelPrefix: LLMProviderPrefixes.Anyscale,
  },
  [LLMProviders.PerplexityAI]: {
    provider: LLMProviders.PerplexityAI,
    displayName: LLMProviderDisplayNames.PerplexityAI,
    keyName: LLMProviderKeys.PerplexityAI,
    completionModels: perplexityAIModelsArray,
    embeddingModels: [],
    allModels: perplexityAIModelsArray,
    vendorModelPrefix: LLMProviderPrefixes.PerplexityAI,
  },
  [LLMProviders.VLLM]: {
    provider: LLMProviders.VLLM,
    displayName: LLMProviderDisplayNames.VLLM,
    keyName: LLMProviderKeys.VLLM,
    completionModels: vllmModelsArray,
    embeddingModels: [],
    allModels: vllmModelsArray,
    vendorModelPrefix: LLMProviderPrefixes.VLLM,
  },
  [LLMProviders.DeepInfra]: {
    provider: LLMProviders.DeepInfra,
    displayName: LLMProviderDisplayNames.DeepInfra,
    keyName: LLMProviderKeys.DeepInfra,
    completionModels: deepInfraChatModelsArray,
    embeddingModels: [],
    allModels: deepInfraChatModelsArray,
    vendorModelPrefix: LLMProviderPrefixes.DeepInfra,
  },
  [LLMProviders.Cohere]: {
    provider: LLMProviders.Cohere,
    displayName: LLMProviderDisplayNames.Cohere,
    keyName: LLMProviderKeys.Cohere,
    completionModels: [],
    embeddingModels: cohereEmbeddingModelsArray,
    allModels: cohereEmbeddingModelsArray,
    vendorModelPrefix: '',
  },
  [LLMProviders.TogetherAI]: {
    provider: LLMProviders.TogetherAI,
    displayName: LLMProviderDisplayNames.TogetherAI,
    keyName: LLMProviderKeys.TogetherAI,
    completionModels: togetherAIModelsArray,
    embeddingModels: [],
    allModels: togetherAIModelsArray,
    vendorModelPrefix: LLMProviderPrefixes.TogetherAI,
  },
  [LLMProviders.AlephAlpha]: {
    provider: LLMProviders.AlephAlpha,
    displayName: LLMProviderDisplayNames.AlephAlpha,
    keyName: LLMProviderKeys.AlephAlpha,
    completionModels: alephAlphaModelsArray,
    embeddingModels: [],
    allModels: alephAlphaModelsArray,
    vendorModelPrefix: '',
  },
  [LLMProviders.Baseten]: {
    provider: LLMProviders.Baseten,
    displayName: LLMProviderDisplayNames.Baseten,
    keyName: LLMProviderKeys.Baseten,
    completionModels: baseTenModelsArray,
    embeddingModels: [],
    allModels: baseTenModelsArray,
    vendorModelPrefix: LLMProviderPrefixes.Baseten,
  },
  [LLMProviders.OpenRouter]: {
    provider: LLMProviders.OpenRouter,
    displayName: LLMProviderDisplayNames.OpenRouter,
    keyName: LLMProviderKeys.OpenRouter,
    completionModels: openRouterModelsArray,
    embeddingModels: [],
    allModels: openRouterModelsArray,
    vendorModelPrefix: LLMProviderPrefixes.OpenRouter,
  },
  [LLMProviders.CustomAPI]: {
    provider: LLMProviders.CustomAPI,
    displayName: LLMProviderDisplayNames.CustomAPI,
    keyName: LLMProviderKeys.Unknown,
    completionModels: [],
    embeddingModels: [],
    allModels: [],
    vendorModelPrefix: '',
  },
  [LLMProviders.Petals]: {
    provider: LLMProviders.Petals,
    displayName: LLMProviderDisplayNames.Petals,
    keyName: LLMProviderKeys.Petals,
    completionModels: petalsModelsArray,
    embeddingModels: [],
    allModels: petalsModelsArray,
    vendorModelPrefix: LLMProviderPrefixes.Petals,
  },
  [LLMProviders.Ollama]: {
    provider: LLMProviders.Ollama,
    displayName: LLMProviderDisplayNames.Ollama,
    keyName: LLMProviderKeys.Ollama,
    completionModels: allOllamaModelsArray,
    embeddingModels: [],
    allModels: allOllamaModelsArray,
    vendorModelPrefix: '',
  },
  [LLMProviders.GoogleAIStudio]: {
    provider: LLMProviders.GoogleAIStudio,
    displayName: LLMProviderDisplayNames.GoogleAIStudio,
    keyName: LLMProviderKeys.GoogleAIStudio,
    completionModels: googleAIStudioModelsArray,
    embeddingModels: [],
    allModels: googleAIStudioModelsArray,
    vendorModelPrefix: LLMProviderPrefixes.GoogleAIStudio,
  },
  [LLMProviders.Palm]: {
    provider: LLMProviders.Palm,
    displayName: LLMProviderDisplayNames.Palm,
    keyName: LLMProviderKeys.Palm,
    completionModels: palmModelsArray,
    embeddingModels: [],
    allModels: palmModelsArray,
    vendorModelPrefix: LLMProviderPrefixes.Palm,
  },
  [LLMProviders.HuggingFace]: {
    provider: LLMProviders.HuggingFace,
    displayName: LLMProviderDisplayNames.HuggingFace,
    keyName: LLMProviderKeys.HuggingFace,
    completionModels: huggingFaceModelsWithPromptFormattingArray,
    embeddingModels: huggingFaceEmbeddingModelsArray,
    allModels: [
      ...huggingFaceModelsWithPromptFormattingArray,
      ...huggingFaceEmbeddingModelsArray,
    ],
    vendorModelPrefix: LLMProviderPrefixes.HuggingFace,
  },
  [LLMProviders.Xinference]: {
    provider: LLMProviders.Xinference,
    displayName: LLMProviderDisplayNames.Xinference,
    keyName: LLMProviderKeys.Xinference,
    completionModels: xinferenceModelsArray,
    embeddingModels: [],
    allModels: xinferenceModelsArray,
    vendorModelPrefix: LLMProviderPrefixes.Xinference,
  },
  [LLMProviders.CloudflareWorkersAI]: {
    provider: LLMProviders.CloudflareWorkersAI,
    displayName: LLMProviderDisplayNames.CloudflareWorkersAI,
    keyName: LLMProviderKeys.CloudflareWorkersAI,
    completionModels: cloudflareWorkersAIModelsArray,
    embeddingModels: [],
    allModels: cloudflareWorkersAIModelsArray,
    vendorModelPrefix: LLMProviderPrefixes.CloudflareWorkersAI,
  },
  [LLMProviders.AI21]: {
    provider: LLMProviders.AI21,
    displayName: LLMProviderDisplayNames.AI21,
    keyName: LLMProviderKeys.AI21,
    completionModels: ai21ModelsArray,
    embeddingModels: [],
    allModels: ai21ModelsArray,
    vendorModelPrefix: '',
  },
  [LLMProviders.NLPCloud]: {
    provider: LLMProviders.NLPCloud,
    displayName: LLMProviderDisplayNames.NLPCloud,
    keyName: LLMProviderKeys.NLPCloud,
    completionModels: nlpCloudModelsArray,
    embeddingModels: [],
    allModels: nlpCloudModelsArray,
    vendorModelPrefix: '',
  },
  [LLMProviders.VoyageAI]: {
    provider: LLMProviders.VoyageAI,
    displayName: LLMProviderDisplayNames.VoyageAI,
    keyName: LLMProviderKeys.VoyageAI,
    completionModels: voyageAIModelsArray,
    embeddingModels: voyageEmbeddingModelsArray,
    allModels: [...voyageAIModelsArray, ...voyageEmbeddingModelsArray],
    vendorModelPrefix: LLMProviderPrefixes.VoyageAI,
  },
  [LLMProviders.Replicate]: {
    provider: LLMProviders.Replicate,
    displayName: LLMProviderDisplayNames.Replicate,
    keyName: LLMProviderKeys.Replicate,
    completionModels: replicateModelsArray,
    embeddingModels: [],
    allModels: replicateModelsArray,
    vendorModelPrefix: LLMProviderPrefixes.Replicate,
  },
  [LLMProviders.Meta]: {
    provider: LLMProviders.Meta,
    displayName: LLMProviderDisplayNames.Meta,
    keyName: LLMProviderKeys.Meta,
    completionModels: [],
    embeddingModels: [],
    allModels: [],
    vendorModelPrefix: '',
  },
  [LLMProviders.Mistral]: {
    provider: LLMProviders.Mistral,
    displayName: LLMProviderDisplayNames.Mistral,
    keyName: LLMProviderKeys.Mistral,
    completionModels: mistralAIModelsArray,
    embeddingModels: mistralEmbeddingModelsArray,
    allModels: [...mistralAIModelsArray, ...mistralEmbeddingModelsArray],
    vendorModelPrefix: LLMProviderPrefixes.Mistral,
  },
  [LLMProviders.VertexAI]: {
    provider: LLMProviders.VertexAI,
    displayName: LLMProviderDisplayNames.VertexAI,
    keyName: LLMProviderKeys.VertexAI,
    completionModels: vertexAIGoogleModelsArray,
    embeddingModels: [],
    allModels: vertexAIGoogleModelsArray,
    vendorModelPrefix: '',
  },
  [LLMProviders.CustomOpenAI]: {
    provider: LLMProviders.CustomOpenAI,
    displayName: LLMProviderDisplayNames.CustomOpenAI,
    keyName: LLMProviderKeys.OpenAI,
    completionModels: allOpenAICompletionModelsArray,
    embeddingModels: [],
    allModels: allOpenAICompletionModelsArray,
    vendorModelPrefix: LLMProviderPrefixes.CustomOpenAI,
  },
}

export type ActiveProviders =
  | LLMProviders.OpenAI
  | LLMProviders.CustomOpenAI
  | LLMProviders.GoogleAIStudio
  | LLMProviders.TogetherAI
  | LLMProviders.Palm
// | LLMProviders.VertexAI

const activeProviders: ActiveProviders[] = [
  LLMProviders.OpenAI,
  LLMProviders.CustomOpenAI,
  LLMProviders.TogetherAI,
  LLMProviders.GoogleAIStudio,
  LLMProviders.Palm,
  // LLMProviders.VertexAI,
]

export const availableProviders = activeProviders.map(provider => {
  return providers[provider]
})
