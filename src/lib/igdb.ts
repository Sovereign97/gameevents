import axios from 'axios';

interface TwitchTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface Game {
  id: number;
  name: string;
  summary?: string;
  first_release_date?: number;
  cover?: {
    id: number;
    url: string;
  };
  screenshots?: Array<{
    id: number;
    url: string;
  }>;
  genres?: Array<{
    id: number;
    name: string;
  }>;
  platforms?: Array<{
    id: number;
    name: string;
    abbreviation?: string;
  }>;
  rating?: number;
  rating_count?: number;
  hypes?: number;
}

class IGDBClient {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = process.env.TWITCH_CLIENT_ID || '';
    this.clientSecret = process.env.TWITCH_CLIENT_SECRET || '';
    
    // Note: Credentials are loaded at runtime, so this check may be misleading during build
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post<TwitchTokenResponse>(
        'https://id.twitch.tv/oauth2/token',
        null,
        {
          params: {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: 'client_credentials',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;

      return this.accessToken;
    } catch (error) {
      console.error('Failed to get Twitch access token:', error);
      throw new Error('Failed to authenticate with IGDB API');
    }
  }

  private async makeRequest(endpoint: string, body: string): Promise<Game[]> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.post(
        `https://api.igdb.com/v4/${endpoint}`,
        body,
        {
          headers: {
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'text/plain',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(`IGDB API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getUpcomingGames(limit: number = 20): Promise<Game[]> {
    const today = Math.floor(Date.now() / 1000);
    const sixMonthsFromNow = today + (180 * 24 * 60 * 60); // Extended to 6 months for more games

    const query = `
      fields name, summary, first_release_date, cover.url, screenshots.url, genres.name, platforms.name, platforms.abbreviation, rating, rating_count, hypes;
      where first_release_date >= ${today} & first_release_date <= ${sixMonthsFromNow} & category = 0;
      sort first_release_date asc;
      limit ${limit};
    `;

    return this.makeRequest('games', query);
  }

  async getRecentlyReleasedGames(limit: number = 20): Promise<Game[]> {
    const today = Math.floor(Date.now() / 1000);
    const oneMonthAgo = today - (30 * 24 * 60 * 60);

    const query = `
      fields name, summary, first_release_date, cover.url, screenshots.url, genres.name, platforms.name, platforms.abbreviation, rating, rating_count, hypes;
      where first_release_date >= ${oneMonthAgo} & first_release_date <= ${today} & category = 0;
      sort first_release_date desc;
      limit ${limit};
    `;

    return this.makeRequest('games', query);
  }

  async getTrendingGames(limit: number = 20): Promise<Game[]> {
    const query = `
      fields name, summary, first_release_date, cover.url, screenshots.url, genres.name, platforms.name, platforms.abbreviation, rating, rating_count, hypes;
      where hypes > 5 & rating > 70 & category = 0;
      sort hypes desc;
      limit ${limit};
    `;

    return this.makeRequest('games', query);
  }
}

// Utility functions
export function formatImageUrl(url: string, size: 'thumb' | 'cover_small' | 'cover_big' | 'screenshot_med' | 'screenshot_big' = 'cover_big'): string {
  if (!url) return '';
  return url.replace('t_thumb', `t_${size}`).replace('//', 'https://');
}

export function formatReleaseDate(timestamp?: number): string {
  if (!timestamp) return 'TBA';
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getTimeUntilRelease(timestamp?: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
} {
  if (!timestamp || timestamp <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
  }

  const now = Date.now();
  const releaseDate = timestamp * 1000;
  const difference = releaseDate - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = Math.max(0, Math.floor((difference % (1000 * 60)) / 1000));

  return { days, hours, minutes, seconds, isPast: false };
}

export const igdbClient = new IGDBClient();
export type { Game }; 