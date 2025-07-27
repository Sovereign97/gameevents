import { NextResponse } from 'next/server';
import { igdbClient } from '@/lib/igdb';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const recentGames = await igdbClient.getRecentlyReleasedGames();
    
    return NextResponse.json({
      games: recentGames,
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching recent games:', error);
    
    return NextResponse.json({
      games: [],
      success: false,
      error: 'Failed to fetch recent games',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 