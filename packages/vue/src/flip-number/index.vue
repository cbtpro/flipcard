<template>
  <ul class="flip" :class="type">
    <FlipNumberItem v-for="(num, index) in numbers" :key="index" :number="num" :is-active="index === activeIndex"
      :is-before="index === beforeIndex" />
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FlipNumberItem from './item.vue';

const props = defineProps<{
  numbers: number[];
  activeIndex: number;
  beforeIndex: number;
  type: 'minutePlay' | 'secondPlay';
}>();
</script>
<style scoped>
ul.flip {
  position: relative;
  width: 80px;
  height: 120px;
  perspective: 300px;
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
