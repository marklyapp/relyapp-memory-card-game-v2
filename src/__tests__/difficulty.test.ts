/**
 * Unit tests for difficulty levels feature (issue #3).
 * Covers: DIFFICULTY_CONFIGS shape, grid dimensions, createShuffledDeck per difficulty.
 */
import { DIFFICULTY_CONFIGS, DifficultyLevel } from '../app/lib/types';
import { createShuffledDeck } from '../app/lib/deck';

describe('DIFFICULTY_CONFIGS', () => {
  const levels: DifficultyLevel[] = ['easy', 'medium', 'hard'];

  it('defines exactly three difficulty levels', () => {
    expect(Object.keys(DIFFICULTY_CONFIGS)).toEqual(levels);
  });

  it('easy: 3 cols × 4 rows = 6 pairs', () => {
    const config = DIFFICULTY_CONFIGS.easy;
    expect(config.cols).toBe(3);
    expect(config.rows).toBe(4);
    expect(config.pairs).toBe(6);
    expect(config.cols * config.rows).toBe(config.pairs * 2);
  });

  it('medium: 4 cols × 4 rows = 8 pairs', () => {
    const config = DIFFICULTY_CONFIGS.medium;
    expect(config.cols).toBe(4);
    expect(config.rows).toBe(4);
    expect(config.pairs).toBe(8);
    expect(config.cols * config.rows).toBe(config.pairs * 2);
  });

  it('hard: 5 cols × 6 rows = 15 pairs', () => {
    const config = DIFFICULTY_CONFIGS.hard;
    expect(config.cols).toBe(5);
    expect(config.rows).toBe(6);
    expect(config.pairs).toBe(15);
    expect(config.cols * config.rows).toBe(config.pairs * 2);
  });

  it('each config includes a human-readable label', () => {
    expect(DIFFICULTY_CONFIGS.easy.label).toBeTruthy();
    expect(DIFFICULTY_CONFIGS.medium.label).toBeTruthy();
    expect(DIFFICULTY_CONFIGS.hard.label).toBeTruthy();
  });

  it('each config includes a description with grid dimensions', () => {
    expect(DIFFICULTY_CONFIGS.easy.description).toMatch(/3.?4/);
    expect(DIFFICULTY_CONFIGS.medium.description).toMatch(/4.?4/);
    expect(DIFFICULTY_CONFIGS.hard.description).toMatch(/5.?6/);
  });

  it('each level field matches the key', () => {
    for (const [key, config] of Object.entries(DIFFICULTY_CONFIGS)) {
      expect(config.level).toBe(key);
    }
  });
});

describe('createShuffledDeck with difficulty configs', () => {
  it('creates correct deck size for easy difficulty', () => {
    const config = DIFFICULTY_CONFIGS.easy;
    const deck = createShuffledDeck(config.pairs);
    expect(deck.length).toBe(config.pairs * 2);
  });

  it('creates correct deck size for medium difficulty', () => {
    const config = DIFFICULTY_CONFIGS.medium;
    const deck = createShuffledDeck(config.pairs);
    expect(deck.length).toBe(config.pairs * 2);
  });

  it('creates correct deck size for hard difficulty', () => {
    const config = DIFFICULTY_CONFIGS.hard;
    const deck = createShuffledDeck(config.pairs);
    expect(deck.length).toBe(config.pairs * 2);
  });

  it('deck fills the full grid for each difficulty', () => {
    for (const config of Object.values(DIFFICULTY_CONFIGS)) {
      const deck = createShuffledDeck(config.pairs);
      const totalCells = config.cols * config.rows;
      expect(deck.length).toBe(totalCells);
    }
  });

  it('all cards start face-down for every difficulty', () => {
    for (const config of Object.values(DIFFICULTY_CONFIGS)) {
      const deck = createShuffledDeck(config.pairs);
      expect(deck.every((c) => c.isFlipped === false)).toBe(true);
    }
  });

  it('all cards start unmatched for every difficulty', () => {
    for (const config of Object.values(DIFFICULTY_CONFIGS)) {
      const deck = createShuffledDeck(config.pairs);
      expect(deck.every((c) => c.isMatched === false)).toBe(true);
    }
  });

  it('each emoji appears exactly twice in every difficulty deck', () => {
    for (const config of Object.values(DIFFICULTY_CONFIGS)) {
      const deck = createShuffledDeck(config.pairs);
      const counts: Record<string, number> = {};
      for (const card of deck) {
        counts[card.emoji] = (counts[card.emoji] ?? 0) + 1;
      }
      expect(Object.values(counts).every((v) => v === 2)).toBe(true);
    }
  });
});
