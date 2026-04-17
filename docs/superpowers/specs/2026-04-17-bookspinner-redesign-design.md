# BookSpinner Redesign — Design Spec

**Date:** 2026-04-17  
**Direction:** Illustrated Bookshop  
**Scope:** Full visual redesign — new color system, typography, and component styles. No changes to app logic, composables, or data flow.

---

## Overview

Replace BookSpinner's current generic warm-serif aesthetic (Playfair Display + cream + burgundy) with a distinctive **Illustrated Bookshop** visual identity: warm parchment backgrounds, four playful accent colors (terracotta, sage, violet, marigold), and a Rasa + Mulish type pairing. The slot machine spin remains the hero moment; everything else sets the stage for it.

---

## Design Principles

1. **Delight lives in the details** — micro-interactions, tactile button shadows, and small surprises make the app memorable.
2. **Warmth without cliché** — cozy doesn't mean beige and burgundy. Achieved through deliberate OKLCH palette, colorful book cover placeholders, and a type pairing that feels genuinely chosen.
3. **The spin is the hero** — the slot machine section gets the most visual energy: terracotta frame, decorative dots, tactile button, theatrical winner overlay.
4. **Whimsy earns trust** — small touches (emoji in copy, confetti on winner, subtle card rotation) make it feel crafted and fun.
5. **Light and fast** — all interactions feel instant; transitions are short (≤300ms).

---

## Color System

All colors use OKLCH for perceptual uniformity. Neutrals are tinted toward the brand warmth hue (~80° = amber-warm).

| Token | Value | Use |
|---|---|---|
| `--bg` | `oklch(93% 0.018 80)` | Page background |
| `--surface` | `oklch(99% 0.010 80)` | Section cards, inputs |
| `--border` | `oklch(88% 0.025 80)` | Card borders, dividers |
| `--text-primary` | `oklch(28% 0.04 80)` | Headings, body text |
| `--text-secondary` | `oklch(52% 0.06 80)` | Subtitles, author names, placeholders |
| `--terracotta` | `oklch(62% 0.14 40)` | Primary accent, spin frame, CTA |
| `--terracotta-shadow` | `oklch(48% 0.12 40)` | Button shadow / pressed state |
| `--sage` | `oklch(58% 0.12 155)` | Add-book section accent |
| `--violet` | `oklch(60% 0.12 310)` | Book-list section accent |
| `--marigold` | `oklch(72% 0.13 70)` | Header decoration, pointer arrow |

**Book cover placeholder colors** (cycle by index mod 4):
- 0: terracotta `oklch(62% 0.14 40)`
- 1: sage `oklch(58% 0.12 155)`
- 2: violet `oklch(60% 0.12 310)`
- 3: marigold `oklch(72% 0.13 70)` with dark text `oklch(28% 0.06 70)`

