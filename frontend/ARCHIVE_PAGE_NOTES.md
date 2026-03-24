# Archive Page Conversion

## Overview
The `main.html` file has been successfully converted into a React TypeScript component-based application. It serves as the archive/landing page showing active policy debate cards in an asymmetric grid layout.

## New Components

### PolicyCard (`src/components/PolicyCard.tsx`)
A versatile, multi-layout card component that adapts to different card types:
- **Featured Card**: Large card with metadata, title, description, and call-to-action
- **Small Card**: Vertical card with border-left (used for Education)
- **Healthcare Card**: Card with border-top and minimal interactive elements
- **Primary Card**: Full-width dark themed card with gradient background (used for featured debates)

Props:
- `policy`: PolicyCardData object containing all card information
- `onViewDebate`: Callback when "View Debate" is clicked

### FilterBar (`src/components/FilterBar.tsx`)
Horizontal scrollable filter bar for filtering policies by domain.

Props:
- `options`: Array of FilterOption items
- `activeFilter`: Currently selected filter ID
- `onFilterChange`: Callback when filter changes

### HeroSection (`src/components/HeroSection.tsx`)
Page header with title and description.

Props:
- `title`: Main heading
- `description`: Subtitle/description text

### ArchivePage (`src/pages/ArchivePage.tsx`)
Main landing/archive page combining all components:
- Header and Footer
- Hero section
- Filter bar
- Asymmetric grid of policy cards
- Decorative SVG element

## Data Structure

### PolicyCardData Interface
```typescript
interface PolicyCardData {
  id: string;
  title: string;
  description: string;
  domain: string;
  status: 'active-disagreement' | 'settled' | 'uncertain' | 'opinion';
  statusLabel: string;
  citations: number;
  activeDebaters: number;
  isFeatured?: boolean;
  isPrimary?: boolean;
}
```

## Features

✅ **Responsive Bento Grid** - Asymmetric layout that adapts to screen size
✅ **Status Labels** - Color-coded indicators (Active Disagreement, Settled, Uncertain, Opinion)
✅ **Filter System** - Filter policies by domain
✅ **Material Icons** - Integrated Google Material Symbols
✅ **Hover Effects** - Smooth transitions and interactive states
✅ **Dark Mode Ready** - Full support via Tailwind's dark mode classes

## Status Badge Colors

- **Active Expert Disagreement**: Amber with pulsing indicator
- **Broadly Settled (Empirical)**: Emerald with verified icon
- **Highly Uncertain (Predictive)**: Slate with help icon
- **Opinion / Value Judgment**: White/transparent with balance icon

## Grid Layout

The asymmetric grid is built with Tailwind's CSS Grid and spans:
- Featured Housing Card: `md:col-span-8`
- Education Card: `md:col-span-4`
- Healthcare Card: `md:col-span-4`
- Economy Card (Primary): `md:col-span-8`

## Usage

To view the archive page in the app, the App.tsx currently defaults to displaying the ArchivePage. To switch between pages, modify the `currentPage` state:

```typescript
const [currentPage, setCurrentPage] = useState<Page>('archive'); // or 'home'
```

Future enhancements could include:
- React Router for proper routing
- Dynamic policy data loading from an API
- Search functionality across policies
- Sorting options (most cited, most debaters, etc.)
- Detailed debate view page
