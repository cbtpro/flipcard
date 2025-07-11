<template>
  <div class="clock-container">
    <flip-item :total="2" :current="timeArr[0]" />
    <flip-item :total="9" :current="timeArr[1]" />
    <div class="colon"></div>
    <flip-item :total="5" :current="timeArr[2]" />
    <flip-item :total="9" :current="timeArr[3]" />
    <div class="colon"></div>
    <flip-item :total="5" :current="timeArr[4]" />
    <flip-item :total="9" :current="timeArr[5]" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FlipNumberItem as FlipItem } from '@flipcard/vue';
import { getTimeArr } from '@flipcard/utils';
import { onBeforeUnmount, onMounted } from 'vue';

const timeArr = ref(getTimeArr());

const timer = ref<ReturnType<typeof setTimeout>>();
const startTimer = () => {
  stopTimer();
  timer.value = setTimeout(() => {
    timeArr.value = getTimeArr();
    startTimer();
  }, 1000);
};

const stopTimer = () => {
  clearTimeout(timer.value);
};
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
