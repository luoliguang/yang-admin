<script setup lang="ts">
import { computed } from 'vue';
import { resolveIcon } from '@/utils/icons';
import type { MenuNode } from '@/api/auth';

const props = defineProps<{ item: MenuNode }>();

// 可见子菜单（排除按钮）
const visibleChildren = computed(
  () => props.item.children?.filter((c) => c.type !== 2) ?? [],
);
const icon = computed(() => resolveIcon(props.item.icon));
const index = computed(() => props.item.path || `menu-${props.item.id}`);
</script>

<template>
  <!-- 有子菜单 → 可展开子菜单 -->
  <el-sub-menu v-if="visibleChildren.length" :index="index">
    <template #title>
      <el-icon v-if="icon"><component :is="icon" /></el-icon>
      <span>{{ item.title }}</span>
    </template>
    <SidebarItem v-for="child in visibleChildren" :key="child.id" :item="child" />
  </el-sub-menu>

  <!-- 叶子菜单 -->
  <el-menu-item v-else :index="index">
    <el-icon v-if="icon"><component :is="icon" /></el-icon>
    <template #title>{{ item.title }}</template>
  </el-menu-item>
</template>
