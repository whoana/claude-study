# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start dev server (http://localhost:3000)
- `npm run build` — Production build
- `npm start` — Run production server
- `npm run lint` — Run ESLint

## Tech Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19** with TypeScript 5 (strict mode)
- **Tailwind CSS v4** via `@import "tailwindcss"` in globals.css
- **ESLint 9** flat config with Next.js Core Web Vitals + TypeScript rules
- **Package manager:** npm

## Architecture

- Path alias: `@/*` maps to `./src/*`
- Root layout (`src/app/layout.tsx`) loads Geist font family via `next/font/google`
- Theming uses CSS custom properties (`--background`, `--foreground`) with dark mode via `prefers-color-scheme`
- Tailwind v4 theme tokens defined in `globals.css` using `@theme inline` block

## Conventions

- All components use Tailwind utility classes for styling (no CSS modules)
- Dark mode classes use Tailwind's `dark:` prefix
- Responsive breakpoints use `sm:` and `md:` prefixes
