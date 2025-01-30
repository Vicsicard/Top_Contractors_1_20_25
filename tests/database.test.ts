import { supabase } from '@/utils/supabase';
import { 
  getAllTrades,
  getTradeBySlug,
  getAllSubregions,
  getSubregionBySlug,
  getContractorsByTradeAndSubregion,
  getContractorBySlug
} from '../src/utils/database';

// Mock Supabase client
jest.mock('@/utils/supabase', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: {
              id: '1',
              category_name: 'Bathroom Remodelers',
              slug: 'bathroom-remodelers',
              created_at: '2025-01-09T14:56:32Z',
              updated_at: '2025-01-09T14:56:32Z'
            },
            error: null
          })),
          order: jest.fn(() => ({
            data: [
              {
                id: '1',
                category_id: 'cat-1',
                subregion_id: 'sub-1',
                contractor_name: 'Test Contractor',
                address: '123 Test St, Denver, CO',
                phone: '303-555-0123',
                website: 'https://example.com',
                google_rating: 4.5,
                google_review_count: 100,
                slug: 'test-contractor',
                created_at: '2025-01-09T14:56:32Z',
                updated_at: '2025-01-09T14:56:32Z'
              }
            ],
            error: null
          }))
        })),
        match: jest.fn(() => ({
          data: [
            {
              id: '1',
              category_id: 'cat-1',
              subregion_id: 'sub-1',
              contractor_name: 'Test Contractor',
              address: '123 Test St, Denver, CO',
              phone: '303-555-0123',
              website: 'https://example.com',
              google_rating: 4.5,
              google_review_count: 100,
              slug: 'test-contractor'
            }
          ],
          error: null
        }))
      }))
    }))
  }))
}));