No pure black (#000) or pure white (#fff). No gradient text. No side-stripe border accents (border-left/right > 1px as decorative element).

---

## Typography

**Display — Rasa** (Google Fonts, serif)  
Used for: app title, section headings, book titles in reel, winner title, spin button label.  
Weights: 600, 700.

**Body — Mulish** (Google Fonts, sans-serif)  
Used for: search input, book author names, labels, clear button, metadata.  
Weights: 400, 600, 700, 800.

**Type scale** (fixed `rem` for app UI):
- App title: `3.2rem`, weight 700, Rasa, `letter-spacing: -1px`
- Section title: `1.15rem`, weight 600, Rasa
- Body / input: `0.95rem`, weight 400, Mulish
- Small labels: `0.78–0.85rem`, weight 600–700, Mulish
- Spin button: `1.2rem`, weight 700, Rasa

---

## Layout

Vertical single-column flow (unchanged from current):

1. Header
2. Add a Book section
3. Your Books section
4. Spin to Pick section
5. Winner overlay (teleported to `<body>`)

Max-width `860px`, centered, `padding: 2.5rem 1.5rem 4rem`.

---

## Components

### `style.css` — Global Styles

**Replace entirely.** New CSS custom properties using the token table above. New global resets for `button`, `input`. Font import for Rasa + Mulish via Google Fonts (added to `index.html`).

Remove: Playfair Display, Merriweather imports from `index.html`. Remove all old `--cream`, `--brown`, `--burgundy`, `--gold` variables.

### `App.vue` — Shell & Header

**Header** (`app-header`):
- Decorative row: `[line]  [terracotta dot] [sage dot] [violet dot]  [line]` using marigold lines
- Title `BookSpinner` in Rasa 700, terracotta color `oklch(38% 0.10 40)`
- Subtitle in Mulish 600, text-secondary

**Sections** (`.section`):
- White surface card, `border-radius: 16px`, `border: 1.5px solid var(--border)`
- 3px top accent stripe via `::before` pseudo-element using `var(--section-accent)` — set as a scoped CSS custom property on each section element via Vue's `:style="{'--section-accent': 'oklch(...)'}"` binding
- Section title includes a small colored dot (same color as stripe) before the label
- Add-book section: sage accent
- Books section: violet accent
- Spin section: terracotta accent

### `BookSearch.vue` — Search Input & Dropdown

**Input:** Pill-shaped (`border-radius: 50px`), warm surface background, focus ring in sage. No structural changes.

**Dropdown results:** Rectangular, rounded bottom corners only, warm surface, sage hover state.

**Spinner:** Sage-colored border-top on the loading spinner.

### `BookList.vue` — Grid & Empty State

**Grid:** unchanged (`auto-fill, minmax(130px, 1fr)`, `gap: 1rem`).

**Empty state:** Replace 📚 emoji with the same emoji but centered in a larger display. Update copy color to `text-secondary`. No structural change.

### `BookCard.vue` — Book Cards

- Background: `var(--surface)`, `border: 1.5px solid var(--border)`
- Cover placeholder: cycle accent colors by `index % 4` (requires passing `index` prop from `BookList.vue`)
- Remove button: terracotta background, appears on hover, `border-radius: 50%`
- Slight rotation preserved (`rotate(-1deg)` / `rotate(0.8deg)` alternating)
- Hover: `rotate(0deg) translateY(-4px)` with lifted shadow

**Prop change:** Add optional `index` prop (Number, default 0) to `BookCard` for cover color cycling. `BookList` passes `:index="index"` in the `v-for`.

### `ClearButton.vue` — Clear All Button

- Style: pill-shaped ghost button, `border: 1.5px solid var(--border)`, text-secondary color
- Hover: border darkens slightly, text shifts to text-primary
- No logic changes

### `SlotMachine.vue` — Slot Machine (Hero Component)

**Frame:**
- Background: terracotta `var(--terracotta)`
- `border-radius: 20px`
- Box shadow: `0 6px 0 var(--terracotta-shadow), 0 10px 30px color-mix(in oklch, var(--terracotta) 30%, transparent)`
- Decorative dot rows: 5 dots across top, 3 dots centered bottom, using a lighter tint of terracotta

**Viewport:** `border-radius: 10px`, warm surface background, inset shadow.

**Reel items:** Cover placeholder uses the book's index within `props.books` (not the reel item index) mod 4 — so the same book always renders the same color as it scrolls through the reel. Title in Rasa, author in Mulish.

**Pointer arrow:** Moved to left side, marigold color `var(--marigold)`.

**Spin button:**
- Background: `var(--text-primary)` (deep warm near-black)
- Text: `var(--bg)` (warm off-white)
- Font: Rasa 700, `1.2rem`
- `border-radius: 50px`
- Shadow: `0 4px 0 oklch(18% 0.03 80)` (pressed-key feel)
- Label: "Pick a Book!" (unchanged), "Spinning…" when active

**Winner overlay:**
- Backdrop: `var(--text-primary)` at 75% opacity
- Card: warm surface, `border-radius: 20px`, `border: 2px solid var(--border)`
- Ribbon (replaces banner): pill-shaped terracotta label positioned above card top edge, text "This month's read!"
- Emoji confetti: 🎉 top-left, ✨ top-right, positioned absolutely within card
- Dismiss button label: "Let's read it! 📖" → `background: var(--terracotta)`, pill shape, terracotta shadow
- Pop-in animation: same `cubic-bezier(0.175, 0.885, 0.32, 1.275)` scale animation, kept short (400ms)

---

## Files Changed

| File | Change |
|---|---|
| `index.html` | Replace font imports (Rasa + Mulish) |
| `src/style.css` | Full rewrite — new CSS tokens, global styles |
| `src/App.vue` | Header markup + section accent variables |
| `src/components/BookSearch.vue` | Scoped styles only |
| `src/components/BookList.vue` | Pass `index` prop to BookCard |
| `src/components/BookCard.vue` | Add `index` prop, new scoped styles |
| `src/components/ClearButton.vue` | Scoped styles only |
| `src/components/SlotMachine.vue` | Scoped styles + reel cover color cycling |

No changes to: `src/main.js`, `src/composables/`, `vite.config.js`.

---

## Transitions & Motion

- All button hover transforms: `transition: transform 0.15s ease, box-shadow 0.15s ease`
- Card hover lift: `transition: transform 0.2s ease, box-shadow 0.2s ease`
- Search dropdown: no transition change needed
- Slot reel: existing `easeOutCubic` animation unchanged (3500ms)
- Winner overlay: existing `fadeInOverlay` (0.3s) + `popIn` (0.4s) unchanged
- Book card entrance: existing `fadeIn` (0.3s) unchanged

No bounce or elastic easing anywhere. No layout property animations.

---

## Out of Scope

- No changes to search logic, API calls, or composables
- No dark mode
- No responsive breakpoint changes (existing max-width behavior is fine)
- No new features or interactions
- No accessibility audit (separate task if needed)
