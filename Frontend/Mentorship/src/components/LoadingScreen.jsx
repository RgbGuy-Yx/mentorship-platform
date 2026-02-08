
import { useState, useEffect } from 'react';

export default function LoadingScreen({ message = "Welcome to Dashboard" }) {
  const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < message.length) {
        setDisplayedText(message.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50); // 50ms between each character

    return () => clearInterval(interval);
  }, [message]);

  return (
    <div className="fixed inset-0 bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Spinner */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-white rounded-full animate-spin"></div>
        </div>

        {/* Welcome Message with typewriter effect */}
        <h1 className="text-4xl font-bold text-white min-h-16">
          {displayedText}
          <span className="animate-pulse">|</span>
        </h1>

        {/* Subtitle */}
        <p className="text-blue-100 mt-4 text-lg">
          Preparing your workspace...
        </p>
      </div>
    </div>
  );
}
