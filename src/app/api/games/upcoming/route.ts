import { NextResponse } from 'next/server';
import { igdbClient } from '@/lib/igdb';

export async function GET() {
  try {
    const games = await igdbClient.getUpcomingGames(12);
    return NextResponse.json({ games });
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming games' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour 