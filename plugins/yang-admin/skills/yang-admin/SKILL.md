---
name: yang-admin
description: 在 yang-admin 中后台基座（Vue 3 + Element Plus + NestJS）里搭建或扩展后台页面。当用户基于 yang-admin 起项目、要新增管理页/CRUD/仪表盘、或让页面风格与基座一致时使用。核心理念：写页面 = 写配置，用 @/components/pro 的配置驱动组件，不手写重复 UI 样板。
---

# 用 yang-admin 基座搭后台

yang-admin 是一套通用中后台基座。在它里面做页面**不是从零写 UI，而是用一批配置驱动组件拼装**，从而保证风格统一、可维护。本技能教 agent 正确复用它的组件与约定。

## 何时用本技能

- 用户的项目基于 yang-admin（用了模板 / clone / 目录里有 `apps/web` + `@/components/pro`）。
- 要新增：一个管理列表页（增删改查）、一个仪表盘/概览页、一张图表、一个表单弹窗。
- 要求"和基座风格一致 / 用现成组件 / 别手写表格样板"。

先用一句话判断是否在 yang-admin 项目里：存在 `apps/web/src/components/pro/index.ts` 即是。

## 第一步：读组件目录（必做）

动手前先读 `reference/catalog.md`（本技能自带）——它列出所有可用组件、props、以及"页面积木(blocks)"。**永远以 catalog 为准**，不要凭空假设组件 API。

如果项目里有完整仓库，`packages/skills-templates/catalog.md` 是同一份的最新版；也可通过 MCP 工具 `list_components` 获取。

## 核心约定（务必遵守）

- **组件来源**：项目自有组件从 `@/components/pro` 引入（`ProTable` / `SearchForm` / `CrudModal` / `Upload` / `StatCard` / `PageHeader` / `DictTag` / `StatusDot` / `Empty`）。图标从 `@element-plus/icons-vue`。
- **表格一律用 `ProTable`**（`columns` + `request` 配置驱动），**不手写 `el-table` 样板**。
- **增删改查弹窗用 `CrudModal`**（`fields` 描述表单项），搜索栏用 `SearchForm` 或 ProTable 的 `searchFields`。
- **样式只用设计令牌**（`--ya-*`：颜色/间距/圆角/阴影/字号），不写死颜色像素。明暗双主题自动适配。
- **只用 catalog 里出现过的 props**，不臆造。
- **权限**：后端接口用 `@RequirePermission('资源:动作')`，前端按钮用 `v-permission`，两者 code 必须与菜单里的按钮权限一致。
- **后端响应**统一 `{ code, message, data }`（全局拦截器包装，service 直接返回数据即可）。

## 三类常见任务的做法

### A. 一个管理列表页（CRUD）

页面 = 一个 `ProTable`（列表+搜索+分页+工具栏）+ 一个 `CrudModal`（新增/编辑）。用 `columns` 描述列、`request` 提供分页数据、`fields` 描述表单。参考 catalog 里 ProTable / CrudModal 的 props 与「表单与弹窗」示例。

**若是完整仓库**：优先用 CRUD 生成器一步生成前后端：
```bash
node packages/skills-templates/generate-crud.mjs <name>
```
（先写 `resources/<name>.json` 资源配置，并在 Prisma 里建好对应 model。详见仓库内 `packages/skills-templates/SKILL.md`。）

### B. 一个仪表盘 / 概览页

顶部一行 `StatCard`（KPI 卡片）+ 若干 `Chart`（折线/饼图/地图）+ 可选 `ProTable`。用 `PageHeader` 做页头。参考 catalog 的「页面积木」：`page-header` / `stat-cards` / `chart` / `pro-table`。

**若是完整仓库**：可用视图生成器按规格生成：
```bash
node packages/skills-templates/generate-view.mjs <name>
```

### C. 单个组件用法

直接照 catalog 里该组件的 props 表写。组件中心（登录后「组件中心」菜单）每个组件都有实时预览 + 可复制用法。

## 接线（新增页面后别忘了）

1. 后端新模块：在 `apps/server/src/app.module.ts` 的 `imports` 加上 `<Name>Module`。
2. 挂路由/菜单：后台「菜单管理」新增菜单（`component` 填 `<name>/index`）+ 按钮权限；或在 `apps/server/prisma/seed.ts` 追加后重跑 seed。

## 验证

```bash
pnpm --filter @yang-admin/web build && pnpm --filter @yang-admin/server build
```
两端 build（含类型检查）通过即为达标。改了组件目录则先 `node packages/skills-templates/gen-catalog.mjs` 同步 catalog。

## 边界

- 本技能面向**基于 yang-admin 的项目**。若当前项目里没有 `@/components/pro`，先说明"这不是 yang-admin 项目"，再讨论是否移植组件，而不是硬套。
- 生成器（generate-crud / generate-view）依赖完整仓库目录结构；非完整仓库时改为**按 catalog 直接手写组件**（agent 擅长这个，效果一样）。
