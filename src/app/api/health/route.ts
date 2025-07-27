import { NextResponse } from 'next/server';
import { igdbClient } from '@/lib/igdb';

export const dynamic = 'force-dynamic';

interface HealthData {
  status: string;
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  igdb?: { status: string; responseTime?: number; error?: string };
  responseTime?: number;
}

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Basic health check
    const healthData: HealthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };

    // Test IGDB connectivity
    try {
      await igdbClient.getUpcomingGames();
      healthData.igdb = { status: 'connected', responseTime: Date.now() - startTime };
    } catch (igdbError) {
      healthData.igdb = { status: 'disconnected', error: 'Failed to connect to IGDB API' };
      healthData.status = 'degraded';
    }

    const responseTime = Date.now() - startTime;
    healthData.responseTime = responseTime;

    const statusCode = healthData.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(healthData, { status: statusCode });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      responseTime: Date.now() - startTime,
    }, { status: 503 });
  }
} 