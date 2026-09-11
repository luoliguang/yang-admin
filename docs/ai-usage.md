# 用 AI / Agent 使用 yang-admin

本文档讲三件事：**① 各 Agent 怎么接入 ② 每条指令/工具是干什么的 ③ 怎么用本项目搭一个页面**。

yang-admin 给 AI 准备了两层能力：

- **知识层（指令/技能）**：告诉 Agent「有哪些组件、怎么用、什么约定」——通过 `AGENTS.md`（通用）或 Claude 插件技能。
- **工具层（MCP）**：让 Agent 直接调用生成能力——通过 MCP 服务 `yang-admin`（跨 Agent 通用标准）。

> MCP 是跨 Agent 的开放标准，Claude Code / Codex / Cursor 等都能接；差别只在**各自的配置文件位置**。下面分别给出。

---

## 一、各 Agent 接入方式

### Claude Code

**方式 A（推荐，一键装技能）**：
```bash
/plugin marketplace add luoliguang/yang-admin
/plugin install yang-admin@yang-admin
```
装完 Agent 即获得 yang-admin 技能。

**方式 B（在基于本基座的项目内）**：仓库自带 `.mcp.json`，已注册 `yang-admin` MCP 服务，Claude Code 打开项目即可用其工具；`AGENTS.md` 也会被读取。

### Codex（OpenAI Codex CLI）

1. **指令**：Codex 会自动读取项目根目录的 `AGENTS.md`，无需额外配置。
2. **MCP 工具**：在 `~/.codex/config.toml` 增加（路径按你的项目位置调整；以 Codex 最新版语法为准）：
   ```toml
   [mcp_servers.yang-admin]
   command = "node"
   args = ["packages/skills-templates/mcp-server.mjs"]
   ```
   在项目根目录启动 Codex，即可调用 `list_components` / `generate_crud` 等工具。

### Cursor

1. **指令**：Cursor 读取根目录 `AGENTS.md`（或把 `AGENTS.md` 内容放进 `.cursor/rules`）。
2. **MCP 工具**：新建 `.cursor/mcp.json`：
   ```json
   {
     "mcpServers": {
       "yang-admin": {
         "command": "node",
         "args": ["packages/skills-templates/mcp-server.mjs"]
       }
     }
   }
   ```

### 任意 MCP 客户端（通用）

只要支持 MCP 的 Agent，都用同一条命令启动本服务：
```
command: node
args:    packages/skills-templates/mcp-server.mjs
```
再把 `AGENTS.md` 作为系统/项目指令提供给它即可。

> **注意**：MCP 的生成类工具（`generate_crud` / `generate_view`）会把代码写进**当前项目**，因此需在**基于 yang-admin 的完整仓库**里运行；只想让 Agent 读组件目录（`list_components`）则任何环境都可用。

---

## 二、指令 / 工具详解

### pnpm 脚本（在仓库根目录运行）

| 指令 | 作用 |
|---|---|
| `pnpm install` | 安装 monorepo 全部依赖 |
| `pnpm dev:web` | 启动前端开发服务器（http://localhost:5173） |
| `pnpm dev:server` | 启动后端（http://localhost:3000/api，文档 `/api/docs`） |
| `pnpm build:web` / `pnpm build:server` | 分别构建前端 / 后端（含类型检查） |
| `pnpm build` | 依次构建前后端 |
| `pnpm build:demo` | 以 Mock 模式构建前端（在线 Demo 用，`VITE_USE_MOCK=true`，不依赖后端） |
| `pnpm gen:catalog` | 扫描 `@/components/pro` 源码，重新生成组件速查表（同步到 catalog / README / 插件 reference） |
| `pnpm check` | `gen:catalog` + 两端构建/类型检查——**提交前一键自检** |

### 代码生成器（脚本）

| 指令 | 作用 | 前置 |
|---|---|---|
| `node packages/skills-templates/generate-crud.mjs <name>` | 依 `resources/<name>.json` 生成后端模块（dto/service/controller/module，含权限与分页搜索）+ 前端 `api/<name>.ts` 与 `views/<name>/index.vue`（ProTable + CrudModal） | 先写好 `resources/<name>.json`，并在 `schema.prisma` 建对应 model |
| `node packages/skills-templates/generate-view.mjs <name>` | 依 `views/<name>.json` 的「积木(blocks)」生成一个可运行组合页面 `.vue`（页头 / 统计卡片 / 图表 / 表格 / 描述列表） | 先写好 `views/<name>.json` |
| `node packages/skills-templates/gen-catalog.mjs` | 从组件源码自动生成组件速查表，注入 catalog.md、README、插件 reference（单一数据源） | 无 |

> 生成器不会自动改 `app.module.ts` 和菜单（避免误伤），需按提示手动接线。

### MCP 工具（Agent 通过 MCP 调用）

| 工具 | 作用 |
|---|---|
| `list_components` | 返回组件目录（catalog.md）：可用组件、props、页面积木 |
| `list_resources` | 列出已有的 CRUD 资源配置 |
| `scaffold_resource` | 写入一份新的 CRUD 资源配置 json |
| `generate_crud` | 依资源配置生成后端模块 + 前端 CRUD 页 |
| `scaffold_view` | 写入一份视图规格 json（blocks 见 catalog） |
| `generate_view` | 依视图规格生成一个组合页面 .vue |

---

## 三、怎么用本项目搭一个页面（完整示例）

以「新增一个**订单管理**列表页」为例：

1. **起服务**（首次）
   ```bash
   pnpm install
   cp apps/server/.env.example apps/server/.env   # 填 DATABASE_URL
   pnpm --filter @yang-admin/server exec prisma migrate dev
   pnpm --filter @yang-admin/server prisma:seed
   pnpm dev:server   # 一个终端
   pnpm dev:web      # 另一个终端；默认账号 admin / admin123
   ```

2. **让 Agent 干活**（自然语言即可）
   > 「用 yang-admin 加一个订单管理页：字段有订单号、客户、金额、状态（启用/禁用），要能搜索订单号、分页、增删改查。」

   Agent 会：读组件目录 → 写 `resources/order.json` → 提示你在 Prisma 建 `Order` model → 跑 `generate-crud` → 提示接线（`app.module.ts` + 菜单权限）。

3. **手动接线**（生成器不碰的两处）
   - `apps/server/src/app.module.ts` 的 `imports` 加 `OrderModule`
   - 后台「菜单管理」加菜单（`component: order/index`）+ `order:list/add/edit/delete` 按钮权限

4. **验证**
   ```bash
   pnpm check
   ```
   通过后登录到该菜单页测试增删改查。

> 不想用生成器？直接让 Agent「按组件目录手写这个页面」也行——它会用 `ProTable` + `CrudModal` 配置出同样风格的页面。

---

## 常见问题

- **我不是从 yang-admin 起的项目，能用吗？** 组件目录知识（`list_components` / `AGENTS.md`）随时可用作参考；但生成器依赖本仓库目录结构，非完整仓库请让 Agent 按目录手写组件。
- **在线体验？** https://yang-admin.vercel.app （Mock 数据，登录页点「游客体验」免登录逛）。
- **组件目录会过时吗？** 不会——`gen:catalog` 从源码生成，`pnpm check` 会带着一起跑，人与 AI 看到同一份真相。
