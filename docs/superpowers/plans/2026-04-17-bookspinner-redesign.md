# BookSpinner Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace BookSpinner's generic warm-serif aesthetic with the Illustrated Bookshop visual identity: OKLCH color palette (terracotta, sage, violet, marigold), Rasa + Mulish type pairing, and a theatrical slot machine hero.

**Architecture:** Pure visual redesign — new CSS tokens in `style.css`, scoped style rewrites per component, one small JS change (book index prop for cover color cycling). No logic, composable, or data flow changes.

**Tech Stack:** Vue 3, Vite, vanilla CSS (OKLCH, CSS custom properties). No PostCSS or CSS preprocessor needed — Vite serves modern CSS natively.

---

## File Map

| File | Change |
|---|---|
| `index.html` | Swap Google Fonts imports (Rasa + Mulish) |
| `src/style.css` | Full rewrite — new tokens, global cover color classes, section styles |
| `src/App.vue` | New header template markup; `:style` bindings for section accent color |
| `src/components/BookSearch.vue` | Scoped `<style>` rewrite only |
| `src/components/BookList.vue` | Add `:index="index"` to BookCard in `v-for` |
| `src/components/BookCard.vue` | Add `index` prop; cover uses global `cover-N` class; scoped style rewrite |
| `src/components/ClearButton.vue` | Scoped `<style>` rewrite only |
| `src/components/SlotMachine.vue` | Extend `reelItems` computed to include `bookIndex`; scoped style rewrite |

---

## Task 1: Start dev server + swap fonts

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Open the URL printed (usually `http://localhost:5173`). Keep it open throughout — Vite hot-reloads on every save.

- [ ] **Step 2: Replace font imports in `index.html`**

Replace the entire `<head>` block with:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BookSpinner</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Rasa:wght@600;700&family=Mulish:wght@400;600;700;800&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 3: Verify fonts load**

In the browser, open DevTools → Network → filter by "fonts.gstatic.com". Confirm `Rasa` and `Mulish` font files appear. The app will still look broken (old CSS variables) — that's expected.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: swap fonts to Rasa + Mulish"
```

---

## Task 2: Rewrite style.css

**Files:**
- Modify: `src/style.css`

- [ ] **Step 1: Replace the entire contents of `src/style.css`**

```css
:root {
  --bg: oklch(93% 0.018 80);
  --surface: oklch(99% 0.010 80);
  --border: oklch(88% 0.025 80);
  --text-primary: oklch(28% 0.04 80);
  --text-secondary: oklch(52% 0.06 80);
  --terracotta: oklch(62% 0.14 40);
  --terracotta-shadow: oklch(48% 0.12 40);
  --sage: oklch(58% 0.12 155);
  --violet: oklch(60% 0.12 310);
  --marigold: oklch(72% 0.13 70);
  --font-display: 'Rasa', Georgia, serif;
  --font-body: 'Mulish', system-ui, sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  background-color: var(--bg);
  color: var(--text-primary);
  min-height: 100vh;
  line-height: 1.6;
}

#app {
  max-width: 860px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}

h1, h2, h3 {
  font-family: var(--font-display);
}

button {
  font-family: var(--font-body);
  cursor: pointer;
  border: none;
  border-radius: 6px;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, color 0.15s ease;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input {
  font-family: var(--font-body);
  font-size: 0.95rem;
  width: 100%;
}

/* ── Sections ── */
.section {
  background: var(--surface);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  border: 1.5px solid var(--border);
  position: relative;
  overflow: hidden;
}

.section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--section-accent, var(--terracotta));
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-header .section-title {
  margin-bottom: 0;
}

.section-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--section-accent, var(--terracotta));
  flex-shrink: 0;
}

.book-count {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-left: 4px;
}

/* ── Global cover placeholder color classes ── */
/* Used by both BookCard and SlotMachine reel items */
.cover-0 { background: var(--terracotta); color: var(--surface); }
.cover-1 { background: var(--sage); color: var(--surface); }
.cover-2 { background: var(--violet); color: var(--surface); }
.cover-3 { background: var(--marigold); color: oklch(28% 0.06 70); }

