---
name: yang-admin-crud
description: 在 yang-admin 基座里快速生成一个后台 CRUD 模块（后端 NestJS + 前端 ProTable 页面）。当需要为某个数据模型新增「列表+增删改查」管理页时使用。
---

# yang-admin CRUD 生成方法论

在 yang-admin 基座中，一个标准 CRUD 管理页 = **配置**，不是从零写 UI。本技能把「生成一个 CRUD 模块」固化为可复现的步骤，供人或 AI 使用，保证产出风格与基座一致。

## 何时用

需要为某数据模型新增「分页列表 + 搜索 + 新增/编辑/删除」的后台页时。

## 生成器

`packages/skills-templates/generate-crud.mjs` 读取资源配置生成后端模块 + 前端页面。

### 1. 写资源配置 `packages/skills-templates/resources/<name>.json`

```json
{
  "modelName": "Notice",              // Prisma model（PascalCase）
  "label": "公告",                     // 中文名，用于标题/提示
  "route": "/system/notice",          // 前端路由
  "permissionPrefix": "system:notice",// 权限前缀 → :list/:add/:edit/:delete
  "fields": [
    { "prop": "title", "label": "标题", "type": "input", "search": true, "required": true, "column": true },
    { "prop": "type", "label": "类型", "type": "select",
      "options": [{ "label": "通知", "value": 1 }, { "label": "公告", "value": 2 }], "column": true },
    { "prop": "content", "label": "内容", "type": "textarea" },
    { "prop": "status", "label": "状态", "type": "switch", "column": true }
  ]
}
```

字段属性：
- `type`: `input` | `textarea` | `select` | `switch` | `number`（映射到 CrudModal 控件）
- `search`: 出现在顶部搜索栏（仅字符串字段作 keyword 模糊查询）
- `required`: 表单必填校验
- `column`: 出现在表格列（`switch`→启用/禁用 tag，`select`→按 options 显示 label）

### 2. Prisma 里先有对应 model

在 `apps/server/prisma/schema.prisma` 添加 `model <ModelName>`（至少含 `id Int @id`），然后：
```bash
pnpm --filter @yang-admin/server exec prisma migrate dev --name add_<name>
```

### 3. 运行生成器

```bash
node packages/skills-templates/generate-crud.mjs <name>
```

产出：
- 后端 `apps/server/src/modules/<name>/`（dto / service / controller / module，含 `@RequirePermission` 与分页搜索）
- 前端 `apps/web/src/api/<name>.ts` + `apps/web/src/views/<name>/index.vue`（ProTable + CrudModal，含 `v-permission`）

### 4. 手动接线（生成器不自动改这两处，避免误伤）

1. `apps/server/src/app.module.ts`：`imports` 里加 `<Name>Module`
2. 通过后台「菜单管理」新增：目录/菜单路由（`component: <name>/index`）+ 四个按钮权限（`<prefix>:list/add/edit/delete`）。或在 `prisma/seed.ts` 用 `buildPage()` 追加后重跑 seed。

### 5. 验证

```bash
pnpm --filter @yang-admin/server build && pnpm --filter @yang-admin/web build
```
两端 build 通过即可；启动后登录到该菜单页测试增删改查。

## 约定

- 后端响应统一 `{ code, message, data }`（由全局拦截器包装，service 直接返回数据）。
- 权限：接口用 `@RequirePermission`，前端按钮用 `v-permission`，两者的 code 必须与菜单里的按钮权限一致。
- 前端表格/表单一律用 `@/components/pro` 的 ProTable / CrudModal，不手写 el-table/el-form 重复样板。
