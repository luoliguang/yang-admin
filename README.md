# yang-admin

> 通用型全栈中后台基座 · **Vue 3 + Element Plus + NestJS**
> 目标：沉淀一套可长期复用的设计系统、业务级组件与工程规范，让每个新后台项目都从一个扎实的起点开始。

## ✨ 特性

- 🎨 **设计系统先行**：统一 design tokens（色阶/间距/圆角/阴影/字号）+ 明暗双主题 + 可换品牌色
- 🧱 **配置驱动组件**：`ProTable` / `SearchForm` / `CrudModal` / `Upload` / `StatCard` / `PageHeader` / `DictTag`——写页面 = 写配置
- 📖 **内置组件中心**：登录后「组件中心」菜单里每个组件都有实时预览 + 可复制代码，找得到、拷了就能用
- 🔐 **完整 RBAC**：用户 / 角色 / 菜单，JWT + 刷新令牌，接口级 `@RequirePermission` + 按钮级 `v-permission`
- 🧭 **动态路由**：后端菜单树驱动侧边栏与路由，按权限出菜单
- 📊 **数据可视化**：ECharts 图表 + 中国地图 choropleth（主题感知）
- 🌍 **国际化**：vue-i18n 中/英 + Element Plus 语言联动
- 🧪 **Mock 可切换**：`VITE_USE_MOCK` 一开关，脱离后端也能登录演示
- 🤖 **AI 开发期提效**：CRUD 代码生成器 + Skill + MCP 服务
- 🏗️ **跨栈隔离**：设计令牌 / 共享类型 / 生成器独立成包，未来出 React 版可复用

## 🛠️ 技术栈

| 层 | 选型 |
|---|---|
| 前端 | Vue 3 · Vite · TypeScript · Element Plus（按需引入）· Pinia · Vue Router · SCSS + design tokens · ECharts · vue-i18n · Axios |
| 后端 | NestJS · Prisma · PostgreSQL · JWT · Swagger · class-validator |
| 工程 | pnpm monorepo · ESLint/Prettier 就绪 |

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
| P7 | 文档 | ✅ |

后续可选：运行期 AI Copilot、React 版前端、更多业务组件。
