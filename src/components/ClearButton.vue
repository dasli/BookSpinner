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
