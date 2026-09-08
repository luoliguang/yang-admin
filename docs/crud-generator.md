# CRUD 生成器 & MCP

用一份配置生成一个完整 CRUD 模块（后端 NestJS + 前端 ProTable 页面）。位于 `packages/skills-templates`。

> 详尽方法论见 [`packages/skills-templates/SKILL.md`](../packages/skills-templates/SKILL.md)。本文是速查。

## 命令行用法

### 1. 加 Prisma model 并迁移

`apps/server/prisma/schema.prisma` 里加 `model Xxx { id Int @id ... }`：

```bash
pnpm --filter @yang-admin/server exec prisma migrate dev --name add_xxx
```

### 2. 写资源配置 `packages/skills-templates/resources/<name>.json`

```json
{
  "modelName": "Notice",
  "label": "公告",
  "route": "/system/notice",
  "permissionPrefix": "system:notice",
  "fields": [
    { "prop": "title", "label": "标题", "type": "input", "search": true, "required": true, "column": true },
    { "prop": "status", "label": "状态", "type": "switch", "column": true }
  ]
}
```

### 3. 生成

```bash
node packages/skills-templates/generate-crud.mjs notice
```

生成：后端 `apps/server/src/modules/notice/*`，前端 `apps/web/src/api/notice.ts` + `apps/web/src/views/notice/index.vue`。

### 4. 接线（生成器不自动改，避免误伤）

1. `apps/server/src/app.module.ts` 引入 `NoticeModule`
2. 后台「菜单管理」新增路由（`component: notice/index`）+ 四个按钮权限，或在 `prisma/seed.ts` 用 `buildPage()` 追加后重跑 seed

### 5. 验证

```bash
pnpm --filter @yang-admin/server build && pnpm --filter @yang-admin/web build
```

> 配置字段的完整格式见 [`SKILL.md`](../packages/skills-templates/SKILL.md)。

## MCP 用法

`packages/skills-templates/mcp-server.mjs` 把生成器暴露为 MCP 工具，供 Claude Code 调用。项目根 `.mcp.json` 已配置接入：

```json
{ "mcpServers": { "yang-admin": { "command": "node", "args": ["packages/skills-templates/mcp-server.mjs"] } } }
```

工具：

| 工具 | 作用 |
|---|---|
| `list_resources` | 列出已有资源配置 |
| `scaffold_resource` | 写入一份新资源配置 json |
| `generate_crud` | 依据配置生成前后端代码 |

在 Claude Code 里即可说「用 yang-admin 生成一个 xxx 管理页」，由 AI 走 scaffold → generate 流程。
