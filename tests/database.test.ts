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
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: {
              id: '1',
              name: 'Bathroom Remodelers',
              slug: 'bathroom-remodelers',
              created_at: '2025-01-09T14:56:32Z',
              updated_at: '2025-01-09T14:56:32Z'
            },
            error: null
          })),
          data: [
            {
              id: '1',
              name: 'Bathroom Remodelers',
              slug: 'bathroom-remodelers',
              created_at: '2025-01-09T14:56:32Z',
              updated_at: '2025-01-09T14:56:32Z'
            }
          ],
          error: null
        })),
        order: jest.fn(() => ({
          data: [
            {
              id: '1',
              name: 'Bathroom Remodelers',
              slug: 'bathroom-remodelers',
              created_at: '2025-01-09T14:56:32Z',
              updated_at: '2025-01-09T14:56:32Z'
            }
          ],
          error: null
        }))
      }))
    }))
  }
}));

describe('Database Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTradeBySlug', () => {
    it('should fetch trade by slug successfully', async () => {
      const trade = await getTradeBySlug('bathroom-remodelers');
      expect(trade).toEqual({
        id: '1',
        name: 'Bathroom Remodelers',
        slug: 'bathroom-remodelers',
        created_at: '2025-01-09T14:56:32Z',
        updated_at: '2025-01-09T14:56:32Z'
      });
    });
  });

  describe('getAllTrades', () => {
    it('should fetch all trades successfully', async () => {
      const trades = await getAllTrades();
      expect(trades).toEqual([
        {
          id: '1',
          name: 'Bathroom Remodelers',
          slug: 'bathroom-remodelers',
          created_at: '2025-01-09T14:56:32Z',
          updated_at: '2025-01-09T14:56:32Z'
        }
      ]);
    });
  });

  describe('getAllSubregions', () => {
    it('should fetch all subregions successfully', async () => {
      const subregions = await getAllSubregions();
      expect(subregions).toEqual([
        {
          id: '1',
          name: 'Bathroom Remodelers',
          slug: 'bathroom-remodelers',
          created_at: '2025-01-09T14:56:32Z',
          updated_at: '2025-01-09T14:56:32Z'
        }
      ]);
    });
  });

  describe('getSubregionBySlug', () => {
    it('should fetch subregion by slug successfully', async () => {
      const subregion = await getSubregionBySlug('denver-metro');
      expect(subregion).toEqual({
        id: '1',
        name: 'Bathroom Remodelers',
        slug: 'bathroom-remodelers',
        created_at: '2025-01-09T14:56:32Z',
        updated_at: '2025-01-09T14:56:32Z'
      });
    });
  });
});
