<script setup>
defineProps({
  book: { type: Object, required: true },
  removable: { type: Boolean, default: true },
})

defineEmits(['remove'])
</script>

<template>
  <div class="book-card fade-in">
    <button v-if="removable" class="remove-btn" @click="$emit('remove')" title="Remove book">&times;</button>
    <div class="cover-wrapper">
      <img
        v-if="book.coverUrl"
        :src="book.coverUrl"
        :alt="book.title"
        class="cover-img"
      />
      <div v-else class="cover-img cover-placeholder">
        <span>{{ book.title.charAt(0) }}</span>
      </div>
    </div>
    <div class="book-info">
      <div class="book-title">{{ book.title }}</div>
      <div class="book-author">{{ book.author }}</div>
    </div>
  </div>
</template>

<style scoped>
.book-card {
  position: relative;
  background: white;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 3px 12px var(--shadow), 0 1px 3px var(--shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  transform: rotate(-0.5deg);
}

.book-card:nth-child(even) {
  transform: rotate(0.5deg);
}

.book-card:hover {
  transform: rotate(0deg) translateY(-4px);
  box-shadow: 0 8px 24px var(--shadow-strong);
}

.remove-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--burgundy);
  color: white;
  font-size: 1.1rem;
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
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
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
  background: linear-gradient(135deg, var(--burgundy), var(--brown));
  color: var(--cream);
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 900;
}

.book-info {
  text-align: center;
}

.book-title {
  font-weight: 700;
  font-size: 0.85rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 0.75rem;
  color: var(--brown-light);
  margin-top: 2px;
}
</style>
