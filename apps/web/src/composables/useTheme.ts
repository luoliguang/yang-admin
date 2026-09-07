import { useStorage } from '@vueuse/core';
import { watch } from 'vue';

export type ThemeMode = 'light' | 'dark';

const themeMode = useStorage<ThemeMode>('ya-theme-mode', 'light');

function applyTheme(mode: ThemeMode) {
  const html = document.documentElement;
  // 加过渡类，实现明暗切换的平滑淡入
  html.classList.add('theme-transition');
  html.classList.toggle('dark', mode === 'dark');
  window.setTimeout(() => html.classList.remove('theme-transition'), 300);
}

let initialized = false;

/** 主题管理：明暗模式切换 + 本地持久化 */
export function useTheme() {
  if (!initialized) {
    applyTheme(themeMode.value);
    watch(themeMode, applyTheme);
    initialized = true;
  }

  const isDark = () => themeMode.value === 'dark';
  const toggleDark = () => {
    themeMode.value = themeMode.value === 'dark' ? 'light' : 'dark';
  };
  const setTheme = (mode: ThemeMode) => {
    themeMode.value = mode;
  };

  return { themeMode, isDark, toggleDark, setTheme };
}
