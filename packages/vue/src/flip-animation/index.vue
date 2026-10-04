<script setup lang="ts">
import { computed, nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref, watch } from 'vue';
import type { FlipAnimationProps } from './types';
import { retainSound, unlockSound as unlockAudio, playSound } from './sound';

const props = withDefaults(defineProps<FlipAnimationProps>(), {
  items: () => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  duration: 600, width: 60, height: 90, fontSize: 64,
  theme: 'dark', paused: false, respectReducedMotion: true, sound: false, volume: 0.15,
  flipMode: 'direct', flipOrder: 'simultaneous', sequenceIndex: 0, stagger: 80,
});
const target = computed(() => {
  if (props.currentIndex !== undefined) return props.items[props.currentIndex] ?? '';
  if (props.currentValue !== undefined) return props.items.includes(props.currentValue) ? props.currentValue : '';
  return props.items[0] ?? '';
});
const tile = ref<HTMLElement | null>(null);
const font = ref('');
let measure: CanvasRenderingContext2D | null = null;
const shown = ref(target.value);
const previous = ref(target.value);
let position = props.items.indexOf(target.value);
const animating = ref(false);
const flipFrame = ref(0);
const pageActive = ref(true);
const mountedActive = ref(true);
const stopped = computed(() => props.paused || !pageActive.value || !mountedActive.value);
let timer: ReturnType<typeof setTimeout> | undefined;
let releaseSound: (() => void) | undefined;
let revision = 0;
let phase: 'idle' | 'waiting' | 'flipping' = 'idle';
let due = 0;
let cancelSound: (() => void) | undefined;
const stepDuration = computed(() => props.duration <= 0 ? 0 : props.flipMode === 'sequential' ? Math.max(32, props.duration) : props.duration);
const style = computed(() => ({
  width: `${Math.max(1, props.width)}px`, height: `${Math.max(1, props.height)}px`,
  fontSize: `${Math.max(1, props.fontSize)}px`, '--tile-height': `${Math.max(1, props.height)}px`, '--duration': `${Math.max(0, stepDuration.value)}ms`,
}));

/** 按字体实际字形的上下边界修正基线，使可见文字垂直居中。 */
function textStyle(content: string | number) {
  if (!measure || !font.value) return {};
  measure.font = font.value;
  const metrics = measure.measureText(String(content));
  if (!Number.isFinite(metrics.fontBoundingBoxAscent) || !Number.isFinite(metrics.fontBoundingBoxDescent)) return {};
  const offset = (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent - metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent) / 2;
  return { transform: `translateY(${offset}px)` };
}

/** 读取实际生效的字体，用于字形测量。 */
function syncFont() {
  if (!tile.value) return;
  const style = getComputedStyle(tile.value);
  font.value = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
}
watch(() => props.fontSize, syncFont, { flush: 'post' });

/** 用户开启声音后解锁共享音频。 */
function unlockSound() {
  if (props.sound) unlockAudio();
}

/** 取消当前动画、等待任务及尚未播放的声音。 */
function cancel() {
  revision++;
  clearTimeout(timer);
  cancelSound?.();
  cancelSound = undefined;
  phase = 'idle';
  animating.value = false;
}

/** 连续翻牌每次只完成一步，再按最新目标决定下一步。 */
async function flip() {
  if (phase !== 'idle' || stopped.value || target.value === shown.value) return;
  const request = revision;
  const wait = due - performance.now();
  phase = 'waiting';
  if (wait > 0) {
    timer = setTimeout(() => { phase = 'idle'; void flip(); }, wait);
    return;
  }
  await nextTick();
  if (request !== revision || stopped.value) return;
  if (target.value === shown.value) { phase = 'idle'; return; }
  previous.value = shown.value;
  if (props.items[position] !== shown.value) position = props.items.indexOf(shown.value);
  const from = position;
  const to = props.items.indexOf(target.value);
  position = props.flipMode === 'sequential' && stepDuration.value > 0 && from >= 0 && to >= 0
    ? (from + 1) % props.items.length
    : to;
  shown.value = position >= 0 ? props.items[position] : target.value;
  const duration = stepDuration.value;
  phase = 'flipping';
  flipFrame.value++;
  animating.value = duration > 0;
  if (props.sound) cancelSound = playSound(props.volume, duration);
  timer = setTimeout(() => {
    animating.value = false;
    cancelSound?.();
    cancelSound = undefined;
    phase = 'idle';
    void flip();
  }, duration);
}

