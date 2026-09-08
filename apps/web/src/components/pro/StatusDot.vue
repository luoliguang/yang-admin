<script setup lang="ts">
import { computed } from 'vue';

type DotType = 'primary' | 'success' | 'warning' | 'danger' | 'info';

const props = withDefaults(
  defineProps<{ text?: string; type?: DotType }>(),
  { type: 'success' },
);

const colorMap: Record<DotType, string> = {
  primary: 'var(--ya-color-primary)',
  success: 'var(--ya-color-success)',
  warning: 'var(--ya-color-warning)',
  danger: 'var(--ya-color-danger)',
  info: 'var(--ya-text-secondary)',
};
const color = computed(() => colorMap[props.type]);
</script>

<template>
  <span class="status-dot">
    <span class="status-dot__dot" :style="{ background: color }" />
    <span class="status-dot__text">{{ text }}</span>
  </span>
</template>

<style scoped>
.status-dot {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.status-dot__dot {
  width: 8px;
  height: 8px;
  border-radius: var(--ya-radius-full);
  flex-shrink: 0;
}
.status-dot__text {
  font-size: var(--ya-font-base);
  color: var(--ya-text-regular);
}
</style>