/* ── Fade-in animation ── */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease forwards;
}
```

- [ ] **Step 2: Verify in browser**

The page background should now be warm parchment (`oklch(93% 0.018 80)`). Section cards will be near-white with a subtle warm tint. Text will be a deep warm brown. Some elements will look unstyled until their component styles are updated — that's fine.

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "feat: rewrite style.css with Illustrated Bookshop tokens"
```

---

## Task 3: Redesign App.vue

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: Replace the entire contents of `src/App.vue`**

```vue
<script setup>
import { useBookList } from './composables/useBookList.js'
import BookSearch from './components/BookSearch.vue'
import BookList from './components/BookList.vue'
import SlotMachine from './components/SlotMachine.vue'
import ClearButton from './components/ClearButton.vue'

const { books, addBook, removeBook, clearAll } = useBookList()

const accentSage = { '--section-accent': 'var(--sage)' }
const accentViolet = { '--section-accent': 'var(--violet)' }
const accentTerracotta = { '--section-accent': 'var(--terracotta)' }
</script>

<template>
  <header class="app-header">
    <div class="header-decoration">
      <div class="header-line"></div>
      <div class="header-dot dot-terracotta"></div>
      <div class="header-dot dot-sage"></div>
      <div class="header-dot dot-violet"></div>
      <div class="header-line"></div>
    </div>
    <h1>BookSpinner</h1>
    <p class="subtitle">Your book club's next read, chosen by fate</p>
  </header>

  <section class="section" :style="accentSage">
    <h2 class="section-title">
      <span class="section-title-dot"></span>
      Add a Book
    </h2>
    <BookSearch @select="addBook" />
  </section>

  <section class="section" :style="accentViolet">
    <div class="section-header">
      <h2 class="section-title">
        <span class="section-title-dot"></span>
        Your Books
        <span v-if="books.length" class="book-count">({{ books.length }})</span>
      </h2>
      <ClearButton :disabled="books.length === 0" @clear="clearAll" />
    </div>
    <BookList :books="books" @remove="removeBook" />
  </section>

  <section class="section" :style="accentTerracotta">
    <h2 class="section-title">
      <span class="section-title-dot"></span>
      Spin to Pick!
    </h2>
    <SlotMachine :books="books" />
  </section>
</template>

<style scoped>
.app-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.header-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
}

.header-line {
  height: 2px;
  width: 52px;
  background: var(--marigold);
  border-radius: 1px;
}

.header-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.dot-terracotta { background: var(--terracotta); }
.dot-sage       { background: var(--sage); }
.dot-violet     { background: var(--violet); }

h1 {
  font-size: 3.2rem;
  font-weight: 700;
  color: oklch(38% 0.10 40);
  letter-spacing: -1px;
  line-height: 1;
  margin-bottom: 6px;
}

.subtitle {
  font-size: 0.92rem;
  color: var(--text-secondary);
  font-weight: 600;
  letter-spacing: 0.3px;
}
</style>
```

- [ ] **Step 2: Verify in browser**

The header should show: marigold lines flanking three colored dots, then "BookSpinner" in large Rasa serif (warm terracotta-brown), then the subtitle. Each section card should now have a 3px colored top stripe — sage, violet, terracotta from top to bottom.

- [ ] **Step 3: Commit**

```bash
git add src/App.vue
git commit -m "feat: redesign App.vue header and section accent system"
```

---

## Task 4: Redesign BookSearch.vue

**Files:**
- Modify: `src/components/BookSearch.vue`

- [ ] **Step 1: Replace the `<style scoped>` block in `src/components/BookSearch.vue`**

Keep the `<script setup>` and `<template>` blocks exactly as they are. Replace only the `<style scoped>` block:

