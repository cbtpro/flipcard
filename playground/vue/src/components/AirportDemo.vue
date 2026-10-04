<script setup lang="ts">
import { computed } from 'vue';
import { FlipAnimation } from '@flipcard/vue';
import { animationProps, flightStatuses, type DemoState } from '../demo-state';
const props = defineProps<{ state: DemoState; active: boolean }>();
const characters = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:'.split('');
const flights = [
  { time: '09:30', flight: 'CA1831', destination: 'SHANGHAI', gate: 'A12', status: 'BOARDING' },
  { time: '10:15', flight: 'MU5102', destination: 'BEIJING', gate: 'B08', status: 'ON TIME' },
  { time: '11:05', flight: 'CZ3521', destination: 'GUANGZHOU', gate: 'C21', status: 'WAITING' },
];
const rows = computed(() => flights.map((flight, index) => ({ ...flight,
  gate: props.state.tick % 3 === 1 && index === 1 ? 'B12' : flight.gate,
  status: flightStatuses[(index + props.state.tick) % flightStatuses.length].value,
})));
</script>
<template><div class="airport-display" :style="{ '--flip-background': state.boardColors.background, '--flip-color': state.boardColors.text }"><div class="board-title"><span>↗ DEPARTURES</span><small>出发航班 · 演示数据</small></div><div class="board-scroll" tabindex="0" aria-label="航班信息"><table><thead><tr><th>TIME</th><th>FLIGHT</th><th>DESTINATION</th><th>GATE</th><th>REMARK</th></tr></thead><tbody><tr v-for="(row, rowIndex) in rows" :key="row.flight"><td v-for="(text, key, columnIndex) in row" :key="key"><div class="board-cell" :style="key === 'status' ? { '--flip-color': state.statusColors[row.status] } : undefined"><FlipAnimation v-for="(char, index) in String(text).padEnd(key === 'destination' ? 9 : key === 'status' ? 8 : String(text).length, ' ')" :key="index" v-bind="animationProps(state, active)" :items="characters" :current-value="char" :sequence-index="state.config.sequenceIndex + rowIndex * 31 + [0, 5, 11, 20, 23][columnIndex] + index" /></div></td></tr></tbody></table></div></div></template>
