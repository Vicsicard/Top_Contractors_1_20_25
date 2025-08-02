/**
 * Comprehensive AI Bot Pattern Database
 * 100+ AI bot signatures for maximum detection coverage
 */

export interface BotPattern {
  name: string;
  patterns: string[];
  confidence: number;
  category: 'ai_assistant' | 'search_ai' | 'content_ai' | 'coding_ai' | 'generic_ai';
  description: string;
}

export const AI_BOT_PATTERNS: BotPattern[] = [
  // OpenAI/ChatGPT Family
  {
    name: 'ChatGPT',
    patterns: [
      'gptbot', 'chatgpt', 'openai', 'gpt-3', 'gpt-4', 'gpt-crawler',
      'openai-crawler', 'chatgpt-user', 'openaibot', 'gpt-4-turbo',
      'gpt-3.5-turbo', 'openai-gpt', 'chatgpt-api', 'openai-api'
    ],
    confidence: 0.98,
    category: 'ai_assistant',
    description: 'OpenAI ChatGPT and GPT model crawlers'
  },

  // Anthropic/Claude Family
  {
    name: 'Claude',
    patterns: [
      'claude', 'anthropic', 'claude-web', 'anthropic-ai', 'claude-bot',
      'anthropic-crawler', 'claude-crawler', 'claude-2', 'claude-3',
      'anthropic-api', 'claude-api', 'claude-instant'
    ],
    confidence: 0.98,
    category: 'ai_assistant',
    description: 'Anthropic Claude AI assistant crawlers'
  },

  // Perplexity AI
  {
    name: 'Perplexity',
    patterns: [
      'perplexity', 'perplexitybot', 'perplexity-ai', 'perplexity-crawler',
      'perplexity-search', 'perplexity-api', 'pplx-bot'
    ],
    confidence: 0.98,
    category: 'search_ai',
    description: 'Perplexity AI search and answer engine'
  },

  // Google AI (Gemini/Bard)
  {
    name: 'Gemini',
    patterns: [
      'gemini', 'bard', 'google-ai', 'gemini-pro', 'bard-ai',
      'google-gemini', 'bardbot', 'gemini-api', 'google-bard',
      'gemini-ultra', 'gemini-nano'
    ],
    confidence: 0.95,
    category: 'ai_assistant',
    description: 'Google Gemini and Bard AI systems'
  },

  // Microsoft AI (Copilot)
  {
    name: 'Copilot',
    patterns: [
      'copilot', 'bing-ai', 'microsoft-ai', 'copilot-crawler',
      'bing-copilot', 'edge-copilot', 'microsoft-copilot',
      'copilot-api', 'bing-chat', 'sydney-bot'
    ],
    confidence: 0.95,
    category: 'ai_assistant',
    description: 'Microsoft Copilot and Bing AI'
  },

  // You.com AI
  {
    name: 'You.com',
    patterns: [
      'you.com', 'youbot', 'you-ai', 'you-search', 'you-chat',
      'youcom-bot', 'you-crawler'
    ],
    confidence: 0.90,
    category: 'search_ai',
    description: 'You.com AI search engine'
  },

  // Phind AI
  {
    name: 'Phind',
    patterns: [
      'phind', 'phindbot', 'phind-ai', 'phind-search', 'phind-crawler'
    ],
    confidence: 0.90,
    category: 'coding_ai',
    description: 'Phind AI coding assistant'
  },

  // Character.AI
  {
    name: 'Character.AI',
    patterns: [
      'character.ai', 'characterai', 'character-ai', 'cai-bot',
      'character-bot', 'characterai-crawler'
    ],
    confidence: 0.90,
    category: 'ai_assistant',
    description: 'Character.AI conversational AI'
  },

  // Poe (Quora)
  {
    name: 'Poe',
    patterns: [
      'poe.com', 'poebot', 'poe-ai', 'quora-poe', 'poe-crawler',
      'poe-api'
    ],
    confidence: 0.90,
    category: 'ai_assistant',
    description: 'Quora Poe AI platform'
  },

  // Jasper AI
  {
    name: 'Jasper',
    patterns: [
      'jasper', 'jasperbot', 'jasper-ai', 'jasper-crawler',
      'jasper-api', 'jarvis-ai'
    ],
    confidence: 0.85,
    category: 'content_ai',
    description: 'Jasper AI content generation'
  },

  // Copy.ai
  {
    name: 'Copy.ai',
    patterns: [
      'copy.ai', 'copyai', 'copy-ai', 'copyai-bot', 'copy-crawler'
    ],
    confidence: 0.85,
    category: 'content_ai',
    description: 'Copy.ai content generation'
  },

  // Writesonic
  {
    name: 'Writesonic',
    patterns: [
      'writesonic', 'writesonicbot', 'writesonic-ai', 'writesonic-crawler'
    ],
    confidence: 0.85,
    category: 'content_ai',
    description: 'Writesonic AI writing assistant'
  },

  // Rytr
  {
    name: 'Rytr',
    patterns: [
      'rytr', 'rytrbot', 'rytr-ai', 'rytr-crawler'
    ],
    confidence: 0.85,
    category: 'content_ai',
    description: 'Rytr AI writing tool'
  },

  // Notion AI
  {
    name: 'Notion AI',
    patterns: [
      'notion-ai', 'notionbot', 'notion-crawler', 'notion-api'
    ],
    confidence: 0.85,
    category: 'content_ai',
    description: 'Notion AI writing assistant'
  },

  // Grammarly AI
  {
    name: 'Grammarly',
    patterns: [
      'grammarly', 'grammarlybot', 'grammarly-ai', 'grammarly-crawler'
    ],
    confidence: 0.80,
    category: 'content_ai',
    description: 'Grammarly AI writing assistant'
  },

  // GitHub Copilot
  {
    name: 'GitHub Copilot',
    patterns: [
      'github-copilot', 'copilot-github', 'gh-copilot', 'github-ai'
    ],
    confidence: 0.90,
    category: 'coding_ai',
    description: 'GitHub Copilot code assistant'
  },

  // Replit AI
  {
    name: 'Replit AI',
    patterns: [
      'replit-ai', 'replitbot', 'replit-crawler', 'ghostwriter-ai'
    ],
    confidence: 0.85,
    category: 'coding_ai',
    description: 'Replit AI coding assistant'
  },

  // Codeium
  {
    name: 'Codeium',
    patterns: [
      'codeium', 'codeiumbot', 'codeium-ai', 'codeium-crawler'
    ],
    confidence: 0.85,
    category: 'coding_ai',
    description: 'Codeium AI code completion'
  },

  // TabNine
  {
    name: 'TabNine',
    patterns: [
      'tabnine', 'tabninebot', 'tabnine-ai', 'tabnine-crawler'
    ],
    confidence: 0.85,
    category: 'coding_ai',
    description: 'TabNine AI code completion'
  },

  // Hugging Face
  {
    name: 'Hugging Face',
    patterns: [
      'huggingface', 'hf-bot', 'hugging-face', 'transformers-bot',
      'hf-crawler', 'huggingface-api'
    ],
    confidence: 0.80,
    category: 'generic_ai',
    description: 'Hugging Face AI models'
  },

  // Generic AI Patterns
  {
    name: 'Generic AI Bot',
    patterns: [
      'ai-bot', 'aibot', 'artificial-intelligence', 'machine-learning',
      'neural-network', 'deep-learning', 'llm-bot', 'language-model',
      'ai-crawler', 'ai-scraper', 'ai-agent', 'chatbot', 'voicebot',
      'textbot', 'smartbot', 'autobot', 'robo-', 'bot-ai',
      'ai-assistant', 'virtual-assistant', 'conversational-ai'
    ],
    confidence: 0.70,
    category: 'generic_ai',
    description: 'Generic AI bot patterns'
  },

  // Suspicious Automation Patterns
  {
    name: 'Suspicious Bot',
    patterns: [
      'headless', 'phantom', 'selenium', 'puppeteer', 'playwright',
      'chrome-headless', 'firefox-headless', 'automation', 'scraper',
      'crawler', 'spider', 'fetcher', 'harvester', 'extractor',
      'python-requests', 'urllib', 'httpx', 'aiohttp', 'scrapy',
      'beautifulsoup', 'requests-html', 'mechanize', 'api-client',
      'rest-client', 'http-client', 'web-client', 'curl/', 'wget/',
      'postman', 'insomnia'
    ],
    confidence: 0.60,
    category: 'generic_ai',
    description: 'Suspicious automation and scraping patterns'
  }
];

// AI Platform Referrer Patterns
export const AI_REFERRER_PATTERNS = [
  'chat.openai.com',
  'claude.ai',
  'perplexity.ai',
  'bard.google.com',
  'copilot.microsoft.com',
  'you.com',
  'phind.com',
  'character.ai',
  'poe.com',
  'jasper.ai',
  'copy.ai',
  'writesonic.com',
  'rytr.me',
  'notion.so',
  'grammarly.com',
  'github.com/features/copilot',
  'replit.com',
  'codeium.com',
  'tabnine.com',
  'huggingface.co'
];

// Export helper functions
export function getAllPatterns(): string[] {
  return AI_BOT_PATTERNS.flatMap(bot => bot.patterns);
}

export function getPatternsByCategory(category: BotPattern['category']): BotPattern[] {
  return AI_BOT_PATTERNS.filter(bot => bot.category === category);
}

export function findBotByPattern(pattern: string): BotPattern | null {
  return AI_BOT_PATTERNS.find(bot => 
    bot.patterns.some(p => pattern.toLowerCase().includes(p.toLowerCase()))
  ) || null;
}
