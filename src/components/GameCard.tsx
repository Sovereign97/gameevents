'use client';

import React from 'react';
import { Game, formatImageUrl, formatReleaseDate } from '@/lib/igdb';
import { Calendar, Star, Users } from 'lucide-react';
import Image from 'next/image';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const coverUrl = game.cover?.url ? formatImageUrl(game.cover.url, 'cover_big') : '';
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={game.name}
            width={300}
            height={400}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <span className="text-white text-lg font-semibold text-center px-2">{game.name}</span>
          </div>
        )}
        
        {game.rating && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded-lg flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{Math.round(game.rating)}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{game.name}</h3>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{formatReleaseDate(game.first_release_date)}</span>
        </div>

        {game.genres && game.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {game.genres.slice(0, 3).map((genre) => (
              <span
                key={genre.id}
                className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}

        {game.platforms && game.platforms.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {game.platforms.slice(0, 4).map((platform) => (
              <span
                key={platform.id}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {platform.abbreviation || platform.name}
              </span>
            ))}
          </div>
        )}

        {game.hypes && game.hypes > 0 && (
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{game.hypes} people hyped</span>
          </div>
        )}
      </div>
    </div>
  );
} 