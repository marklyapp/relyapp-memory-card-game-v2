"use client";

import { CardType } from "../lib/types";

interface CardProps {
  card: CardType;
  onClick: (id: number) => void;
  disabled: boolean;
}

export default function Card({ card, onClick, disabled }: CardProps) {
  const { id, emoji, isFlipped, isMatched } = card;
  const faceUp = isFlipped || isMatched;

  return (
    <div
      className="card-scene"
      onClick={() => !disabled && !faceUp && onClick(id)}
      role="button"
      aria-label={faceUp ? emoji : "Hidden card"}
      aria-pressed={faceUp}
      tabIndex={disabled || faceUp ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled && !faceUp) {
          onClick(id);
        }
      }}
    >
      <div className={"card-inner" + (faceUp ? " flipped" : "")}>
        {/* Back face */}
        <div className="card-face card-back">
          <span className="text-3xl select-none">🂠</span>
        </div>
        {/* Front face */}
        <div
          className={
            "card-face card-front" +
            (isMatched ? " card-matched" : "")
          }
        >
          <span className="text-4xl select-none">{emoji}</span>
        </div>
      </div>
    </div>
  );
}
