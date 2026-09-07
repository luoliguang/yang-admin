# yang-admin · 通用型全栈后台基座 · 规划文档

> 目标：沉淀一套**可长期复用**的中后台基座，解决"后台样式/组件/功能匮乏"的痛点。
> 主栈：**Vue 3 + Element Plus + NestJS**（全 TypeScript 一条龙）。
> 定位：全栈完整项目 + 同步沉淀开发期 AI 提效能力。
> 规划日期：2026-09-08

---

## 1. 设计原则

1. **设计系统先行**：先定 design tokens（主题/间距/圆角/暗色模式），再做组件——高级感的根。
2. **配置驱动 CRUD**：把「表格 + 搜索表单 + 分页 + 增删改查弹窗」抽成配置驱动，新页面写配置而非重复写 UI。这是解决"组件匮乏"的核心杠杆。
3. **跨栈隔离**：可跨栈复用的资产（design tokens、后端、skills 方法论）物理隔离成独立包，未来出 React 版可复用 60%~70%。
4. **Mock 优先**：前端不依赖真后端也能独立跑起来、能演示。
5. **AI 可插拔**：开发期提效优先；运行期 Copilot 预留插槽、默认关闭。

---

## 2. 仓库结构（pnpm monorepo）

```
yang-admin/
├── packages/
│   ├── design-tokens/     # 跨栈：CSS 变量 + JSON token，主题/暗色模式
│   ├── shared/            # 跨栈：TS 类型、常量、工具、API 契约（前后端共享）
│   └── skills-templates/  # 跨栈：生成后台页面的代码模板（供 AI 提效用）
├── apps/
│   ├── web/               # Vue3 + Vite + TS + Element Plus + Pinia + UnoCSS
│   └── server/            # NestJS + Prisma + PostgreSQL
├── docs/                  # 使用文档、组件文档、复用指南
├── PLANNING.md
└── pnpm-workspace.yaml
```

---

## 3. 技术选型

### 前端 apps/web
- 构建：Vite + TypeScript
- UI：Element Plus（按需引入）
- 状态：Pinia
- 路由：Vue Router（约定式 / 动态权限路由）
- 样式：UnoCSS + design-tokens（CSS 变量）
- 请求：Axios 封装（拦截器、错误处理、loading、token 刷新）
- Mock：内置 mock 层，一键切换真/假接口
- 图表：ECharts（含地图 choropleth，对应 yang-map）

### 后端 apps/server
- 框架：NestJS（模块化 + 装饰器）
- ORM：Prisma
- DB：PostgreSQL
- 认证：JWT + 刷新令牌
- 权限：RBAC（角色-权限-菜单）
- 文档：Swagger 自动生成
- 校验：class-validator / class-transformer

### 工程规范
- pnpm workspace、ESLint + Prettier、Husky + lint-staged、Commitlint、TypeScript 严格模式

---

## 4. 核心能力清单

### 设计层
- [ ] design tokens：主色/中性色/语义色、间距、圆角、阴影、字号阶梯
- [ ] 亮/暗色模式，主题切换持久化
- [ ] 全局质感：布局密度、卡片、玻璃拟态/阴影层级

### 组件层（业务级）
- [ ] **ProTable**：配置驱动的高级表格（列配置、排序、筛选、分页、行选择、工具栏、列显隐）
- [ ] **SearchForm**：配置驱动的查询表单（多种控件、折叠展开、重置）
- [ ] **CrudModal / Drawer**：配置驱动的增删改查表单弹窗
- [ ] **PermissionButton / v-permission**：按钮级权限控制
- [ ] 图表卡片、统计卡片、地图（yang-map）
- [ ] 文件上传、富文本、Markdown、代码编辑器（可选）

### 工程层
- [ ] 布局：侧边栏 + 顶栏 + 多标签页 + 面包屑 + 全屏 + 主题设置抽屉
- [ ] 动态路由 + 菜单权限
- [ ] 请求封装、统一错误/loading、mock 切换
- [ ] 登录/登出/token 刷新
- [ ] 国际化预留（中/英）
- [ ] 环境配置、构建优化

### 后端层
- [ ] 用户 / 角色 / 权限 / 菜单（RBAC）
- [ ] 认证（JWT + refresh）
- [ ] 统一响应格式、全局异常过滤、日志
- [ ] Prisma schema + 迁移 + seed
- [ ] Swagger 文档

### AI 提效层（开发期）
- [ ] 沉淀「生成 CRUD 页面」的 skill 模板（前端 + 后端配套）
- [ ] 预留开发期 MCP：读取 Prisma schema → 生成前后端 CRUD 骨架
- [ ] 运行期 Copilot 插槽（默认关闭）

---

## 5. 实施路线图（分阶段，每阶段可独立验证）

| 阶段 | 目标 | 产出 |
|---|---|---|
| **P0 地基** | monorepo + 两个 app 空壳能跑 | 目录结构、pnpm workspace、web/server 启动成功 |
| **P1 设计系统** | design tokens + 暗色模式 + 布局骨架 | 侧边栏/顶栏/标签页布局，主题切换 |
| **P2 后端基座** | NestJS + Prisma + RBAC + 认证 | 用户/角色/权限接口 + Swagger + seed |
| **P3 前端打通** | 请求封装 + 登录 + 动态路由 + Mock | 能登录、按权限出菜单 |
| **P4 核心组件** | ProTable + SearchForm + CrudModal | 一个完整 CRUD 示例页（配置驱动） |
| **P5 增强** | 图表/地图/上传/国际化 | Dashboard 示例、地图示例 |
| **P6 AI 提效** | CRUD 生成 skill + 开发期 MCP | 一条命令生成新 CRUD 模块 |
| **P7 文档** | 复用指南 + 组件文档 | 新项目如何基于此起步 |

---

## 6. 待确认 / 风险

- PostgreSQL 是否本机可用？若无，P2 可先用 SQLite 起步再迁移。
- 是否需要保留未来 React 版的可能（影响跨栈隔离的严格程度）。
- Copilot 运行期能力接哪个模型/接口，留到 P6 再定。
