# Common Components Guide

This folder contains shared UI primitives and section-level reusable components.
Use these first before creating new UI blocks.

## Source of truth
- Theme tokens: `app/globals.css`
- Tailwind token mapping: `tailwind.config.ts`
- Shared UI primitives: `components/ui/*`

## Shared components
- `components/ui/button.tsx`
  - Variants: `default`, `outline`, `ghost`
  - Sizes: `default`, `sm`, `lg`, `icon`
  - Use for all click actions and CTAs.
- `components/ui/card.tsx`
  - Building blocks: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
  - Use for grouped content sections.
- `components/ui/input.tsx`
  - Standard single-line text input.
  - Use with `Label` for accessible forms.
- `components/ui/textarea.tsx`
  - Standard multi-line text input.
  - Use for memo/comment/description fields.
- `components/ui/label.tsx`
  - Accessible label primitive for form controls.
- `components/ui/badge.tsx`
  - Variants: `default`, `secondary`, `outline`, `destructive`
  - Use for status and short category tags.
- `components/ui/separator.tsx`
  - Orientations: `horizontal`, `vertical`
  - Use to visually divide groups/sections.

## Usage rules
- Do not hardcode new colors in component code. Always use theme tokens.
- Prefer composing with existing primitives over creating ad-hoc styles.
- Keep routes/pages focused on layout and composition.
- Keep business logic in `lib/` and domain types in `types/`.
- Avoid passing event handlers from Server Components to Client Components.

## Demo page
- Route: `/components`
- File: `app/components/page.tsx`
- Purpose: single-column, full-width display of shared components with title + divider sections.
