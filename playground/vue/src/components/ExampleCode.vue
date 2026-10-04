<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { exampleCode } from '../example-code';
import type { DemoId, DemoState } from '../demo-state';
const props = defineProps<{ id: DemoId; state: DemoState }>();
const code = computed(() => exampleCode(props.id, props.state));
const message = ref('');
watch(code, () => { message.value = ''; });
async function copy() {
  try {
    await navigator.clipboard.writeText(code.value);
    message.value = '已复制';
  } catch {
    message.value = '复制未成功，请手动选择代码';
  }
}
</script>
<template><details class="example-code"><summary>组件使用示例 <span>Vue · 与当前配置同步</span></summary><div class="code-toolbar"><span role="status">{{ message }}</span><button @click="copy">复制代码</button></div><pre><code>{{ code }}</code></pre></details></template>
