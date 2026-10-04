<script setup lang="ts">
import { computed } from 'vue';
import { flightStatuses, alphabetProps, animationProps, type DemoId, type DemoState } from '../demo-state';
const props = defineProps<{ id: DemoId; name: string; state: DemoState }>();
defineEmits<{ reset: []; preview: [] }>();
const fields = [
  { group: 'animation', key: 'sequenceIndex', label: '启动顺序（从 0 开始）', min: 0, max: 100, step: 1 },
  { group: 'animation', key: 'stagger', label: '依次启动间隔（ms）', min: 0, max: 2000, step: 10 },
  { group: 'animation', key: 'duration', label: '动画时长（ms）', min: 0, max: 5000, step: 50 },
  { group: 'appearance', key: 'width', label: '宽度（px）', min: 20, max: 240, step: 1 },
  { group: 'appearance', key: 'height', label: '高度（px）', min: 30, max: 300, step: 1 },
  { group: 'appearance', key: 'fontSize', label: '字号（px）', min: 10, max: 180, step: 1 },
  { group: 'sound', key: 'volume', label: '声音音量', min: 0, max: 1, step: 0.05 },
] as const;
const items = computed(() => props.state.itemsText.split(',').map(item => item.trim()).filter(Boolean));
const code = computed(() => JSON.stringify(props.id === 'card' ? props.state.card : props.id === 'alphabet' ? alphabetProps(props.state, true) : props.id === 'airport' ? { ...animationProps(props.state, true), boardColors: props.state.boardColors, statusColors: props.state.statusColors } : animationProps(props.state, true), null, 2));
</script>
<template>
      <aside aria-label="组件配置">
        <div class="panel-title"><div><span class="eyebrow">{{ name }}</span><h2>组件 Props</h2></div><button @click="$emit('reset')">重置</button></div>
        <div class="props-scroll" tabindex="0" role="region" aria-label="Props 控制面板">
          <p class="hint panel-intro">仅调整 {{ name }}，配置独立保存</p>
          <fieldset v-if="id === 'clock'" class="props-group"><legend>时钟格式</legend><label>hourFormat · 时间制<select v-model="state.hourFormat" aria-label="时间制"><option value="24">24H</option><option value="12">12H</option></select></label></fieldset>
          <fieldset v-if="id === 'countdown'" class="props-group"><legend>倒计时设置</legend><label>倒计时秒数<input v-model.number="state.countdown.seconds" type="number" min="1" max="359999" step="1" aria-label="倒计时秒数"></label><p class="hint">修改时长会重置倒计时；离开页面或当前示例时暂停，返回后恢复。</p></fieldset>
          <fieldset v-if="id === 'alphabet'" class="props-group"><legend>内容与目标</legend>
            <label>items（逗号分隔）<textarea v-model="state.itemsText" rows="2"></textarea></label>
            <div class="control-grid">
              <label>控制方式<select v-model="state.mode"><option value="index">索引</option><option value="value">值</option></select></label>
              <label v-if="state.mode === 'index'">currentIndex<input v-model.number="state.config.currentIndex" type="number" min="0" :max="Math.max(0, items.length - 1)"></label>
              <label v-else>currentValue<select v-model="state.config.currentValue" aria-label="currentValue"><option v-for="(item, index) in items" :key="index" :value="item">{{ item }}</option></select></label>
            </div>
          </fieldset>
          <fieldset v-if="id !== 'card'" class="props-group"><legend>翻牌行为</legend>
            <div class="control-grid">
              <label>flipMode<select v-model="state.config.flipMode" aria-label="flipMode"><option value="direct">直接到目标</option><option value="sequential">逐张翻牌</option></select></label>
              <label>flipOrder<select v-model="state.config.flipOrder" aria-label="flipOrder"><option value="simultaneous">统一启动</option><option value="sequential">依次启动</option></select></label>
              <label v-for="field in fields.filter(field => field.group === 'animation')" :key="field.key" :title="field.label">{{ field.key }}<input v-model.number="state.config[field.key]" :aria-label="`${field.key} · ${field.label}`" type="number" :min="field.min" :max="field.max" :step="field.step"></label>
            </div>
            <label class="check"><input v-model="state.config.paused" type="checkbox"> paused · 暂停翻牌</label>
            <label class="check"><input v-model="state.config.respectReducedMotion" type="checkbox"> respectReducedMotion · 跟随系统减少动态效果</label>
            <p class="hint">演示默认完整播放动画；勾选后遵循系统设置。</p>
            <p class="hint">逐张翻牌沿 items 顺序前进；依次启动按每块牌的位置错开。</p>
            <button v-if="id !== 'countdown'" class="preview-behavior" :disabled="state.config.paused" @click="$emit('preview')">演示当前翻牌行为</button>
            <p class="hint">跨多个值演示，自动播放会暂停。duration 是每步毫秒数。</p>
          </fieldset>
          <fieldset v-if="id !== 'card'" class="props-group"><legend>尺寸与主题</legend>
            <div class="control-grid">
              <label v-for="field in fields.filter(field => field.group === 'appearance')" :key="field.key" :title="field.label">{{ field.key }}<input v-model.number="state.config[field.key]" :aria-label="`${field.key} · ${field.label}`" type="number" :min="field.min" :max="field.max" :step="field.step"></label>
              <label>theme · 翻牌主题<select v-model="state.config.theme"><option value="dark">深色</option><option value="light">浅色</option></select></label>
            </div>
            <p class="hint">宽度、高度与字号的单位为 px。</p>
          </fieldset>
          <fieldset v-if="id === 'airport'" class="props-group"><legend>航班牌颜色</legend>
            <div class="control-grid">
              <label>牌面背景<input v-model="state.boardColors.background" type="color" aria-label="航班牌背景颜色"></label>
              <label>普通文字<input v-model="state.boardColors.text" type="color" aria-label="航班牌文字颜色"></label>
              <label v-for="status in flightStatuses" :key="status.value">{{ status.label }} · {{ status.value }}<input v-model="state.statusColors[status.value]" type="color" :aria-label="`${status.label}颜色`"></label>
            </div>
            <p class="hint">深色牌面，浅色字符；登机绿色、准点米白、等待琥珀色。颜色作用于文字。</p>
          </fieldset>
          <fieldset v-if="id !== 'card'" class="props-group"><legend>翻牌声音</legend>
            <div class="control-grid sound-controls">
              <label class="check"><input v-model="state.config.sound" type="checkbox"> sound · 翻牌声音</label>
              <label v-for="field in fields.filter(field => field.group === 'sound')" :key="field.key">{{ field.key }}<input v-model.number="state.config[field.key]" :aria-label="`${field.key} · ${field.label}`" type="number" :min="field.min" :max="field.max" :step="field.step"></label>
            </div>
            <p class="hint">纸片摩擦与落片声，点击或键盘操作后启用。</p>
          </fieldset>
          <fieldset v-if="id === 'card'" class="props-group"><legend>交互卡片 · options</legend>
            <div class="control-grid">
              <label>trigger<select v-model="state.card.trigger" aria-label="trigger"><option value="hover">hover · 悬停</option><option value="click">click · 点击</option></select></label>
              <label class="check"><input v-model="state.card.flipped" type="checkbox"> flipped · 翻转状态</label>
            </div>
          </fieldset>
          <details class="props-code"><summary>当前配置</summary><pre>{{ code }}</pre></details>
        </div>
      </aside>
</template>
