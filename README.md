# Memory Card Game

A memory card matching game built with Next.js 14, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Local Development

```bash
# Navigate to the project directory
cd memory-card-game

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Build for Production

```bash
npm run build
npm run start
```

## Tech Stack

- [Next.js 14](https://nextjs.org/) — App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Project Structure

```
memory-card-game/
├── src/
│   └── app/
│       ├── globals.css     # Global styles (Tailwind directives)
│       ├── layout.tsx      # Root layout
│       └── page.tsx        # Landing page
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Deployment

This project is deployed on Vercel as part of the [RelyGroup](https://github.com/marklyapp/relygroup) monorepo.
