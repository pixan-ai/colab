// Los modelos que genAI ofrece. La interfaz los muestra y /api/chat rechaza
// cualquier otro: es la única lista, para que no se desfasen.
// IDs, contexto y precio por 1K tokens según el catálogo público de Vercel AI
// Gateway (https://ai-gateway.vercel.sh/v1/models) al 21 nov 2026.
export const LLM_CONFIG = {
  claude: { name: 'Claude Opus 4.5', modelId: 'anthropic/claude-opus-4.5', color: '#D4A574', bgColor: '#FDF6E3', context: '200K', inputPrice: 0.005, outputPrice: 0.025, inGroup: true },
  'claude-sonnet': { name: 'Claude Sonnet 4.5', modelId: 'anthropic/claude-sonnet-4.5', color: '#D4A574', bgColor: '#FDF6E3', context: '1M', inputPrice: 0.003, outputPrice: 0.015, inGroup: false },
  gpt: { name: 'GPT-5.2', modelId: 'openai/gpt-5.2', color: '#10A37F', bgColor: '#E6F7F1', context: '400K', inputPrice: 0.00175, outputPrice: 0.014, inGroup: true },
  gemini: { name: 'Gemini 3 Flash', modelId: 'google/gemini-3-flash', color: '#4285F4', bgColor: '#E8F0FE', context: '1M', inputPrice: 0.0005, outputPrice: 0.003, inGroup: true },
  'gemini-thinking': { name: 'Gemini 3.8 Flash', modelId: 'google/gemini-3.8-flash', color: '#EA4335', bgColor: '#FEE8E6', context: '1M', inputPrice: 0.00075, outputPrice: 0.00375, inGroup: false },
  'gemini-stable': { name: 'Gemini 2.5 Flash', modelId: 'google/gemini-2.5-flash', color: '#34A853', bgColor: '#E6F7ED', context: '1M', inputPrice: 0.0003, outputPrice: 0.0025, inGroup: false },
  perplexity: { name: 'Sonar', modelId: 'perplexity/sonar', color: '#20B2AA', bgColor: '#E6F7F6', context: '127K', inputPrice: 0.00025, outputPrice: 0.0025, inGroup: false },
  deepseek: { name: 'DeepSeek v3.2', modelId: 'deepseek/deepseek-v3.2-thinking', color: '#4F46E5', bgColor: '#EEF2FF', context: '128K', inputPrice: 0.00062, outputPrice: 0.00185, inGroup: false },
  grok: { name: 'Grok 4.20', modelId: 'spacexai/grok-4.20-reasoning', color: '#000000', bgColor: '#F5F5F5', context: '2M', inputPrice: 0.00125, outputPrice: 0.0025, inGroup: true },
  kimi: { name: 'Kimi K2.5', modelId: 'moonshotai/kimi-k2.5', color: '#7C3AED', bgColor: '#F3E8FF', context: '256K', inputPrice: 0.0006, outputPrice: 0.003, inGroup: false }
};

export const ALLOWED_MODELS = Object.values(LLM_CONFIG).map((config) => config.modelId);
