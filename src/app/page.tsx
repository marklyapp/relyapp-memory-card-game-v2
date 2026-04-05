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
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 sm:py-12 px-2">
      <div className="flex flex-col items-center gap-6 sm:gap-8 w-full">
        {/* App header */}
        <div className="text-center space-y-2 screen-enter">
          <h1 className="text-4xl sm:text-5xl font-bold text-indigo-700 tracking-tight">
            🃏 Memory Match
          </h1>
          <p className="text-base sm:text-lg text-gray-500">
            Flip the cards. Find the pairs.
          </p>
          {/* Leaderboard button — only shown on main menu */}
          {difficulty === null && (
            <button
              onClick={() => setShowLeaderboard(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-yellow-50 active:bg-yellow-100 border border-yellow-300 text-yellow-700 font-semibold rounded-xl shadow-sm text-sm transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              aria-label="Open leaderboard"
            >
              🏆 Best Times
            </button>
          )}
        </div>

        {/* Screen content */}
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
