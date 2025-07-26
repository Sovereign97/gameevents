import { NextResponse } from 'next/server';
import { igdbClient } from '@/lib/igdb';

export async function GET() {
  try {
    const games = await igdbClient.getTrendingGames(6);
    return NextResponse.json({ games });
  } catch (error) {
    console.error('Error fetching trending games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending games' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 1800; // Cache for 30 minutes 