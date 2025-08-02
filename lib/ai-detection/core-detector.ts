/**
 * Core AI Detection Engine
 * Advanced algorithms for detecting AI bots with high confidence
 */

import { AI_BOT_PATTERNS, AI_REFERRER_PATTERNS, findBotByPattern, type BotPattern } from './bot-patterns';

export interface DetectionResult {
  isBot: boolean;
  botType: string | null;
  confidence: number;
  method: 'user_agent_primary' | 'user_agent_suspicious' | 'behavioral_analysis' | 'referrer_analysis' | 'header_analysis';
  evidence: string[];
  category?: BotPattern['category'];
}

export interface RequestContext {
  userAgent: string;
  headers: Record<string, string>;
  url: string;
  ip: string;
  referrer: string;
  timestamp: number;
}

export class CoreAIDetector {
  private suspicionThreshold = 0.6;
  private highConfidenceThreshold = 0.85;

  /**
   * Main detection method - analyzes all available signals
   */
  async detectAI(context: RequestContext): Promise<DetectionResult> {
    // Primary user agent detection
    const userAgentResult = this.analyzeUserAgent(context.userAgent);
    if (userAgentResult.isBot && userAgentResult.confidence >= this.highConfidenceThreshold) {
      return userAgentResult;
    }

    // Referrer analysis for AI platform detection
    const referrerResult = this.analyzeReferrer(context.referrer);
    if (referrerResult.isBot && referrerResult.confidence >= this.highConfidenceThreshold) {
      return referrerResult;
    }

    // Header analysis for suspicious patterns
    const headerResult = this.analyzeHeaders(context.headers, context.userAgent);
    if (headerResult.isBot && headerResult.confidence >= this.suspicionThreshold) {
      return headerResult;
    }

    // Behavioral analysis
    const behavioralResult = this.analyzeBehavioralPatterns(context);
    if (behavioralResult.isBot && behavioralResult.confidence >= this.suspicionThreshold) {
      return behavioralResult;
    }

    // Return best result or no detection
    const results = [userAgentResult, referrerResult, headerResult, behavioralResult];
    const bestResult = results.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );

