import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosResponse } from 'axios';

const SQUARE_API_URL = process.env.NEXT_PUBLIC_APP_SQUARE_API_URL;
const SQUARE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_APP_SQURAE_ACCESS_TOKEN_PROD;

// Define the expected structure of the response data
interface SquareCatalogResponse {
  objects: any[];  // You can replace `any[]` with the specific type if you know the shape of each object
  cursor: string | null;
}

export async function GET(req: NextRequest) {
  let allItems: any[] = []; // Array to store all items
  let cursor: string | null = null; // The cursor to handle pagination

  try {
    // Continue fetching while there's a cursor (pagination)
    do {
      // Fetch the data from Square API
      const response: AxiosResponse<SquareCatalogResponse> = await axios.get(SQUARE_API_URL + '/v2/catalog/list', {
        headers: {
          'Content-Type': 'application/json',
          'Square-Version': '2025-04-16',
          Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
        },
        params: cursor ? { cursor } : {},  // Include cursor in request if it exists
      });

      // Append the items from this page to the allItems array
      allItems = [...allItems, ...(response.data.objects || [])];

      // Update cursor if more items are available
      cursor = response.data.cursor || null;

      console.log(`Fetched ${response.data.objects?.length || 0} items. Next cursor: ${cursor}`);
    } while (cursor); // Continue fetching if there is a cursor

    // Once all items are fetched, return the complete list
    return NextResponse.json({ objects: allItems });
  } catch (error: any) {
    console.error('Square API error:', error?.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to fetch from Square API' }, { status: 500 });
  }
}
