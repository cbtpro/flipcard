<script setup lang="ts">
import { computed } from 'vue';
import { FlipAnimation } from '@flipcard/vue';
import { alphabetProps, type DemoState } from '../demo-state';
const props = defineProps<{ state: DemoState; active: boolean }>();
const tiles = computed(() => {
  const base = alphabetProps(props.state, props.active);
  const items = base.items ?? [];
  const start = base.currentIndex ?? items.indexOf(base.currentValue ?? '');
  return Array.from({ length: 4 }, (_, index) => ({
    ...base,
    currentIndex: index === 0 ? base.currentIndex : undefined,
    currentValue: index === 0 ? base.currentValue : start >= 0 && start < items.length ? items[(start + index) % items.length] : '',
    sequenceIndex: props.state.config.sequenceIndex + index,
  }));
});
</script>
<template><div class="alphabet-display tiles"><FlipAnimation v-for="(options, index) in tiles" :key="index" v-bind="options" /></div></template>
