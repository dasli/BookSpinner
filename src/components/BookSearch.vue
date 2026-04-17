<script setup>
import { ref } from 'vue'
import { useBookSearch } from '../composables/useBookSearch.js'

const emit = defineEmits(['select'])

const query = ref('')
const showDropdown = ref(false)
const { results, loading, debouncedSearch, clearResults } = useBookSearch()

function onInput() {
  debouncedSearch(query.value)
  showDropdown.value = query.value.trim().length > 0
}

function selectBook(book) {
  emit('select', book)
  query.value = ''
  showDropdown.value = false
  clearResults()
}

function onBlur() {
  // Delay to allow click on dropdown item
  setTimeout(() => { showDropdown.value = false }, 200)
}
</script>

<template>
  <div class="book-search">
    <div class="search-input-wrapper">
      <input
        v-model="query"
        type="text"
        placeholder="Search for a book to add..."
        @input="onInput"
        @focus="showDropdown = query.trim().length > 0"
        @blur="onBlur"
      />
      <span v-if="loading" class="search-spinner"></span>
    </div>

    <ul v-if="showDropdown && results.length > 0" class="search-results">
      <li
        v-for="(book, i) in results"
        :key="i"
        class="search-result-item"
        @mousedown.prevent="selectBook(book)"
      >
        <img
          v-if="book.coverUrl"
          :src="book.coverUrl"
          :alt="book.title"
          class="result-cover"
        />
        <div v-else class="result-cover result-cover-placeholder">?</div>
        <div class="result-info">
          <div class="result-title">{{ book.title }}</div>
          <div class="result-author">{{ book.author }}</div>
        </div>
      </li>
    </ul>

    <div v-if="showDropdown && !loading && query.trim() && results.length === 0" class="search-empty">
      No books found
    </div>
  </div>
</template>

<style scoped>
.book-search {
  position: relative;
}

.search-input-wrapper {
  position: relative;
}

.search-spinner {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 2px solid var(--cream-dark);
  border-top-color: var(--burgundy);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: translateY(-50%) rotate(360deg); }
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid var(--cream-dark);
  border-top: none;
  border-radius: 0 0 8px 8px;
  list-style: none;
  z-index: 100;
  box-shadow: 0 8px 20px var(--shadow-strong);
  max-height: 320px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.search-result-item:hover {
  background: var(--cream);
}

.result-cover {
  width: 40px;
  height: 56px;
  object-fit: cover;
  border-radius: 3px;
  box-shadow: 0 1px 4px var(--shadow);
  flex-shrink: 0;
}

.result-cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream-dark);
  color: var(--brown-light);
  font-size: 1.2rem;
  font-weight: 700;
}

.result-info {
  min-width: 0;
}

.result-title {
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-author {
  font-size: 0.8rem;
  color: var(--brown-light);
}

.search-empty {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid var(--cream-dark);
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 14px;
  text-align: center;
  color: var(--brown-light);
  font-size: 0.9rem;
  z-index: 100;
}
</style>
