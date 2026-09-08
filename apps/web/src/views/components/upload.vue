<script setup lang="ts">
import { ref } from 'vue';
import { PageHeader, Upload, DemoBlock } from '@/components/pro';

const url = ref('');
const code = `<Upload v-model="imageUrl" :max-size="5" />

// 走后端 /upload，自动带 token；成功后 v-model 得到图片 url`;
</script>

<template>
  <div>
    <PageHeader title="Upload 文件上传" subtitle="图片上传，带 token、预览、大小/类型校验。" />
    <DemoBlock title="图片上传" desc="点击方框选择图片上传（需后端运行）。" :code="code">
      <Upload v-model="url" :max-size="5" />
      <div v-if="url" class="hint">url: <code>{{ url }}</code></div>
    </DemoBlock>
  </div>
</template>

<style scoped>
.hint {
  margin-top: var(--ya-spacing-md);
  font-size: var(--ya-font-sm);
  color: var(--ya-text-secondary);
}
</style>
