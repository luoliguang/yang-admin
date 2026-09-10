<div align="center">

# yang-admin

**AI 时代的通用型全栈中后台基座** · Vue 3 + Element Plus + NestJS

沉淀一套可长期复用的设计系统、业务级组件与工程规范，让每个新后台项目都从一个扎实的起点开始。

![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&logoColor=white)
![Element Plus](https://img.shields.io/badge/Element%20Plus-on--demand-409eff?logo=element&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-e0234e?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-monorepo-f69220?logo=pnpm&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-22c55e)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-22c55e)

**免费开源 · MIT 许可** · 拿去随便用，也欢迎你来提想法、共建组件

[🔗 在线体验](https://yang-admin.vercel.app) · [🚀 快速开始](#-快速开始) · [🤝 参与共建](#-免费开源--参与共建)

<sub>在线 Demo 为 Mock 数据，登录页点「👤 游客体验」即可免登录逛组件中心。</sub>

</div>

---

## ⚡ 30 秒理解它

普通后台模板给你「一堆代码」，yang-admin 多给你**三件套**，让你（和 AI）用得又快又对：

1. **内置「组件中心」** — 登录后即是一个可交互的组件库：每个组件实时预览、可调 props、一键复制代码。
2. **「复制为 AI 指令」** — 任意组件/整页一键复制成结构化提示词，粘给 AI，AI 立刻知道**从哪引入、按什么 props 用**，直接产出可运行代码。
3. **CRUD 生成器 + MCP** — 命令行/AI 一句话生成前后端 CRUD 与视图页，接进本基座即可跑。

> 卖点一句话：**写页面 = 写配置；扩功能 = 让 AI 照着组件库拼**。

<!-- 💡 建议：在此处放一张「组件中心 → 复制为 AI 指令 → AI 生成页面」的 GIF，
     胜过一屏文字。录制方法见 docs/reuse-guide.md。 -->
<!-- ![组件中心演示](docs/assets/demo.gif) -->

## ✨ 特性

- 🎨 **设计系统先行**：统一 design tokens（色阶/间距/圆角/阴影/字号）+ 明暗双主题 + 可换品牌色
- 🧱 **配置驱动组件**：`ProTable` / `SearchForm` / `CrudModal` / `Upload` / `StatCard` / `PageHeader` / `DictTag`——写页面 = 写配置
- 📖 **内置组件中心**：每个组件实时预览 + 可调 props + 可复制代码，找得到、拷了就能用
- 🤖 **AI 原生**：组件/整页「复制为 AI 指令」+ CRUD 生成器 + MCP 服务，让 AI 精准复用你的组件库
- 🔐 **完整 RBAC**：用户 / 角色 / 菜单，JWT + 刷新令牌，接口级 `@RequirePermission` + 按钮级 `v-permission`
- 🧭 **动态路由**：后端菜单树驱动侧边栏与路由，按权限出菜单
- 📊 **数据可视化**：ECharts 图表 + 中国地图 choropleth（主题感知）
- 🌍 **国际化**：vue-i18n 中/英 + Element Plus 语言联动
- 🧪 **Mock 可切换**：`VITE_USE_MOCK` 一开关，脱离后端也能登录演示
- 🏗️ **跨栈隔离**：设计令牌 / 共享类型 / 生成器独立成包，未来出 React 版可复用

## 🤖 让 AI 用上我的组件库

这是 yang-admin 区别于其它模板的核心能力。三种由浅入深的用法：

| 方式 | 场景 | 怎么做 |
|---|---|---|
| **复制为 AI 指令** | 想让 AI 照某个组件/整页写代码 | 组件中心里点「复制为 AI 指令」→ 粘进对话，AI 即知引入路径与 props 约定 |
| **CRUD 生成器** | 新建一张资源表的增删改查 | `node packages/skills-templates/generate-crud.mjs <name>`，前后端一起生成 |
| **MCP 服务** | 让 AI（Claude 等）直接调用生成能力 | `.mcp.json` 已注册 `yang-admin` server，提供 `list_components` / `scaffold_view` 等工具 |

> 组件速查表见下方「🧩 组件速查」——它由脚本从源码自动生成，AI 与人看到的是同一份真相。

## 🧩 组件速查

<!-- COMPONENTS:START -->

| 组件 | 分类 | 用途 | 主要 props |
|---|---|---|---|
| **ProTable** | 业务级 | 配置驱动表格：搜索 + 分页 + 工具栏 + 树表，写 columns/request 即可 | `columns` `request` `searchFields?` `rowKey?` |
| **SearchForm** | 业务级 | 配置驱动查询表单，与 ProTable 搭配 | `fields` `modelValue?` |
| **CrudModal** | 业务级 | 配置驱动的增删改查弹窗（表单项由 fields 描述） | `modelValue` `title?` `fields` `model` |
| **Upload** | 业务级 | 图片上传：带 token、预览、体积/类型校验 | `modelValue?` `maxSize?` |
| **StatCard** | 基础 | KPI 统计卡片：图标 + 数值 + 涨跌 | `label` `value` `icon?` `color?` |
| **PageHeader** | 基础 | 页头：标题 + 副标题 + #extra 操作位 | `title` `subtitle?` |
| **DictTag** | 基础 | 字典标签：按 value 匹配 options 渲染彩色 el-tag | `value` `options` |
| **StatusDot** | 基础 | 状态圆点 + 文字（在线/离线等语义色） | `text?` `type?` |
| **Empty** | 基础 | 空状态占位，可插入操作按钮 | `description?` `imageSize?` |
| **DemoBlock** | 文档 | 组件中心用：实时预览 + 可折叠代码 + 复制为 AI 指令 | `title` `desc?` `code?` |
| **Playground** | 文档 | 组件中心用：实时调 props → 同步生成代码 → 复制为 AI 指令 | `title` `desc?` `controls` `state` |

<!-- COMPONENTS:END -->

> 由 `node packages/skills-templates/gen-catalog.mjs` 从 `@/components/pro` 源码自动生成。详细 props 见 `packages/skills-templates/catalog.md`，交互演示见登录后「组件中心」。

## 🛠️ 技术栈

| 层 | 选型 |
|---|---|
| 前端 | Vue 3 · Vite · TypeScript · Element Plus（按需引入）· Pinia · Vue Router · SCSS + design tokens · ECharts · vue-i18n · Axios |
| 后端 | NestJS · Prisma · PostgreSQL · JWT · Swagger · class-validator |
| 工程 | pnpm monorepo · ESLint/Prettier 就绪 · `pnpm check` 一键自检 |

## 📦 目录结构

```
yang-admin/
├── packages/
│   ├── design-tokens/     # 跨栈：CSS 变量 + 明暗主题
│   ├── shared/            # 跨栈：前后端共享类型/契约
│   └── skills-templates/  # 跨栈：CRUD 生成器 + Skill + MCP 服务
├── apps/
│   ├── web/               # 前端 Vue3 + Element Plus
│   └── server/            # 后端 NestJS + Prisma
└── docs/                  # 文档
```

## 🚀 快速开始

**环境**：Node ≥ 20、pnpm ≥ 9、PostgreSQL

```bash
# 1. 安装依赖
pnpm install

# 2. 配置数据库：复制并填入你的 PostgreSQL 密码
cp apps/server/.env.example apps/server/.env
#   编辑 apps/server/.env 的 DATABASE_URL

# 3. 迁移 + 种子数据（自动建库、建表、写入 admin 账号与菜单）
pnpm --filter @yang-admin/server exec prisma migrate dev
pnpm --filter @yang-admin/server prisma:seed

# 4. 启动后端（http://localhost:3000/api，文档 /api/docs）
pnpm dev:server

# 5. 另开终端启动前端（http://localhost:5173）
pnpm dev:web
```

默认账号：**admin / admin123**

> 想脱离后端先看前端？把 `apps/web/.env.development` 的 `VITE_USE_MOCK` 设为 `true` 即可用 Mock 数据登录演示。

## 📚 文档

- [基于本基座起新项目](docs/reuse-guide.md)
- [配置驱动组件用法](docs/components.md)（ProTable / SearchForm / CrudModal / Upload / Chart）
- [CRUD 生成器 & MCP](docs/crud-generator.md)
- [架构与约定](docs/architecture.md)
- [更新日志](CHANGELOG.md)

## 🤝 免费开源 & 参与共建

yang-admin 采用 **MIT 许可**，永久免费，商用/改造/二次分发都可以，只需保留版权声明。

### 怎么用它起项目

| 方式 | 适合 |
|---|---|
| 点仓库页 **Use this template** | 直接生成你自己的新仓库（推荐做基座） |
| `git clone` 本仓库 | 想研究/改造源码 |
| 只抄组件 | 进「组件中心」→ 组件「复制为 AI 指令」→ 喂给 AI |

> 仅想逛组件、不想跑后端？在线 Demo 用 Mock 数据运行，登录页有「👤 游客体验」一键进入；本地则把 `apps/web/.env.development` 的 `VITE_USE_MOCK` 设为 `true`。

### 怎么参与

欢迎提想法、报 Bug、贡献组件——详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

- 💡 有想法/建议 → [Discussions](../../discussions) 或「💡 功能建议」Issue
- 🐛 发现问题 → 「🐛 Bug 反馈」Issue
- 🔧 贡献代码 → Fork → 改 → `pnpm check` → 发 PR

### 部署在线 Demo（Vercel）

让访客免登录逛组件中心：

1. 到 [vercel.com](https://vercel.com) 用 GitHub 登录 → **Add New Project** → 导入本仓库
2. 构建配置已在 `vercel.json` 写好（`VITE_USE_MOCK=true pnpm build:web`，产物 `apps/web/dist`），无需手动填
3. 部署完成后把拿到的网址填回本 README 顶部「🔗 在线体验」处

> Demo 构建用**内联环境变量** `VITE_USE_MOCK=true` 开启 Mock（而非 `.env` 文件——`.env.*` 已被 gitignore，不会进仓库），因此不影响真实生产构建。本地想复现同款 Mock 构建可跑 `pnpm build:demo`。

## 🗺️ 路线图

| 阶段 | 内容 | 状态 |
|---|---|---|
| P0 | monorepo 地基 | ✅ |
| P1 | 设计系统 + 布局骨架 | ✅ |
| P2 | 后端基座（NestJS + Prisma + RBAC + JWT） | ✅ |
| P3 | 前端打通（请求封装 + 登录 + 动态路由 + Mock） | ✅ |
| P4 | 核心组件（ProTable / SearchForm / CrudModal） | ✅ |
| P5 | 增强（图表 / 地图 / 上传 / i18n） | ✅ |
| P6 | AI 开发期提效（CRUD 生成器 + Skill + MCP） | ✅ |
| P7 | 文档 + 组件中心（vibecoding） | ✅ |

后续可选：运行期 AI Copilot、React 版前端、更多业务组件。

## 📄 许可证

[MIT](LICENSE) © 2026 luoliguang
