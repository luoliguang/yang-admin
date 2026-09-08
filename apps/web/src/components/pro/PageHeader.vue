<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>();
</script>

<template>
  <div class="page-header">
    <div class="page-header__text">
      <h2>{{ title }}</h2>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div class="page-header__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--ya-spacing-xl);
}
.page-header h2 {
  margin: 0 0 4px;
  font-size: var(--ya-font-xl);
  color: var(--ya-text-primary);
}
.page-header p {
  margin: 0;
  color: var(--ya-text-secondary);
  font-size: var(--ya-font-base);
}
</style>
