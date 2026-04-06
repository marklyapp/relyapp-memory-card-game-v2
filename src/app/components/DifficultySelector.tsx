"use client";

import { DifficultyConfig, DifficultyLevel, DIFFICULTY_CONFIGS } from "../lib/types";

interface DifficultySelectorProps {
  onSelect: (config: DifficultyConfig) => void;
}

const BUTTON_STYLES: Record<DifficultyLevel, {
  base: string;
  hoverShadow: string;
  icon: string;
  grid: string;
  badgeBg: string;
}> = {
  easy: {
    base: "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 border-emerald-700 focus-visible:ring-emerald-400",
    hoverShadow: "hover:shadow-emerald-200",
    icon: "🌿",
    grid: "3×4",
    badgeBg: "bg-emerald-800/40 border-emerald-400/30",
  },
  medium: {
    base: "bg-amber-500 hover:bg-amber-400 active:bg-amber-600 border-amber-600 focus-visible:ring-amber-400",
    hoverShadow: "hover:shadow-amber-200",
    icon: "⚡",
    grid: "4×4",
    badgeBg: "bg-amber-800/40 border-amber-400/30",
  },
  hard: {
    base: "bg-rose-600 hover:bg-rose-500 active:bg-rose-700 border-rose-700 focus-visible:ring-rose-400",
    hoverShadow: "hover:shadow-rose-200",
    icon: "🔥",
    grid: "5×6",
    badgeBg: "bg-rose-800/40 border-rose-400/30",
  },
};

export default function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  const difficulties = Object.values(DIFFICULTY_CONFIGS);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm px-2 sm:px-4 screen-enter">
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-indigo-700">Choose Difficulty</h2>
        <p className="text-gray-500 text-sm">Select a grid size to start playing</p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {difficulties.map((config, i) => {
          const style = BUTTON_STYLES[config.level];
          return (
            <button
              key={config.level}
              onClick={() => onSelect(config)}
              className={
                "w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 " +
                "text-white font-semibold shadow-md hover:shadow-lg " +
                "transition-all duration-200 cursor-pointer " +
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
                "screen-enter " +
                style.base + " " + style.hoverShadow
              }
              style={{ animationDelay: `${i * 70}ms` }}
              aria-label={`${config.label} difficulty: ${config.description}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0" aria-hidden="true">{style.icon}</span>
                <div className="flex flex-col items-start gap-0.5 min-w-0">
                  <span className="text-lg font-extrabold tracking-tight">{config.label}</span>
                  <span className="text-xs sm:text-sm font-normal opacity-90 truncate">
                    {config.description}
                  </span>
                </div>
              </div>
              <span
                className={
                  "text-xs font-bold px-2.5 py-1.5 rounded-lg border whitespace-nowrap ml-3 shrink-0 " +
                  style.badgeBg
                }
                aria-hidden="true"
              >
                {style.grid}
              </span>
            </button>
          );
        })}
      </div>

      {/* Helpful tip */}
      <p className="text-xs text-gray-400 text-center px-2">
        💡 Tip: the timer only starts when you flip your first card
      </p>
    </div>
  );
}
