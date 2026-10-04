<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import AlphabetDemo from './components/AlphabetDemo.vue';
import CountdownDemo from './components/CountdownDemo.vue';
import ClockDemo from './components/ClockDemo.vue';
import AirportDemo from './components/AirportDemo.vue';
import InteractiveCardDemo from './components/InteractiveCardDemo.vue';
import PropsPanel from './components/PropsPanel.vue';
import ExampleCode from './components/ExampleCode.vue';
import { createDemoState, type DemoId } from './demo-state';

const scenes = [
  { id: 'alphabet', name: '字母翻牌', number: '01', title: '一个字母。无限表达。', description: '从 A 到 Z，让每一个变化都被看见。', component: AlphabetDemo },
  { id: 'clock', name: '翻页时钟', number: '02', title: '时间，有了触感。', description: '把每一秒，变成一次轻盈的翻动。', component: ClockDemo },
  { id: 'countdown', name: '倒计时', number: '03', title: '让期待，逐秒靠近。', description: '设定时间，开始倒数。', component: CountdownDemo },
  { id: 'airport', name: '机场航班牌', number: '04', title: '下一站，即将揭晓。', description: '熟悉的出发大厅，一整面正在变化的信息。', component: AirportDemo },
  { id: 'card', name: '交互卡片', number: '05', title: '翻过去。发现另一面。', description: '一次悬停，或一次点击。', component: InteractiveCardDemo },
] as const;
const states = reactive(Object.fromEntries(scenes.map(scene => [scene.id, createDemoState(scene.id)])) as Record<DemoId, ReturnType<typeof createDemoState>>);
const selected = ref<DemoId>('alphabet');
const visibleScene = ref<DemoId | null>(null);
const currentScene = computed(() => scenes.find(scene => scene.id === selected.value)!);
const theme = ref<'light' | 'dark'>('dark');
const panelOpen = ref(false);
const pageActive = ref(true);
const scrollPosition = ref(0);
const reducedMotion = ref(false);
const root = ref<HTMLElement | null>(null);
const backdropStyle = computed(() => ({ transform: reducedMotion.value ? 'none' : `translate3d(0, ${-scrollPosition.value * 0.055}px, 0)` }));
const heroStyle = computed(() => ({ transform: reducedMotion.value ? 'none' : `translate3d(0, ${Math.min(scrollPosition.value, 900) * 0.18}px, 0)` }));
let timer: ReturnType<typeof setInterval> | undefined;
let frame = 0;
let navigationTimer: ReturnType<typeof setTimeout> | undefined;
let navigating = false;
let motion: MediaQueryList | undefined;
let seconds = 0;
function advance(id: DemoId) {
  const state = states[id];
  if (!pageActive.value || state.config.paused) return;
  seconds = 0;
  state.tick++;
  state.time = new Date();
  const items = state.itemsText.split(',').map(item => item.trim()).filter(Boolean);
  const current = state.mode === 'index' ? state.config.currentIndex : items.indexOf(state.config.currentValue);
  const step = id === 'alphabet' ? Math.min(5, Math.max(1, items.length - 1)) : 1;
  state.config.currentIndex = (Math.max(0, current) + step) % Math.max(1, items.length);
  state.config.currentValue = items[state.config.currentIndex] ?? '';
}
function previewBehavior() {
  const state = states[selected.value];
  if (!pageActive.value || state.config.paused) return;
  state.auto = false;
  if (selected.value === 'clock') {
    state.time = new Date(state.time.getTime() + 73_000);
  } else {
    advance(selected.value);
  }
}
function pausePage() { pageActive.value = false; clearInterval(timer); }
function syncTimer() {
  clearInterval(timer);
  pageActive.value = !document.hidden && document.hasFocus();
  if (!pageActive.value) return;
  seconds = 0;
  states.clock.time = new Date();
  timer = setInterval(() => {
    const state = states[selected.value];
    if (!state.auto || state.config.paused || (selected.value === 'card' || selected.value === 'countdown') || visibleScene.value !== selected.value) return;
    if (selected.value === 'clock') state.time = new Date();
    const items = state.itemsText.split(',').map(item => item.trim()).filter(Boolean);
    const steps = selected.value === 'alphabet' && state.config.flipMode === 'sequential'
      ? Math.min(5, Math.max(1, items.length - 1)) : 1;
    const startDelay = selected.value === 'alphabet' && state.config.flipOrder === 'sequential'
      ? (state.config.sequenceIndex + 3) * state.config.stagger : 0;
    const interval = Math.max(2000, steps * state.config.duration + startDelay + 500);
    if (++seconds * 1000 >= interval && selected.value !== 'clock') advance(selected.value);
  }, 1000);
}
function reset() {
  const state = states[selected.value];
  Object.assign(state, createDemoState(selected.value), { auto: state.auto, tick: state.tick, time: state.time });
}
function syncScroll() {
  frame = 0;
  scrollPosition.value = window.scrollY;
  let nearest: DemoId | undefined;
  let distance = Infinity;
  for (const section of root.value?.querySelectorAll<HTMLElement>('[data-demo]') ?? []) {
    const rect = section.getBoundingClientRect();
    if (rect.bottom < innerHeight * 0.25 || rect.top > innerHeight * 0.85) continue;
    const delta = Math.abs(rect.top + rect.height / 2 - innerHeight * 0.55);
    if (delta < distance) { distance = delta; nearest = section.dataset.demo as DemoId; }
  }
  visibleScene.value = nearest ?? null;
  if (nearest && !navigating) selected.value = nearest;
}
function onScroll() { if (!frame) frame = requestAnimationFrame(syncScroll); }
function navigate(id: DemoId) {
  selected.value = id;
  navigating = true;
  clearTimeout(navigationTimer);
  root.value?.querySelector(`[data-demo="${id}"]`)?.scrollIntoView({ behavior: reducedMotion.value ? 'instant' : 'smooth', block: 'start' });
  navigationTimer = setTimeout(() => { navigating = false; syncScroll(); }, 1000);
}
function syncMotion() { reducedMotion.value = motion?.matches ?? false; }
onMounted(() => {
  motion = matchMedia('(prefers-reduced-motion: reduce)');
  syncMotion();
  motion.addEventListener('change', syncMotion);
  syncTimer();
  syncScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  document.addEventListener('visibilitychange', syncTimer);
  window.addEventListener('focus', syncTimer);
  window.addEventListener('blur', pausePage);
});
onBeforeUnmount(() => {
  clearInterval(timer);
  clearTimeout(navigationTimer);
  cancelAnimationFrame(frame);
  motion?.removeEventListener('change', syncMotion);
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
  document.removeEventListener('visibilitychange', syncTimer);
  window.removeEventListener('focus', syncTimer);
  window.removeEventListener('blur', pausePage);
});
</script>

