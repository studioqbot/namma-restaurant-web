// src/app/api/search-catalog-item/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const SQUARE_API_URL = process.env.NEXT_PUBLIC_APP_SQUARE_API_URL;
const SQUARE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_APP_SQURAE_ACCESS_TOKEN_PROD;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Get the POST body

    const response = await axios.post(
      `${SQUARE_API_URL}/v2/catalog/search-catalog-items`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Square-Version': '2023-10-18',
          Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Square API error:', error?.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to search catalog items' }, { status: 500 });
  }
}
