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
      <div v-else class="cover-img cover-placeholder" :class="coverClass">
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
