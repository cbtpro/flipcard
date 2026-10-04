import { alphabetProps, animationProps, type DemoId, type DemoState } from './demo-state';

/** 生成与当前独立配置对应、可保存为 Vue 单文件组件的示例。 */
export function exampleCode(id: DemoId, state: DemoState) {
  if (id === 'card') return `<script setup lang="ts">
import { reactive } from 'vue';
import FlipCardVue from '@flipcard/vue';
const options = reactive<{ trigger: 'hover' | 'click'; flipped: boolean }>(${JSON.stringify(state.card, null, 2)});
</script>

<template>
  <FlipCardVue :options="options">
    <div class="card">点击或悬停翻转</div>
  </FlipCardVue>
  <button @click="options.flipped = !options.flipped">切换翻转状态</button>
</template>

<style scoped>
.card { width: 240px; height: 160px; display: grid; place-items: center; background: #e7dcc3; color: #24231f; border-radius: 12px; }
:deep(.flipcard) { transition: transform .6s; }
</style>`;
  const options = JSON.stringify(animationProps(state, true), null, 2);
  const imports = `import { FlipAnimation, type FlipAnimationProps } from '@flipcard/vue';\nimport '@flipcard/vue/dist/style.css';`;
  if (id === 'alphabet') {
    const selected = alphabetProps(state, true);
    const items = selected.items ?? [];
    const start = selected.currentIndex ?? items.indexOf(selected.currentValue ?? '');
    return `<script setup lang="ts">
import { ref } from 'vue';
${imports}
const items = ${JSON.stringify(items)};
const index = ref(${Math.max(0, start)});
const options = ${options} satisfies FlipAnimationProps;
</script>

<template>
  <div class="tiles">
    <FlipAnimation
      v-for="offset in 4" :key="offset"
      v-bind="options" :items="items"
      :current-index="(index + offset - 1) % items.length"
      :sequence-index="options.sequenceIndex + offset - 1"
    />
  </div>
  <button :disabled="!items.length || options.paused" @click="index = (index + 5) % items.length">跨值翻牌</button>
</template>

<style scoped>
.tiles { display: flex; align-items: center; gap: 8px; }
</style>`;
  }
  if (id === 'countdown') return `<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
${imports}
const options = ${options} satisfies FlipAnimationProps;
const total = ${Math.min(359999, Math.max(1, Number(state.countdown.seconds) || 1))};
const remaining = ref(total);
const running = ref(false);
const active = ref(true);
const digits = '9876543210'.split('');
const clock = computed(() => {
  const seconds = Math.ceil(remaining.value);
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(value => String(value).padStart(2, '0')).join(':');
});
let timer: ReturnType<typeof setInterval> | undefined;
let last = 0;
function reset() { running.value = false; remaining.value = total; }
function toggle() { if (!remaining.value) reset(); running.value = !running.value; }
function pause() { active.value = false; }
function resume() { active.value = !document.hidden && document.hasFocus(); last = performance.now(); }
onMounted(() => {
  resume();
  timer = setInterval(() => {
    const now = performance.now();
    if (active.value && running.value && !options.paused) {
      remaining.value = Math.max(0, remaining.value - (now - last) / 1000);
      if (!remaining.value) running.value = false;
    }
    last = now;
  }, 100);
  document.addEventListener('visibilitychange', resume);
  window.addEventListener('focus', resume);
  window.addEventListener('blur', pause);
});
onBeforeUnmount(() => {
  clearInterval(timer);
  document.removeEventListener('visibilitychange', resume);
  window.removeEventListener('focus', resume);
  window.removeEventListener('blur', pause);
});
</script>
<template>
  <div class="tiles">
    <template v-for="(digit, index) in clock" :key="index">
      <span v-if="digit === ':'">:</span>
      <FlipAnimation v-else v-bind="options" :paused="options.paused || !active" :items="digits" :current-value="digit" :sequence-index="options.sequenceIndex + index" />
    </template>
  </div>
  <p role="status">{{ remaining === 0 ? '倒计时结束' : '' }}</p>
  <button :disabled="options.paused || !active" @click="toggle">{{ running ? '暂停' : '开始' }}</button>
  <button @click="reset">重置</button>
</template>
<style scoped>
.tiles { display: flex; gap: 8px; align-items: center; }
</style>`;
  if (id === 'clock') return `<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
${imports}
const options = ${options} satisfies FlipAnimationProps;
const time = ref(new Date());
const hourFormat = ref<'24' | '12'>('${state.hourFormat}');
const clock = computed(() => {
  const hours = hourFormat.value === '12' ? time.value.getHours() % 12 || 12 : time.value.getHours();
  return [hours, time.value.getMinutes(), time.value.getSeconds()].map(value => String(value).padStart(2, '0')).join(':');
});
const period = computed(() => time.value.getHours() < 12 ? 'AM' : 'PM');
const digits = '0123456789'.split('');
let timer: ReturnType<typeof setInterval> | undefined;
function pause() { clearInterval(timer); }
function resume() {
  pause();
  if (document.hidden || !document.hasFocus()) return;
  time.value = new Date();
  timer = setInterval(() => { if (!options.paused) time.value = new Date(); }, 1000);
}
onMounted(() => {
  resume();
  document.addEventListener('visibilitychange', resume);
  window.addEventListener('focus', resume);
  window.addEventListener('blur', pause);
});
onBeforeUnmount(() => {
  pause();
  document.removeEventListener('visibilitychange', resume);
  window.removeEventListener('focus', resume);
  window.removeEventListener('blur', pause);
});
</script>

<template>
  <div class="tiles">
    <template v-for="(digit, index) in clock" :key="index">
      <span v-if="digit === ':'">:</span>
      <FlipAnimation v-else v-bind="options" :items="digits" :current-value="digit" :sequence-index="options.sequenceIndex + index" />
    </template>
    <div v-if="hourFormat === '12'" class="tiles">
      <FlipAnimation v-for="(letter, index) in period" :key="index" v-bind="options"
        :items="index === 0 ? ['A', 'P'] : ['M']" :current-value="letter"
        :sequence-index="options.sequenceIndex + clock.length + index" />
    </div>
  </div>
  <select v-model="hourFormat" aria-label="时间制"><option value="24">24H</option><option value="12">12H</option></select>
</template>

<style scoped>
.tiles { display: flex; gap: 8px; align-items: center; }
</style>`;
  return `<script setup lang="ts">
import { ref } from 'vue';
${imports}
const options = ${options} satisfies FlipAnimationProps;
const characters = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:'.split('');
const colors = ${JSON.stringify(state.boardColors, null, 2)};
const statusColors: Record<string, string> = ${JSON.stringify(state.statusColors, null, 2)};
const rows = ref([
  { time: '09:30', flight: 'CA1831', destination: 'SHANGHAI', gate: 'A12', status: 'BOARDING' },
  { time: '10:15', flight: 'MU5102', destination: 'BEIJING', gate: 'B08', status: 'ON TIME' },
  { time: '11:05', flight: 'CZ3521', destination: 'GUANGZHOU', gate: 'C21', status: 'WAITING' },
]);
function update() {
  rows.value[0].status = rows.value[0].status === 'BOARDING' ? 'WAITING' : 'BOARDING';
}
</script>

<template>
  <table :style="{ '--flip-background': colors.background, '--flip-color': colors.text }">
    <thead><tr><th>TIME</th><th>FLIGHT</th><th>DESTINATION</th><th>GATE</th><th>REMARK</th></tr></thead>
    <tbody>
      <tr v-for="(row, rowIndex) in rows" :key="row.flight">
        <td v-for="(text, key, column) in row" :key="key">
          <div class="tiles" :style="key === 'status' ? { '--flip-color': statusColors[row.status] } : undefined">
            <FlipAnimation
              v-for="(char, index) in text.padEnd(key === 'destination' ? 9 : key === 'status' ? 8 : text.length, ' ')"
              :key="index" v-bind="options" :items="characters" :current-value="char"
              :sequence-index="options.sequenceIndex + rowIndex * 31 + [0, 5, 11, 20, 23][column] + index"
            />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <button :disabled="options.paused" @click="update">更新航班状态</button>
</template>

<style scoped>
.tiles { display: flex; gap: 2px; }
table { background: #0c0e10; color: #e8e7df; border-collapse: collapse; }
th { text-align: left; font: 12px system-ui; padding: 8px; }
td { padding: 6px; }
</style>`;
}
