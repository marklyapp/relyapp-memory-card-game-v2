# 🃏 Memory Match

A browser-based memory card matching game built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

🎮 **Live demo:** [https://relyapp-memory-card-game-v2.vercel.app](https://relyapp-memory-card-game-v2.vercel.app)

---

## Overview

Memory Match is a classic flip-and-match card game. Cards are laid out face-down in a grid; tap any two to reveal their emoji. If they match, they stay face-up. If not, they flip back over. The goal is to find all matching pairs in the fewest moves and the shortest time.

The game is built as a static Next.js App Router application with no backend — all state lives in the browser, and best times are persisted in `localStorage`.

---

## Features

| Feature | Description |
|---|---|
| **Difficulty levels** | Choose Easy (3×4, 6 pairs), Medium (4×4, 8 pairs), or Hard (5×6, 15 pairs) before each game |
| **Card flip mechanic** | Smooth CSS flip animation; matched pairs stay face-up with a success highlight |
| **Mismatch shake** | Cards that don't match briefly shake to give clear visual feedback |
| **Game timer** | Starts on the first card flip, stops when all pairs are found, and displays as MM:SS |
| **Best times leaderboard** | Top 10 times per difficulty, stored in `localStorage`; enter your name when you beat a top-10 time |
| **Screen-enter animations** | Smooth fade-in transition when switching between the difficulty picker and the game board |
| **Responsive design** | Adapts from mobile (small grid, tighter spacing) to desktop |
| **Accessible controls** | Keyboard-focusable cards, ARIA labels, visible focus ring |

---

## Getting Started

### Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/marklyapp/relyapp-memory-card-game-v2.git
cd relyapp-memory-card-game-v2

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running Tests

```bash
npm test
```

> **Note:** Tests require **jest@^29** and **ts-jest@^29** (both are listed as `devDependencies` and installed automatically via `npm install`).

The test suite covers:

| Test file | What it tests |
|---|---|
| `src/__tests__/deck.test.ts` | Deck generation: correct count, all pairs present, shuffled output |
| `src/__tests__/difficulty.test.ts` | Difficulty config values (grid size, pair counts) |
| `src/__tests__/timer.test.ts` | `formatTime` utility (MM:SS formatting, edge cases) |
| `src/__tests__/leaderboard.test.ts` | Add/rank entries, top-10 cap, per-difficulty filtering, clear operations |

---

## Project Structure

```
relyapp-memory-card-game-v2/
├── public/                        # Static assets
│   └── favicon.svg
├── src/
│   ├── __tests__/                 # Unit tests
│   │   ├── deck.test.ts           # Card deck logic tests
│   │   ├── difficulty.test.ts     # Difficulty config tests
│   │   ├── leaderboard.test.ts    # Leaderboard helper tests
│   │   └── timer.test.ts          # Timer formatting tests
│   └── app/
│       ├── components/
│       │   ├── Card.tsx            # Single card with flip + shake animations
│       │   ├── DifficultySelector.tsx  # Difficulty picker screen
│       │   ├── GameBoard.tsx       # Main game grid, game loop, win detection
│       │   ├── Leaderboard.tsx     # Top-times modal (per difficulty)
│       │   └── WinForm.tsx         # Post-game name entry + rank reveal
│       ├── lib/
│       │   ├── deck.ts             # Deck creation & Fisher-Yates shuffle
│       │   ├── leaderboard.ts      # localStorage leaderboard CRUD helpers
│       │   ├── timer.ts            # useTimer hook + formatTime utility
│       │   └── types.ts            # Shared types & DIFFICULTY_CONFIGS map
│       ├── globals.css             # Tailwind directives & custom animations
│       ├── layout.tsx              # Root layout (fonts, metadata)
│       └── page.tsx                # Entry page (difficulty → game → leaderboard flow)
├── jest.config.js                  # Jest + ts-jest configuration
├── next.config.js                  # Next.js config
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json                     # Vercel build settings
```

---

## Tech Stack

- [Next.js 14](https://nextjs.org/) — App Router, static export
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [Jest 29](https://jestjs.io/) + [ts-jest 29](https://kulshekhar.github.io/ts-jest/) — unit testing

---

## Deployment

Deployed automatically on [Vercel](https://vercel.com). Every push to `main` triggers a production deploy.

**Production URL:** [https://relyapp-memory-card-game-v2.vercel.app](https://relyapp-memory-card-game-v2.vercel.app)
