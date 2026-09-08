<script setup lang="ts">
import type { Component } from 'vue';

withDefaults(
  defineProps<{
    label: string;
    value: string | number;
    icon?: Component;
    color?: string;
    delta?: string;
    up?: boolean;
  }>(),
  { color: 'var(--ya-color-primary)' },
);
</script>

<template>
  <div class="stat-card">
    <div v-if="icon" class="stat-card__icon" :style="{ background: color + '1a', color }">
      <el-icon :size="24"><component :is="icon" /></el-icon>
    </div>
    <div class="stat-card__body">
      <div class="stat-card__label">{{ label }}</div>
      <div class="stat-card__value">{{ value }}</div>
      <div v-if="delta" class="stat-card__delta" :class="up ? 'is-up' : 'is-down'">{{ delta }}</div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: var(--ya-spacing-lg);
  padding: var(--ya-spacing-xl);
  background: var(--ya-bg-container);
  border: 1px solid var(--ya-border-color-light);
  border-radius: var(--ya-radius-lg);
  box-shadow: var(--ya-shadow-sm);
  transition: box-shadow var(--ya-transition-base), transform var(--ya-transition-base);
}
.stat-card:hover {
  box-shadow: var(--ya-shadow-lg);
  transform: translateY(-2px);
}
.stat-card__icon {
  width: 52px;
  height: 52px;
  border-radius: var(--ya-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-card__label {
  font-size: var(--ya-font-sm);
  color: var(--ya-text-secondary);
}
.stat-card__value {
  font-size: var(--ya-font-2xl);
  font-weight: 700;
  color: var(--ya-text-primary);
  line-height: 1.3;
}
.stat-card__delta {
  font-size: var(--ya-font-xs);
}
.stat-card__delta.is-up {
  color: var(--ya-color-success);
}
.stat-card__delta.is-down {
  color: var(--ya-color-danger);
}
</style>
