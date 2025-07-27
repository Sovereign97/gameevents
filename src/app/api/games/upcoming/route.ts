import { NextResponse } from 'next/server';
import { igdbClient } from '@/lib/igdb';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const upcomingGames = await igdbClient.getUpcomingGames();
    
    return NextResponse.json({
      games: upcomingGames,
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    
    return NextResponse.json({
      games: [],
      success: false,
      error: 'Failed to fetch upcoming games',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 