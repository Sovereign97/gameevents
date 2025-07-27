import { NextResponse } from 'next/server';
import { igdbClient } from '@/lib/igdb';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const trendingGames = await igdbClient.getTrendingGames();
    
    return NextResponse.json({
      games: trendingGames,
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching trending games:', error);
    
    return NextResponse.json({
      games: [],
      success: false,
      error: 'Failed to fetch trending games',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 