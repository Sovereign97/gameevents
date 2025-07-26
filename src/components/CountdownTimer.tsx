'use client';

import React, { useState, useEffect } from 'react';
import { getTimeUntilRelease } from '@/lib/igdb';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  releaseDate?: number;
  gameName: string;
}

export default function CountdownTimer({ releaseDate, gameName }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!releaseDate || releaseDate <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
    }
    
    const now = Date.now();
    const releaseTime = releaseDate * 1000;
    const difference = releaseTime - now;
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds, isPast: false };
  });

  useEffect(() => {
    if (!releaseDate || releaseDate <= 0) return;



    const interval = setInterval(() => {
      const now = Date.now();
      const releaseTime = releaseDate * 1000;
      const difference = releaseTime - now;
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        clearInterval(interval);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    }, 1000);

    return () => clearInterval(interval);
  }, [releaseDate, gameName]);

  if (!releaseDate) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <Clock className="w-5 h-5" />
          <span className="font-medium">Release Date TBA</span>
        </div>
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className="bg-green-100 rounded-lg p-4 text-center">
        <div className="text-green-800 font-semibold">
          🎉 {gameName} is now available!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg p-4 text-center">
      <div className="flex items-center justify-center space-x-2 mb-3">
        <Clock className="w-5 h-5" />
        <span className="font-medium">Time Until Release</span>
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-white bg-opacity-20 rounded p-2">
          <div className="text-2xl font-bold text-gray-900">{String(timeLeft.days || 0)}</div>
          <div className="text-xs uppercase tracking-wide text-gray-700">Days</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded p-2">
          <div className="text-2xl font-bold text-gray-900">{String(timeLeft.hours || 0)}</div>
          <div className="text-xs uppercase tracking-wide text-gray-700">Hours</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded p-2">
          <div className="text-2xl font-bold text-gray-900">{String(timeLeft.minutes || 0)}</div>
          <div className="text-xs uppercase tracking-wide text-gray-700">Minutes</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded p-2">
          <div className="text-2xl font-bold text-gray-900">{String(timeLeft.seconds || 0)}</div>
          <div className="text-xs uppercase tracking-wide text-gray-700">Seconds</div>
        </div>
      </div>
    </div>
  );
} 