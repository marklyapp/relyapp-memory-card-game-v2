"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import Card from './Card';
import WinForm from './WinForm';
import Leaderboard from './Leaderboard';
import { CardType, DifficultyConfig } from '../lib/types';
import { createShuffledDeck } from '../lib/deck';
import { useTimer, formatTime } from '../lib/timer';
import { LeaderboardEntry } from '../lib/leaderboard';

interface GameBoardProps {
  difficulty: DifficultyConfig;
  onChangeDifficulty: () => void;
}

// Map column count to a Tailwind grid-cols class
function gridColsClass(cols: number): string {
  const map: Record<number, string> = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
  };
  return map[cols] ?? 'grid-cols-4';
}

export default function GameBoard({ difficulty, onChangeDifficulty }: GameBoardProps) {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [moves, setMoves] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [finalTimeMs, setFinalTimeMs] = useState<number>(0);
  const [finalTime, setFinalTime] = useState<string>("");
  const [hasStarted, setHasStarted] = useState(false);
  // ids of cards that just mismatched (for shake animation)
  const [mismatchIds, setMismatchIds] = useState<number[]>([]);
  // leaderboard state
  const [savedEntry, setSavedEntry] = useState<LeaderboardEntry | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [formDone, setFormDone] = useState(false);

  const { elapsedMs, start: startTimer, stop: stopTimer, reset: resetTimer } = useTimer();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize deck when difficulty changes
  useEffect(() => {
    setCards(createShuffledDeck(difficulty.pairs));
    setFlippedIds([]);
    setIsChecking(false);
    setMoves(0);
    setHasWon(false);
    setFinalTimeMs(0);
    setFinalTime("");
    setHasStarted(false);
    setMismatchIds([]);
    setSavedEntry(null);
    setShowLeaderboard(false);
    setFormDone(false);
    resetTimer();
  // resetTimer is stable (useCallback), safe to include
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  // Check win condition whenever cards change
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.isMatched)) {
      stopTimer();
      setFinalTimeMs(elapsedMs);
      setFinalTime(formatTime(elapsedMs));
      setHasWon(true);
    }
  // We intentionally capture elapsedMs at the moment of win; stopTimer is stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  const handleCardClick = useCallback(
    (id: number) => {
      if (isChecking) return;
      if (flippedIds.includes(id)) return;
      if (flippedIds.length >= 2) return;

      // Start timer on first card flip
      if (!hasStarted) {
        startTimer();
        setHasStarted(true);
      }

      const newFlipped = [...flippedIds, id];

      // Flip the clicked card
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
      );
      setFlippedIds(newFlipped);

      if (newFlipped.length === 2) {
        setIsChecking(true);
        setMoves((m) => m + 1);
        setMismatchIds([]);

        const [firstId, secondId] = newFlipped;

        // Use a snapshot to determine match
        setCards((prev) => {
          const first = prev.find((c) => c.id === firstId)!;
          const second = prev.find((c) => c.id === secondId)!;
          const matched = first.emoji === second.emoji;

          if (matched) {
            // Mark both as matched immediately
            const updated = prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false, isMatched: true }
                : c
            );
            setTimeout(() => {
              setFlippedIds([]);
              setIsChecking(false);
              setMismatchIds([]);
            }, 300);
            return updated;
          } else {
            // Trigger mismatch shake
            setMismatchIds([firstId, secondId]);
            // No match — show both for ~0.9s then flip back
            timeoutRef.current = setTimeout(() => {
              setCards((current) =>
                current.map((c) =>
                  c.id === firstId || c.id === secondId
                    ? { ...c, isFlipped: false }
                    : c
                )
              );
              setFlippedIds([]);
              setIsChecking(false);
              setMismatchIds([]);
            }, 900);
            return prev;
          }
        });
      }
    },
    [flippedIds, isChecking, hasStarted, startTimer]
  );

  const handleRestart = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCards(createShuffledDeck(difficulty.pairs));
    setFlippedIds([]);
    setIsChecking(false);
    setMoves(0);
    setHasWon(false);
    setFinalTimeMs(0);
    setFinalTime("");
    setHasStarted(false);
    setMismatchIds([]);
    setSavedEntry(null);
    setShowLeaderboard(false);
    setFormDone(false);
    resetTimer();
  };

  const handleSaved = (entry: LeaderboardEntry) => {
    setSavedEntry(entry);
    setFormDone(true);
    setShowLeaderboard(true);
  };

  const handleSkip = () => {
    setFormDone(true);
  };

  const matchedCount = cards.filter((c) => c.isMatched).length / 2;
  const totalPairs = difficulty.pairs;
  const isDisabled = isChecking || flippedIds.length >= 2;
  const colsClass = gridColsClass(difficulty.cols);
  const compact = difficulty.level === "hard";

  // Timer display: active (pulsing) only when game is in progress
  const timerActive = hasStarted && !hasWon;

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-2xl px-2 sm:px-4 screen-enter">
      {/* Header row — stats + controls */}
      <div className="flex items-center justify-between w-full gap-2 flex-wrap">
        {/* Stats group: moves + pairs + timer */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Moves counter */}
          <div
            className="stat-pill"
            aria-label={`Moves: ${moves}`}
          >
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Moves</span>
            <span className="text-xl font-bold text-indigo-700 tabular-nums leading-tight">{moves}</span>
          </div>

          {/* Pairs counter */}
          <div
            className="stat-pill"
            aria-label={`Pairs found: ${matchedCount} of ${totalPairs}`}
          >
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Pairs</span>
            <span className="text-xl font-bold text-indigo-700 tabular-nums leading-tight">
              {matchedCount}<span className="text-sm font-medium text-indigo-300">/{totalPairs}</span>
            </span>
          </div>

          {/* Timer */}
          <div
            className={"stat-pill px-4" + (timerActive ? " timer-active" : "")}
            aria-label={"Elapsed time: " + formatTime(elapsedMs)}
            aria-live="off"
          >
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Time</span>
            <span className="text-xl font-bold font-mono text-indigo-600 tabular-nums leading-tight">
              {formatTime(elapsedMs)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onChangeDifficulty}
            className="px-3 py-2 bg-white hover:bg-indigo-50 active:bg-indigo-100 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none text-indigo-600 font-semibold rounded-xl shadow-sm border border-indigo-200 text-sm"
            aria-label="Return to difficulty menu"
          >
            ← Menu
          </button>
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:outline-none text-white font-semibold rounded-xl shadow text-sm"
          >
            New Game
          </button>
        </div>
      </div>

      {/* Difficulty badge */}
      <div className="text-xs font-semibold text-indigo-400 uppercase tracking-widest bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1">
        {difficulty.label} — {difficulty.description}
      </div>

      {/* Win banner */}
      {hasWon && (
        <div
          className="win-banner w-full text-center py-6 px-5 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 rounded-2xl shadow-lg"
          role="alert"
          aria-live="polite"
        >
          <div className="text-5xl mb-2 select-none" aria-hidden="true">🎉</div>
          <p className="text-2xl font-extrabold text-green-700 tracking-tight">You win!</p>
          <div className="flex justify-center gap-5 mt-2 mb-1 text-sm">
            <span className="text-gray-600">
              Moves: <strong className="text-green-700 font-bold">{moves}</strong>
            </span>
            {finalTime && (
              <span className="text-gray-600">
                Time: <strong className="font-mono text-green-700 font-bold">{finalTime}</strong>
              </span>
            )}
          </div>

          {/* Name entry form — shown until saved or skipped */}
          {!formDone && (
            <WinForm
              timeMs={finalTimeMs}
              difficulty={difficulty.level}
              moves={moves}
              onSaved={handleSaved}
              onSkip={handleSkip}
            />
          )}

          {/* Post-form action buttons */}
          {formDone && (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4">
              <button
                onClick={() => setShowLeaderboard(true)}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none border border-yellow-500 text-yellow-900 font-semibold rounded-xl shadow text-sm"
              >
                🏆 Leaderboard
              </button>
              <button
                onClick={onChangeDifficulty}
                className="px-4 py-2 bg-white hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none border border-indigo-300 text-indigo-600 font-semibold rounded-xl shadow text-sm"
              >
                Change Difficulty
              </button>
              <button
                onClick={handleRestart}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 active:bg-green-800 focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:outline-none text-white font-semibold rounded-xl shadow text-sm"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Card grid */}
      <div
        className={"grid " + colsClass + " gap-2 sm:gap-3 w-full justify-items-center"}
        role="grid"
        aria-label="Memory card game board"
        aria-describedby="game-instructions"
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={handleCardClick}
            disabled={isDisabled}
            compact={compact}
            mismatch={mismatchIds.includes(card.id)}
          />
        ))}
      </div>

      <p id="game-instructions" className="sr-only">
        Click or press Enter or Space on a card to flip it. Match pairs of cards to win.
      </p>

      {/* Leaderboard modal */}
      {showLeaderboard && (
        <Leaderboard
          highlightEntry={savedEntry}
          initialDifficulty={difficulty.level}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
}