```vue
<style scoped>
.book-search {
  position: relative;
}

.search-input-wrapper {
  position: relative;
}

.search-input {
  background: var(--bg);
  border: 2px solid var(--border);
  border-radius: 50px;
  padding: 0.75rem 1.25rem;
  color: var(--text-primary);
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--sage);
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--sage) 20%, transparent);
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.search-spinner {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border: 2px solid var(--border);
  border-top-color: var(--sage);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: translateY(-50%) rotate(360deg); }
}

.search-results {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  list-style: none;
  z-index: 100;
  box-shadow: 0 8px 24px oklch(28% 0.04 80 / 0.12);
  max-height: 320px;
  overflow-y: auto;
  overflow: hidden;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.search-result-item:first-child {
  border-radius: 12px 12px 0 0;
}

.search-result-item:last-child {
  border-radius: 0 0 12px 12px;
}

.search-result-item:only-child {
  border-radius: 12px;
}

.search-result-item:hover {
  background: var(--bg);
}

.result-cover {
  width: 36px;
  height: 52px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 1px 4px oklch(28% 0.04 80 / 0.15);
  flex-shrink: 0;
}

.result-cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--border);
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 700;
  border-radius: 4px;
  flex-shrink: 0;
  width: 36px;
  height: 52px;
}

.result-info {
  min-width: 0;
}

.result-title {
  font-weight: 700;
  font-size: 0.88rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-primary);
}

.result-author {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin-top: 1px;
}

.search-empty {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.88rem;
  z-index: 100;
}
</style>
```

- [ ] **Step 2: Verify in browser**

Search for a book. The input should be pill-shaped with a sage focus ring. Results dropdown should appear below with rounded corners all around and sage hover state.

- [ ] **Step 3: Commit**

```bash
git add src/components/BookSearch.vue
git commit -m "feat: redesign BookSearch with pill input and sage focus"
```

---

## Task 5: Wire up index prop — BookList + BookCard

**Files:**
- Modify: `src/components/BookList.vue`
- Modify: `src/components/BookCard.vue` (`<script setup>` only)

This task adds the `index` prop that drives cover color cycling. Do both files together since they're tightly coupled.

- [ ] **Step 1: Update `src/components/BookList.vue` to pass `:index`**

Replace the entire file:

```vue
<script setup>
import BookCard from './BookCard.vue'

defineProps({
  books: { type: Array, required: true },
})

defineEmits(['remove'])
</script>

<template>
  <div>
    <div v-if="books.length === 0" class="empty-state">
      <div class="empty-icon">📚</div>
      <p>No books yet. Search above to add some!</p>
    </div>
    <div v-else class="book-grid">
      <BookCard
        v-for="(book, index) in books"
        :key="index"
        :book="book"
        :index="index"
        @remove="$emit('remove', index)"
      />
    </div>
  </div>
</template>

<style scoped>
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}

.empty-state p {
  font-size: 0.92rem;
}
</style>
```

- [ ] **Step 2: Update `<script setup>` in `src/components/BookCard.vue` to accept `index` prop**

Replace only the `<script setup>` block (leave `<template>` and `<style>` as-is for now):

```vue
<script setup>
import { computed } from 'vue'

const props = defineProps({
  book: { type: Object, required: true },
  removable: { type: Boolean, default: true },
  index: { type: Number, default: 0 },
})

defineEmits(['remove'])

const coverClass = computed(() => `cover-${props.index % 4}`)
</script>
```

- [ ] **Step 3: Update the `<template>` in `src/components/BookCard.vue` to use `coverClass`**

Replace the cover placeholder `<div>` inside the template. Find this block in the template:

```html
<div v-else class="cover-img cover-placeholder">
  <span>{{ book.title.charAt(0) }}</span>
</div>
```

Replace with:

```html
<div v-else class="cover-img cover-placeholder" :class="coverClass">
  <span>{{ book.title.charAt(0) }}</span>
</div>
```

- [ ] **Step 4: Verify in browser**

Add 4+ books. Each book's placeholder cover (when no image loads) should cycle through terracotta → sage → violet → marigold colors. Books with real cover images are unaffected.

- [ ] **Step 5: Commit**

```bash
git add src/components/BookList.vue src/components/BookCard.vue
git commit -m "feat: add index prop to BookCard for cover color cycling"
```

