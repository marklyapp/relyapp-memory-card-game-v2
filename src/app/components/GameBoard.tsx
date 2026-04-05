"use client";

import { useState, useCallback, useEffect } from 'react';
import Card from './Card';
import { CardType, DifficultyConfig } from '../lib/types';
import { createShuffledDeck } from '../lib/deck';
import { useTimer, formatTime } from '../lib/timer';

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
  const [finalTime, setFinalTime] = useState<string>("");
  const [hasStarted, setHasStarted] = useState(false);

  const { elapsedMs, start: startTimer, stop: stopTimer, reset: resetTimer } = useTimer();

  // Initialize deck when difficulty changes
  useEffect(() => {
    setCards(createShuffledDeck(difficulty.pairs));
    setFlippedIds([]);
    setIsChecking(false);
    setMoves(0);
    setHasWon(false);
    setFinalTime("");
    setHasStarted(false);
    resetTimer();
  // resetTimer is stable (useCallback), safe to include
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  // Check win condition whenever cards change
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.isMatched)) {
      stopTimer();
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
            }, 300);
            return updated;
          } else {
            // No match — show both for 1 second then flip back
            setTimeout(() => {
              setCards((current) =>
                current.map((c) =>
                  c.id === firstId || c.id === secondId
                    ? { ...c, isFlipped: false }
                    : c
                )
              );
              setFlippedIds([]);
              setIsChecking(false);
            }, 1000);
            return prev;
          }
        });
      }
    },
    [flippedIds, isChecking, hasStarted, startTimer]
  );

  const handleRestart = () => {
    setCards(createShuffledDeck(difficulty.pairs));
    setFlippedIds([]);
    setIsChecking(false);
    setMoves(0);
    setHasWon(false);
    setFinalTime("");
    setHasStarted(false);
    resetTimer();
  };

  const matchedCount = cards.filter((c) => c.isMatched).length / 2;
  const totalPairs = difficulty.pairs;
  const isDisabled = isChecking || flippedIds.length >= 2;
  const colsClass = gridColsClass(difficulty.cols);
  const compact = difficulty.level === "hard";

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl px-4">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col text-sm text-gray-500">
          <span className="font-medium">Moves: {moves}</span>
          <span>
            Pairs: {matchedCount}/{totalPairs}
          </span>
        </div>

        {/* Timer display */}
        <div
          className="text-2xl font-mono font-bold text-indigo-600 tabular-nums"
          aria-label={"Elapsed time: " + formatTime(elapsedMs)}
          aria-live="off"
        >
          {formatTime(elapsedMs)}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onChangeDifficulty}
            className="px-3 py-2 bg-white hover:bg-gray-50 active:bg-gray-100 text-indigo-600 font-semibold rounded-xl shadow border border-indigo-200 transition-colors duration-200 cursor-pointer text-sm"
          >
            ← Difficulty
          </button>
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl shadow transition-colors duration-200 cursor-pointer text-sm"
          >
            New Game
          </button>
        </div>
      </div>

      {/* Difficulty badge */}
      <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {difficulty.label} — {difficulty.description}
      </div>

      {/* Win banner */}
      {hasWon && (
        <div
          className="w-full text-center py-6 px-6 bg-green-100 border-2 border-green-300 rounded-2xl shadow-md"
          role="alert"
          aria-live="polite"
        >
          <p className="text-3xl font-bold text-green-700 mb-1">🎉 You win!</p>
          <p className="text-gray-600 mt-1">
            Completed in <strong>{moves}</strong> moves
          </p>
          {finalTime && (
            <p className="text-gray-600 mt-1">
              Time: <strong className="font-mono">{finalTime}</strong>
            </p>
          )}
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={onChangeDifficulty}
              className="px-5 py-2 bg-white hover:bg-gray-50 border border-indigo-300 text-indigo-600 font-semibold rounded-xl shadow transition-colors duration-200 cursor-pointer"
            >
              Change Difficulty
            </button>
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow transition-colors duration-200 cursor-pointer"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Card grid */}
      <div
        className={"grid " + colsClass + " gap-2 sm:gap-3"}
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
          />
        ))}
      </div>

      <p id="game-instructions" className="sr-only">
        Click or press Enter/Space on a card to flip it. Match pairs of cards to win.
      </p>
    </div>
  );
}
