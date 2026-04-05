"use client";

import { useState, useCallback, useEffect } from 'react';
import Card from './Card';
import { CardType } from '../lib/types';
import { createShuffledDeck } from '../lib/deck';

export default function GameBoard() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [moves, setMoves] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  // Initialize deck on mount
  useEffect(() => {
    setCards(createShuffledDeck());
  }, []);

  // Check win condition whenever cards change
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.isMatched)) {
      setHasWon(true);
    }
  }, [cards]);

  const handleCardClick = useCallback(
    (id: number) => {
      if (isChecking) return;
      if (flippedIds.includes(id)) return;
      if (flippedIds.length >= 2) return;

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
    [flippedIds, isChecking]
  );

  const handleRestart = () => {
    setCards(createShuffledDeck());
    setFlippedIds([]);
    setIsChecking(false);
    setMoves(0);
    setHasWon(false);
  };

  const matchedCount = cards.filter((c) => c.isMatched).length / 2;
  const totalPairs = cards.length / 2;
  const isDisabled = isChecking || flippedIds.length >= 2;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg px-4">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col text-sm text-gray-500">
          <span className="font-medium">Moves: {moves}</span>
          <span>
            Pairs: {matchedCount}/{totalPairs}
          </span>
        </div>
        <button
          onClick={handleRestart}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl shadow transition-colors duration-200 cursor-pointer text-sm"
        >
          New Game
        </button>
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
          <button
            onClick={handleRestart}
            className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow transition-colors duration-200 cursor-pointer"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Card grid */}
      <div
        className="grid grid-cols-4 gap-3 sm:gap-4"
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
          />
        ))}
      </div>

      <p id="game-instructions" className="sr-only">
        Click or press Enter/Space on a card to flip it. Match pairs of cards to win.
      </p>
    </div>
  );
}
