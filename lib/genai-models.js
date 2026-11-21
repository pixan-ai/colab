// Los modelos que genAI ofrece. La interfaz los muestra y /api/chat rechaza
// cualquier otro: es la única lista, para que no se desfasen.
// Actualizado Dic 22, 2025
export const LLM_CONFIG = {
  claude: { name: 'Claude Opus 4.5', modelId: 'anthropic/claude-opus-4-5', color: '#D4A574', bgColor: '#FDF6E3', context: '200K', inputPrice: 0.005, outputPrice: 0.025, inGroup: true },
  'claude-sonnet': { name: 'Claude Sonnet 4.5', modelId: 'anthropic/claude-sonnet-4.5', color: '#D4A574', bgColor: '#FDF6E3', context: '200K', inputPrice: 0.003, outputPrice: 0.015, inGroup: false },
  gpt: { name: 'GPT-5.2', modelId: 'openai/gpt-5.2', color: '#10A37F', bgColor: '#E6F7F1', context: '400K', inputPrice: 0.00175, outputPrice: 0.014, inGroup: true },
  gemini: { name: 'Gemini 3 Flash', modelId: 'google/gemini-3-flash-preview', color: '#4285F4', bgColor: '#E8F0FE', context: '1M', inputPrice: 0.0005, outputPrice: 0.003, inGroup: true },
  'gemini-thinking': { name: 'Gemini Flash Thinking', modelId: 'google/gemini-2.0-flash-thinking-exp-1219', color: '#EA4335', bgColor: '#FEE8E6', context: '32K', inputPrice: 0.0005, outputPrice: 0.003, inGroup: false },
  'gemini-stable': { name: 'Gemini 2.5 Flash', modelId: 'google/gemini-2.5-flash', color: '#34A853', bgColor: '#E6F7ED', context: '1M', inputPrice: 0.0005, outputPrice: 0.003, inGroup: false },
  perplexity: { name: 'Sonar Pro', modelId: 'perplexity/sonar-pro', color: '#20B2AA', bgColor: '#E6F7F6', context: '200K', inputPrice: 0.002, outputPrice: 0.002, inGroup: false },
  deepseek: { name: 'DeepSeek v3.2', modelId: 'deepseek/deepseek-v3.2-exp-thinking', color: '#4F46E5', bgColor: '#EEF2FF', context: '164K', inputPrice: 0.00028, outputPrice: 0.00042, inGroup: false },
  grok: { name: 'Grok 4.1', modelId: 'xai/grok-4.1-fast-reasoning', color: '#000000', bgColor: '#F5F5F5', context: '2M', inputPrice: 0.0002, outputPrice: 0.0005, inGroup: true },
  kimi: { name: 'Kimi K2', modelId: 'moonshotai/kimi-k2-thinking', color: '#7C3AED', bgColor: '#F3E8FF', context: '262K', inputPrice: 0.0006, outputPrice: 0.0025, inGroup: false }
};

export const ALLOWED_MODELS = Object.values(LLM_CONFIG).map((config) => config.modelId);
