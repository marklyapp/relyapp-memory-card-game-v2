/**
 * Unit tests for the card deck creation and shuffle logic (issue #2).
 * Covers: createShuffledDeck pairs, uniqueness, shuffling, emoji symbols.
 */
import { createShuffledDeck } from '../app/lib/deck';

describe('createShuffledDeck', () => {
  it('creates a deck with exactly 2x pairs cards', () => {
    const deck = createShuffledDeck(8);
    expect(deck.length).toBe(16);
  });

  it('creates a deck with exactly 2x pairs cards for 6 pairs (easy)', () => {
    const deck = createShuffledDeck(6);
    expect(deck.length).toBe(12);
  });

  it('creates a deck with exactly 2x pairs cards for 15 pairs (hard)', () => {
    const deck = createShuffledDeck(15);
    expect(deck.length).toBe(30);
  });

  it('each emoji appears exactly twice', () => {
    const deck = createShuffledDeck(8);
    const counts: Record<string, number> = {};
    for (const card of deck) {
      counts[card.emoji] = (counts[card.emoji] ?? 0) + 1;
    }
    const values = Object.values(counts);
    expect(values.length).toBe(8); // 8 distinct emojis
    expect(values.every((v) => v === 2)).toBe(true);
  });

  it('all cards start face-down (isFlipped = false)', () => {
    const deck = createShuffledDeck(8);
    expect(deck.every((c) => c.isFlipped === false)).toBe(true);
  });

  it('all cards start unmatched (isMatched = false)', () => {
    const deck = createShuffledDeck(8);
    expect(deck.every((c) => c.isMatched === false)).toBe(true);
  });

  it('each card has a unique id', () => {
    const deck = createShuffledDeck(8);
    const ids = deck.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(deck.length);
  });

  it('deck is shuffled (very unlikely to be identical order across runs)', () => {
    // Run createShuffledDeck multiple times; if it were never shuffled, all
    // would produce the same emoji order. We just verify the function can
    // produce at least two distinct orderings among 5 attempts.
    const orders = Array.from({ length: 5 }, () =>
      createShuffledDeck(8).map((c) => c.emoji).join(',')
    );
    const unique = new Set(orders);
    // At least 2 distinct orderings in 5 attempts (astronomically likely)
    expect(unique.size).toBeGreaterThan(1);
  });

  it('throws when requesting more pairs than available emojis', () => {
    expect(() => createShuffledDeck(100)).toThrow();
  });

  it('default pairs value is 8', () => {
    const deck = createShuffledDeck();
    expect(deck.length).toBe(16);
  });
});

describe('matching logic', () => {
  it('pairs with same emoji are considered matches', () => {
    const deck = createShuffledDeck(8);
    // Find any two cards with the same emoji — they should exist as a pair
    const first = deck[0];
    const match = deck.slice(1).find((c) => c.emoji === first.emoji);
    expect(match).toBeDefined();
    expect(match!.id).not.toBe(first.id);
  });

  it('different emojis are not matches', () => {
    const deck = createShuffledDeck(8);
    const emojis = [...new Set(deck.map((c) => c.emoji))];
    // All emojis should be distinct from each other
    expect(emojis.length).toBe(8);
    // Confirm no two distinct emojis are equal
    for (let i = 0; i < emojis.length; i++) {
      for (let j = i + 1; j < emojis.length; j++) {
        expect(emojis[i]).not.toBe(emojis[j]);
      }
    }
  });
});
