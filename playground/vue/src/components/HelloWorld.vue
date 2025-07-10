<script setup lang="ts">
import { onMounted, ref } from 'vue';
import FlipCardVue, { SwitchVue } from '@flipcard/vue';
import { prefixName } from '@flipcard/theme';

defineProps<{ msg: string; }>();

const bool = ref<boolean>(true);
const count = ref(0);

const defaultTheme = `${prefixName}-theme-light`;
const darkThemeName = `${prefixName}-theme-dark`;
const lightThemeName = `${prefixName}-theme-light`;
const onClick = () => {
  const app = document.querySelector('#app');
  app?.classList.toggle(lightThemeName);
  app?.classList.toggle(darkThemeName);
};
onMounted(() => {
  // 默认加上 light 主题类
  const app = document.querySelector('#app');
  if (app && !app.classList.contains(lightThemeName) && !app.classList.contains(darkThemeName)) {
    app.classList.add(defaultTheme);
  }
});
</script>

<template>
  <h1>{{ msg }}</h1>
  <button @click="onClick">点击换主题色</button>
  <FlipCardVue>
    React Card
  </FlipCardVue>
  <SwitchVue v-model="bool" />
  <p>Switch is {{ bool ? 'on' : 'off' }}</p>
  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank">Vue Docs Scaling up Guide</a>.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
/* @import '@flipcard/theme/assets/style/variables.less'; */

.read-the-docs {
  color: #888;
}
</style>
