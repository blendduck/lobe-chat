import { ModelProvider } from '@/libs/agent-runtime';
import { genUserLLMConfig } from '@/utils/genUserLLMConfig';

export const DEFAULT_LLM_CONFIG = genUserLLMConfig({
  lmstudio: {
    fetchOnClient: true,
  },
  ollama: {
    enabled: true,
    fetchOnClient: true,
  },
  openai: {
    enabled: true,
  },
});

/**
 * @patch
 * export const DEFAULT_MODEL = 'gpt-4o-mini';
 * export const DEFAULT_PROVIDER = ModelProvider.OpenAI;
 */
export const DEFAULT_MODEL = 'deepseek-r1';
export const DEFAULT_PROVIDER = 'qwen';

/**
 * @patch
 * export const DEFAULT_EMBEDDING_MODEL = 'text-embedding-3-small';
 * export const DEFAULT_EMBEDDING_PROVIDER = ModelProvider.OpenAI;
 */
export const DEFAULT_EMBEDDING_MODEL = 'embedding-3';
export const DEFAULT_EMBEDDING_PROVIDER = ModelProvider.ZhiPu;

export const DEFAULT_RERANK_MODEL = 'rerank-english-v3.0';
export const DEFAULT_RERANK_PROVIDER = 'cohere';
export const DEFAULT_RERANK_QUERY_MODE = 'full_text';
