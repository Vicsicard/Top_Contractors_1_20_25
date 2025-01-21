import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';

// Mock the VideoPlayer component
jest.mock('@/components/VideoPlayer', () => ({
  VideoPlayer: ({ url, title }: { url: string; title: string }) => (
    <div data-testid="video-player">
      <div data-url={url}>{title}</div>
    </div>
  ),
}));

describe('Video Blog Pages', () => {
  const testPage = {
    name: 'bathroom-remodeling',
    expectedUrl: 'https://youtu.be/mTOqRT0unsY',
    expectedTitle: "Bathroom Remodeling in Denver - Expert Guide"
  };

  describe(`${testPage.name} page`, () => {
    let content: string;

    beforeAll(() => {
      const filePath = path.join(process.cwd(), 'src', 'app', 'blog', 'trades', testPage.name, 'page.tsx');
      content = fs.readFileSync(filePath, 'utf-8');
    });

    it('contains necessary imports', () => {
      expect(content).toContain('import { VideoPlayer }');
      expect(content).toContain('import { Metadata }');
      expect(content).toContain('import { tradesData }');
    });

    it('contains VideoPlayer component with correct props', () => {
      expect(content).toContain('VideoPlayer');
      expect(content).toContain(`url="${testPage.expectedUrl}"`);
      expect(content).toContain(`title="${testPage.expectedTitle}"`);
    });

    it('has valid YouTube URL', () => {
      const youtubeIdRegex = /youtu(?:\.be\/|be\.com\/(?:watch\?v=|v\/|embed\/))([a-zA-Z0-9_-]{11})/;
      const match = testPage.expectedUrl.match(youtubeIdRegex);
      expect(match).not.toBeNull();
      expect(match![1]).toHaveLength(11);
    });

    it('uses the correct trade data', () => {
      expect(content).toContain(`const trade = '${testPage.name}'`);
      expect(content).toContain('const tradeData = tradesData[trade]');
    });
  });
});
