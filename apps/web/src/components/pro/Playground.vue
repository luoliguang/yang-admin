<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { DocumentCopy, MagicStick } from '@element-plus/icons-vue';
import { buildAiPrompt } from '@/utils/aiPrompt';

export interface PlaygroundControl {
  key: string;
  label: string;
  type: 'switch' | 'select' | 'text' | 'number' | 'color' | 'slider' | 'segmented';
  options?: { label: string; value: string | number }[];
  min?: number;
  max?: number;
  step?: number;
}

const props = defineProps<{
  title: string;
  desc?: string;
  controls: PlaygroundControl[];
  /** 父组件持有的响应式属性对象，控件直接改它 */
  state: Record<string, any>;
  /** 依据当前属性生成代码 */
  code?: (state: Record<string, any>) => string;
}>();

async function writeClipboard(text: string, tip: string) {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success(tip);
  } catch {
    ElMessage.error('复制失败');
  }
}

function copy() {
  if (props.code) writeClipboard(props.code(props.state), '已复制代码');
}

function copyForAi() {
  if (!props.code) return;
  writeClipboard(
    buildAiPrompt({ title: props.title, code: props.code(props.state), desc: props.desc }),
    '已复制 AI 指令，粘给 AI 即可',
  );
}
</script>

<template>
  <div class="pg">
    <div class="pg__head">
      <div>
        <div class="pg__title">{{ title }}</div>
        <div v-if="desc" class="pg__desc">{{ desc }}</div>
      </div>
    </div>

    <div class="pg__body">
      <!-- 实时预览 -->
      <div class="pg__preview">
        <slot :state="state" />
      </div>

      <!-- 属性控制面板 -->
      <div class="pg__panel">
        <div class="pg__panel-title">属性调试</div>
        <div v-for="c in controls" :key="c.key" class="pg__row">
          <label class="pg__label">{{ c.label }}</label>
          <div class="pg__control">
            <el-switch v-if="c.type === 'switch'" v-model="state[c.key]" />
            <el-select v-else-if="c.type === 'select'" v-model="state[c.key]" size="small">
              <el-option v-for="o in c.options" :key="String(o.value)" :label="o.label" :value="o.value" />
            </el-select>
            <el-radio-group v-else-if="c.type === 'segmented'" v-model="state[c.key]" size="small">
              <el-radio-button v-for="o in c.options" :key="String(o.value)" :value="o.value">{{ o.label }}</el-radio-button>
            </el-radio-group>
            <el-color-picker v-else-if="c.type === 'color'" v-model="state[c.key]" />
            <el-input-number v-else-if="c.type === 'number'" v-model="state[c.key]" size="small" :min="c.min" :max="c.max" :step="c.step" controls-position="right" />
            <el-slider v-else-if="c.type === 'slider'" v-model="state[c.key]" :min="c.min ?? 0" :max="c.max ?? 100" :step="c.step ?? 1" />
            <el-input v-else v-model="state[c.key]" size="small" />
          </div>
        </div>
      </div>
    </div>

    <!-- 生成的代码 -->
    <div v-if="code" class="pg__code-wrap">
      <div class="pg__code-head">
        <span>实时生成的代码</span>
        <span>
          <el-button text :icon="DocumentCopy" size="small" @click="copy">复制</el-button>
          <el-button text type="primary" :icon="MagicStick" size="small" @click="copyForAi">复制为 AI 指令</el-button>
        </span>
      </div>
      <pre class="pg__code"><code>{{ code(state) }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.pg {
  border: 1px solid var(--ya-border-color-light);
  border-radius: var(--ya-radius-lg);
  background: var(--ya-bg-container);
  margin-bottom: var(--ya-spacing-xl);
  overflow: hidden;
}
.pg__head {
  padding: var(--ya-spacing-lg) var(--ya-spacing-xl);
  border-bottom: 1px solid var(--ya-border-color-light);
}
.pg__title {
  font-size: var(--ya-font-md);
  font-weight: 600;
  color: var(--ya-text-primary);
}
.pg__desc {
  margin-top: 4px;
  font-size: var(--ya-font-sm);
  color: var(--ya-text-secondary);
}
.pg__body {
  display: grid;
  grid-template-columns: 1fr 300px;
}
.pg__preview {
  padding: var(--ya-spacing-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  border-right: 1px solid var(--ya-border-color-light);
  background: var(--ya-bg-page);
}
.pg__panel {
  padding: var(--ya-spacing-lg) var(--ya-spacing-xl);
}
.pg__panel-title {
  font-size: var(--ya-font-sm);
  color: var(--ya-text-secondary);
  margin-bottom: var(--ya-spacing-lg);
}
.pg__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ya-spacing-md);
  margin-bottom: var(--ya-spacing-md);
  min-height: 32px;
}
.pg__label {
  font-size: var(--ya-font-sm);
  color: var(--ya-text-regular);
  flex-shrink: 0;
}
.pg__control {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}
.pg__control :deep(.el-slider) {
  margin-right: 8px;
}
.pg__code-wrap {
  border-top: 1px dashed var(--ya-border-color);
}
.pg__code-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px var(--ya-spacing-xl);
  font-size: var(--ya-font-sm);
  color: var(--ya-text-secondary);
  background: var(--ya-bg-page);
}
.pg__code {
  margin: 0;
  padding: var(--ya-spacing-lg) var(--ya-spacing-xl);
  background: var(--ya-bg-page);
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: var(--ya-font-sm);
  line-height: 1.6;
  color: var(--ya-text-regular);
  overflow-x: auto;
  white-space: pre;
}

@media (max-width: 900px) {
  .pg__body {
    grid-template-columns: 1fr;
  }
  .pg__preview {
    border-right: none;
    border-bottom: 1px solid var(--ya-border-color-light);
  }
}
</style>
