'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import GameCard from '@/components/GameCard';
import CountdownTimer from '@/components/CountdownTimer';
import { Game, formatImageUrl } from '@/lib/igdb';
import { Calendar, TrendingUp, Clock, Gamepad2 } from 'lucide-react';

interface GameSection {
  title: string;
  icon: React.ReactNode;
  games: Game[];
  loading: boolean;
  error: string | null;
}

export default function Home() {
  const [upcomingGames, setUpcomingGames] = useState<GameSection>({
    title: 'Upcoming Releases',
    icon: <Calendar className="w-6 h-6" />,
    games: [],
    loading: true,
    error: null,
  });

  const [recentGames, setRecentGames] = useState<GameSection>({
    title: 'Recently Released',
    icon: <Clock className="w-6 h-6" />,
    games: [],
    loading: true,
    error: null,
  });

  const [trendingGames, setTrendingGames] = useState<GameSection>({
    title: 'Trending Now',
    icon: <TrendingUp className="w-6 h-6" />,
    games: [],
    loading: true,
    error: null,
  });

  const [featuredGame, setFeaturedGame] = useState<Game | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch upcoming games
        const upcomingResponse = await fetch('/api/games/upcoming');
        if (upcomingResponse.ok) {
          const upcomingData = await upcomingResponse.json();
          setUpcomingGames(prev => ({
            ...prev,
            games: upcomingData.games || [],
            loading: false,
          }));
          
          // Set featured game to the most anticipated upcoming game
          if (upcomingData.games && upcomingData.games.length > 0) {
            // Find the most anticipated game - prioritize games with actual hype and ratings
            const mostAnticipated = upcomingData.games
              .filter((game: Game) => game.first_release_date && game.first_release_date > 0)
              .sort((a: Game, b: Game) => {
                // Prioritize games with higher hype count first, then rating
                const aHype = a.hypes || 0;
                const bHype = b.hypes || 0;
                
                if (aHype !== bHype) {
                  return bHype - aHype; // Higher hype wins
                }
                
                const aRating = a.rating || 0;
                const bRating = b.rating || 0;
                return bRating - aRating; // Higher rating wins
              })[0];
            
            setFeaturedGame(mostAnticipated || upcomingData.games[0]);
          }
        } else {
          setUpcomingGames(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to load upcoming games',
          }));
        }

        // Fetch recent games
        const recentResponse = await fetch('/api/games/recent');
        if (recentResponse.ok) {
          const recentData = await recentResponse.json();
          setRecentGames(prev => ({
            ...prev,
            games: recentData.games || [],
            loading: false,
          }));
        } else {
          setRecentGames(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to load recent games',
          }));
        }

        // Fetch trending games
        const trendingResponse = await fetch('/api/games/trending');
        if (trendingResponse.ok) {
          const trendingData = await trendingResponse.json();
          setTrendingGames(prev => ({
            ...prev,
            games: trendingData.games || [],
            loading: false,
          }));
        } else {
          setTrendingGames(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to load trending games',
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const GameSection = ({ section }: { section: GameSection }) => (
    <section className="mb-12">
      <div className="flex items-center space-x-3 mb-6">
        <div className="text-purple-600">{section.icon}</div>
        <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
      </div>

      {section.loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse" />
          ))}
        </div>
      )}

      {section.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
          {section.error}
        </div>
      )}

      {!section.loading && !section.error && (
        <>
          {section.games.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {section.games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No games found in this category.
            </div>
          )}
        </>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-xl">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">GameEvents</h1>
              <p className="text-gray-600">
                Your gaming calendar & release tracker | 
                <a 
                  href="https://github.com/Sovereign97/gameevents" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 text-blue-600 hover:text-blue-800 underline"
                >
                  View Source
                </a>
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Game with Countdown */}
        {featuredGame && (
          <section className="mb-12">
            <div className="bg-gradient-to-r from-purple-600 to-blue-700 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-20" />
              <div className="relative z-10 flex items-center gap-8">
                {/* Game Cover Image */}
                <div className="flex-shrink-0">
                  {featuredGame.cover?.url ? (
                    <Image
                      src={formatImageUrl(featuredGame.cover.url, 'cover_big')}
                      alt={featuredGame.name}
                      width={200}
                      height={267}
                      className="rounded-xl shadow-2xl border-4 border-white/20"
                    />
                  ) : (
                    <div className="w-[200px] h-[267px] bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-2xl border-4 border-white/20 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold text-center px-4">{featuredGame.name}</span>
                    </div>
                  )}
                </div>
                
                {/* Game Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">Most Anticipated</h2>
                  </div>
                  <h3 className="text-4xl font-bold mb-4">{featuredGame.name}</h3>
                  <div className="max-w-2xl">
                    {featuredGame.first_release_date ? (
                      <CountdownTimer 
                        releaseDate={featuredGame.first_release_date} 
                        gameName={featuredGame.name}
                      />
                    ) : (
                      <p className="text-lg text-gray-600">Release date to be announced</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Game Sections */}
        <GameSection section={upcomingGames} />
        <GameSection section={recentGames} />
        <GameSection section={trendingGames} />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Gamepad2 className="w-6 h-6" />
            <span className="text-xl font-semibold">GameEvents</span>
          </div>
          <p className="text-gray-400 mb-2">
            Powered by IGDB API | Built with Next.js & Tailwind CSS
          </p>
          <p className="text-sm text-gray-500">
            DevOps-ready with Docker, CI/CD, and modern deployment practices
          </p>
        </div>
      </footer>
    </div>
  );
}
