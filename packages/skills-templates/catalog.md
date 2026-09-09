# yang-admin 组件目录（vibecoding 生成用）

给「视图生成器」和 AI 参考：本基座有哪些积木、如何组合成一个页面。用自然语言描述页面 → 组出下面的**视图规格(view spec)** → `generate-view.mjs` 生成可运行 `.vue`。

## 视图规格格式

`packages/skills-templates/views/<name>.json`：

```json
{
  "name": "order-overview",
  "title": "订单概览",
  "blocks": [ { "type": "...", ... } ]
}
```

## 可用 blocks（页面积木）

| type | 说明 | 关键字段 |
|---|---|---|
| `page-header` | 页头 | `title`, `subtitle` |
| `stat-cards` | KPI 统计卡片行 | `items: [{ label, value, color, icon, delta, up }]` |
| `pro-table` | 配置驱动表格（示例数据，可换真实接口） | `columns: [{ prop, label, tag? }]` |
| `chart` | 图表 | `kind: line\|bar\|pie`, `title` |
| `descriptions` | 详情描述列表 | `column`, `items: [{ label, value }]` |

`icon` 取值：`TrendCharts` `User` `ShoppingCart` `Money` `Odometer`（Element Plus 图标名）。
`pro-table` 的列 `tag: true` 会渲染成 启用/禁用 状态标签。

## 底层可复用组件（写自定义页面时直接用）

从 `@/components/pro` 引入：`ProTable` `SearchForm` `CrudModal` `Upload` `StatCard` `PageHeader` `DictTag` `StatusDot` `Empty` `Playground` `DemoBlock`。图表用 `@/components/chart/Chart.vue`。详细用法见 `docs/components.md` 与「组件中心」。

## 生成流程

1. 写规格 `views/<name>.json`（或用 MCP `scaffold_view`）
2. `node packages/skills-templates/generate-view.mjs <name>`（或 MCP `generate_view`）
3. 后台「菜单管理」挂路由，`component` 填 `<name>/index`
4. `pnpm --filter @yang-admin/web build` 验证

## 示例规格

```json
{
  "name": "order-overview",
  "title": "订单概览",
  "blocks": [
    { "type": "page-header", "title": "订单概览", "subtitle": "示例组合页" },
    { "type": "stat-cards", "items": [
      { "label": "订单数", "value": "9,214", "color": "#4f46e5", "icon": "ShoppingCart", "delta": "+5%", "up": true },
      { "label": "销售额", "value": "¥642,180", "color": "#22c55e", "icon": "Money", "delta": "+21%", "up": true }
    ]},
    { "type": "chart", "kind": "line", "title": "订单趋势" },
    { "type": "pro-table", "columns": [
      { "prop": "orderNo", "label": "订单号" },
      { "prop": "customer", "label": "客户" },
      { "prop": "status", "label": "状态", "tag": true }
    ]}
  ]
}
```