---

## Task 6: Redesign BookCard.vue styles

**Files:**
- Modify: `src/components/BookCard.vue` (`<style scoped>` only)

- [ ] **Step 1: Replace the `<style scoped>` block in `src/components/BookCard.vue`**

```vue
<style scoped>
.book-card {
  position: relative;
  background: var(--surface);
  border-radius: 12px;
  padding: 10px;
  border: 1.5px solid var(--border);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  transform: rotate(-0.8deg);
}

.book-card:nth-child(even) {
  transform: rotate(0.6deg);
}

.book-card:hover {
  transform: rotate(0deg) translateY(-4px);
  box-shadow: 0 8px 24px oklch(28% 0.04 80 / 0.14);
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--terracotta);
  color: var(--surface);
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 1;
}

.book-card:hover .remove-btn {
  opacity: 1;
}

.cover-wrapper {
  aspect-ratio: 2 / 3;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 700;
}

.book-info {
  text-align: center;
}

.book-title {
  font-weight: 700;
  font-size: 0.82rem;
  line-height: 1.3;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 0.72rem;
  color: var(--text-secondary);
  margin-top: 2px;
}
</style>
```

- [ ] **Step 2: Verify in browser**

Book cards should now have a white-warm surface, subtle border, a slight tilt. Hovering should lift the card and show a terracotta × button. Cover placeholders cycle through the four accent colors.

- [ ] **Step 3: Commit**

```bash
git add src/components/BookCard.vue
git commit -m "feat: redesign BookCard with new palette and color-cycling covers"
```

---

## Task 7: Redesign ClearButton.vue

**Files:**
- Modify: `src/components/ClearButton.vue`

- [ ] **Step 1: Replace the entire `src/components/ClearButton.vue`**

```vue
<script setup>
defineProps({
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['clear'])

function handleClear() {
  if (window.confirm('Remove all books from your list?')) {
    emit('clear')
  }
}
</script>

<template>
  <button class="btn-clear" :disabled="disabled" @click="handleClear">
    Clear All
  </button>
</template>

<style scoped>
.btn-clear {
  background: transparent;
  border: 1.5px solid var(--border);
  border-radius: 50px;
  padding: 6px 18px;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  white-space: nowrap;
}

.btn-clear:hover:not(:disabled) {
  border-color: var(--text-secondary);
  color: var(--text-primary);
}
</style>
```

- [ ] **Step 2: Verify in browser**

The "Clear All" button should be a small ghost pill — no background, just a border, secondary text color. Hover darkens border and text. When disabled (no books) it should be dimmed.

- [ ] **Step 3: Commit**

```bash
git add src/components/ClearButton.vue
git commit -m "feat: redesign ClearButton as ghost pill"
```

---

## Task 8: Redesign SlotMachine.vue

**Files:**
- Modify: `src/components/SlotMachine.vue`

This is the hero component. Two changes: (1) the `reelItems` computed includes `bookIndex` for color cycling, (2) full style rewrite.

- [ ] **Step 1: Replace the entire `<script setup>` block in `src/components/SlotMachine.vue`**

```vue
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  books: { type: Array, required: true },
})

const spinning = ref(false)
const winner = ref(null)
const reelOffset = ref(0)
const showWinner = ref(false)

const canSpin = computed(() => props.books.length >= 2 && !spinning.value)

const REEL_REPEATS = 8
const ITEM_HEIGHT = 110

const reelItems = computed(() => {
  const items = []
  for (let i = 0; i < REEL_REPEATS; i++) {
    props.books.forEach((book, bookIndex) => {
      items.push({ ...book, bookIndex })
    })
  }
  return items
})

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

function spin() {
  if (!canSpin.value) return

  spinning.value = true
  showWinner.value = false
  winner.value = null
  reelOffset.value = 0

  const winnerIndex = Math.floor(Math.random() * props.books.length)
  const pickedBook = props.books[winnerIndex]

  const targetIndex = (REEL_REPEATS - 2) * props.books.length + winnerIndex
  const targetOffset = targetIndex * ITEM_HEIGHT

  const duration = 3500
  let startTime = null

  function animate(timestamp) {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easeOutCubic(progress)

    reelOffset.value = easedProgress * targetOffset

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      reelOffset.value = targetOffset
      setTimeout(() => {
        winner.value = { ...pickedBook, bookIndex: winnerIndex }
        showWinner.value = true
        spinning.value = false
      }, 300)
    }
  }

  requestAnimationFrame(animate)
}

function dismiss() {
  showWinner.value = false
  winner.value = null
}
</script>
```