    return bestResult.confidence >= this.suspicionThreshold ? bestResult : {
      isBot: false,
      botType: null,
      confidence: 0,
      method: 'user_agent_primary',
      evidence: []
    };
  }

  /**
   * Analyze user agent string for AI bot patterns
   */
  private analyzeUserAgent(userAgent: string): DetectionResult {
    const userAgentLower = userAgent.toLowerCase();
    const evidence: string[] = [];

    // Check against comprehensive bot patterns
    const matchedBot = findBotByPattern(userAgent);
    if (matchedBot) {
      evidence.push(`Matched AI bot pattern: ${matchedBot.name}`);
      evidence.push(`User-Agent: ${userAgent}`);
      
      return {
        isBot: true,
        botType: matchedBot.name,
        confidence: matchedBot.confidence,
        method: 'user_agent_primary',
        evidence,
        category: matchedBot.category
      };
    }

    // Additional suspicious patterns not in main database
    const suspiciousKeywords = [
      'bot', 'crawler', 'spider', 'scraper', 'fetcher', 'harvester',
      'python', 'requests', 'urllib', 'httpx', 'curl', 'wget',
      'headless', 'phantom', 'selenium', 'puppeteer', 'playwright'
    ];

    let suspicionScore = 0;
    const foundKeywords: string[] = [];

    for (const keyword of suspiciousKeywords) {
      if (userAgentLower.includes(keyword)) {
        suspicionScore += 0.2;
        foundKeywords.push(keyword);
      }
    }

    if (foundKeywords.length > 0) {
      evidence.push(`Suspicious keywords found: ${foundKeywords.join(', ')}`);
      evidence.push(`User-Agent: ${userAgent}`);
    }

    // Very short or very long user agents are suspicious
    if (userAgent.length < 20) {
      suspicionScore += 0.3;
      evidence.push(`Unusually short user agent (${userAgent.length} chars)`);
    } else if (userAgent.length > 500) {
      suspicionScore += 0.2;
      evidence.push(`Unusually long user agent (${userAgent.length} chars)`);
    }

    return {
      isBot: suspicionScore >= this.suspicionThreshold,
      botType: suspicionScore >= this.suspicionThreshold ? 'Suspicious_AI_Bot' : null,
      confidence: Math.min(suspicionScore, 0.95),
      method: 'user_agent_suspicious',
      evidence
    };
  }

  /**
   * Analyze referrer for AI platform indicators
   */
  private analyzeReferrer(referrer: string): DetectionResult {
    if (!referrer) {
      return {
        isBot: false,
        botType: null,
        confidence: 0,
        method: 'referrer_analysis',
        evidence: []
      };
    }

    const referrerLower = referrer.toLowerCase();
    const evidence: string[] = [];

    // Check against known AI platform referrers
    for (const aiReferrer of AI_REFERRER_PATTERNS) {
      if (referrerLower.includes(aiReferrer.toLowerCase())) {
        evidence.push(`AI platform referrer detected: ${aiReferrer}`);
        evidence.push(`Referrer: ${referrer}`);
        
        // Determine bot type from referrer
        let botType = 'AI_Platform_User';
        if (aiReferrer.includes('openai') || aiReferrer.includes('chatgpt')) botType = 'ChatGPT';
        else if (aiReferrer.includes('claude')) botType = 'Claude';
        else if (aiReferrer.includes('perplexity')) botType = 'Perplexity';
        else if (aiReferrer.includes('bard') || aiReferrer.includes('google')) botType = 'Gemini';
        else if (aiReferrer.includes('copilot') || aiReferrer.includes('microsoft')) botType = 'Copilot';

        return {
          isBot: true,
          botType,
          confidence: 0.90,
          method: 'referrer_analysis',
          evidence,
          category: 'ai_assistant'
        };
      }
    }

    return {
      isBot: false,
      botType: null,
      confidence: 0,
      method: 'referrer_analysis',
      evidence
    };
  }

  /**
   * Analyze HTTP headers for suspicious patterns
   */
  private analyzeHeaders(headers: Record<string, string>, userAgent: string): DetectionResult {
    const evidence: string[] = [];
    let suspicionScore = 0;

    // Check for missing common browser headers
    const expectedHeaders = [
      'accept',
      'accept-language',
      'accept-encoding',
      'cache-control',
      'connection'
    ];

    const missingHeaders: string[] = [];
    for (const header of expectedHeaders) {
      if (!headers[header] && !headers[header.toLowerCase()]) {
        missingHeaders.push(header);
        suspicionScore += 0.15;
      }
    }

    if (missingHeaders.length > 0) {
      evidence.push(`Missing common browser headers: ${missingHeaders.join(', ')}`);
    }

    // Check for unusual Accept header patterns
    const accept = headers['accept'] || headers['Accept'] || '';
    if (accept.includes('application/json') && !accept.includes('text/html')) {
      suspicionScore += 0.3;
      evidence.push('API-like Accept header in browser context');
    }

    // Check for simplified Accept-Language
    const acceptLanguage = headers['accept-language'] || headers['Accept-Language'] || '';
    if (!acceptLanguage || acceptLanguage === 'en' || acceptLanguage.split(',').length === 1) {
      suspicionScore += 0.2;
      evidence.push('Simplified or missing Accept-Language header');
    }

    // Check for Mozilla user agent with missing browser headers
    if (userAgent.includes('Mozilla') && missingHeaders.includes('accept-language')) {
      suspicionScore += 0.3;
      evidence.push('Mozilla user agent with missing browser-specific headers');
    }

    // Check for unusual Connection header
    const connection = headers['connection'] || headers['Connection'] || '';
    if (connection.toLowerCase() === 'close' && userAgent.includes('Mozilla')) {
      suspicionScore += 0.2;
      evidence.push('Unusual Connection: close header for browser-like user agent');
    }

    return {
      isBot: suspicionScore >= this.suspicionThreshold,
      botType: suspicionScore >= this.suspicionThreshold ? 'Header_Analysis_Bot' : null,
      confidence: Math.min(suspicionScore, 0.85),
      method: 'header_analysis',
      evidence
    };
  }

  /**
   * Analyze behavioral patterns for AI detection
   */
  private analyzeBehavioralPatterns(context: RequestContext): DetectionResult {
    const evidence: string[] = [];
    let suspicionScore = 0;

    // Check for unusual URL patterns
    const url = context.url.toLowerCase();
    const aiQueryIndicators = [
      'ai-summary', 'chatgpt', 'claude', 'perplexity', 'ai-query',
      'llm-request', 'ai-crawl', 'bot-refresh', 'ai-content'
    ];

    for (const indicator of aiQueryIndicators) {
      if (url.includes(indicator)) {
        suspicionScore += 0.4;
        evidence.push(`AI-specific URL parameter detected: ${indicator}`);
      }
    }

    // Check for rapid sequential access patterns (would need session tracking)
    // This is a placeholder for more advanced behavioral analysis
    const currentTime = context.timestamp;
    // TODO: Implement session-based rapid access detection

    // Check for unusual IP patterns (would need geographic analysis)
    // TODO: Implement IP clustering and geographic analysis

    // Check for missing referer on non-root access
    if (!context.referrer && !context.url.endsWith('/') && !context.url.includes('?')) {
      suspicionScore += 0.1;
      evidence.push('Missing referrer on non-root page access');
    }

    return {
      isBot: suspicionScore >= this.suspicionThreshold,
      botType: suspicionScore >= this.suspicionThreshold ? 'Behavioral_AI_Bot' : null,
      confidence: Math.min(suspicionScore, 0.80),
      method: 'behavioral_analysis',
      evidence
    };
  }

  /**
   * Get detection statistics
   */
  getDetectionStats() {
    return {
      totalPatterns: AI_BOT_PATTERNS.length,
      totalBotTypes: AI_BOT_PATTERNS.length,
      referrerPatterns: AI_REFERRER_PATTERNS.length,
      suspicionThreshold: this.suspicionThreshold,
      highConfidenceThreshold: this.highConfidenceThreshold
    };
  }

  /**
   * Update detection thresholds
   */
  updateThresholds(suspicion: number, highConfidence: number) {
    this.suspicionThreshold = Math.max(0.1, Math.min(0.9, suspicion));
    this.highConfidenceThreshold = Math.max(0.7, Math.min(0.99, highConfidence));
  }
}
