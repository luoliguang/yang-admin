<script setup lang="ts">
withDefaults(
  defineProps<{ description?: string; imageSize?: number }>(),
  { description: '暂无数据', imageSize: 90 },
);
</script>

<template>
  <div class="ya-empty">
    <el-empty :description="description" :image-size="imageSize">
      <slot />
    </el-empty>
  </div>
</template>

<style scoped>
.ya-empty {
  display: flex;
  justify-content: center;
  padding: var(--ya-spacing-xl) 0;
}
</style>
