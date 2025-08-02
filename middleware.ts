import { NextRequest, NextResponse } from 'next/server';
import { CoreAIDetector, type RequestContext } from './lib/ai-detection/core-detector';
import { CacheAwareDetector } from './lib/cache-detection/cache-indicators';

/**
 * Ultra-Comprehensive AI Bot Detection Middleware
 * Multi-layered detection system for maximum AI crawler visibility
 */

// Initialize detection engines
const coreDetector = new CoreAIDetector();
const cacheDetector = new CacheAwareDetector();

// Session tracking for behavioral analysis
const sessionTracker = new Map<string, Array<{url: string; timestamp: number}>>();

async function detectAndTrackAI(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const referrer = request.headers.get('referer') || '';
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const timestamp = Date.now();
  
  // Build request context
  const context: RequestContext = {
    userAgent,
    headers: Object.fromEntries(request.headers.entries()),
    url: request.nextUrl.href,
    ip,
    referrer,
    timestamp
  };

  // Track session for behavioral analysis
  const sessionKey = `${ip}-${userAgent.slice(0, 50)}`;
  const previousRequests = sessionTracker.get(sessionKey) || [];
  previousRequests.push({ url: context.url, timestamp });
  
  // Keep only recent requests (last 5 minutes)
  const recentRequests = previousRequests.filter((req: {url: string; timestamp: number}) => timestamp - req.timestamp < 300000);
  sessionTracker.set(sessionKey, recentRequests.slice(-20)); // Keep max 20 requests

  // Layer 1: Core AI Detection
  const coreResult = await coreDetector.detectAI(context);
  
  // Layer 2: Cache-Aware Detection
  const cacheResult = cacheDetector.detectCacheActivity({
    referrer,
    headers: context.headers,
    userAgent,
    url: context.url,
    timestamp,
    previousRequests: recentRequests
  });

  // Determine final detection result
  let finalBotType: string | null = null;
  let finalConfidence = 0;
  let detectionMethod = 'none';
  let allEvidence: string[] = [];

  // Prioritize core detection if high confidence
  if (coreResult.isBot && coreResult.confidence >= 0.85) {
    finalBotType = coreResult.botType;
    finalConfidence = coreResult.confidence;
    detectionMethod = coreResult.method;
    allEvidence = coreResult.evidence;
  }
  // Check cache detection
  else if (cacheResult.isCacheActivity && cacheResult.totalConfidence >= 0.6) {
    finalBotType = cacheResult.suggestedBotType;
    finalConfidence = cacheResult.totalConfidence;
    detectionMethod = 'cache_aware_detection';
    allEvidence = cacheResult.indicators.flatMap(indicator => indicator.evidence);
  }
  // Use core detection even with lower confidence
  else if (coreResult.isBot) {
    finalBotType = coreResult.botType;
    finalConfidence = coreResult.confidence;
    detectionMethod = coreResult.method;
    allEvidence = coreResult.evidence;
  }

  // Track if we detected AI activity
  if (finalBotType && finalConfidence >= 0.6) {
    const visitData = {
      site_url: request.nextUrl.origin,
      page_url: request.nextUrl.href,
      user_agent: userAgent,
      bot_type: finalBotType,
      referrer,
      ip_address: ip,
      timestamp: new Date().toISOString(),
      metadata: {
        detection_confidence: finalConfidence,
        detection_method: detectionMethod,
        evidence: allEvidence,
        core_detection: coreResult,
        cache_detection: cacheResult,
        session_requests: recentRequests.length,
        request_headers: context.headers,
        pathname: request.nextUrl.pathname,
        search: request.nextUrl.search,
        comprehensive_detection: true
      }
    };
    
    // Track the AI activity asynchronously
    try {
      await fetch('https://bot-tracking-worker.vicsicard.workers.dev/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(visitData)
      });
      
      console.log(`🤖 AI Activity Detected: ${finalBotType} (${(finalConfidence * 100).toFixed(1)}%) - ${request.nextUrl.href}`);
      console.log(`📋 Evidence: ${allEvidence.slice(0, 3).join(', ')}`);
    } catch (error) {
      console.error('❌ Error tracking AI activity:', error);
    }
  }
  
  return {
    botType: finalBotType,
    confidence: finalConfidence,
    method: detectionMethod,
    evidence: allEvidence
  };
}

export async function middleware(request: NextRequest) {
  // Comprehensive AI detection and tracking
  const detection = await detectAndTrackAI(request);
  
  // Continue with the request
  const response = NextResponse.next();
  
  // Add cache-busting headers to encourage fresh AI crawls
  response.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
  response.headers.set('X-AI-Content-Version', Date.now().toString());
  response.headers.set('X-AI-Last-Updated', new Date().toISOString());
  
  // Add detection headers for debugging
  if (detection.botType) {
    response.headers.set('X-AI-Bot-Detected', detection.botType);
    response.headers.set('X-AI-Confidence', (detection.confidence * 100).toFixed(1));
    response.headers.set('X-AI-Method', detection.method);
  }
  
  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
