# The Digital Hansard - React TypeScript Conversion

This is a React TypeScript conversion of the original HTML prototype for The Digital Hansard platform. The project uses Vite for fast development builds, Tailwind CSS for styling, and Material Symbols Outlined for icons.

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.tsx
│   ├── PolicyHeader.tsx
│   ├── ChatBox.tsx
│   ├── DiscourseSection.tsx
│   ├── EvidenceCard.tsx
│   ├── EngagementMetrics.tsx
│   ├── StatusBadge.tsx
│   ├── MaterialIcon.tsx
│   └── index.ts
├── pages/
│   └── HomePage.tsx     # Main page component
├── types/
│   └── index.ts         # TypeScript type definitions
├── App.tsx
├── globals.css
└── index.tsx

public/
└── index.html           # Entry point HTML

Configuration files:
- tailwind.config.js     # Tailwind CSS configuration
- postcss.config.js      # PostCSS configuration
- vite.config.ts         # Vite build configuration
- tsconfig.json          # TypeScript configuration
- package.json           # Project dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn/pnpm installed

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will open at `http://localhost:3000`

### Building

Build for production:
```bash
npm run build
# or
yarn build
# or
pnpm build
```

Preview the production build:
```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## Features

- **Responsive Design**: Mobile-first design that works on all device sizes
- **Dark Mode Support**: Built-in dark mode using Tailwind's class-based dark mode
- **Type Safety**: Full TypeScript support with proper type definitions
- **Material Icons**: Integration with Google Material Symbols Outlined icons
- **Custom Theme**: Complete Material Design 3 color system with custom extensions
- **Performance**: Optimized builds with Vite and tree-shaking

## Key Components

### Header
Top navigation bar with site branding and navigation links.

### PolicyHeader
Policy information section with metadata, badges, and engagement metrics.

### EngagementMetrics
Displays consensus level, citations verified, and active debaters with progress indicators.

### ChatBox
AI query interface with suggested queries.

### DiscourseSection
Two-column layout displaying supporting evidence and critical challenges.

### EvidenceCard
Reusable card component for evidence items with author, affiliation, and citations.

## Customization

### Colors
All custom colors are defined in:
- `tailwind.config.js` - Main color configuration
- `public/index.html` - Inline Tailwind config for development

### Fonts
Custom fonts are loaded from Google Fonts:
- **Newsreader** (serif) - Headlines and titles
- **Inter** (sans) - Body text
- **Work Sans** (sans) - Labels and small text

To use different fonts, update:
1. `src/globals.css` - Font imports
2. `tailwind.config.js` - Font family mappings

### Icons
Material Symbols are used throughout. To change icons:
1. Visit [Google Material Symbols](https://fonts.google.com/icons)
2. Replace the icon name in the component props
3. The `MaterialIcon` component handles icon styling

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Google Material Symbols** - Icon system

## Browser Support

This application supports all modern browsers that support ES2020. For older browser support, adjust the `target` in `tsconfig.json`.

## License

© 2024 The Digital Hansard. All rights reserved.
