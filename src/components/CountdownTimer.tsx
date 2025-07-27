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
      <div className="flex justify-center space-x-6 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{String(timeLeft.days)}</div>
          <div className="text-sm text-gray-700">Days</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{String(timeLeft.hours)}</div>
          <div className="text-sm text-gray-700">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{String(timeLeft.minutes)}</div>
          <div className="text-sm text-gray-700">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{String(timeLeft.seconds)}</div>
          <div className="text-sm text-gray-700">Seconds</div>
        </div>
      </div>
      <p className="text-sm text-gray-600">Until {gameName} releases</p>
    </div>
  );
};

export default CountdownTimer; 