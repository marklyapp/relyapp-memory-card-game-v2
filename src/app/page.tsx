"use client";

import { useState } from 'react';
import GameBoard from './components/GameBoard';
import DifficultySelector from './components/DifficultySelector';
import Leaderboard from './components/Leaderboard';
import { DifficultyConfig } from './lib/types';

export default function Home() {
  const [difficulty, setDifficulty] = useState<DifficultyConfig | null>(null);
  // key used to force re-mount (and thus re-trigger screen-enter animation) on screen change
  const [screenKey, setScreenKey] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleSelect = (config: DifficultyConfig) => {
    setDifficulty(config);
    setScreenKey((k) => k + 1);
  };

  const handleChangeDifficulty = () => {
    setDifficulty(null);
    setScreenKey((k) => k + 1);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-6 sm:py-10 px-2 sm:px-4">
      {/* Background decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/3 -right-16 w-64 h-64 bg-purple-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-16 left-1/4 w-80 h-80 bg-pink-200 rounded-full opacity-15 blur-3xl" />
      </div>

      <div className="flex flex-col items-center gap-5 sm:gap-8 w-full max-w-2xl">
        {/* App header — always visible */}
        <header className="text-center space-y-2 screen-enter w-full" aria-label="Memory Match game header">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-indigo-700 tracking-tight leading-none">
            🃏 Memory Match
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium">
            Flip the cards. Find the pairs.
          </p>

          {/* Leaderboard button — only shown on main menu */}
          {difficulty === null && (
            <div className="pt-1">
              <button
                onClick={() => setShowLeaderboard(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-yellow-50 active:bg-yellow-100 border border-yellow-300 text-yellow-700 font-semibold rounded-xl shadow-sm text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                aria-label="Open leaderboard"
              >
                🏆 Best Times
              </button>
            </div>
          )}
        </header>

        {/* Animated screen content area */}
        <div key={screenKey} className="w-full flex flex-col items-center">
          {difficulty === null ? (
            <DifficultySelector onSelect={handleSelect} />
          ) : (
            <GameBoard
              difficulty={difficulty}
              onChangeDifficulty={handleChangeDifficulty}
            />
          )}
        </div>
      </div>

      {/* Leaderboard modal — accessible from main menu */}
      {showLeaderboard && (
        <Leaderboard
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </main>
  );
}
