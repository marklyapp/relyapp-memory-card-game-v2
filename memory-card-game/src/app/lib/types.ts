export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  level: Difficulty;
  label: string;
  cols: number;
  rows: number;
  pairs: number;
  description: string;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    level: 'easy',
    label: 'Easy',
    cols: 3,
    rows: 4,
    pairs: 6,
    description: '3x4 grid - 6 pairs',
  },
  medium: {
    level: 'medium',
    label: 'Medium',
    cols: 4,
    rows: 4,
    pairs: 8,
    description: '4x4 grid - 8 pairs',
  },
  hard: {
    level: 'hard',
    label: 'Hard',
    cols: 5,
    rows: 6,
    pairs: 15,
    description: '5x6 grid - 15 pairs',
  },
};
