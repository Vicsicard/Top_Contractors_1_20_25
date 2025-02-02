import { supabase } from './supabase';
import type { CategoryRecord, SubregionRecord, ContractorRecord } from '@/types/database';

import { PostgrestError } from '@supabase/supabase-js';

type SupabaseResult<T> = {
  data: T | null;
  error: PostgrestError | null;
};

async function retryOperation<T>(
  operation: () => Promise<SupabaseResult<T>>,
  retries = 3,
  delay = 1000
): Promise<SupabaseResult<T>> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying operation, ${retries} attempts remaining...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryOperation(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function getAllTrades(): Promise<CategoryRecord[]> {
  try {
    console.log('[SERVER] Fetching categories from Supabase...');
    const result = await retryOperation<CategoryRecord[]>(async () => {
      const response = await supabase
        .from('categories')
        .select('*')
        .order('category_name');
      return {
        data: Array.isArray(response.data) ? response.data : [],
        error: response.error
      };
    });
    const { data: categories, error } = result;

    // Ensure categories is always an array
    const categoriesArray = Array.isArray(categories) ? categories : [];

    if (error) {
      console.error('[SERVER] Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      // Return empty array instead of throwing during static generation
      console.warn('[SERVER] Returning empty categories array due to error');
      return [];
    }

    if (categoriesArray.length === 0) {
      console.warn('[SERVER] No categories found in database');
      return [];
    }

    console.log('[SERVER] Successfully fetched categories count:', categoriesArray.length);
    return categoriesArray;
  } catch (error) {
    console.error('[SERVER] Error in getAllTrades:', error);
    // Return empty array instead of throwing during static generation
    return [];
  }
}

export async function getTradeBySlug(slug: string): Promise<CategoryRecord | null> {
  try {
    const result = await retryOperation<CategoryRecord>(async () => {
      const response = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      return {
        data: response.data,
        error: response.error
      };
    });
    const { data: category, error } = result;

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        console.warn(`[SERVER] No category found for slug: ${slug}`);
        return null;
      }
      console.error('[SERVER] Error fetching category:', {
        error,
        slug,
        context: 'getTradeBySlug'
      });
      return null;
    }

    return category;
  } catch (error) {
    console.error('[SERVER] Error in getTradeBySlug:', {
      error,
      slug,
      context: 'getTradeBySlug'
    });
    return null;
  }
}

export async function getAllSubregions(): Promise<SubregionRecord[]> {
  try {
    const result = await retryOperation<SubregionRecord[]>(async () => {
      const response = await supabase
        .from('subregions')
        .select('*')
        .order('subregion_name');
      return {
        data: Array.isArray(response.data) ? response.data : [],
        error: response.error
      };
    });
    const { data: subregions, error } = result;

    // Ensure subregions is always an array
    const subregionsArray = Array.isArray(subregions) ? subregions : [];

    if (error) {
      console.error('[SERVER] Error fetching subregions:', error);
      return [];
    }

    if (subregionsArray.length === 0) {
      console.warn('[SERVER] No subregions found in database');
      return [];
    }

    return subregionsArray;
  } catch (error) {
    console.error('[SERVER] Error in getAllSubregions:', error);
    return [];
  }
}

export async function getSubregionBySlug(slug: string): Promise<SubregionRecord | null> {
  try {
    const result = await retryOperation<SubregionRecord>(async () => {
      const response = await supabase
        .from('subregions')
        .select('*')
        .eq('slug', slug)
        .single();
      return {
        data: response.data,
        error: response.error
      };
    });
    const { data: subregion, error } = result;

    if (error) {
      if (error.code === 'PGRST116') {  // No rows returned
        return null;
      }
      console.error('[SERVER] Error fetching subregion:', {
        error,
        slug,
        context: 'getSubregionBySlug'
      });
      return null;
    }

    return subregion;
  } catch (error) {
    console.error('[SERVER] Error in getSubregionBySlug:', error);
    return null;
  }
}

export async function getContractorsByTradeAndSubregion(
  categorySlug: string,
  subregionSlug: string
): Promise<ContractorRecord[]> {
  try {
    console.log('[SERVER] Fetching contractors for:', { categorySlug, subregionSlug });

    type CategoryIdRecord = Pick<CategoryRecord, 'id' | 'slug'>;
    type SubregionIdRecord = Pick<SubregionRecord, 'id' | 'slug'>;

    // Get category and subregion IDs
    const categoryResult = await retryOperation<CategoryIdRecord>(async () => {
      const response = await supabase
        .from('categories')
        .select('id, slug')
        .eq('slug', categorySlug)
        .single();
      return {
        data: response.data as CategoryIdRecord | null,
        error: response.error
      };
    });

    const subregionResult = await retryOperation<SubregionIdRecord>(async () => {
      const response = await supabase
        .from('subregions')
        .select('id, slug')
        .eq('slug', subregionSlug)
        .single();
      return {
        data: response.data as SubregionIdRecord | null,
        error: response.error
      };
    });

    if (categoryResult.error || !categoryResult.data) {
      console.error('[SERVER] Error fetching category:', categoryResult.error);
      return [];
    }

    if (subregionResult.error || !subregionResult.data) {
      console.error('[SERVER] Error fetching subregion:', subregionResult.error);
      return [];
    }

    const category = categoryResult.data;
    const subregion = subregionResult.data;

    // Get contractors
    const contractorsResult = await retryOperation<ContractorRecord[]>(async () => {
      const response = await supabase
        .from('contractors')
        .select('*, categories!inner(*), subregions!inner(*)')
        .eq('category_id', category.id)
        .eq('subregion_id', subregion.id)
        .order('contractor_name', { ascending: true });
      return {
        data: Array.isArray(response.data) ? response.data : [],
        error: response.error
      };
    });

    if (contractorsResult.error) {
      console.error('[SERVER] Error fetching contractors:', contractorsResult.error);
      return [];
    }

    const contractors = contractorsResult.data || [];
    console.log('[SERVER] Found contractors:', contractors.length);

    return contractors;
  } catch (error) {
    console.error('[SERVER] Error in getContractorsByTradeAndSubregion:', error);
    return [];
  }
}

export async function getContractorBySlug(slug: string): Promise<ContractorRecord | null> {
  try {
    const result = await retryOperation<ContractorRecord>(async () => {
      const response = await supabase
        .from('contractors')
        .select(`
          *,
          category:categories(*),
          subregion:subregions(*)
        `)
        .eq('slug', slug)
        .single();
      return {
        data: response.data,
        error: response.error
      };
    });

    const { data: contractor, error } = result;

    if (error) {
      if (error.code === 'PGRST116') {
        console.warn(`[SERVER] No contractor found for slug: ${slug}`);
        return null;
      }
      console.error('[SERVER] Error fetching contractor:', {
        error,
        slug,
        context: 'getContractorBySlug'
      });
      return null;
    }

    return contractor;
  } catch (error) {
    console.error('[SERVER] Error in getContractorBySlug:', error);
    return null;
  }
}
