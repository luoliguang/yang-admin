import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { ref } from 'vue';

/** 应用级 UI 状态：侧边栏收起等 */
export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = useStorage('ya-sidebar-collapsed', false);
  const settingsOpen = ref(false);

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }
  function openSettings() {
    settingsOpen.value = true;
  }

  return { sidebarCollapsed, settingsOpen, toggleSidebar, openSettings };
});
