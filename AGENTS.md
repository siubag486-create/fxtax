# Repository Guidelines

## Project structure
- `app/`: Next.js App Router pages and global styles (`app/globals.css`).
- `components/`: Reusable UI and feature components.
- `components/ui/`: Primitive shared UI components.
- `lib/`: Pure helpers for calculations and formatting.
- `types/`: Shared TypeScript domain types.
- `public/`: Static assets.

## Core rule for page implementation
- When building pages, import and compose shared components from `components/` and `components/ui/` first.
- Follow `components/Agents.md` as the source of truth for common component usage.
- Do not recreate existing common components with duplicate markup/styles.
- Keep color usage aligned with global theme tokens in `app/globals.css`.

## Build and verification
- `pnpm dev`
- `pnpm lint`
- Manually verify affected routes: `/`, `/fx-return`, `/tax`, `/valuation`, `/components`.
