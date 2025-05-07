// src/app/api/categorylist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const SQUARE_API_URL = process.env.NEXT_PUBLIC_APP_SQUARE_API_URL;
const SQUARE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_APP_SQURAE_ACCESS_TOKEN_PROD;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  // const types = searchParams.get('types');

  try {
    const response = await axios.get(`${SQUARE_API_URL}/v2/catalog/list`, {
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2025-04-16',
        Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
      },
      // params: { types }, // Pass the query param
    });
    console.log('API::CategoryList:',response)
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Square API error:', error);
    // console.error('Square API error:', error?.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to fetch from Square API' }, { status: 500 });
  }
}
