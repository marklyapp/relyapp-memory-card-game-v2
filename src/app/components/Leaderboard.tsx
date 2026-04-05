"use client";

import { useState, useEffect, useCallback } from "react";
import { DifficultyLevel, DIFFICULTY_CONFIGS } from "../lib/types";
import { getTopEntries, clearLeaderboard, clearAllLeaderboard, LeaderboardEntry } from "../lib/leaderboard";

interface LeaderboardProps {
  highlightEntry?: LeaderboardEntry | null;
  initialDifficulty?: DifficultyLevel;
  onClose: () => void;
}

const TABS: { level: DifficultyLevel; label: string; icon: string }[] = [
  { level: "easy", label: "Easy", icon: "🌿" },
  { level: "medium", label: "Medium", icon: "⚡" },
  { level: "hard", label: "Hard", icon: "🔥" },
];

function fmt(iso: string): string {
  try { return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
  catch { return ""; }
}

function isMatch(a: LeaderboardEntry, b: LeaderboardEntry): boolean {
  return a.name === b.name && a.timeMs === b.timeMs && a.date === b.date && a.difficulty === b.difficulty;
}

export default function Leaderboard({ highlightEntry, initialDifficulty = "easy", onClose }: LeaderboardProps) {
  const [tab, setTab] = useState<DifficultyLevel>(highlightEntry?.difficulty ?? initialDifficulty);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [confirm, setConfirm] = useState<null | "tab" | "all">(null);

  const load = useCallback(() => setEntries(getTopEntries(tab)), [tab]);
  useEffect(() => { load(); setConfirm(null); }, [load]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (confirm) setConfirm(null); else onClose(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, confirm]);

  const doClear = (mode: "tab" | "all") => {
    if (mode === "all") clearAllLeaderboard(); else clearLeaderboard(tab);
    load(); setConfirm(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog" aria-modal="true" aria-label="Leaderboard"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden screen-enter">
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center gap-2"><span aria-hidden="true">🏆</span><h2 className="text-lg font-bold">Best Times</h2></div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none font-bold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded" aria-label="Close leaderboard">×</button>
        </div>
        <div className="flex border-b border-gray-100" role="tablist">
          {TABS.map((t) => (
            <button key={t.level} role="tab" aria-selected={tab === t.level}
              onClick={() => setTab(t.level)}
              className={"flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400 " + (tab === t.level ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50/60" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50")}
            ><span aria-hidden="true">{t.icon}</span>{t.label}</button>
          ))}
        </div>
        <div className="px-4 py-3 min-h-[220px] max-h-[360px] overflow-y-auto" role="tabpanel">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 h-40 text-gray-400">
              <span className="text-3xl" aria-hidden="true">🕹️</span>
              <p className="text-sm">No times yet for {DIFFICULTY_CONFIGS[tab].label}.</p>
              <p className="text-xs">Win a game to see your score here!</p>
            </div>
          ) : (
            <ol className="flex flex-col gap-1.5" role="list">
              {entries.map((entry, i) => {
                const rank = i + 1;
                const isNew = !!highlightEntry && isMatch(entry, highlightEntry);
                const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
                return (
                  <li key={i} className={"flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm " + (isNew ? "bg-yellow-50 border-2 border-yellow-300 shadow-sm" : rank % 2 === 0 ? "bg-gray-50 border border-gray-100" : "bg-white border border-gray-100")}>
                    <span className="w-7 text-center shrink-0">{medal ? <span>{medal}</span> : <span className="font-bold text-gray-400 text-xs">{rank}</span>}</span>
                    <span className="flex-1 font-semibold text-gray-700 truncate">
                      {entry.name}
                      {isNew && <span className="ml-1.5 text-xs font-bold text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded-full">NEW</span>}
                    </span>
                    <span className="font-mono font-bold text-indigo-600 shrink-0">{entry.timeFormatted}</span>
                    <span className="text-xs text-gray-400 shrink-0 hidden sm:block">{fmt(entry.date)}</span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/60">
          {confirm ? (
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs text-gray-600 flex-1">{confirm === "all" ? "Clear ALL entries?" : "Clear all " + DIFFICULTY_CONFIGS[tab].label + " times?"}</span>
              <button onClick={() => doClear(confirm)} className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg cursor-pointer transition-all">Confirm</button>
              <button onClick={() => setConfirm(null)} className="px-3 py-1.5 text-xs bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 font-semibold rounded-lg cursor-pointer">Cancel</button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <button onClick={() => setConfirm("tab")} className="px-3 py-1.5 text-xs bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 font-semibold rounded-lg cursor-pointer transition-all" aria-label={"Clear " + DIFFICULTY_CONFIGS[tab].label + " leaderboard"}>Clear {DIFFICULTY_CONFIGS[tab].label}</button>
                <button onClick={() => setConfirm("all")} className="px-3 py-1.5 text-xs bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 font-semibold rounded-lg cursor-pointer transition-all" aria-label="Clear all leaderboard entries">Clear All</button>
              </div>
              <button onClick={onClose} className="ml-auto px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow cursor-pointer transition-all">Close</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
