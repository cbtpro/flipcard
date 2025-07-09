<template>
  <div ref="flipcardRef" class="flipcard">
    <slot name="default"></slot>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, toRefs } from 'vue';
import { FlipCard, FlipCardOptions } from '@flipcard/core';

interface IProps {
  options?: FlipCardOptions;
}

const props = withDefaults(defineProps<IProps>(), {
  options: () => {
    return {
      trigger: 'hover',
      flipped: false
    };
  },
});

const { options } = toRefs(props);
const flipcardRef = ref<HTMLDivElement | null>(null);
const flip = ref<FlipCard | null>(null);
onMounted(() => {
  if (!flipcardRef.value) {
    return;
  }
  flip.value = new FlipCard(flipcardRef.value, options.value);
});

onBeforeUnmount(() => {
  if (flip.value) {
    flip.value.destroy();
  }
})

</script>
