<template>
  <div class="clock-container">
    <!-- 传字符串数组 + 值控制 -->
    <FlipAnimation :items="words" :currentValue="currentWord" />

    <!-- 传数字数组 + 索引控制 -->
    <FlipAnimation :items="nums" :currentIndex="2" />

    <!-- 默认数字0-9数组 + 索引 -->
    <FlipAnimation :currentIndex="5" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { FlipAnimation } from '@flipcard/vue';
import { getTimeArr } from '@flipcard/utils';

const words = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const timeArr = ref(getTimeArr());
const currentWord = ref('W');

let timer: ReturnType<typeof setTimeout>;

function startTimer() {
  stopTimer();
  timer = setTimeout(() => {
    timeArr.value = getTimeArr();
    currentWord.value = words[Math.floor(Math.random() * words.length)];
    startTimer();
  }, 1000);
}

function stopTimer() {
  clearTimeout(timer);
}

onMounted(() => {
  startTimer();
});

onBeforeUnmount(() => {
  stopTimer();
});
</script>

<style lang='less' scoped>
.clock-container {
  display: flex;
  align-items: center;
  justify-content: center;
  font: 12px "Helvetica Neue", Helvetica, sans-serif;
  background: radial-gradient(rgb(150, 150, 150) 0px, rgb(89, 89, 89) 100%);
  width: 800px;
  height: 300px;
  user-select: none;
}

.colon {
  height: 50px;
  padding: 0 10px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;

  &::after,
  &::before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 50%;
  }
}
</style>
