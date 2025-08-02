import { NextRequest, NextResponse } from 'next/server';

/**
 * Cache-Aware AI Bot Detection Middleware
 * Detects both direct AI crawlers and cached AI activity indicators
 */

interface AIActivityIndicator {
  type: 'direct_crawler' | 'cache_indicator' | 'behavioral_pattern';
  confidence: number;
  evidence: string[];
}

// Enhanced detection with cache-awareness
async function detectAIActivity(request: NextRequest): Promise<AIActivityIndicator | null> {
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  const xForwardedFor = request.headers.get('x-forwarded-for') || '';
  
  // Direct AI crawler detection (existing patterns)
  const directCrawlerResult = await detectDirectCrawler(request);
  if (directCrawlerResult) {
    return directCrawlerResult;
  }
  
  // Cache indicator detection
  const cacheIndicatorResult = await detectCacheIndicators(request);
  if (cacheIndicatorResult) {
    return cacheIndicatorResult;
  }
  
  // Behavioral pattern detection
  const behavioralResult = await detectBehavioralPatterns(request);
  if (behavioralResult) {
    return behavioralResult;
  }
  
  return null;
}

async function detectDirectCrawler(request: NextRequest): Promise<AIActivityIndicator | null> {
  const userAgent = request.headers.get('user-agent') || '';
  const userAgentLower = userAgent.toLowerCase();
  
  const aiBotPatterns = {
    'ChatGPT': ['gptbot', 'chatgpt', 'openai', 'gpt-crawler'],
    'Claude': ['claude', 'anthropic', 'claude-web'],
    'Perplexity': ['perplexity', 'perplexitybot'],
    'Gemini': ['gemini', 'bard', 'google-ai'],
    'Copilot': ['copilot', 'bing-ai', 'microsoft-ai']
  };
  
  for (const [botType, patterns] of Object.entries(aiBotPatterns)) {
    for (const pattern of patterns) {
      if (userAgentLower.includes(pattern.toLowerCase())) {
        return {
          type: 'direct_crawler',
          confidence: 0.95,
          evidence: [`Direct AI crawler detected: ${botType}`, `User-Agent: ${userAgent}`]
        };
      }
    }
  }
  
  return null;
}

async function detectCacheIndicators(request: NextRequest): Promise<AIActivityIndicator | null> {
  const evidence: string[] = [];
  let confidence = 0;
  
  // Check for AI platform referrers (when users click through from AI responses)
  const aiReferrers = [
    'chat.openai.com', 'claude.ai', 'perplexity.ai', 'bard.google.com',
    'copilot.microsoft.com', 'you.com', 'phind.com', 'character.ai'
  ];
  
  const referer = request.headers.get('referer') || '';
  for (const aiReferrer of aiReferrers) {
    if (referer.includes(aiReferrer)) {
      evidence.push(`AI platform referrer detected: ${aiReferrer}`);
      confidence += 0.8;
    }
  }
  
  // Check for unusual traffic patterns that might indicate AI cache refresh
  const userAgent = request.headers.get('user-agent') || '';
  const timestamp = Date.now();
  
  // Detect rapid sequential page access (AI systems often crawl multiple pages quickly)
  const rapidAccessPatterns = [
    'Multiple pages accessed within seconds',
    'Systematic URL pattern access',
    'No typical user browsing delays'
  ];
  
  // Check for missing typical browser headers (cache refresh might skip some)
  const missingHeaders = [];
  if (!request.headers.get('accept-language')) missingHeaders.push('accept-language');
  if (!request.headers.get('accept-encoding')) missingHeaders.push('accept-encoding');
  if (!request.headers.get('cache-control')) missingHeaders.push('cache-control');
  
  if (missingHeaders.length >= 2) {
    evidence.push(`Missing typical browser headers: ${missingHeaders.join(', ')}`);
    confidence += 0.3;
  }
  
  // Check for AI-specific query parameters or paths
  const aiQueryIndicators = [
    'ai-summary', 'chatgpt', 'claude', 'perplexity', 'ai-query',
    'llm-request', 'ai-crawl', 'bot-refresh'
  ];
  
  const url = request.nextUrl.href.toLowerCase();
  for (const indicator of aiQueryIndicators) {
    if (url.includes(indicator)) {
      evidence.push(`AI-specific URL parameter detected: ${indicator}`);
      confidence += 0.6;
    }
  }
  
  if (confidence >= 0.6) {
    return {
      type: 'cache_indicator',
      confidence,
      evidence
    };
  }
  
  return null;
}

