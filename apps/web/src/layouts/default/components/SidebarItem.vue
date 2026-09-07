<script setup lang="ts">
import { computed } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { resolveIcon } from '@/utils/icons';

const props = defineProps<{
  item: RouteRecordRaw;
  basePath: string;
}>();

// 拼接完整路径（支持嵌套）
function resolvePath(routePath: string) {
  if (routePath.startsWith('/')) return routePath;
  return `${props.basePath.replace(/\/$/, '')}/${routePath}`;
}

const fullPath = computed(() => resolvePath(props.item.path));

// 可见子路由（用于判断是否渲染为子菜单）
const visibleChildren = computed(
  () => props.item.children?.filter((c) => !c.meta?.hideMenu) ?? [],
);
const icon = computed(() => resolveIcon(props.item.meta?.icon as string | undefined));
const title = computed(() => (props.item.meta?.title as string) ?? props.item.name);
</script>

<template>
  <!-- 有可见子路由 → 渲染为可展开子菜单 -->
  <el-sub-menu v-if="visibleChildren.length" :index="fullPath">
    <template #title>
      <el-icon v-if="icon"><component :is="icon" /></el-icon>
      <span>{{ title }}</span>
    </template>
    <SidebarItem
      v-for="child in visibleChildren"
      :key="child.path"
      :item="child"
      :base-path="fullPath"
    />
  </el-sub-menu>

  <!-- 叶子路由 → 渲染为菜单项 -->
  <el-menu-item v-else :index="fullPath">
    <el-icon v-if="icon"><component :is="icon" /></el-icon>
    <template #title>{{ title }}</template>
  </el-menu-item>
</template>
