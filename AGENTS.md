# AGENTS.md — 给 AI/Agent 的项目指令

> 本文件是**跨 Agent 通用**的操作说明（Codex、Cursor、以及其它读取 `AGENTS.md` 的工具会自动加载）。
> Claude Code 用户可另外安装本仓库的插件技能（见 `README.md`「作为 Agent 技能一键安装」），内容与此一致。
> 完整接入方式与指令详解见 [`docs/ai-usage.md`](docs/ai-usage.md)。

## 这是什么

yang-admin 是通用型全栈中后台基座（**Vue 3 + Element Plus + NestJS**，pnpm monorepo）。
在它里面做页面的核心理念：**写页面 = 写配置**，用一批配置驱动组件拼装，而不是从零写 UI。

判断当前是否 yang-admin 项目：存在 `apps/web/src/components/pro/index.ts` 即是。若不存在，先说明"这不是 yang-admin 项目"，再讨论是否移植，别硬套。

## 动手前必读

1. **组件目录**：读 `packages/skills-templates/catalog.md`（组件、props、页面积木 blocks 的唯一真相来源）。有 MCP 时用工具 `list_components` 获取。
2. 永远以 catalog 为准，**不要臆造组件 API / props**。

## 必须遵守的约定

- **组件来源**：自有组件从 `@/components/pro` 引入（ProTable / SearchForm / CrudModal / Upload / StatCard / PageHeader / DictTag / StatusDot / Empty）；图标从 `@element-plus/icons-vue`。
- **表格一律 `ProTable`**（`columns` + `request` 配置驱动），**不手写 `el-table` 样板**。
- **增删改查弹窗用 `CrudModal`**（`fields` 描述表单），搜索用 `SearchForm` 或 ProTable 的 `searchFields`。
- **样式只用设计令牌 `--ya-*`**（颜色/间距/圆角/阴影/字号），不写死颜色像素；明暗双主题自动适配。注意 hover/激活态对比度。
- **只用 catalog 里出现过的 props**。
- **权限**：后端接口 `@RequirePermission('资源:动作')`，前端按钮 `v-permission`，code 必须与菜单按钮权限一致。
- **后端响应**统一 `{ code, message, data }`（全局拦截器包装，service 直接返回数据）。

## 常见任务

- **管理列表页（CRUD）** = 一个 `ProTable` + 一个 `CrudModal`。完整仓库可用 `node packages/skills-templates/generate-crud.mjs <name>` 一步生成前后端（先写 `resources/<name>.json` 并建好 Prisma model）。
- **仪表盘/概览** = `PageHeader` + 一行 `StatCard` + 若干 `Chart` + 可选 `ProTable`。完整仓库可用 `node packages/skills-templates/generate-view.mjs <name>`。
- **单个组件** = 照 catalog 的 props 表写；组件中心有实时预览。

非完整仓库（拿不到生成器目录结构）时：**按 catalog 直接手写组件**即可，效果一致。

## 接线（新增页面后）

1. 后端新模块：在 `apps/server/src/app.module.ts` 的 `imports` 加 `<Name>Module`。
2. 挂路由/菜单：后台「菜单管理」新增菜单（`component` 填 `<name>/index`）+ 按钮权限；或在 `apps/server/prisma/seed.ts` 追加后重跑 seed。

## 验证（改完必做）

```bash
pnpm check          # 生成组件目录 + 两端类型检查/构建，一键自检
```
改了组件目录先 `node packages/skills-templates/gen-catalog.mjs` 同步。

## 指令速查（详解见 docs/ai-usage.md）

| 指令 | 作用 |
|---|---|
| `pnpm dev:web` / `pnpm dev:server` | 启动前端(5173) / 后端(3000) 开发服务 |
| `pnpm check` | 生成 catalog + 两端类型检查/构建（提交前自检） |
| `pnpm gen:catalog` | 从源码重新生成组件速查表 |
| `node packages/skills-templates/generate-crud.mjs <name>` | 依资源配置生成后端模块 + 前端 CRUD 页 |
| `node packages/skills-templates/generate-view.mjs <name>` | 依视图规格生成一个组合页面 .vue |
| MCP `list_components` | 返回组件目录（catalog） |
| MCP `scaffold_resource` / `generate_crud` | 写资源配置 / 生成 CRUD |
| MCP `scaffold_view` / `generate_view` | 写视图规格 / 生成页面 |
