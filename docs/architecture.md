# 架构与约定

## 分层

```
packages/design-tokens   跨栈：CSS 变量 + 明暗主题（--ya-* 命名，联动 --el-*）
packages/shared          跨栈：ApiResponse / PageQuery / PageResult 等前后端契约
packages/skills-templates 跨栈：CRUD 生成器 + Skill + MCP
apps/web                 前端
apps/server              后端
```

**跨栈隔离**：可复用资产（设计令牌、共享类型、生成器方法论）独立成包，与前端框架无关。未来若出 React 版前端，这三块可直接复用，只需重写 `apps/web` 的组件层。

## 后端约定

- **统一响应**：全局拦截器把返回值包成 `{ code: 0, message: 'ok', data }`；service 直接返回业务数据即可，不用手写包装。
- **统一异常**：全局过滤器输出 `{ code, message, data: null }`，HTTP 状态为异常状态码。
- **鉴权**：全局 `JwtAuthGuard`（`@Public()` 放行）+ `PermissionGuard`（`@RequirePermission('x:y:z')` 声明所需权限，`*` 为超权）。
- **RBAC**：`User ↔ Role ↔ Menu` 多对多。`Menu.type` = 0 目录 / 1 菜单 / 2 按钮；按钮的 `permission` 字段即权限标识。
- **权限来源**：登录后 `/auth/profile` 返回用户 + 角色 + 权限标识 + 菜单路由树。

## 前端约定

- **请求层** `utils/request.ts`：自动附加 token、解包统一响应、401 刷新令牌并重放（并发排队）、错误 `ElMessage`。
- **动态路由**：`stores/permission.ts` 把后端菜单树转成路由并 `addRoute`；侧边栏也由该菜单树渲染。视图组件通过 `import.meta.glob('../views/**/*.vue')` 按 `component` 字段（如 `system/user/index`）匹配。
- **权限控制**：按钮用 `v-permission="'x:y:z'"` 指令，无权限则移除元素。
- **主题**：只用 `--ya-*` 设计令牌，不硬编码色值；明暗两套都要适配。品牌色可在「主题设置」抽屉实时切换。
- **组件复用**：表格/表单一律用 `@/components/pro`，不重复造轮子。

## 环境变量

**后端** `apps/server/.env`（gitignore）：`DATABASE_URL`、`JWT_SECRET`/`JWT_REFRESH_SECRET`、`PORT`。

**前端** `apps/web/.env.development`：`VITE_API_BASE`（默认 `/api`，Vite 代理转发到后端）、`VITE_USE_MOCK`（`true` 启用 Mock 层）。

## 命令速查

```bash
pnpm dev:web / pnpm dev:server            # 开发
pnpm build:web / pnpm build:server        # 构建
pnpm --filter @yang-admin/server prisma:migrate   # 迁移
pnpm --filter @yang-admin/server prisma:seed      # 种子
pnpm --filter @yang-admin/server prisma:studio    # 数据库可视化
```
