// Los modelos que genAI ofrece. La interfaz los muestra y /api/chat rechaza
// cualquier otro: es la única lista, para que no se desfasen.
// IDs, contexto y precio por 1K tokens según el catálogo público de Vercel AI
// Gateway (https://ai-gateway.vercel.sh/v1/models) al 24 nov 2026. Criterio: la
// generación actual de cada proveedor a precio estándar, sin vistas previas,
// betas ni nombres en clave (son los que desaparecen del catálogo).
export const LLM_CONFIG = {
  claude: { name: 'Claude Opus 5.5', modelId: 'anthropic/claude-opus-5.5', color: '#D4A574', bgColor: '#FDF6E3', context: '1M', inputPrice: 0.004, outputPrice: 0.02, inGroup: true },
  'claude-sonnet': { name: 'Claude Sonnet 5.5', modelId: 'anthropic/claude-sonnet-5.5', color: '#D4A574', bgColor: '#FDF6E3', context: '1M', inputPrice: 0.002, outputPrice: 0.01, inGroup: false },
  gpt: { name: 'GPT-5.5', modelId: 'openai/gpt-5.5', color: '#10A37F', bgColor: '#E6F7F1', context: '1M', inputPrice: 0.005, outputPrice: 0.03, inGroup: true },
  gemini: { name: 'Gemini 3.8 Flash', modelId: 'google/gemini-3.8-flash', color: '#4285F4', bgColor: '#E8F0FE', context: '1M', inputPrice: 0.00075, outputPrice: 0.00375, inGroup: true },
  'gemini-thinking': { name: 'Gemini 2.5 Pro', modelId: 'google/gemini-2.5-pro', color: '#EA4335', bgColor: '#FEE8E6', context: '1M', inputPrice: 0.00125, outputPrice: 0.01, inGroup: false },
  'gemini-stable': { name: 'Gemini 3.5 Flash Lite', modelId: 'google/gemini-3.5-flash-lite', color: '#34A853', bgColor: '#E6F7ED', context: '1M', inputPrice: 0.0003, outputPrice: 0.0025, inGroup: false },
  perplexity: { name: 'Sonar', modelId: 'perplexity/sonar', color: '#20B2AA', bgColor: '#E6F7F6', context: '127K', inputPrice: 0.00025, outputPrice: 0.0025, inGroup: false },
  deepseek: { name: 'DeepSeek V4 Pro', modelId: 'deepseek/deepseek-v4-pro', color: '#4F46E5', bgColor: '#EEF2FF', context: '1M', inputPrice: 0.00132, outputPrice: 0.00396, inGroup: false },
  grok: { name: 'Grok 4.7', modelId: 'spacexai/grok-4.7', color: '#000000', bgColor: '#F5F5F5', context: '500K', inputPrice: 0.002, outputPrice: 0.006, inGroup: true },
  kimi: { name: 'Kimi K3.1 Pro', modelId: 'moonshotai/kimi-k3.1-pro', color: '#7C3AED', bgColor: '#F3E8FF', context: '1M', inputPrice: 0.002, outputPrice: 0.01, inGroup: false }
};

export const ALLOWED_MODELS = Object.values(LLM_CONFIG).map((config) => config.modelId);
