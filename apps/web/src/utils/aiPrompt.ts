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

/** 页面级「复制为 AI 指令」：让 AI 用组件库积木拼一整个后台页面 */
export function buildPagePrompt(): string {
  return [
    '我在用 yang-admin 中后台基座（Vue 3 + Element Plus + 组件库 @/components/pro）。请用它的「页面积木」帮我拼一个后台页面。',
    '',
    '## 可用积木（block）',
    '- page-header：页头 { title, subtitle }',
    '- stat-cards：KPI 卡片行 { items: [{ label, value, color, icon, delta, up }] }',
    '- pro-table：配置驱动表格 { columns: [{ prop, label, tag? }] }（tag:true 渲染启用/禁用标签）',
    '- chart：图表 { kind: line|bar|pie, title }',
    '- descriptions：详情描述 { column, items: [{ label, value }] }',
    'icon 取值：TrendCharts / User / ShoppingCart / Money / Odometer（Element Plus 图标名）',
    '',
    '## 两种产出方式（任选其一，推荐 A）',
    'A. 直接写页面：用 `@/components/pro` 的组件（PageHeader / StatCard / ProTable / CrudModal / Chart 等）写一个完整可运行的 `.vue`（含 `<script setup lang="ts">` 与 `<template>`），表格/图表用本地示例数据即可。',
    'B. 产出视图规格：给出一份 `{ "name": "...", "title": "...", "blocks": [ ... ] }` 的 JSON，我用项目的 `node packages/skills-templates/generate-view.mjs <name>` 生成。',
    '',
    '## 约束',
    '- 项目组件从 `@/components/pro` 引入；图标从 `@element-plus/icons-vue` 引入。',
    '- 表格一律用 `ProTable`（columns + request 配置驱动），不手写 el-table 样板。',
    '- 只用项目设计令牌，不额外写死颜色/间距。',
    '',
    '## 我想要的页面',
    '【在这里描述你的页面，例如：一个"订单概览"——顶部 3~4 个统计卡片，下面一个订单趋势折线图，再下面一个订单表格（订单号/客户/金额/状态）】',
    '',
    '请按上面的规范产出。',
  ].join('\n');
}
