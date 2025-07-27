import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  releaseDate: number; // Unix timestamp
  gameName: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ releaseDate, gameName }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const timeDifference = Math.max(0, releaseDate - now);
      
      const days = Math.floor(timeDifference / (24 * 60 * 60));
      const hours = Math.floor((timeDifference % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((timeDifference % (60 * 60)) / 60);
      const seconds = timeDifference % 60;

      return { days, hours, minutes, seconds };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [releaseDate]);

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-medium text-gray-900">🎉 {gameName} is now available!</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex justify-center space-x-8 mb-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-1">{String(timeLeft.days)}</div>
          <div className="text-sm text-white/80 uppercase tracking-wide">Days</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-1">{String(timeLeft.hours)}</div>
          <div className="text-sm text-white/80 uppercase tracking-wide">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-1">{String(timeLeft.minutes)}</div>
          <div className="text-sm text-white/80 uppercase tracking-wide">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-1">{String(timeLeft.seconds)}</div>
          <div className="text-sm text-white/80 uppercase tracking-wide">Seconds</div>
        </div>
      </div>
      <p className="text-sm text-white/90">Until {gameName} releases</p>
    </div>
  );
};

export default CountdownTimer; 