<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Upload } from '@/components/pro';

const { t } = useI18n();
const imageUrl = ref('');
</script>

<template>
  <div class="panel">
    <div class="panel__title">{{ t('upload.title') }}</div>
    <el-alert class="tip" type="info" :closable="false" :title="t('upload.tip')" />
    <Upload v-model="imageUrl" />
    <div v-if="imageUrl" class="result">
      <span class="result__label">{{ t('upload.result') }}:</span>
      <code>{{ imageUrl }}</code>
    </div>
  </div>
</template>

<style scoped>
.panel {
  background: var(--ya-bg-container);
  border: 1px solid var(--ya-border-color-light);
  border-radius: var(--ya-radius-lg);
  padding: var(--ya-spacing-xl);
  box-shadow: var(--ya-shadow-sm);
}
.panel__title {
  font-size: var(--ya-font-md);
  font-weight: 600;
  color: var(--ya-text-primary);
  margin-bottom: var(--ya-spacing-lg);
}
.tip {
  margin-bottom: var(--ya-spacing-lg);
}
.result {
  margin-top: var(--ya-spacing-lg);
  font-size: var(--ya-font-sm);
  color: var(--ya-text-regular);
}
.result__label {
  color: var(--ya-text-secondary);
  margin-right: 6px;
}
</style>
