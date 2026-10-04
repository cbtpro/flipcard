<script setup lang="ts">
import { computed } from 'vue';
import { FlipAnimation } from '@flipcard/vue';
import { animationProps, type DemoState } from '../demo-state';
const props = defineProps<{ state: DemoState; active: boolean }>();
const clock = computed(() => {
  const time = props.state.time;
  const hours = props.state.hourFormat === '12' ? time.getHours() % 12 || 12 : time.getHours();
  return [hours, time.getMinutes(), time.getSeconds()].map(value => String(value).padStart(2, '0')).join(':');
});
const period = computed(() => props.state.time.getHours() < 12 ? 'AM' : 'PM');
const digits = '0123456789'.split('');
</script>
<template><div class="tiles clock-display"><template v-for="(digit, index) in clock" :key="index"><span v-if="digit === ':'" class="colon">:</span><FlipAnimation v-else v-bind="animationProps(state, active)" :items="digits" :current-value="digit" :sequence-index="state.config.sequenceIndex + index" /></template><div v-if="state.hourFormat === '12'" class="clock-period tiles"><FlipAnimation v-for="(letter, index) in period" :key="index" v-bind="animationProps(state, active)" :items="index === 0 ? ['A', 'P'] : ['M']" :current-value="letter" :sequence-index="state.config.sequenceIndex + clock.length + index" /></div></div></template>
