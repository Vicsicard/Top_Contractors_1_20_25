import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VideoPage, { generateMetadata } from '@/app/videos/[category]/[id]/page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Mock next/navigation
jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');
  return {
    ...actual,
    notFound: () => {
      throw new Error('Not Found');
    }
  };
});

// Create spy for notFound
const notFoundSpy = jest.spyOn(require('next/navigation'), 'notFound');

// Mock the Supabase client
jest.mock('@/utils/supabase-server', () => ({
  createClient: () => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockVideo,
            error: null
          })),
          neq: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => ({
                data: mockRelatedVideos,
                error: null
              }))
            }))
          }))
        }))
      }))
    }))
  })
}));

// Mock components
jest.mock('@/components/VideoPlayer', () => ({
  __esModule: true,
  default: ({ youtubeId, title }: { youtubeId: string; title: string }) => (
    <div data-testid="video-player">
      <div data-youtube-id={youtubeId}>{title}</div>
    </div>
  ),
}));

jest.mock('@/components/RelatedVideoCard', () => ({
  __esModule: true,
  default: ({ video }: { video: any }) => (
    <div data-testid="related-video-card">{video.title}</div>
  ),
}));

jest.mock('@/components/VideoChapters', () => ({
  __esModule: true,
  default: ({ timestamps }: { timestamps: Record<string, string> }) => (
    <div data-testid="video-chapters">
      {Object.entries(timestamps).map(([time, title]) => (
        <div key={time}>{title}</div>
      ))}
    </div>
  ),
}));

// Mock data
const mockVideo = {
  id: '123',
  title: 'Test Video',
  description: 'Test Description',
  youtube_id: 'test123',
  category: 'plumbing',
  related_services: ['plumbing-repair', 'drain-cleaning'],
  timestamps: {
    '0:00': 'Introduction',
    '1:30': 'Main Content'
  },
  created_at: '2025-01-30T12:00:00Z'
};

const mockRelatedVideos = [
  {
    id: '456',
    title: 'Related Video 1',
    youtube_id: 'related1',
    category: 'plumbing'
  },
  {
    id: '789',
    title: 'Related Video 2',
    youtube_id: 'related2',
    category: 'plumbing'
  }
];

describe('Video Page', () => {
  const params = {
    category: 'plumbing',
    id: '123'
  };

  describe('generateMetadata', () => {
    it('generates correct metadata for a video', async () => {
      const parent = {
        openGraph: { images: [] }
      } as any;

      const metadata = await generateMetadata({ params }, parent) as Metadata;

      expect(metadata.title).toBe(mockVideo.title);
      expect(metadata.description).toBe(mockVideo.description);
      expect((metadata.openGraph?.videos as any)?.[0].url).toBe(
        `https://www.youtube.com/watch?v=${mockVideo.youtube_id}`
      );
    });
  });

  describe('VideoPage component', () => {
    beforeEach(() => {
      notFoundSpy.mockClear();
      jest.clearAllMocks();
    });

    it('calls notFound when video is not found', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => ({
                data: null,
                error: null
              }))
            }))
          }))
        }))
      };

      jest.spyOn(require('@/utils/supabase-server'), 'createClient')
        .mockImplementation(() => mockSupabase);

      await expect(VideoPage({ params: { category: 'invalid', id: 'invalid' } }))
        .rejects
        .toThrow('Not Found');
      
      expect(notFoundSpy).toHaveBeenCalled();
    });

    it('handles database errors gracefully', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => ({
                data: null,
                error: new Error('Database error')
              }))
            }))
          }))
        }))
      };

      jest.spyOn(require('@/utils/supabase-server'), 'createClient')
        .mockImplementation(() => mockSupabase);

      await expect(VideoPage({ params: { category: 'plumbing', id: '123' } }))
        .rejects
        .toThrow('Database error');
    });

    it('handles missing related videos gracefully', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => ({
                data: mockVideo,
                error: null
              })),
              neq: jest.fn(() => ({
                order: jest.fn(() => ({
                  limit: jest.fn(() => ({
                    data: [],
                    error: null
                  }))
                }))
              }))
            }))
          }))
        }))
      };

      jest.spyOn(require('@/utils/supabase-server'), 'createClient')
        .mockImplementation(() => mockSupabase);

      const page = await VideoPage({ params });
      render(page);

      expect(screen.getByText('No related videos found')).toBeInTheDocument();
    });

    it('renders the video player with correct props', async () => {
      const page = await VideoPage({ params });
      render(page);

      const videoPlayer = screen.getByTestId('video-player');
      expect(videoPlayer).toBeInTheDocument();
      expect(videoPlayer).toHaveTextContent(mockVideo.title);
      expect(videoPlayer.querySelector('[data-youtube-id]')).toHaveAttribute(
        'data-youtube-id',
        mockVideo.youtube_id
      );
    });

    it('renders related services', async () => {
      const page = await VideoPage({ params });
      render(page);

      mockVideo.related_services.forEach(service => {
        const serviceLink = screen.getByText(service.replace(/-/g, ' '));
        expect(serviceLink).toBeInTheDocument();
        expect(serviceLink).toHaveAttribute('href', `/services/${service}`);
      });
    });

    it('renders video chapters when available', async () => {
      const page = await VideoPage({ params });
      render(page);

      const chapters = screen.getByTestId('video-chapters');
      expect(chapters).toBeInTheDocument();
      Object.values(mockVideo.timestamps).forEach(title => {
        expect(chapters).toHaveTextContent(title);
      });
    });

    it('renders related videos', async () => {
      const page = await VideoPage({ params });
      render(page);

      const relatedCards = screen.getAllByTestId('related-video-card');
      expect(relatedCards).toHaveLength(mockRelatedVideos.length);
      mockRelatedVideos.forEach((video, index) => {
        expect(relatedCards[index]).toHaveTextContent(video.title);
      });
    });

    it('includes a back to videos link', async () => {
      const page = await VideoPage({ params });
      render(page);

      const backLink = screen.getByText('Back to Videos');
      expect(backLink).toBeInTheDocument();
      expect(backLink.closest('a')).toHaveAttribute('href', '/videos');
    });
  });
});
