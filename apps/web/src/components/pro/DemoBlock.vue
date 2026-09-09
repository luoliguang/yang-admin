<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { DocumentCopy, ArrowDown, ArrowUp, MagicStick } from '@element-plus/icons-vue';
import { buildAiPrompt } from '@/utils/aiPrompt';

const props = defineProps<{
  title: string;
  desc?: string;
  code?: string;
}>();

const showCode = ref(false);

async function writeClipboard(text: string, tip: string) {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success(tip);
  } catch {
    ElMessage.error('复制失败');
  }
}

function copy() {
  if (props.code) writeClipboard(props.code, '已复制代码');
}

function copyForAi() {
  if (!props.code) return;
  writeClipboard(buildAiPrompt({ title: props.title, code: props.code, desc: props.desc }), '已复制 AI 指令，粘给 AI 即可');
}
</script>

<template>
  <div class="demo-block">
    <div class="demo-block__head">
      <div>
        <div class="demo-block__title">{{ title }}</div>
        <div v-if="desc" class="demo-block__desc">{{ desc }}</div>
      </div>
      <div v-if="code" class="demo-block__actions">
        <el-button text :icon="showCode ? ArrowUp : ArrowDown" @click="showCode = !showCode">
          {{ showCode ? '收起代码' : '查看代码' }}
        </el-button>
        <el-button text :icon="DocumentCopy" @click="copy">复制</el-button>
        <el-button text type="primary" :icon="MagicStick" @click="copyForAi">复制为 AI 指令</el-button>
      </div>
    </div>

    <div class="demo-block__preview">
      <slot />
    </div>

    <el-collapse-transition>
      <pre v-show="showCode && code" class="demo-block__code"><code>{{ code }}</code></pre>
    </el-collapse-transition>
  </div>
</template>

<style scoped>
.demo-block {
  border: 1px solid var(--ya-border-color-light);
  border-radius: var(--ya-radius-lg);
  background: var(--ya-bg-container);
  margin-bottom: var(--ya-spacing-xl);
  overflow: hidden;
}
.demo-block__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ya-spacing-lg);
  padding: var(--ya-spacing-lg) var(--ya-spacing-xl);
  border-bottom: 1px solid var(--ya-border-color-light);
}
.demo-block__title {
  font-size: var(--ya-font-md);
  font-weight: 600;
  color: var(--ya-text-primary);
}
.demo-block__desc {
  margin-top: 4px;
  font-size: var(--ya-font-sm);
  color: var(--ya-text-secondary);
  line-height: 1.6;
}
.demo-block__actions {
  flex-shrink: 0;
  white-space: nowrap;
}
.demo-block__preview {
  padding: var(--ya-spacing-xl);
}
.demo-block__code {
  margin: 0;
  padding: var(--ya-spacing-lg) var(--ya-spacing-xl);
  background: var(--ya-bg-page);
  border-top: 1px dashed var(--ya-border-color);
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: var(--ya-font-sm);
  line-height: 1.6;
  color: var(--ya-text-regular);
  overflow-x: auto;
  white-space: pre;
}
</style>
