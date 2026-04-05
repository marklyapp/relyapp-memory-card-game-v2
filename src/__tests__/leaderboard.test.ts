/**
 * Unit tests for leaderboard library functions.
 * Uses a localStorage mock since tests run in Node (not a browser).
 */

// ---------------------------------------------------------------------------
// localStorage mock
// ---------------------------------------------------------------------------
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });
Object.defineProperty(global, 'window', { value: global });

// ---------------------------------------------------------------------------
// Imports — after the mock is in place
// ---------------------------------------------------------------------------
import {
  addEntry,
  getTopEntries,
  wouldMakeTop10,
  clearLeaderboard,
  clearAllLeaderboard,
  LeaderboardEntry,
} from '../../src/app/lib/leaderboard';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeEntry(
  name: string,
  timeMs: number,
  difficulty: 'easy' | 'medium' | 'hard' = 'easy',
): LeaderboardEntry {
  return {
    name,
    timeMs,
    timeFormatted: String(timeMs),
    difficulty,
    date: new Date().toISOString(),
  };
}

beforeEach(() => {
  localStorageMock.clear();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('addEntry', () => {
  it('adds an entry and returns its rank', () => {
    const entry = makeEntry('Alice', 5000);
    const rank = addEntry(entry);
    expect(rank).toBe(1);
  });

  it('returns rank 2 when a slower time already exists', () => {
    addEntry(makeEntry('Bob', 3000));
    const rank = addEntry(makeEntry('Alice', 5000));
    expect(rank).toBe(2);
  });

  it('returns null when entry does not make the top 10', () => {
    // Fill top 10 with fast times
    for (let i = 1; i <= 10; i++) {
      addEntry(makeEntry(`Player${i}`, i * 1000));
    }
    const rank = addEntry(makeEntry('Slow', 99000));
    expect(rank).toBeNull();
  });
});

describe('getTopEntries', () => {
  it('returns entries sorted fastest first', () => {
    addEntry(makeEntry('C', 9000));
    addEntry(makeEntry('A', 3000));
    addEntry(makeEntry('B', 6000));
    const top = getTopEntries('easy');
    expect(top.map((e) => e.name)).toEqual(['A', 'B', 'C']);
  });

  it('returns at most 10 entries', () => {
    for (let i = 0; i < 15; i++) {
      addEntry(makeEntry(`P${i}`, (i + 1) * 1000));
    }
    expect(getTopEntries('easy').length).toBe(10);
  });

  it('only returns entries for the requested difficulty', () => {
    addEntry(makeEntry('EasyPlayer', 1000, 'easy'));
    addEntry(makeEntry('HardPlayer', 2000, 'hard'));
    expect(getTopEntries('easy').length).toBe(1);
    expect(getTopEntries('medium').length).toBe(0);
    expect(getTopEntries('hard').length).toBe(1);
  });
});

describe('wouldMakeTop10', () => {
  it('returns true when leaderboard has fewer than 10 entries', () => {
    addEntry(makeEntry('X', 5000));
    expect(wouldMakeTop10(99000, 'easy')).toBe(true);
  });

  it('returns true when time beats the slowest top-10 entry', () => {
    for (let i = 1; i <= 10; i++) {
      addEntry(makeEntry(`P${i}`, i * 1000));
    }
    // Slowest is 10 000 ms; a time of 9 500 would make top 10
    expect(wouldMakeTop10(9500, 'easy')).toBe(true);
  });

  it('returns false when time is slower than all top-10 entries', () => {
    for (let i = 1; i <= 10; i++) {
      addEntry(makeEntry(`P${i}`, i * 1000));
    }
    expect(wouldMakeTop10(11000, 'easy')).toBe(false);
  });
});

describe('clearLeaderboard', () => {
  it('removes only entries for the specified difficulty', () => {
    addEntry(makeEntry('E', 1000, 'easy'));
    addEntry(makeEntry('M', 2000, 'medium'));
    clearLeaderboard('easy');
    expect(getTopEntries('easy').length).toBe(0);
    expect(getTopEntries('medium').length).toBe(1);
  });
});

describe('clearAllLeaderboard', () => {
  it('removes all entries across all difficulties', () => {
    addEntry(makeEntry('E', 1000, 'easy'));
    addEntry(makeEntry('M', 2000, 'medium'));
    addEntry(makeEntry('H', 3000, 'hard'));
    clearAllLeaderboard();
    expect(getTopEntries('easy').length).toBe(0);
    expect(getTopEntries('medium').length).toBe(0);
    expect(getTopEntries('hard').length).toBe(0);
  });
});
