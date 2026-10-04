<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';
import { FlipAnimation } from '@flipcard/vue';
import { animationProps, type DemoState } from '../demo-state';
const props = defineProps<{ state: DemoState; active: boolean }>();
const digits = '9876543210'.split('');
const clock = computed(() => {
  const seconds = Math.ceil(props.state.countdown.remaining);
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(value => String(value).padStart(2, '0')).join(':');
});
let timer: ReturnType<typeof setInterval> | undefined;
let last = 0;
function reset() {
  props.state.countdown.running = false;
  props.state.countdown.remaining = Math.min(359999, Math.max(1, Number(props.state.countdown.seconds) || 1));
}
watch(() => props.state.countdown.seconds, reset);
watch(() => props.active && !props.state.config.paused && props.state.countdown.running, running => {
  clearInterval(timer);
  if (!running) return;
  last = performance.now();
  timer = setInterval(() => {
    const now = performance.now();
    props.state.countdown.remaining = Math.max(0, props.state.countdown.remaining - (now - last) / 1000);
    last = now;
    if (props.state.countdown.remaining === 0) props.state.countdown.running = false;
  }, 100);
}, { immediate: true });
onBeforeUnmount(() => clearInterval(timer));
function toggle() {
  if (props.state.countdown.remaining === 0) reset();
  props.state.countdown.running = !props.state.countdown.running;
}
</script>
<template>
  <div class="countdown-demo">
    <div class="tiles clock-display" :aria-label="`剩余时间 ${clock}`"><template v-for="(digit, index) in clock" :key="index"><span v-if="digit === ':'" class="colon">:</span><FlipAnimation v-else v-bind="animationProps(state, active)" :items="digits" :current-value="digit" :sequence-index="state.config.sequenceIndex + index" /></template></div>
    <div class="demo-actions"><span role="status">{{ state.countdown.remaining === 0 ? '倒计时结束' : state.countdown.running && active && !state.config.paused ? '倒计时中' : '已暂停' }}</span><button :disabled="!active || state.config.paused" @click="toggle">{{ state.countdown.running ? '暂停倒计时' : state.countdown.remaining === 0 ? '重新开始' : '开始倒计时' }}</button><button @click="reset">重置倒计时</button></div>
  </div>
</template>
