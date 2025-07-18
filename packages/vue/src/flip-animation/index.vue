<template>
  <div :class="{ play: isPlay }">
    <ul class="flip">
      <FlipItem v-for="(item, index) in items" :key="item" :content="item" :active="index === current"
        :before="index === before" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps } from 'vue';
import FlipItem from './item.vue';

const props = withDefaults(defineProps<{
  items?: (string | number)[];
  currentIndex?: number;
  currentValue?: string | number;
}>(), {
  items: () => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  currentIndex: undefined,
  currentValue: undefined
});

const current = computed(() => {
  if (props.currentIndex !== undefined) return props.currentIndex;
  if (props.currentValue !== undefined) return props.items.indexOf(props.currentValue);
  return -1;
});

const before = ref(current.value === -1 ? -1 : props.items.length - 1);
const isPlay = ref(false);

watch(current, (_newVal, oldVal) => {
  before.value = oldVal ?? -1;
  isPlay.value = true;
});
</script>
<style lang="less" scoped>
@width: 60px;
@height: 90px;
@fontSize: 80px;
@lineWidth: 3px;
@radius: 6px;

.flip {
  position: relative;
  margin: 5px;
  width: @width;
  height: @height;
  font-size: @fontSize;
  font-weight: bold;
  line-height: @height - @lineWidth;
  border-radius: @radius;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.7);

  :deep(.item) {
    list-style: none;
    z-index: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    perspective: 200px;
    transition: opacity 0.3s;

    &.active {
      z-index: 2;
    }

    &:first-child {
      z-index: 2;
    }

    .up,
    .down {
      z-index: 1;
      position: absolute;
      left: 0;
      width: 100%;
      height: 50%;
      overflow: hidden;
    }

    .up {
      transform-origin: 50% 100%;
      top: 0;

      &:after {
        content: '';
        position: absolute;
        top: calc((@height - @lineWidth) / 2);
        left: 0;
        z-index: 5;
        width: 100%;
        height: @lineWidth;
        background-color: rgba(0, 0, 0, 0.4);
      }
    }

    .down {
      transform-origin: 50% 0%;
      bottom: 0;
      transition: opacity 0.3s;
    }

    .inn {
      position: absolute;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 200%;
      color: #ccc;
      text-shadow: 0 1px 2px #000;
      text-align: center;
      background-color: #333;
      border-radius: @radius;
    }

    .up .inn {
      top: 0;
    }

    .down .inn {
      bottom: 0;
    }
  }
}

.play {
  :deep(.item) {
    &.before {
      z-index: 3;
    }

    &.active {
      animation: asd 0.5s 0.5s linear both;
      z-index: 2;
    }

    &.before .up {
      z-index: 2;
      animation: turn-up 0.5s linear both;
    }

    &.active .down {
      z-index: 2;
      animation: turn-down 0.5s 0.5s linear both;
    }
  }

  .shadow {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
  }

  .before .up .shadow {
    background: linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 1) 100%);
    animation: show 0.5s linear both;
  }

  .active .up .shadow {
    background: linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 1) 100%);
    animation: hide 0.5s 0.3s linear both;
  }

  .before .down .shadow {
    background: linear-gradient(rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.1) 100%);
    animation: show 0.5s linear both;
  }

  .active .down .shadow {
    background: linear-gradient(rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.1) 100%);
    animation: hide 0.5s 0.3s linear both;
  }
}

@keyframes turn-down {
  0% {
    transform: rotateX(90deg);
  }

  100% {
    transform: rotateX(0deg);
  }
}

@keyframes turn-up {
  0% {
    transform: rotateX(0deg);
  }

  100% {
    transform: rotateX(-90deg);
  }
}

@keyframes asd {
  0% {
    z-index: 2;
  }

  5% {
    z-index: 4;
  }

  100% {
    z-index: 4;
  }
}

@keyframes show {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes hide {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
