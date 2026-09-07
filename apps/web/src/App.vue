<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import { usePrimaryColor } from '@/composables/usePrimaryColor';

// 初始化主题（明暗模式）与主色，从本地存储恢复
useTheme();
usePrimaryColor();
</script>

<template>
  <router-view />
</template>
