import { NextResponse } from 'next/server';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    igdb: 'operational' | 'degraded' | 'down';
    api: 'operational' | 'degraded' | 'down';
  };
  environment: string;
}

export async function GET(): Promise<NextResponse<HealthStatus>> {
  try {
    // Check IGDB service health
    let igdbStatus: 'operational' | 'degraded' | 'down' = 'operational';
    
    try {
      const hasCredentials = process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET;
      if (!hasCredentials) {
        igdbStatus = 'degraded';
      }
    } catch {
      igdbStatus = 'down';
    }

    // Calculate uptime (simplified)
    const uptime = process.uptime();

    const health: HealthStatus = {
      status: igdbStatus === 'down' ? 'unhealthy' : 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.round(uptime),
      version: '1.0.0',
      services: {
        igdb: igdbStatus,
        api: 'operational'
      },
      environment: process.env.NODE_ENV || 'development'
    };

    const statusCode = health.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(health, { status: statusCode });
  } catch (error) {
    console.error('Health check failed:', error);
    
    const unhealthyResponse: HealthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: 0,
      version: 'unknown',
      services: {
        igdb: 'down',
        api: 'down'
      },
      environment: process.env.NODE_ENV || 'development'
    };

    return NextResponse.json(unhealthyResponse, { status: 503 });
  }
}

export const dynamic = 'force-dynamic'; 