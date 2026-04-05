import { CardType } from './types';

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🦊', '🐻', '🐼', '🐨'];

export function createShuffledDeck(): CardType[] {
  const pairs = [...EMOJIS, ...EMOJIS];
  const shuffled = pairs.sort(() => Math.random() - 0.5);
  return shuffled.map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}
