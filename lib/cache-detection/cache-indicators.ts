/**
 * Cache-Aware AI Detection
 * Detects AI activity even when content is cached
 */

export interface CacheIndicator {
  type: 'ai_referrer' | 'cache_refresh' | 'rapid_access' | 'platform_signature';
  confidence: number;
  evidence: string[];
  timestamp: number;
}

export interface CacheDetectionResult {
  isCacheActivity: boolean;
  indicators: CacheIndicator[];
  totalConfidence: number;
  suggestedBotType: string | null;
}

export class CacheAwareDetector {
  private aiPlatformReferrers = [
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
    'grammarly.com'
  ];

  private cacheRefreshPatterns = [
    'if-modified-since',
    'if-none-match',
    'cache-control: no-cache',
    'cache-control: max-age=0',
    'pragma: no-cache'
  ];

  /**
   * Detect cache-related AI activity
   */
  detectCacheActivity(context: {
    referrer: string;
    headers: Record<string, string>;
    userAgent: string;
    url: string;
    timestamp: number;
    previousRequests?: Array<{url: string; timestamp: number}>;
  }): CacheDetectionResult {
    
    const indicators: CacheIndicator[] = [];
    
    // Check for AI platform referrers
    const referrerIndicator = this.checkAIReferrers(context.referrer, context.timestamp);
    if (referrerIndicator) {
      indicators.push(referrerIndicator);
    }

    // Check for cache refresh patterns
    const cacheRefreshIndicator = this.checkCacheRefreshPatterns(context.headers, context.timestamp);
    if (cacheRefreshIndicator) {
      indicators.push(cacheRefreshIndicator);
    }

    // Check for rapid sequential access
    const rapidAccessIndicator = this.checkRapidAccess(context.previousRequests || [], context.timestamp);
    if (rapidAccessIndicator) {
      indicators.push(rapidAccessIndicator);
    }

    // Check for AI platform signatures in headers/URL
    const platformSignatureIndicator = this.checkPlatformSignatures(context, context.timestamp);
    if (platformSignatureIndicator) {
      indicators.push(platformSignatureIndicator);
    }

    // Calculate total confidence
    const totalConfidence = indicators.reduce((sum, indicator) => sum + indicator.confidence, 0) / indicators.length || 0;
    
    // Suggest bot type based on strongest indicator
    const strongestIndicator = indicators.reduce((strongest, current) => 
      current.confidence > strongest.confidence ? current : strongest, 
      { confidence: 0, evidence: [], type: 'cache_refresh' as const, timestamp: 0 }
    );

    let suggestedBotType: string | null = null;
    if (strongestIndicator.confidence > 0.6) {
      if (strongestIndicator.type === 'ai_referrer') {
        suggestedBotType = this.getBotTypeFromReferrer(context.referrer);
      } else {
        suggestedBotType = 'Cache_Refresh_AI_Bot';
      }
    }

    return {
      isCacheActivity: totalConfidence >= 0.6,
      indicators,
      totalConfidence,
      suggestedBotType
    };
  }

  /**
   * Check for AI platform referrers
   */
  private checkAIReferrers(referrer: string, timestamp: number): CacheIndicator | null {
    if (!referrer) return null;

    const referrerLower = referrer.toLowerCase();
    const evidence: string[] = [];
    let confidence = 0;

    for (const aiReferrer of this.aiPlatformReferrers) {
      if (referrerLower.includes(aiReferrer.toLowerCase())) {
        evidence.push(`AI platform referrer detected: ${aiReferrer}`);
        evidence.push(`Full referrer: ${referrer}`);
        confidence = 0.9; // High confidence for direct AI platform referrers
        break;
      }
    }

    // Check for AI-related query parameters in referrer
    const aiQueryParams = ['q=', 'query=', 'search=', 'prompt=', 'message='];
    for (const param of aiQueryParams) {
      if (referrerLower.includes(param)) {
        evidence.push(`AI query parameter in referrer: ${param}`);
        confidence = Math.max(confidence, 0.7);
      }
    }

    if (confidence > 0) {
      return {
        type: 'ai_referrer',
        confidence,
        evidence,
        timestamp
      };
    }

    return null;
  }

  /**
   * Check for cache refresh patterns
   */
  private checkCacheRefreshPatterns(headers: Record<string, string>, timestamp: number): CacheIndicator | null {
    const evidence: string[] = [];
    let confidence = 0;

    // Check for cache-related headers
    for (const [headerName, headerValue] of Object.entries(headers)) {
      const headerNameLower = headerName.toLowerCase();
      const headerValueLower = (headerValue || '').toLowerCase();

      for (const pattern of this.cacheRefreshPatterns) {
        if (headerNameLower.includes(pattern.split(':')[0]) || headerValueLower.includes(pattern)) {
          evidence.push(`Cache refresh pattern detected: ${headerName}: ${headerValue}`);
          confidence += 0.3;
        }
      }
    }

    // Check for unusual cache control combinations
    const cacheControl = headers['cache-control'] || headers['Cache-Control'] || '';
    const pragma = headers['pragma'] || headers['Pragma'] || '';
    
    if (cacheControl.includes('no-cache') && pragma.includes('no-cache')) {
      evidence.push('Aggressive cache bypass detected (both Cache-Control and Pragma)');
      confidence += 0.4;
    }

    // Check for If-Modified-Since without typical browser headers
    const ifModifiedSince = headers['if-modified-since'] || headers['If-Modified-Since'];
    const acceptLanguage = headers['accept-language'] || headers['Accept-Language'];
    
    if (ifModifiedSince && !acceptLanguage) {
      evidence.push('Cache validation without typical browser headers');
      confidence += 0.5;
    }

    if (confidence >= 0.3) {
      return {
        type: 'cache_refresh',
        confidence: Math.min(confidence, 0.85),
        evidence,
        timestamp
      };
    }

    return null;
  }

