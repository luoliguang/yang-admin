/**
 * 构造「复制为 AI 指令」的提示词：把组件用法包装成一段可直接喂给 AI 的说明，
 * AI 拿到即知道这是什么组件、从哪引入、如何按当前配置使用。
 */
export interface AiPromptInput {
  /** 组件标题，如 "StatCard 统计卡片" */
  title: string;
  /** 当前用法代码 */
  code: string;
  /** 组件用途说明（可选） */
  desc?: string;
}

export function buildAiPrompt({ title, code, desc }: AiPromptInput): string {
  const isPro = /<[A-Z]/.test(code); // 含 PascalCase 标签 → 项目自有组件
  const usesIcon = /:icon="[A-Z]/.test(code) || /\bTrendCharts|ShoppingCart|Money|User|Odometer\b/.test(code);

  const lines = [
    '我在用 yang-admin 中后台基座（Vue 3 + Element Plus）。请在页面里使用下面这个组件，保持相同的 props 用法：',
    '',
    `## 组件：${title}`,
    desc ? desc : '',
    '',
    '### 用法（当前配置）',
    '```vue',
    code,
    '```',
    '',
    '### 使用要点',
    isPro
      ? "- 项目自有组件从 `@/components/pro` 引入，例如 `import { StatCard, ProTable, CrudModal } from '@/components/pro'`。"
      : '- `el-` 前缀为 Element Plus 组件，本项目已全局/按需注册，模板里直接用即可。',
    usesIcon ? "- 图标从 `@element-plus/icons-vue` 引入后作为组件传入，例如 `import { TrendCharts } from '@element-plus/icons-vue'`。" : '',
    '- 只用上面示例出现的 props；样式跟随项目设计令牌，无需额外写 CSS。',
    '',
    '请据此把该组件正确地放进我的页面，并给出完整的 `<script setup>` 与 `<template>` 片段。',
  ];
  return lines.filter((l) => l !== '').join('\n');
}
