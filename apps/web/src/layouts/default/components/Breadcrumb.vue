<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 从匹配到的路由链生成面包屑（跳过无 title 的层级）
const items = computed(() =>
  route.matched
    .filter((m) => m.meta?.title)
    .map((m) => ({ title: m.meta.title as string, path: m.path })),
);
</script>

<template>
  <el-breadcrumb separator="/" class="breadcrumb">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="item in items" :key="item.path">
        {{ item.title }}
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  font-size: var(--ya-font-base);
}
.breadcrumb-enter-active {
  transition: all 0.3s;
}
.breadcrumb-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
</style>
