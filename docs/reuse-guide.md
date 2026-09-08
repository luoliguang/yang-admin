# 基于本基座起新项目

本基座的定位就是「拿来即用」。下面是把它变成你自己新项目的推荐流程。

## 1. 复制并改名

```bash
# 复制整个仓库（不含 .git），作为新项目起点
cp -r yang-admin my-new-project && cd my-new-project && rm -rf .git && git init
```

按需改：根 `package.json`、各包 `name`（`@yang-admin/*` → `@my-project/*`）、README、登录页/侧边栏 Logo 文案。

## 2. 定制设计系统

改 `packages/design-tokens/src/tokens.css`：
- 品牌主色 `--ya-color-primary`（及其明/暗色）
- 中性色阶、圆角、阴影可整体调，全站自动生效
- 默认主题色预设见 `apps/web/src/composables/usePrimaryColor.ts`

## 3. 清理演示内容

本基座内置了演示资源，起新项目时可删：
- 「公告」示例：`apps/server/src/modules/notice`、`apps/web/src/views/notice`、`apps/web/src/api/notice.ts`、schema 里的 `Notice` model、seed 里对应行、`app.module` 的 `NoticeModule`
- 「组件示例」菜单（上传/表格/表单）：seed 里的 demo 目录 + `apps/web/src/views/demo`
- dashboard 的示例图表数据：`apps/web/src/views/dashboard/charts.ts`（换成你的真实统计接口）

保留：用户/角色/菜单三套 RBAC 管理页（这是基座核心）。

## 4. 建你自己的业务模块

用 [CRUD 生成器](crud-generator.md)：加 Prisma model → 写资源配置 → 生成 → 接线。几分钟出一个规范的管理页。

## 5. 部署要点

- 后端：`pnpm build:server` → `node apps/server/dist/main`，配好生产 `.env`（数据库、JWT 密钥务必更换）
- 前端：`pnpm build:web` → 部署 `apps/web/dist` 静态资源，反代 `/api` 与 `/uploads` 到后端
- 数据库：生产用 `prisma migrate deploy`

## 常见改动位置速查

| 想改 | 去哪 |
|---|---|
| 品牌色 / 主题 | `packages/design-tokens/src/tokens.css` |
| 布局（侧边栏/顶栏/标签页） | `apps/web/src/layouts/default` |
| 登录页 | `apps/web/src/views/login` |
| 请求/token/错误处理 | `apps/web/src/utils/request.ts` |
| 权限模型 | `apps/server/prisma/schema.prisma` + `modules/auth` |
| 界面文案多语言 | `apps/web/src/locales` |
