# 更新日志

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 规范，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Added
- **Claude Code 插件/技能市场**：仓库即 marketplace，别人可 `/plugin marketplace add luoliguang/yang-admin`
  + `/plugin install yang-admin@yang-admin`，让 Agent 掌握 yang-admin 组件目录与工程约定来搭后台。
  - `.claude-plugin/marketplace.json` + `plugins/yang-admin/`（plugin.json + skills/yang-admin/SKILL.md + 自带 catalog 参考）
  - `gen-catalog.mjs` 同步把组件目录复制进插件 reference，保持单一数据源
- 标签页右键菜单（关闭其他/右侧/全部）。
- 开源配套：MIT `LICENSE`、`CONTRIBUTING.md`、Issue/PR 模板、README「参与共建」章节。
- 游客模式：登录页「👤 游客体验」按钮（Mock 模式下展示），访客免登录进组件中心。
- Vercel 在线 Demo：`vercel.json` + `pnpm build:demo`（独立 `--mode demo`，不影响真实生产构建）。
- README 落地页化：徽章、「30 秒理解它」、「让 AI 用上我的组件库」章节。
- 组件速查表生成器 `gen-catalog.mjs`：从 `@/components/pro` 源码自动解析 props，
  一处生成、同步注入 README 与 `catalog.md`（MCP `list_components` 随之更新）。
- 根脚本 `pnpm gen:catalog` / `pnpm build` / `pnpm check`（提交前一键自检）。
- `复制为 AI 指令` 反馈增强：按钮转「已复制 ✓」态 + 醒目 toast + 非安全上下文 execCommand 降级。

## [0.7.0] - 组件中心 · vibecoding

### Added
- 组件中心：DemoBlock（实时预览 + 可复制代码）、Playground（实时调 props → 生成代码）。
- 组件级/页面级「复制为 AI 指令」，把用法包装成结构化提示词喂给 AI。
- 视图生成器 `generate-view.mjs` + MCP 6 个工具（含 `list_components` / `scaffold_view`）。
- 新增基础组件 StatusDot / Empty。

## [0.6.0] - AI 开发期提效

### Added
- CRUD 代码生成器 `generate-crud.mjs`（前后端一并生成）。
- MCP 服务 `mcp-server.mjs`，`.mcp.json` 注册 `yang-admin` server。
- Skill 模板与组件目录 `catalog.md`。

## [0.5.0] - 增强能力

### Added
- ECharts 图表 + 中国地图 choropleth（主题感知）。
- 图片上传（带 token、预览、校验）。
- 国际化 vue-i18n 中/英 + Element Plus 语言联动。

## [0.4.0] - 核心组件

### Added
- 配置驱动组件 ProTable / SearchForm / CrudModal / StatCard / PageHeader / DictTag。

## [0.3.0] - 前端打通

### Added
- 请求封装、登录、动态路由（后端菜单树驱动）、Mock 可切换。

## [0.2.0] - 后端基座

### Added
- NestJS + Prisma + PostgreSQL，RBAC（用户/角色/菜单）、JWT + 刷新令牌、Swagger。

## [0.1.0] - 设计系统与骨架

### Added
- design tokens（色阶/间距/圆角/阴影/字号）+ 明暗双主题 + 可换品牌色。
- 布局骨架（侧边栏 / 顶栏 / 内容区）。

## [0.0.1] - 地基

### Added
- pnpm monorepo：`apps/{web,server}` + `packages/{design-tokens,shared,skills-templates}`。
