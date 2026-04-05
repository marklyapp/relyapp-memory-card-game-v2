"use client";

import { useState, useCallback, useEffect } from "react";
import Card from "./Card";
import { CardType } from "../lib/types";
import { createShuffledDeck } from "../lib/deck";

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

  const handleCardClick = useCallback(
    (id: number) => {
      if (isChecking) return;
      if (flippedIds.includes(id)) return;
      if (flippedIds.length === 2) return;

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
        setCards((prev) => {
          const first = prev.find((c) => c.id === firstId)!;
          const second = prev.find((c) => c.id === secondId)!;
          const matched = first.emoji === second.emoji;

          if (matched) {
            const updated = prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false, isMatched: true }
                : c
            );
            // Check win after state settles
            setTimeout(() => {
              setCards((current) => {
                const allMatched = current.every((c) => c.isMatched);
                if (allMatched) setHasWon(true);
                return current;
              });
              setFlippedIds([]);
              setIsChecking(false);
            }, 300);
            return updated;
          } else {
            // No match — flip back after 1s
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

  const isDisabled = isChecking || flippedIds.length === 2;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg px-4">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <span className="text-gray-500 font-medium">Moves: {moves}</span>
        <button
          onClick={handleRestart}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow transition-colors duration-200 cursor-pointer text-sm"
        >
          New Game
        </button>
      </div>

      {/* Win banner */}
      {hasWon && (
        <div className="w-full text-center py-4 px-6 bg-green-100 border border-green-300 rounded-2xl shadow">
          <p className="text-2xl font-bold text-green-700">🎉 You win!</p>
          <p className="text-gray-500 mt-1">Completed in {moves} moves</p>
        </div>
      )}

      {/* Card grid */}
      <div
        className="grid grid-cols-4 gap-3 sm:gap-4"
        aria-label="Memory card game board"
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
    </div>
  );
}