  /**
   * Check for rapid sequential access patterns
   */
  private checkRapidAccess(previousRequests: Array<{url: string; timestamp: number}>, currentTimestamp: number): CacheIndicator | null {
    if (previousRequests.length < 2) return null;

    const evidence: string[] = [];
    let confidence = 0;

    // Check for requests within short time windows
    const recentRequests = previousRequests.filter(req => 
      currentTimestamp - req.timestamp < 10000 // 10 seconds
    );

    if (recentRequests.length >= 3) {
      evidence.push(`${recentRequests.length} requests within 10 seconds`);
      confidence += 0.6;
    }

    // Check for systematic URL patterns
    const urls = recentRequests.map(req => req.url);
    const uniquePaths = new Set(urls.map(url => new URL(url).pathname));
    
    if (uniquePaths.size >= 3 && recentRequests.length >= 3) {
      evidence.push(`Systematic access to ${uniquePaths.size} different pages`);
      confidence += 0.4;
    }

    // Check for very short intervals between requests
    const intervals = [];
    for (let i = 1; i < recentRequests.length; i++) {
      const interval = recentRequests[i].timestamp - recentRequests[i-1].timestamp;
      intervals.push(interval);
    }

    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    if (avgInterval < 2000) { // Less than 2 seconds average
      evidence.push(`Very rapid access pattern (avg ${avgInterval}ms between requests)`);
      confidence += 0.5;
    }

    if (confidence >= 0.4) {
      return {
        type: 'rapid_access',
        confidence: Math.min(confidence, 0.8),
        evidence,
        timestamp: currentTimestamp
      };
    }

    return null;
  }

  /**
   * Check for AI platform signatures in headers/URL
   */
  private checkPlatformSignatures(context: {
    headers: Record<string, string>;
    userAgent: string;
    url: string;
  }, timestamp: number): CacheIndicator | null {
    
    const evidence: string[] = [];
    let confidence = 0;

    // Check for AI-specific query parameters
    const url = new URL(context.url);
    const aiQueryParams = [
      'ai-summary', 'chatgpt', 'claude', 'perplexity', 'ai-query',
      'llm-request', 'ai-crawl', 'bot-refresh', 'ai-content',
      'gpt', 'ai-search', 'ai-response'
    ];

    for (const param of aiQueryParams) {
      if (url.search.toLowerCase().includes(param) || url.pathname.toLowerCase().includes(param)) {
        evidence.push(`AI-specific URL parameter: ${param}`);
        confidence += 0.6;
      }
    }

    // Check for AI-related custom headers
    const aiHeaders = [
      'x-ai-request', 'x-openai', 'x-anthropic', 'x-perplexity',
      'x-ai-bot', 'x-llm', 'x-chatgpt', 'x-claude'
    ];

    for (const [headerName, headerValue] of Object.entries(context.headers)) {
      const headerNameLower = headerName.toLowerCase();
      
      for (const aiHeader of aiHeaders) {
        if (headerNameLower.includes(aiHeader)) {
          evidence.push(`AI-specific header detected: ${headerName}`);
          confidence += 0.8;
        }
      }
    }

    // Check for AI-related User-Agent modifications
    const userAgentLower = context.userAgent.toLowerCase();
    const aiUserAgentIndicators = [
      'ai-enhanced', 'ai-powered', 'llm-client', 'gpt-client',
      'ai-browser', 'smart-browser', 'ai-agent'
    ];

    for (const indicator of aiUserAgentIndicators) {
      if (userAgentLower.includes(indicator)) {
        evidence.push(`AI-enhanced User-Agent indicator: ${indicator}`);
        confidence += 0.7;
      }
    }

    if (confidence >= 0.5) {
      return {
        type: 'platform_signature',
        confidence: Math.min(confidence, 0.9),
        evidence,
        timestamp
      };
    }

    return null;
  }

  /**
   * Determine bot type from referrer
   */
  private getBotTypeFromReferrer(referrer: string): string {
    const referrerLower = referrer.toLowerCase();
    
    if (referrerLower.includes('openai') || referrerLower.includes('chatgpt')) return 'ChatGPT';
    if (referrerLower.includes('claude') || referrerLower.includes('anthropic')) return 'Claude';
    if (referrerLower.includes('perplexity')) return 'Perplexity';
    if (referrerLower.includes('bard') || referrerLower.includes('google')) return 'Gemini';
    if (referrerLower.includes('copilot') || referrerLower.includes('microsoft')) return 'Copilot';
    if (referrerLower.includes('you.com')) return 'You.com';
    if (referrerLower.includes('phind')) return 'Phind';
    if (referrerLower.includes('character.ai')) return 'Character.AI';
    if (referrerLower.includes('poe.com')) return 'Poe';
    
    return 'AI_Platform_User';
  }

  /**
   * Get cache detection statistics
   */
  getCacheDetectionStats() {
    return {
      aiPlatformReferrers: this.aiPlatformReferrers.length,
      cacheRefreshPatterns: this.cacheRefreshPatterns.length,
      detectionMethods: ['ai_referrer', 'cache_refresh', 'rapid_access', 'platform_signature']
    };
  }
}
