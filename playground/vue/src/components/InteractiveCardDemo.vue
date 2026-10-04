<script setup lang="ts">
import FlipCardVue from '@flipcard/vue';
import type { DemoState } from '../demo-state';
defineProps<{ state: DemoState; active: boolean }>();
</script>
<template><div class="card-display"><FlipCardVue :options="state.card"><div class="interactive-card"><span class="card-mark">F / C</span><strong>另一面。<br>另一种可能。</strong><span>{{ state.card.trigger === 'hover' ? '移入翻转，移出恢复' : '点击卡片翻转' }}</span></div></FlipCardVue></div></template>