async function detectBehavioralPatterns(request: NextRequest): Promise<AIActivityIndicator | null> {
  const evidence: string[] = [];
  let confidence = 0;
  
  const userAgent = request.headers.get('user-agent') || '';
  const acceptHeader = request.headers.get('accept') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  
  // Pattern 1: Unusual Accept headers (AI systems often have different accept patterns)
  if (acceptHeader.includes('application/json') && !acceptHeader.includes('text/html')) {
    evidence.push('API-like accept header in browser context');
    confidence += 0.3;
  }
  
  // Pattern 2: Missing or unusual Accept-Language
  if (!acceptLanguage || acceptLanguage === 'en' || acceptLanguage.split(',').length === 1) {
    evidence.push('Simplified or missing Accept-Language header');
    confidence += 0.2;
  }
  
  // Pattern 3: Unusual User-Agent patterns
  const suspiciousUAPatterns = [
    'python', 'requests', 'urllib', 'httpx', 'curl', 'wget',
    'api-client', 'bot', 'crawler', 'scraper', 'automation'
  ];
  
  const userAgentLower = userAgent.toLowerCase();
  for (const pattern of suspiciousUAPatterns) {
    if (userAgentLower.includes(pattern)) {
      evidence.push(`Suspicious User-Agent pattern: ${pattern}`);
      confidence += 0.4;
    }
  }
  
  // Pattern 4: Timing patterns (very fast page loads, no typical user delays)
  const requestTime = Date.now();
  // This would need to be enhanced with session tracking for full effectiveness
  
  if (confidence >= 0.6) {
    return {
      type: 'behavioral_pattern',
      confidence,
      evidence
    };
  }
  
  return null;
}

// Enhanced tracking with cache-awareness
async function trackAIActivity(request: NextRequest, activity: AIActivityIndicator) {
  const visitData = {
    site_url: request.nextUrl.origin,
    page_url: request.nextUrl.href,
    user_agent: request.headers.get('user-agent') || '',
    bot_type: activity.type === 'direct_crawler' ? 'Direct_AI_Crawler' : 
              activity.type === 'cache_indicator' ? 'Cache_Refresh_AI' : 
              'Behavioral_AI_Pattern',
    referrer: request.headers.get('referer') || '',
    ip_address: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
    timestamp: new Date().toISOString(),
    metadata: {
      detection_type: activity.type,
      detection_confidence: activity.confidence,
      evidence: activity.evidence,
      request_headers: Object.fromEntries(request.headers.entries()),
      pathname: request.nextUrl.pathname,
      search: request.nextUrl.search,
      cache_aware_detection: true
    }
  };
  
  try {
    await fetch('https://bot-tracking-worker.vicsicard.workers.dev/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(visitData)
    });
    
    console.log(`🤖 AI Activity detected: ${activity.type} (${(activity.confidence * 100).toFixed(1)}%)`);
    console.log(`📋 Evidence: ${activity.evidence.join(', ')}`);
  } catch (error) {
    console.error('❌ Error tracking AI activity:', error);
  }
}

// Add cache-busting headers to responses
function addCacheBustingHeaders(response: NextResponse, request: NextRequest) {
  // Add headers to encourage fresh crawls
  response.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
  response.headers.set('X-AI-Content-Version', Date.now().toString());
  response.headers.set('X-AI-Last-Updated', new Date().toISOString());
  
  // Add AI-specific meta information
  const aiMetaTags = `
    <meta name="ai-crawl-frequency" content="daily">
    <meta name="ai-content-freshness" content="high">
    <meta name="ai-cache-version" content="${Date.now()}">
  `;
  
  // This would need to be injected into the HTML response
  response.headers.set('X-AI-Meta-Tags', Buffer.from(aiMetaTags).toString('base64'));
  
  return response;
}

export async function middleware(request: NextRequest) {
  // Detect AI activity (direct crawlers, cache indicators, behavioral patterns)
  const aiActivity = await detectAIActivity(request);
  
  if (aiActivity) {
    // Track the AI activity
    await trackAIActivity(request, aiActivity);
  }
  
  // Continue with the request
  const response = NextResponse.next();
  
  // Add cache-busting and AI-friendly headers
  addCacheBustingHeaders(response, request);
  
  if (aiActivity) {
    response.headers.set('X-AI-Activity-Detected', aiActivity.type);
    response.headers.set('X-AI-Confidence', (aiActivity.confidence * 100).toFixed(1));
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
