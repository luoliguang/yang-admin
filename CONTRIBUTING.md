# 贡献指南

感谢你对 yang-admin 的关注！这是一个**免费开源**的中后台基座，欢迎任何形式的参与——用它、提想法、报 Bug、贡献代码都可以。

## 我只是想用它

- **起一个新项目**：点仓库页的 **Use this template** 生成你自己的仓库，或直接 `git clone`。
- **本地跑起来**：见 [README 快速开始](README.md#-快速开始)。想免后端预览，把 `apps/web/.env.development` 的 `VITE_USE_MOCK` 设为 `true`。
- **只想抄组件**：登录后进「组件中心」，每个组件都有实时预览 + 「复制为 AI 指令」，粘给 AI 即可。

## 我想提想法 / 报问题

- 💡 **有想法/建议**：开一个 [Discussion](../../discussions) 或提 `💡 功能建议` Issue，不必写得很正式，说清楚"想要什么、为什么"就好。
- 🐛 **发现 Bug**：提 `🐛 Bug 反馈` Issue，附上复现步骤、期望结果、截图/报错。

## 我想贡献代码

1. Fork 本仓库，从 `main` 切出分支：`git checkout -b feat/你的特性`
2. 本地开发，遵循下面的约定
3. 提交前跑一遍自检：`pnpm check`（生成组件速查表 + 两端类型检查/构建）
4. 推送并发起 Pull Request，描述清楚改了什么、为什么

### 开发约定

- **包管理**：pnpm ≥ 9，Node ≥ 20。
- **提交信息**：用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)，如 `feat(web): ...`、`fix(server): ...`、`docs: ...`。
- **组件**：新增可复用组件放 `apps/web/src/components/pro/` 并在 `index.ts` 导出；在 `packages/skills-templates/gen-catalog.mjs` 的 `META` 里补一行分类/用途，再跑 `pnpm gen:catalog` 同步速查表。
- **样式**：只用设计令牌（`--ya-*`），不写死颜色/间距；注意 hover/激活态的对比度。
- **保持聚焦**：一个 PR 只做一件事，别顺手大重构。

### 目录速览

```
packages/design-tokens   设计令牌（跨栈）
packages/shared          前后端共享类型
packages/skills-templates 生成器 + MCP + 组件目录
apps/web                 前端 Vue3 + Element Plus
apps/server              后端 NestJS + Prisma
```

## 行为准则

请保持友善与尊重。这是一个学习与共享的项目，任何真诚的参与都值得欢迎。
