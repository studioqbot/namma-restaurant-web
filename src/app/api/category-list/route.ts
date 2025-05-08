import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosResponse } from 'axios';

const SQUARE_API_URL = process.env.NEXT_PUBLIC_APP_SQUARE_API_URL;
const SQUARE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_APP_SQUARE_ACCESS_TOKEN_PROD;

// Define a more specific type if available
interface SquareCatalogObject {
  // Add more properties if known, for now use index signature
  [key: string]: unknown;
}

interface SquareCatalogResponse {
  objects?: SquareCatalogObject[];
  cursor?: string | null;
}

export async function GET(req: NextRequest) {
  let allItems: SquareCatalogObject[] = [];
  let cursor: string | null = null;

  try {
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

      allItems = [...allItems, ...objects];
      cursor = nextCursor || null;

      console.log(`Fetched ${objects.length} items. Next cursor: ${cursor}`);
    } while (cursor);

    return NextResponse.json({ objects: allItems });
  } catch (error: unknown) {
    let errorMessage = 'Unknown error';

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error('Square API error:', errorMessage);

    return NextResponse.json(
      { error: 'Failed to fetch from Square API', details: errorMessage },
      { status: 500 }
    );
  }
}
