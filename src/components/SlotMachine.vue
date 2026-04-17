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

const REEL_REPEATS = 8
const ITEM_HEIGHT = 110

const reelItems = computed(() => {
  const items = []
  for (let i = 0; i < REEL_REPEATS; i++) {
    props.books.forEach((book, bookIndex) => {
      items.push({ ...book, bookIndex })
    })
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

  const winnerIndex = Math.floor(Math.random() * props.books.length)
  const pickedBook = props.books[winnerIndex]

  const targetIndex = (REEL_REPEATS - 2) * props.books.length + winnerIndex
  const targetOffset = targetIndex * ITEM_HEIGHT

  const duration = 3500
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
      reelOffset.value = targetOffset
      setTimeout(() => {
        winner.value = { ...pickedBook, bookIndex: winnerIndex }
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
      <div class="frame-dots frame-dots-top">
        <span class="frame-dot" v-for="n in 5" :key="n"></span>
      </div>

      <div class="slot-viewport">
        <div
          class="slot-reel"
          :style="{ transform: `translateY(-${reelOffset}px)` }"
        >
          <div
            v-for="(item, i) in reelItems"
            :key="i"
            class="reel-item"
          >
            <img
              v-if="item.coverUrl"
              :src="item.coverUrl"
              :alt="item.title"
              class="reel-cover reel-cover-img"
            />
            <div
              v-else
              class="reel-cover reel-cover-placeholder"
              :class="`cover-${item.bookIndex % 4}`"
            >
              {{ item.title.charAt(0) }}
            </div>
            <div class="reel-info">
              <div class="reel-title">{{ item.title }}</div>
              <div class="reel-author">{{ item.author }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="frame-dots frame-dots-bottom">
        <span class="frame-dot" v-for="n in 3" :key="n"></span>
      </div>

      <div class="slot-pointer"></div>
    </div>

    <button
      class="spin-btn"
      :disabled="!canSpin"
      @click="spin"
    >
      {{ spinning ? 'Spinning…' : 'Pick a Book!' }}
    </button>

    <Teleport to="body">
      <div v-if="showWinner && winner" class="winner-overlay" @click="dismiss">
        <div class="winner-card" @click.stop>
          <div class="winner-ribbon">This month's read!</div>
          <span class="winner-confetti winner-confetti-left">🎉</span>
          <span class="winner-confetti winner-confetti-right">✨</span>
          <img
            v-if="winner.coverUrl"
            :src="winner.coverUrl"
            :alt="winner.title"
            class="winner-cover winner-cover-img"
          />
          <div
            v-else
            class="winner-cover winner-cover-placeholder"
            :class="`cover-${winner.bookIndex % 4}`"
          >
            {{ winner.title.charAt(0) }}
          </div>
          <h2 class="winner-title">{{ winner.title }}</h2>
          <p class="winner-author">by {{ winner.author }}</p>
          <button class="winner-btn" @click="dismiss">Let's read it! 📖</button>
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

/* ── Frame ── */
.slot-frame {
  position: relative;
  width: 100%;
  max-width: 380px;
  background: var(--terracotta);
  border-radius: 20px;
  padding: 12px 14px 10px;
  box-shadow:
    0 6px 0 var(--terracotta-shadow),
    0 12px 32px color-mix(in oklch, var(--terracotta) 30%, transparent);
}

.frame-dots {
  display: flex;
  gap: 7px;
  margin-bottom: 10px;
}

.frame-dots-top {
  justify-content: space-between;
}

.frame-dots-bottom {
  justify-content: center;
  margin-bottom: 0;
  margin-top: 10px;
}

.frame-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: color-mix(in oklch, var(--terracotta) 60%, var(--surface));
  display: block;
}

/* ── Viewport ── */
.slot-viewport {
  height: 110px;
  overflow: hidden;
  border-radius: 10px;
  background: var(--surface);
  box-shadow: inset 0 2px 8px oklch(28% 0.04 80 / 0.15);
}

.slot-reel {
  will-change: transform;
}

/* ── Reel items ── */
.reel-item {
  height: 110px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
}

.reel-cover {
  width: 54px;
  height: 80px;
  border-radius: 5px;
  flex-shrink: 0;
}

.reel-cover-img {
  object-fit: cover;
  box-shadow: 0 2px 6px oklch(28% 0.04 80 / 0.2);
}

.reel-cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
}

.reel-info {
  min-width: 0;
}

.reel-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.reel-author {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* ── Pointer arrow ── */
.slot-pointer {
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 13px solid transparent;
  border-bottom: 13px solid transparent;
  border-left: 13px solid var(--marigold);
  filter: drop-shadow(2px 0 3px oklch(28% 0.04 80 / 0.2));
}

/* ── Spin button ── */
.spin-btn {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  background: var(--text-primary);
  color: var(--bg);
  border-radius: 50px;
  padding: 0.85rem 2.8rem;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 0 oklch(18% 0.03 80);
}

.spin-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 oklch(18% 0.03 80);
}

.spin-btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 0 2px 0 oklch(18% 0.03 80);
}

/* ── Winner overlay ── */
@keyframes fadeInOverlay {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

.winner-overlay {
  position: fixed;
  inset: 0;
  background: oklch(28% 0.04 80 / 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeInOverlay 0.3s ease;
}

.winner-card {
  background: var(--surface);
  border-radius: 20px;
  border: 2px solid var(--border);
  padding: 2rem;
  text-align: center;
  max-width: 300px;
  width: 90%;
  position: relative;
  box-shadow: 0 20px 60px oklch(28% 0.04 80 / 0.35);
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.winner-ribbon {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--terracotta);
  color: var(--surface);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.82rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 4px 20px;
  border-radius: 50px;
  white-space: nowrap;
}

.winner-confetti {
  position: absolute;
  font-size: 1.4rem;
}

.winner-confetti-left  { top: 14px; left: 14px; }
.winner-confetti-right { top: 14px; right: 14px; }

.winner-cover {
  width: 120px;
  height: 180px;
  border-radius: 8px;
  margin: 1.25rem auto 1rem;
  display: block;
}

.winner-cover-img {
  object-fit: cover;
  box-shadow: 0 8px 24px oklch(28% 0.04 80 / 0.25);
}

.winner-cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 700;
  box-shadow: 0 8px 24px oklch(28% 0.04 80 / 0.25);
}

.winner-title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
  line-height: 1.3;
}

.winner-author {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 1.25rem;
}

.winner-btn {
  background: var(--terracotta);
  color: var(--surface);
  border-radius: 50px;
  padding: 10px 28px;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 4px 0 var(--terracotta-shadow);
}

.winner-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 var(--terracotta-shadow);
}

.winner-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 var(--terracotta-shadow);
}
</style>
