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
        class="search-input"
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
  overflow-x: hidden;
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
