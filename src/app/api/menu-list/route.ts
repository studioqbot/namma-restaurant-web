/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosResponse } from 'axios';

const SQUARE_API_URL = process.env.NEXT_PUBLIC_APP_SQUARE_API_URL;
const SQUARE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_APP_SQUARE_ACCESS_TOKEN_PROD;

let cachedData: any = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface SquareCatalogObject {
  type: string;
  id?: string;
  is_deleted?: boolean;
  item_data?: {
    reporting_category?: { id?: string };
    name?: string;
    variations?: {
      item_variation_data?: {
        price_money?: {
          amount?: number;
          currency?: string;
        };
      };
    }[];
  };
}

interface SquareCatalogResponse {
  objects?: SquareCatalogObject[];
  cursor?: string | null;
}

// Utility to get nested value using dot-notation
function getByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => {
    if (acc === undefined || acc === null) return undefined;
    if (/^\d+$/.test(key)) return acc[parseInt(key, 10)];
    return acc[key];
  }, obj);
}

// Map dot-paths to custom response keys
const requiredFields: Record<string, string> = {
  // 'item_data.reporting_category.id': 'category_id',
  // 'item_data.name': 'name',
  // Add more like:
  // 'item_data.variations.0.item_variation_data.price_money.amount': 'amount',
  // 'item_data.variations.0.item_variation_data.price_money.currency': 'currency',
};

export async function GET(_req: NextRequest): Promise<NextResponse> {
  if (!SQUARE_API_URL || !SQUARE_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'Missing Square configuration in environment variables' },
      { status: 500 }
    );
  }

  const now = Date.now();
  if (cachedData && now - cacheTimestamp < CACHE_TTL) {
    return NextResponse.json({ objects: cachedData });
  }

  const allItems: SquareCatalogObject[] = [];
  let cursor: string | null = null;

  try {
    // Fetch catalog items
    do {
      const response: AxiosResponse<SquareCatalogResponse> = await axios.get(
        `${SQUARE_API_URL}/v2/catalog/list`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Square-Version': '2025-04-16',
            Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
          },
          params: cursor ? { cursor } : {},
        }
      );

      const { objects = [], cursor: nextCursor } = response.data;
      allItems.push(...objects);
      cursor = nextCursor ?? null;
    } while (cursor);

    // Filter only ITEMs
    const filteredItems = allItems.filter(
      (obj) => obj.type === 'ITEM' && !obj.is_deleted
    );

    // Build simplified objects with custom keys
    const simplified = filteredItems.map((item) => {
      const result: Record<string, any> = {};
      for (const [path, customKey] of Object.entries(requiredFields)) {
        const value = getByPath(item, path);
        if (value !== undefined) {
          result[customKey] = value;
        }
      }
      return result;
    });

    // Cache and return
    cachedData = simplified;
    cacheTimestamp = now;

    return NextResponse.json({ objects: simplified });
  } catch (error: unknown) {
    const errorMessage =
      axios.isAxiosError(error)
        ? error.response?.data ?? error.message
        : error instanceof Error
        ? error.message
        : 'Unknown error';

    console.error('Square API error:', errorMessage);

    return NextResponse.json(
      { error: 'Failed to fetch data from Square API', details: errorMessage },
      { status: 500 }
    );
  }
}