- [ ] **Step 2: Replace the `<template>` block in `src/components/SlotMachine.vue`**

```vue
<template>
  <div class="slot-machine">
    <div class="slot-frame">
      <div class="frame-dots frame-dots-top">
        <span class="frame-dot" v-for="n in 5" :key="n"></span>
      </div>

      <div class="slot-viewport">
        <div
          class="slot-reel"
          :style="{ transform: `translateY(-${reelOffset}px)` }"
        >
          <div
            v-for="(item, i) in reelItems"
            :key="i"
            class="reel-item"
          >
            <img
              v-if="item.coverUrl"
              :src="item.coverUrl"
              :alt="item.title"
              class="reel-cover reel-cover-img"
            />
            <div
              v-else
              class="reel-cover reel-cover-placeholder"
              :class="`cover-${item.bookIndex % 4}`"
            >
              {{ item.title.charAt(0) }}
            </div>
            <div class="reel-info">
              <div class="reel-title">{{ item.title }}</div>
              <div class="reel-author">{{ item.author }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="frame-dots frame-dots-bottom">
        <span class="frame-dot" v-for="n in 3" :key="n"></span>
      </div>

      <div class="slot-pointer"></div>
    </div>

    <button
      class="spin-btn"
      :disabled="!canSpin"
      @click="spin"
    >
      {{ spinning ? 'Spinning…' : 'Pick a Book!' }}
    </button>

    <Teleport to="body">
      <div v-if="showWinner && winner" class="winner-overlay" @click="dismiss">
        <div class="winner-card" @click.stop>
          <div class="winner-ribbon">This month's read!</div>
          <span class="winner-confetti winner-confetti-left">🎉</span>
          <span class="winner-confetti winner-confetti-right">✨</span>
          <img
            v-if="winner.coverUrl"
            :src="winner.coverUrl"
            :alt="winner.title"
            class="winner-cover winner-cover-img"
          />
          <div
            v-else
            class="winner-cover winner-cover-placeholder"
            :class="`cover-${winner.bookIndex % 4}`"
          >
            {{ winner.title.charAt(0) }}
          </div>
          <h2 class="winner-title">{{ winner.title }}</h2>
          <p class="winner-author">by {{ winner.author }}</p>
          <button class="winner-btn" @click="dismiss">Let's read it! 📖</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
```

- [ ] **Step 3: Replace the `<style scoped>` block in `src/components/SlotMachine.vue`**

