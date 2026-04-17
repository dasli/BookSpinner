<script setup>
import { useBookList } from './composables/useBookList.js'
import BookSearch from './components/BookSearch.vue'
import BookList from './components/BookList.vue'
import SlotMachine from './components/SlotMachine.vue'
import ClearButton from './components/ClearButton.vue'

const { books, addBook, removeBook, clearAll } = useBookList()
</script>

<template>
  <header class="app-header">
    <h1>BookSpinner</h1>
    <p class="subtitle">Your book club's next read, chosen by fate</p>
  </header>

  <section class="section">
    <h2 class="section-title">Add a Book</h2>
    <BookSearch @select="addBook" />
  </section>

  <section class="section">
    <div class="section-header">
      <h2 class="section-title">
        Your Books
        <span v-if="books.length" class="book-count">({{ books.length }})</span>
      </h2>
      <ClearButton :disabled="books.length === 0" @clear="clearAll" />
    </div>
    <BookList :books="books" @remove="removeBook" />
  </section>

  <section class="section">
    <h2 class="section-title">Spin to Pick!</h2>
    <SlotMachine :books="books" />
  </section>
</template>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--cream-dark);
}

.section-header .section-title {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.book-count {
  font-size: 0.9rem;
  font-weight: 400;
  color: var(--brown-light);
}
</style>
