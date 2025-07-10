<template>
  <div>
    <span :class="{
      [`${prefixName}-switch`]: true,
      [`${prefixName}-switch-on`]: state.me_checked
    }" :value="modelValue" @click="toggle"></span>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { prefixName } from '@flipcard/theme';
import './style/index.less';

export interface Props {
  modelValue: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: true
});

const state = reactive({ me_checked: props.modelValue });

const emit = defineEmits(['update:modelValue']);
watch(
  () => state.me_checked,
  (value, oldValue) => {
    if (value !== oldValue) {
      emit('update:modelValue', value);
    }
  }
);

const toggle = () => {
  state.me_checked = !state.me_checked;
};
</script>

<style scoped>
.switch {
  display: block;
  position: relative;
  width: 52px;
  height: 32px;
  border: 1px solid #DFDFDF;
  outline: 0;
  border-radius: 16px;
  box-sizing: border-box;
  background-color: #DFDFDF;
  transition: background-color 0.1s, border 0.1s;
  cursor: pointer;
}

.switch:before {
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 30px;
  border-radius: 15px;
  background-color: #FDFDFD;
  transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
}

.weui-switch:after {
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #FFFFFF;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
}

.weui-switch-on {
  border-color: #1AAD19;
  background-color: #1AAD19;
}

.weui-switch-on:before {
  border-color: #1AAD19;
  background-color: #1AAD19;
}

.weui-switch-on:after {
  transform: translateX(20px);
}
</style>