<template>
  <main ref="root" class="playground" :class="`flip-card-theme-${theme}`" :data-theme="theme" :data-selected="selected">
    <div class="parallax-backdrop" aria-hidden="true"><div class="ambient-layers" :style="backdropStyle"><div class="orb orb-one"></div><div class="orb orb-two"></div><div class="background-grid"></div></div></div>
    <header class="site-header"><a href="#top" class="wordmark">FLIP<span>CARD</span><small>PLAYGROUND</small></a><nav aria-label="示例"><button v-for="scene in scenes" :key="scene.id" :class="{ selected: selected === scene.id }" :aria-current="selected === scene.id ? 'true' : undefined" @click="navigate(scene.id)">{{ scene.name }}</button></nav><label class="theme-select"><select v-model="theme"><option value="dark">深色</option><option value="light">浅色</option></select></label></header>
    <div class="showcase">
      <section id="top" class="hero"><div class="hero-copy" :style="heroStyle"><span class="eyebrow">A LITTLE MOVEMENT. A LOT OF CHARACTER.</span><h1>信息。<br><span>跃然牌上。</span></h1><p>字母、时间、目的地。<br>用一次翻动，让变化有迹可循。</p><button class="explore-button" @click="navigate('alphabet')">向下探索 <span>↓</span></button><div class="hero-flaps" aria-hidden="true"><span v-for="letter in 'FLIP'" :key="letter">{{ letter }}</span></div></div></section>
      <section v-for="scene in scenes" :key="scene.id" class="scene" :class="{ 'is-active': selected === scene.id }" :data-demo="scene.id" :aria-label="scene.name">
        <div class="scene-heading"><span class="eyebrow">{{ scene.number }} / {{ scene.name }}</span><h2>{{ scene.title }}</h2><p>{{ scene.description }}</p></div>
        <div class="stage"><component :is="scene.component" :state="states[scene.id]" :active="pageActive && visibleScene === scene.id" /></div>
        <footer v-if="scene.id !== 'card' && scene.id !== 'countdown'" class="demo-actions"><span class="status-dot" :class="{ paused: !pageActive || states[scene.id].config.paused || !states[scene.id].auto || selected !== scene.id }"></span><span>{{ !pageActive || selected !== scene.id ? '已暂停' : states[scene.id].config.paused ? '已暂停' : states[scene.id].auto ? '自动演示中' : '手动演示' }}</span><button @click="states[scene.id].auto = !states[scene.id].auto">{{ states[scene.id].auto ? '停止自动演示' : '自动演示' }}</button><button :disabled="states[scene.id].config.paused || !pageActive || selected !== scene.id" @click="advance(scene.id)">下一次翻牌</button></footer>
        <p v-if="scene.id === 'alphabet'" class="scene-note">每次跨过多个字母；逐张翻牌会经过中间字母，依次启动会错开四张牌的起始时间。</p>
        <p v-if="reducedMotion && states[scene.id].config.respectReducedMotion && scene.id !== 'card'" class="scene-note">系统已开启减少动态效果，翻牌动画会缩短。</p>
        <p v-if="scene.id === 'card'" class="scene-note">在右侧单独调整 hover / click 和 flipped。</p>
        <ExampleCode :id="scene.id" :state="states[scene.id]" />
      </section>
      <div class="closing-note">FLIPCARD <span>每一面，都有新的可能。</span><a href="#top">回到顶部 ↑</a></div>
    </div>
    <button class="mobile-props-toggle" :aria-expanded="panelOpen" aria-controls="scene-inspector" @click="panelOpen = !panelOpen">{{ panelOpen ? '收起配置' : `调整${currentScene.name} Props` }}</button>
    <div id="scene-inspector" class="inspector" :class="{ 'is-open': panelOpen }"><PropsPanel :key="selected" :id="selected" :name="currentScene.name" :state="states[selected]" @reset="reset" @preview="previewBehavior" /></div>
  </main>
</template>
