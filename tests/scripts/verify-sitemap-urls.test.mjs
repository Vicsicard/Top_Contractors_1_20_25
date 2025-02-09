import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// Mock the dependencies
jest.mock('fs');
jest.mock('node-fetch');

describe('Sitemap URL Verification', () => {
  const mockSitemapContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://topcontractorsdenver.com/</loc>
        <lastmod>2025-02-09</lastmod>
      </url>
      <url>
        <loc>https://topcontractorsdenver.com/blog</loc>
        <lastmod>2025-02-09</lastmod>
      </url>
      <url>
        <loc>https://topcontractorsdenver.com/trades</loc>
        <lastmod>2025-02-09</lastmod>
      </url>
    </urlset>
  `;

  beforeEach(() => {
    jest.clearAllMocks();
    fs.readFileSync.mockReturnValue(mockSitemapContent);
    fs.existsSync.mockReturnValue(true);
  });

  it('reads sitemap files correctly', () => {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap-static.xml');
    expect(fs.readFileSync).toHaveBeenCalledWith(sitemapPath, 'utf-8');
  });

  it('extracts URLs from sitemap XML', () => {
    const urls = mockSitemapContent.match(/<loc>(.*?)<\/loc>/g)
      ?.map(loc => loc.replace(/<\/?loc>/g, ''));
    
    expect(urls).toHaveLength(3);
    expect(urls).toContain('https://topcontractorsdenver.com/');
    expect(urls).toContain('https://topcontractorsdenver.com/blog');
    expect(urls).toContain('https://topcontractorsdenver.com/trades');
  });

  it('validates URLs correctly', async () => {
    fetch.mockImplementation((url) => 
      Promise.resolve({
        ok: url.includes('topcontractorsdenver.com'),
        status: url.includes('topcontractorsdenver.com') ? 200 : 404
      })
    );

    const validUrl = 'https://topcontractorsdenver.com/';
    const invalidUrl = 'https://topcontractorsdenver.com/nonexistent';

    const validResponse = await fetch(validUrl);
    const invalidResponse = await fetch(invalidUrl);

    expect(validResponse.ok).toBe(true);
    expect(validResponse.status).toBe(200);
    expect(invalidResponse.ok).toBe(false);
    expect(invalidResponse.status).toBe(404);
  });

  it('handles network errors gracefully', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    try {
      await fetch('https://topcontractorsdenver.com/');
    } catch (error) {
      expect(error.message).toBe('Network error');
    }
  });
});