```vue
<style scoped>
.slot-machine {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

/* ── Frame ── */
.slot-frame {
  position: relative;
  width: 100%;
  max-width: 380px;
  background: var(--terracotta);
  border-radius: 20px;
  padding: 12px 14px 10px;
  box-shadow:
    0 6px 0 var(--terracotta-shadow),
    0 12px 32px color-mix(in oklch, var(--terracotta) 30%, transparent);
}

.frame-dots {
  display: flex;
  gap: 7px;
  margin-bottom: 10px;
}

.frame-dots-top {
  justify-content: space-between;
}

.frame-dots-bottom {
  justify-content: center;
  margin-bottom: 0;
  margin-top: 10px;
}

.frame-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: color-mix(in oklch, var(--terracotta) 60%, white);
  display: block;
}

/* ── Viewport ── */
.slot-viewport {
  height: 110px;
  overflow: hidden;
  border-radius: 10px;
  background: var(--surface);
  box-shadow: inset 0 2px 8px oklch(28% 0.04 80 / 0.15);
}

.slot-reel {
  will-change: transform;
}

/* ── Reel items ── */
.reel-item {
  height: 110px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
}

.reel-cover {
  width: 54px;
  height: 80px;
  border-radius: 5px;
  flex-shrink: 0;
}

.reel-cover-img {
  object-fit: cover;
  box-shadow: 0 2px 6px oklch(28% 0.04 80 / 0.2);
}

.reel-cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
}

.reel-info {
  min-width: 0;
}

.reel-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.reel-author {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* ── Pointer arrow ── */
.slot-pointer {
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 13px solid transparent;
  border-bottom: 13px solid transparent;
  border-left: 13px solid var(--marigold);
  filter: drop-shadow(2px 0 3px oklch(28% 0.04 80 / 0.2));
}

/* ── Spin button ── */
.spin-btn {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  background: var(--text-primary);
  color: var(--bg);
  border-radius: 50px;
  padding: 0.85rem 2.8rem;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 0 oklch(18% 0.03 80);
}

.spin-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 oklch(18% 0.03 80);
}

.spin-btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 0 2px 0 oklch(18% 0.03 80);
}

/* ── Winner overlay ── */
@keyframes fadeInOverlay {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

.winner-overlay {
  position: fixed;
  inset: 0;
  background: oklch(28% 0.04 80 / 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeInOverlay 0.3s ease;
}

.winner-card {
  background: var(--surface);
  border-radius: 20px;
  border: 2px solid var(--border);
  padding: 2rem;
  text-align: center;
  max-width: 300px;
  width: 90%;
  position: relative;
  box-shadow: 0 20px 60px oklch(28% 0.04 80 / 0.35);
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.winner-ribbon {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--terracotta);
  color: var(--surface);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.82rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 4px 20px;
  border-radius: 50px;
  white-space: nowrap;
}

.winner-confetti {
  position: absolute;
  font-size: 1.4rem;
}

.winner-confetti-left  { top: 14px; left: 14px; }
.winner-confetti-right { top: 14px; right: 14px; }

.winner-cover {
  width: 120px;
  height: 180px;
  border-radius: 8px;
  margin: 1.25rem auto 1rem;
  display: block;
}

.winner-cover-img {
  object-fit: cover;
  box-shadow: 0 8px 24px oklch(28% 0.04 80 / 0.25);
}

.winner-cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 700;
  box-shadow: 0 8px 24px oklch(28% 0.04 80 / 0.25);
}

.winner-title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
  line-height: 1.3;
}

.winner-author {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 1.25rem;
}

.winner-btn {
  background: var(--terracotta);
  color: var(--surface);
  border-radius: 50px;
  padding: 10px 28px;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 4px 0 var(--terracotta-shadow);
}

.winner-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 var(--terracotta-shadow);
}

.winner-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 var(--terracotta-shadow);
}
</style>
```

- [ ] **Step 4: Verify the complete redesign in browser**

Do a full end-to-end check:
1. Header: decorative dots + lines, large Rasa title, subtitle
2. Add a Book: pill input with sage focus ring, search results with rounded dropdown
3. Your Books: violet-accented section, book cards with cycling cover colors and tilt
4. Spin to Pick: terracotta frame with decorative dots, marigold pointer on left, dark pill spin button
5. Spin with 2+ books: reel scrolls and lands on a winner
6. Winner overlay: ribbon badge, confetti emojis, "Let's read it! 📖" button

- [ ] **Step 5: Commit**

```bash
git add src/components/SlotMachine.vue
git commit -m "feat: redesign SlotMachine as illustrated bookshop hero component"
```

---

## Final Check

- [ ] Add 1–5 books, test the full spin flow end-to-end
- [ ] Resize the browser to ~375px wide — verify nothing breaks on mobile
- [ ] Confirm no pure `#000` / `#fff` values remain in any file:

```bash
grep -rn '#000\b\|#fff\b\|#ffffff\|#000000\|\bwhite\b\|\bblack\b' src/
```

Expected: no matches (or only in comments).
