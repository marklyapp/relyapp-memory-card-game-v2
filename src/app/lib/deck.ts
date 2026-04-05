import { CardType } from './types';

const EMOJIS = [
  '🐶', '🐱', '🐭', '🐹', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐮', '🐷', '🐸', '🐙', '🦋', '🌺',
];

export function createShuffledDeck(pairs: number = 8): CardType[] {
  if (pairs > EMOJIS.length) {
    throw new Error(`Cannot create deck with ${pairs} pairs; only ${EMOJIS.length} emojis available.`);
  }
  const selected = EMOJIS.slice(0, pairs);
  const deck: string[] = [...selected, ...selected];

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck.map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}
