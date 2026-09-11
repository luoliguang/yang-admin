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

从 `@/components/pro` 引入。图表用 `@/components/chart/Chart.vue`。详细用法见 `docs/components.md` 与「组件中心」。下表自动生成：

<!-- COMPONENTS:START -->

> 本表由 `node packages/skills-templates/gen-catalog.mjs` 自动生成，勿手改。共 11 个组件。

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

### ProTable

配置驱动表格：搜索 + 分页 + 工具栏 + 树表，写 columns/request 即可

| prop | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `columns` | `ProColumn[]` | 是 | — | — |
| `request` | `(params: Record<string, unknown>) => Promise<FetchResult>` | 是 | — | — |
| `searchFields` | `FormField[]` | 否 | — | — |
| `rowKey` | `string` | 否 | `'id'` | — |
| `showPagination` | `boolean` | 否 | `true` | — |
| `treeProps` | `Record<string, unknown>` | 否 | — | 树表：传入即启用 |
| `defaultExpandAll` | `boolean` | 否 | — | — |
| `immediate` | `boolean` | 否 | `true` | — |

### SearchForm

配置驱动查询表单，与 ProTable 搭配

| prop | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `fields` | `FormField[]` | 是 | — | — |
| `modelValue` | `Record<string, any>` | 否 | — | — |

### CrudModal

配置驱动的增删改查弹窗（表单项由 fields 描述）

| prop | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `modelValue` | `boolean` | 是 | — | — |
| `title` | `string` | 否 | — | — |
| `fields` | `FormField[]` | 是 | — | — |
| `model` | `Record<string, any>` | 是 | — | — |
| `submit` | `(data: Record<string, unknown>) => Promise<unknown>` | 是 | — | — |
| `labelWidth` | `string` | 否 | — | — |
| `width` | `string` | 否 | `'540px'` | — |

### Upload

图片上传：带 token、预览、体积/类型校验

| prop | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `modelValue` | `string` | 否 | — | — |
| `maxSize` | `number` | 否 | `5` | 最大体积 MB |

### StatCard

KPI 统计卡片：图标 + 数值 + 涨跌

| prop | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `label` | `string` | 是 | — | — |
| `value` | `string \| number` | 是 | — | — |
| `icon` | `Component` | 否 | — | — |
| `color` | `string` | 否 | `'var(--ya-color-primary)'` | — |
| `delta` | `string` | 否 | — | — |
| `up` | `boolean` | 否 | — | — |

### PageHeader

页头：标题 + 副标题 + #extra 操作位

| prop | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `title` | `string` | 是 | — | — |
| `subtitle` | `string` | 否 | — | — |

### DictTag

字典标签：按 value 匹配 options 渲染彩色 el-tag

| prop | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `value` | `string \| number` | 是 | — | — |
| `options` | `DictOption[]` | 是 | — | — |

### StatusDot

状态圆点 + 文字（在线/离线等语义色）

| prop | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `text` | `string` | 否 | — | — |
| `type` | `DotType` | 否 | `'success'` | — |

### Empty

空状态占位，可插入操作按钮

| prop | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `description` | `string` | 否 | — | — |
| `imageSize` | `number` | 否 | `90` | — |

### DemoBlock

组件中心用：实时预览 + 可折叠代码 + 复制为 AI 指令

| prop | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `title` | `string` | 是 | — | — |
| `desc` | `string` | 否 | — | — |
| `code` | `string` | 否 | — | — |

### Playground

组件中心用：实时调 props → 同步生成代码 → 复制为 AI 指令

| prop | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `title` | `string` | 是 | — | — |
| `desc` | `string` | 否 | — | — |
| `controls` | `PlaygroundControl[]` | 是 | — | — |
| `state` | `Record<string, any>` | 是 | — | 父组件持有的响应式属性对象，控件直接改它 |
| `code` | `(state: Record<string, any>) => string` | 否 | — | 依据当前属性生成代码 |

<!-- COMPONENTS:END -->

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
