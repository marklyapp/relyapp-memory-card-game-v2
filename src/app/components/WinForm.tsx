"use client";

import { useState } from "react";
import { DifficultyLevel } from "../lib/types";
import { addEntry, wouldMakeTop10, LeaderboardEntry } from "../lib/leaderboard";
import { formatTime } from "../lib/timer";

interface WinFormProps {
  timeMs: number;
  difficulty: DifficultyLevel;
  moves: number;
  onSaved: (entry: LeaderboardEntry) => void;
  onSkip: () => void;
}

export default function WinForm({ timeMs, difficulty, moves, onSaved, onSkip }: WinFormProps) {
  const [name, setName] = useState("");
  const mightRank = wouldMakeTop10(timeMs, difficulty);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const playerName = name.trim() || "Anonymous";
    const entry: LeaderboardEntry = {
      name: playerName,
      timeMs,
      timeFormatted: formatTime(timeMs),
      difficulty,
      date: new Date().toISOString(),
    };
    addEntry(entry);
    onSaved(entry);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 mt-2"
      aria-label="Save your score"
    >
      <div className="text-center">
        <p className="text-base font-semibold text-gray-700">
          {mightRank ? "🏆 You made the top 10! Save your score:" : "Save your score:"}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Time: <strong className="font-mono text-green-700">{formatTime(timeMs)}</strong>
          {" · "}{moves} moves
        </p>
      </div>
      <div className="flex gap-2 w-full max-w-xs">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Anonymous"
          maxLength={24}
          className="flex-1 px-3 py-2 rounded-xl border border-indigo-200 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Player name"
          autoFocus
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl shadow text-sm transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
        >
          Save
        </button>
      </div>
      <button
        type="button"
        onClick={onSkip}
        className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 cursor-pointer transition-colors"
      >
        Skip
      </button>
    </form>
  );
}
