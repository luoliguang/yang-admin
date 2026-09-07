import { useStorage } from '@vueuse/core';
import { watch } from 'vue';

/** 预设品牌色 */
export const PRIMARY_PRESETS = [
  '#4f46e5', // indigo（默认）
  '#2563eb', // blue
  '#0ea5e9', // sky
  '#059669', // emerald
  '#e11d48', // rose
  '#ea580c', // orange
];

const primaryColor = useStorage('ya-primary-color', PRIMARY_PRESETS[0]);

function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace('#', '');
  return [
    parseInt(v.slice(0, 2), 16),
    parseInt(v.slice(2, 4), 16),
    parseInt(v.slice(4, 6), 16),
  ];
}

function mix(color: [number, number, number], target: number, weight: number): string {
  const [r, g, b] = color.map((c) => Math.round(c * (1 - weight) + target * weight));
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

/** 应用主色：同步更新 --ya-* 与 Element Plus 的 --el-color-primary 系列阴影 */
function applyPrimary(hex: string) {
  const rgb = hexToRgb(hex);
  const isDark = document.documentElement.classList.contains('dark');
  const mixTarget = isDark ? 0 : 255; // 暗色向黑混合，浅色向白混合
  const root = document.documentElement.style;
  root.setProperty('--ya-color-primary', hex);
  root.setProperty('--el-color-primary', hex);
  [3, 5, 7, 8, 9].forEach((level) => {
    root.setProperty(`--el-color-primary-light-${level}`, mix(rgb, mixTarget, level / 10));
  });
  root.setProperty('--el-color-primary-dark-2', mix(rgb, isDark ? 255 : 0, 0.2));
}

let initialized = false;

export function usePrimaryColor() {
  if (!initialized) {
    applyPrimary(primaryColor.value);
    watch(primaryColor, applyPrimary);
    initialized = true;
  }
  const setPrimary = (hex: string) => {
    primaryColor.value = hex;
  };
  return { primaryColor, setPrimary, presets: PRIMARY_PRESETS, reapply: () => applyPrimary(primaryColor.value) };
}
