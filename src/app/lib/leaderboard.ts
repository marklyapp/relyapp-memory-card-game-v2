import { DifficultyLevel } from "./types";

export interface LeaderboardEntry {
  name: string;
  timeMs: number;
  timeFormatted: string;
  difficulty: DifficultyLevel;
  date: string;
}

const STORAGE_KEY = "memory-match-leaderboard";
const MAX_ENTRIES = 10;

export function loadLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LeaderboardEntry[]) : [];
  } catch {
    return [];
  }
}

function saveLeaderboard(entries: LeaderboardEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getTopEntries(difficulty: DifficultyLevel): LeaderboardEntry[] {
  return loadLeaderboard()
    .filter((e) => e.difficulty === difficulty)
    .sort((a, b) => a.timeMs - b.timeMs)
    .slice(0, MAX_ENTRIES);
}

export function wouldMakeTop10(timeMs: number, difficulty: DifficultyLevel): boolean {
  const top = getTopEntries(difficulty);
  if (top.length < MAX_ENTRIES) return true;
  return timeMs < top[top.length - 1].timeMs;
}

export function addEntry(entry: LeaderboardEntry): number | null {
  const updated = [...loadLeaderboard(), entry];
  saveLeaderboard(updated);
  const diffEntries = updated
    .filter((e) => e.difficulty === entry.difficulty)
    .sort((a, b) => a.timeMs - b.timeMs);
  const rank = diffEntries.findIndex(
    (e) => e.name === entry.name && e.timeMs === entry.timeMs && e.date === entry.date
  );
  return rank >= 0 && rank < MAX_ENTRIES ? rank + 1 : null;
}

export function clearLeaderboard(difficulty: DifficultyLevel): void {
  saveLeaderboard(loadLeaderboard().filter((e) => e.difficulty !== difficulty));
}

export function clearAllLeaderboard(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
