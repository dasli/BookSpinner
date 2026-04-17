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
        @remove="$emit('remove', index)"
      />
    </div>
  </div>
</template>

<style scoped>
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1.25rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--brown-light);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}

.empty-state p {
  font-size: 0.95rem;
}
</style>