/** 多块牌按位置错开启动；快速更新只保留最新目标。 */
function requestFlip() {
  if (phase !== 'idle') return;
  due = performance.now() + (props.flipOrder === 'sequential' ? Math.max(0, props.sequenceIndex) * Math.max(0, props.stagger) : 0);
  void flip();
}
function pausePage() { pageActive.value = false; }
function syncPage() {
  pageActive.value = !document.hidden && document.hasFocus();
}
watch(target, requestFlip);
watch(stopped, (paused) => {
  if (paused) cancel();
  else requestFlip();
});
watch([() => props.flipMode, () => props.flipOrder, () => props.sequenceIndex, () => props.stagger, () => props.duration], () => {
  cancel();
  requestFlip();
}, { deep: true });
watch(() => props.items.slice(), (items, old) => {
  if (items.length === old.length && items.every((value, index) => value === old[index])) return;
  position = items.indexOf(shown.value);
  cancel();
  requestFlip();
});
watch(() => props.sound, (enabled) => {
  if (enabled) unlockSound();
  else { cancelSound?.(); cancelSound = undefined; }
});
onMounted(() => {
  measure = document.createElement('canvas').getContext('2d');
  syncFont();
  void document.fonts.ready.then(() => { if (tile.value) syncFont(); });
  releaseSound = retainSound();
  syncPage();
  document.addEventListener('visibilitychange', syncPage);
  window.addEventListener('focus', syncPage);
  window.addEventListener('blur', pausePage);
  document.addEventListener('pointerdown', unlockSound);
  document.addEventListener('keydown', unlockSound);
});
onActivated(() => { mountedActive.value = true; });
onDeactivated(() => { mountedActive.value = false; });
onBeforeUnmount(() => {
  cancel();
  document.removeEventListener('visibilitychange', syncPage);
  window.removeEventListener('focus', syncPage);
  window.removeEventListener('blur', pausePage);
  document.removeEventListener('pointerdown', unlockSound);
  document.removeEventListener('keydown', unlockSound);
  releaseSound?.();
});
</script>

<template>
  <div ref="tile" class="flip-tile" :class="[theme, { animating, 'respect-reduced-motion': respectReducedMotion }]" :style="style" role="img" :aria-label="String(shown)">
    <div class="half top" aria-hidden="true"><span :style="textStyle(shown)">{{ shown }}</span></div>
    <div class="half bottom" aria-hidden="true"><span :style="textStyle(animating ? previous : shown)">{{ animating ? previous : shown }}</span></div>
    <template v-if="animating">
      <div :key="`outgoing-${flipFrame}`" class="half top outgoing" aria-hidden="true"><span :style="textStyle(previous)">{{ previous }}</span></div>
      <div :key="`incoming-${flipFrame}`" class="half bottom incoming" aria-hidden="true"><span :style="textStyle(shown)">{{ shown }}</span></div>
    </template>
  </div>
</template>

<style scoped>
.flip-tile { position: relative; display: inline-block; flex-shrink: 0; font-family: ui-monospace, monospace; font-weight: 700; perspective: 500px; border-radius: 6px; background: var(--flip-background, #272b32); color: var(--flip-color, #f7f2dd); box-shadow: 0 3px 7px #0004; }
.flip-tile::after { content: ''; position: absolute; top: 50%; left: 0; width: 100%; height: 1px; transform: translateY(-50%); background: #0005; z-index: 5; pointer-events: none; }
.flip-tile.light { background: var(--flip-background, #fff); color: var(--flip-color, #222b38); }
.half { position: absolute; left: 0; width: 100%; height: 50%; overflow: hidden; background: inherit; backface-visibility: hidden; }
.half span { position: absolute; left: 0; width: 100%; height: var(--tile-height); line-height: var(--tile-height); display: block; text-align: center; }
.top { top: 0; border-radius: 6px 6px 0 0; transform-origin: bottom; }
.top span { top: 0; }
.bottom { bottom: 0; border-radius: 0 0 6px 6px; transform-origin: top; }
.bottom span { bottom: 0; }
.outgoing { z-index: 3; animation: fold calc(var(--duration) / 2) linear both; }
.incoming { z-index: 4; animation: unfold calc(var(--duration) / 2) calc(var(--duration) / 2) linear both; }
@keyframes fold { to { transform: rotateX(-90deg); } }
@keyframes unfold { from { transform: rotateX(90deg); } to { transform: rotateX(0); } }
@media (prefers-reduced-motion: reduce) { .respect-reduced-motion .outgoing, .respect-reduced-motion .incoming { animation-duration: 1ms; animation-delay: 0ms; } }
</style>
