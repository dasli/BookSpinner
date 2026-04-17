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

// Build a long reel: repeat books multiple times so it feels like a real spin
const REEL_REPEATS = 8
const ITEM_HEIGHT = 120 // px per item in the reel

const reelItems = computed(() => {
  const items = []
  for (let i = 0; i < REEL_REPEATS; i++) {
    items.push(...props.books)
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

  // Pick a random winner
  const winnerIndex = Math.floor(Math.random() * props.books.length)
  const pickedBook = props.books[winnerIndex]

  // Calculate target: scroll through most of the reel, landing on the winner
  // Land somewhere in the middle of the reel for visual effect
  const targetIndex = (REEL_REPEATS - 2) * props.books.length + winnerIndex
  const targetOffset = targetIndex * ITEM_HEIGHT

  const duration = 3500 // ms
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
      // Animation complete
      reelOffset.value = targetOffset
      setTimeout(() => {
        winner.value = pickedBook
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

<template>
  <div class="slot-machine">
    <div class="slot-frame">
      <div class="slot-viewport">
        <div
          class="slot-reel"
          :style="{ transform: `translateY(-${reelOffset}px)` }"
        >
          <div
            v-for="(book, i) in reelItems"
            :key="i"
            class="reel-item"
          >
            <img
              v-if="book.coverUrl"
              :src="book.coverUrl"
              :alt="book.title"
              class="reel-cover"
            />
            <div v-else class="reel-cover reel-cover-placeholder">
              {{ book.title.charAt(0) }}
            </div>
            <div class="reel-title">{{ book.title }}</div>
          </div>
        </div>
      </div>
      <div class="slot-pointer"></div>
    </div>

    <button class="btn-primary spin-btn" :disabled="!canSpin" @click="spin">
      {{ spinning ? 'Spinning...' : 'Pick a Book!' }}
    </button>

    <!-- Winner overlay -->
    <Teleport to="body">
      <div v-if="showWinner && winner" class="winner-overlay" @click="dismiss">
        <div class="winner-card" @click.stop>
          <div class="winner-banner">Winner!</div>
          <img
            v-if="winner.coverUrl"
            :src="winner.coverUrl"
            :alt="winner.title"
            class="winner-cover"
          />
          <div v-else class="winner-cover winner-cover-placeholder">
            {{ winner.title.charAt(0) }}
          </div>
          <h2 class="winner-title">{{ winner.title }}</h2>
          <p class="winner-author">by {{ winner.author }}</p>
          <button class="btn-primary" @click="dismiss">Awesome!</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.slot-machine {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.slot-frame {
  position: relative;
  width: 100%;
  max-width: 360px;
  background: linear-gradient(145deg, #5D4037, #3E2723);
  border-radius: 16px;
  padding: 16px;
  box-shadow:
    0 4px 20px var(--shadow-strong),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.slot-viewport {
  height: 120px;
  overflow: hidden;
  border-radius: 8px;
  background: var(--cream);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
}

.slot-reel {
  will-change: transform;
}

.reel-item {
  height: 120px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
}

.reel-cover {
  width: 64px;
  height: 96px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 6px var(--shadow);
  flex-shrink: 0;
}

.reel-cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--burgundy), var(--brown));
  color: var(--cream);
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 900;
}

.reel-title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.slot-pointer {
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-right: 12px solid var(--gold);
  filter: drop-shadow(-2px 0 4px rgba(0, 0, 0, 0.3));
}

.spin-btn {
  font-size: 1.1rem;
  padding: 0.8rem 2.5rem;
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Winner overlay */
.winner-overlay {
  position: fixed;
  inset: 0;
  background: rgba(62, 39, 35, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeInOverlay 0.3s ease;
}

@keyframes fadeInOverlay {
  from { opacity: 0; }
  to { opacity: 1; }
}

.winner-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  max-width: 320px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.winner-banner {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 1.25rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.winner-cover {
  width: 140px;
  height: 210px;
  object-fit: cover;
  border-radius: 6px;
  margin: 0 auto 1rem;
  display: block;
  box-shadow: 0 8px 24px var(--shadow-strong);
}

.winner-cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--burgundy), var(--brown));
  color: var(--cream);
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 900;
}

.winner-title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--brown);
  margin-bottom: 0.25rem;
}

.winner-author {
  color: var(--brown-light);
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
}
</style>
