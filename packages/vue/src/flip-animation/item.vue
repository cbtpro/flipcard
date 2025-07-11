<template>
  <li class="item" :class="{ active, before }">
    <div class="up">
      <div class="shadow"></div>
      <div class="inn">{{ content }}</div>
    </div>
    <div class="down">
      <div class="shadow"></div>
      <div class="inn">{{ content }}</div>
    </div>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  content: string | number;
  active: boolean;
  before: boolean;
}>();
</script>
