"use client";

import { CardType } from '../lib/types';

interface CardProps {
  card: CardType;
  onClick: (id: number) => void;
  disabled: boolean;
}

export default function Card({ card, onClick, disabled }: CardProps) {
  const { id, emoji, isFlipped, isMatched } = card;
  const faceUp = isFlipped || isMatched;
  const isClickable = !disabled && !faceUp;

  return (
    <div
      className="card-scene"
      onClick={() => isClickable && onClick(id)}
      role="button"
      aria-label={faceUp ? `Card showing ${emoji}` : 'Hidden card, click to flip'}
      aria-pressed={faceUp}
      aria-disabled={!isClickable}
      tabIndex={isClickable ? 0 : -1}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
          e.preventDefault();
          onClick(id);
        }
      }}
    >
      <div className={"card-inner" + (faceUp ? ' flipped' : '')}>
        {/* Back face */}
        <div className="card-face card-back" aria-hidden="true">
          <span className="text-2xl sm:text-3xl select-none">🂠</span>
        </div>
        {/* Front face */}
        <div
          className={
            'card-face card-front' +
            (isMatched ? ' card-matched' : '')
          }
          aria-hidden="true"
        >
          <span className="text-3xl sm:text-4xl select-none">{emoji}</span>
        </div>
      </div>
    </div>
  );
}