describe('Database Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTradeBySlug', () => {
    it('should fetch trade by slug successfully', async () => {
      const trade = await getTradeBySlug('bathroom-remodelers');
      
      expect(trade).toBeDefined();
      expect(trade).toHaveProperty('category_name', 'Bathroom Remodelers');
      expect(trade).toHaveProperty('slug', 'bathroom-remodelers');
    });

    it('should handle database errors gracefully', async () => {
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

      (supabase as any) = mockSupabase;

      await expect(getTradeBySlug('error-trade')).rejects.toThrow('Database error');
    });

    it('should return null for non-existent trade', async () => {
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

      (supabase as any) = mockSupabase;

      const trade = await getTradeBySlug('non-existent-trade');
      expect(trade).toBeNull();
    });
  });

  describe('getContractorsByTradeAndSubregion', () => {
    it('should fetch contractors successfully', async () => {
      const contractors = await getContractorsByTradeAndSubregion('bathroom-remodelers', 'denver-tech-center');
      
      expect(Array.isArray(contractors)).toBe(true);
      expect(contractors.length).toBe(1);
      expect(contractors[0]).toHaveProperty('contractor_name', 'Test Contractor');
      expect(contractors[0]).toHaveProperty('google_rating', 4.5);
      expect(contractors[0]).toHaveProperty('google_review_count', 100);
    });

    it('should handle database errors gracefully', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            match: jest.fn(() => ({
              data: null,
              error: new Error('Database error')
            }))
          }))
        }))
      };

      (supabase as any) = mockSupabase;

      await expect(getContractorsByTradeAndSubregion('error-trade', 'error-region'))
        .rejects.toThrow('Database error');
    });

    it('should return empty array when no contractors found', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            match: jest.fn(() => ({
              data: [],
              error: null
            }))
          }))
        }))
      };

      (supabase as any) = mockSupabase;

      const contractors = await getContractorsByTradeAndSubregion('empty-trade', 'empty-region');
      expect(Array.isArray(contractors)).toBe(true);
      expect(contractors.length).toBe(0);
    });
  });

  describe('getAllTrades', () => {
    it('should fetch all trades successfully', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            order: jest.fn(() => ({
              data: [
                {
                  id: '1',
                  category_name: 'Bathroom Remodelers',
                  slug: 'bathroom-remodelers'
                },
                {
                  id: '2',
                  category_name: 'Plumbers',
                  slug: 'plumbers'
                }
              ],
              error: null
            }))
          }))
        }))
      };

      (supabase as any) = mockSupabase;

      const trades = await getAllTrades();
      expect(trades).toHaveLength(2);
      expect(trades[0]).toHaveProperty('category_name', 'Bathroom Remodelers');
      expect(trades[1]).toHaveProperty('category_name', 'Plumbers');
    });

    it('should handle database errors', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            order: jest.fn(() => ({
              data: null,
              error: new Error('Database error')
            }))
          }))
        }))
      };

      (supabase as any) = mockSupabase;

      await expect(getAllTrades()).rejects.toThrow('Failed to load categories');
    });
  });

  describe('getAllSubregions', () => {
    it('should fetch all subregions successfully', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            order: jest.fn(() => ({
              data: [
                {
                  id: '1',
                  subregion_name: 'Denver Tech Center',
                  slug: 'denver-tech-center'
                },
                {
                  id: '2',
                  subregion_name: 'Cherry Creek',
                  slug: 'cherry-creek'
                }
              ],
              error: null
            }))
          }))
        }))
      };

      (supabase as any) = mockSupabase;

      const subregions = await getAllSubregions();
      expect(subregions).toHaveLength(2);
      expect(subregions[0]).toHaveProperty('subregion_name', 'Denver Tech Center');
      expect(subregions[1]).toHaveProperty('subregion_name', 'Cherry Creek');
    });

    it('should handle database errors', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            order: jest.fn(() => ({
              data: null,
              error: new Error('Database error')
            }))
          }))
        }))
      };

      (supabase as any) = mockSupabase;

      await expect(getAllSubregions()).rejects.toThrow('Failed to load subregions');
    });
  });

  describe('getSubregionBySlug', () => {
    it('should fetch subregion by slug successfully', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => ({
                data: {
                  id: '1',
                  subregion_name: 'Denver Tech Center',
                  slug: 'denver-tech-center'
                },
                error: null
              }))
            }))
          }))
        }))
      };

      (supabase as any) = mockSupabase;

      const subregion = await getSubregionBySlug('denver-tech-center');
      expect(subregion).toHaveProperty('subregion_name', 'Denver Tech Center');
      expect(subregion).toHaveProperty('slug', 'denver-tech-center');
    });

    it('should return null for non-existent subregion', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => ({
                data: null,
                error: { code: 'PGRST116' }
              }))
            }))
          }))
        }))
      };

      (supabase as any) = mockSupabase;

      const subregion = await getSubregionBySlug('non-existent');
      expect(subregion).toBeNull();
    });
  });

  describe('getContractorBySlug', () => {
    it('should fetch contractor by slug successfully', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => ({
                data: {
                  id: '1',
                  contractor_name: 'Test Contractor',
                  slug: 'test-contractor',
                  category: {
                    id: 'cat-1',
                    category_name: 'Plumbers'
                  },
                  subregion: {
                    id: 'sub-1',
                    subregion_name: 'Denver Tech Center'
                  }
                },
                error: null
              }))
            }))
          }))
        }))
      };

      (supabase as any) = mockSupabase;

      const contractor = await getContractorBySlug('test-contractor');
      expect(contractor).toHaveProperty('contractor_name', 'Test Contractor');
      expect(contractor).toHaveProperty('category.category_name', 'Plumbers');
      expect(contractor).toHaveProperty('subregion.subregion_name', 'Denver Tech Center');
    });

    it('should handle database errors', async () => {
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

      (supabase as any) = mockSupabase;

      await expect(getContractorBySlug('error-contractor')).rejects.toThrow('Failed to load contractor');
    });
  });
});
