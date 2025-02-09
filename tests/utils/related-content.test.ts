import { getRelatedPosts, getRelatedTradeContent } from '@/utils/related-content';
import { createClient } from '@/utils/supabase-server';

// Mock Supabase client
jest.mock('@/utils/supabase-server', () => ({
  createClient: jest.fn()
}));

describe('Related Content Utils', () => {
  const mockPosts = [
    {
      id: '1',
      title: 'Test Post 1',
      slug: 'test-post-1',
      published_at: '2025-02-09T00:00:00Z',
      category: 'plumbing',
      tags: ['maintenance', 'diy']
    },
    {
      id: '2',
      title: 'Test Post 2',
      slug: 'test-post-2',
      published_at: '2025-02-08T00:00:00Z',
      category: 'plumbing',
      tags: ['maintenance']
    },
    {
      id: '3',
      title: 'Test Post 3',
      slug: 'test-post-3',
      published_at: '2025-02-07T00:00:00Z',
      category: 'electrical',
      tags: ['diy']
    }
  ];

  const mockVideos = [
    {
      id: '1',
      title: 'Test Video 1',
      category: 'plumbing',
      created_at: '2025-02-09T00:00:00Z'
    },
    {
      id: '2',
      title: 'Test Video 2',
      category: 'plumbing',
      created_at: '2025-02-08T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      contains: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn()
    });
  });

  describe('getRelatedPosts', () => {
    it('returns posts with matching tags', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: [mockPosts[1], mockPosts[2]] });
      (createClient as jest.Mock)().limit.mockImplementation(mockSelect);

      const result = await getRelatedPosts(mockPosts[0]);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(mockPosts[1]);
      expect(result).toContainEqual(mockPosts[2]);
    });

    it('returns posts from same category if no tag matches', async () => {
      const mockSelect = jest.fn()
        .mockResolvedValueOnce({ data: [] }) // No tag matches
        .mockResolvedValueOnce({ data: [mockPosts[1]] }); // Category matches
      (createClient as jest.Mock)().limit.mockImplementation(mockSelect);

      const result = await getRelatedPosts(mockPosts[0]);
      expect(result).toHaveLength(1);
      expect(result).toContainEqual(mockPosts[1]);
    });

    it('returns recent posts if no category or tag matches', async () => {
      const mockSelect = jest.fn()
        .mockResolvedValueOnce({ data: [] }) // No tag matches
        .mockResolvedValueOnce({ data: [] }) // No category matches
        .mockResolvedValueOnce({ data: mockPosts }); // Recent posts
      (createClient as jest.Mock)().limit.mockImplementation(mockSelect);

      const result = await getRelatedPosts(mockPosts[0]);
      expect(result).toHaveLength(3);
    });
  });

  describe('getRelatedTradeContent', () => {
    it('returns related posts and videos for a trade', async () => {
      const mockPostSelect = jest.fn().mockResolvedValue({ data: [mockPosts[0], mockPosts[1]] });
      const mockVideoSelect = jest.fn().mockResolvedValue({ data: mockVideos });
      
      (createClient as jest.Mock)().limit
        .mockImplementationOnce(mockPostSelect)
        .mockImplementationOnce(mockVideoSelect);

      const result = await getRelatedTradeContent('plumbing');
      expect(result.posts).toHaveLength(2);
      expect(result.videos).toHaveLength(2);
      expect(result.posts).toContainEqual(mockPosts[0]);
      expect(result.videos).toContainEqual(mockVideos[0]);
    });

    it('handles empty results', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: [] });
      (createClient as jest.Mock)().limit.mockImplementation(mockSelect);

      const result = await getRelatedTradeContent('non-existent-trade');
      expect(result.posts).toHaveLength(0);
      expect(result.videos).toHaveLength(0);
    });
  });
});
