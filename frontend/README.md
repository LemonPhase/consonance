# Consonance Frontend

React + TypeScript client for the Consonance MVP.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Material Symbols Outlined

## Requirements

- Node.js 18+
- npm

## Quick Start

```bash
cp .env.example .env
npm install
npm run dev
```

By default, the app runs at `http://localhost:3000`.

## Environment Variables

Create `frontend/.env` from `.env.example`:

- `VITE_API_BASE_URL` (default: `http://127.0.0.1:8000`)

The frontend expects the backend API to be running and reachable at this URL.

## Available Scripts

- `npm run dev` - run development server
- `npm run build` - run TypeScript compile + production build
- `npm run preview` - preview production build locally
- `npm run lint` - lint `src` files
- `npm run type-check` - TypeScript type checks only

## Application Views

The app is currently organized around three main views in `src/App.tsx`:

- `landing` - product landing page (`src/pages/LandingPage.tsx`)
- `main` - policy archive (`src/pages/ArchivePage.tsx`)
- `discussion` - policy discussion workspace (`src/pages/DiscussionPage.tsx`)

## Core Features

- landing page with branded product narrative and entry CTA
- archive page with policy cards and domain filters
- discussion page with:
  - for/against argument columns
  - create argument flow
  - vote on arguments
  - threaded comments per argument
  - AI summary generation and latest summary display
- shared API client layer for backend integration (`src/lib/api.ts`)

## Important Paths

```text
frontend/
├── src/
│   ├── App.tsx
│   ├── globals.css
│   ├── lib/api.ts
│   ├── types/index.ts
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── ArchivePage.tsx
│   │   └── DiscussionPage.tsx
│   └── components/
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Build and Validation

```bash
npm run type-check
npm run build
```

## Notes

- Vite dev server is configured for port `3000` in `vite.config.ts`.
- Path alias `@` maps to `src`.
- Styling is driven by Tailwind utility classes and custom tokens in `tailwind.config.js` plus global styles in `src/globals.css`.
