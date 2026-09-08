<script setup lang="ts">
import { computed } from 'vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';
import { useTheme } from '@/composables/useTheme';
import { usePrimaryColor } from '@/composables/usePrimaryColor';
import { localeStore } from '@/locales';

// 初始化主题（明暗模式）与主色，从本地存储恢复
useTheme();
usePrimaryColor();

// Element Plus 语言随全局 locale 切换
const epLocale = computed(() => (localeStore.value === 'en-US' ? en : zhCn));
</script>

<template>
  <el-config-provider :locale="epLocale">
    <router-view />
  </el-config-provider>
</template>
