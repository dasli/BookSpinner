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
