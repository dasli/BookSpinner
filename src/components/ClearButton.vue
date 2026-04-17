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
  <button class="btn-danger" :disabled="disabled" @click="handleClear">
    Clear All
  </button>
</template>
