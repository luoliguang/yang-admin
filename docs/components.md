# 配置驱动组件

全部位于 `apps/web/src/components/pro`，通过 `import { ProTable, CrudModal, SearchForm, Upload, StatCard, PageHeader, DictTag } from '@/components/pro'` 使用。核心理念：**写页面 = 写配置**，不重复手写 el-table / el-form 样板。

> 💡 **最快的上手方式**：启动项目后登录，进「组件中心」菜单——每个组件都有实时预览 + 可复制代码，直接拷走用。本文是文字版速查。

参考完整示例：`apps/web/src/views/system/user/index.vue`（用户管理 = 搜索 + 分页 + 增删改查 + 多选角色 + 状态开关）。

---

## ProTable

配置驱动表格，内置搜索栏、工具栏、分页、loading。

```vue
<ProTable
  ref="tableRef"
  :columns="columns"
  :search-fields="searchFields"
  :request="getUsersApi as any"
>
  <template #toolbar>
    <el-button v-permission="'system:user:add'" type="primary" @click="openCreate">新增</el-button>
  </template>
  <template #col-action="{ row }">
    <el-button text type="primary" @click="openEdit(row)">编辑</el-button>
  </template>
</ProTable>
```

**Props**

| Prop | 说明 |
|---|---|
| `columns` | `ProColumn[]`，见下 |
| `request` | `(params) => Promise<{ list, total }>`，接收 `{ page, pageSize, ...搜索项 }` |
| `searchFields` | `FormField[]`，传入即在顶部渲染搜索栏 |
| `rowKey` | 行主键，默认 `id` |
| `showPagination` | 默认 `true`；树表设 `false` |
| `treeProps` / `defaultExpandAll` | 树表用（见菜单管理页） |

**ProColumn**

```ts
{ prop, label, width?, minWidth?, align?, fixed?, sortable?, showOverflowTooltip?,
  slot?,            // 具名插槽 #col-<slot>
  formatter?,       // (row) => string
  tag? }            // (row) => { text, type } 渲染为 el-tag
```

**暴露方法**：`tableRef.value.reload()`（保持页码刷新）、`refresh()`（回第一页）。

---

## CrudModal

配置驱动的新增/编辑弹窗。

```vue
<CrudModal
  v-model="dialogVisible"
  :title="isEdit ? '编辑' : '新增'"
  :fields="dialogFields"
  :model="model"
  :submit="submit"
  @submitted="tableRef?.reload()"
/>
```

`model` 是父组件持有的 `reactive` 对象；`submit(data)` 返回 Promise（内部区分新增/编辑调用不同 API）。

**FormField**

```ts
{ prop, label,
  type?,          // input | textarea | password | number | select | switch | date | daterange | treeSelect
  options?,       // select 选项 [{ label, value }]
  rules?,         // Element 校验规则
  span?,          // 栅格 1-24，默认 24
  props?,         // 透传底层组件属性（如 multiple、activeValue）
  treeData? }     // treeSelect 树数据
```

菜单授权的复选树示例见 `views/system/role/index.vue`（`type: 'treeSelect'` + `props: { multiple, showCheckbox, nodeKey, props: { label:'title' } }`）。

---

## SearchForm

一般无需单独用——`ProTable` 传 `searchFields` 即自动集成。字段类型支持 `input` / `select` / `daterange`。

---

## Upload

图片上传（走后端 `/upload`，自动带 token）。

```vue
<Upload v-model="imageUrl" :max-size="5" />
```

示例见 `views/demo/upload.vue`。

---

## Chart

主题感知的 ECharts 封装，明暗切换自动重建、配色随品牌色。

```vue
<Chart :option="trendOption" height="300px" />
```

- 图表按需注册见 `components/chart/echarts.ts`
- 中国地图 choropleth 做法见 `views/dashboard/charts.ts` 的 `mapOption()`（含区域名归一化）

---

## 基础组件

后台高频小组件，直接引用即可：

```vue
<!-- KPI 统计卡片 -->
<StatCard label="访问量" :value="128430" :icon="TrendCharts" color="#4f46e5" delta="+12.5%" up />

<!-- 页头（右侧操作插槽） -->
<PageHeader title="标题" subtitle="副标题"><template #extra><el-button>操作</el-button></template></PageHeader>

<!-- 字典标签：按 value 匹配 options 显示带色标签 -->
<DictTag :value="row.status" :options="[{ label:'启用', value:1, type:'success' }, { label:'禁用', value:0, type:'info' }]" />
```

## Playground（交互演练场）

`Playground` 让组件的 props/样式**可视化实时调试**：配一组控件（开关/下拉/颜色/滑块/文本），左侧实时预览，下方代码同步生成、可复制。示例见「组件中心 → 交互演练场」(`views/components/playground.vue`)。

```vue
<Playground title="StatCard" :controls="controls" :state="state" :code="genCode">
  <template #default="{ state }">
    <StatCard :label="state.label" :color="state.color" ... />
  </template>
</Playground>

// controls: PlaygroundControl[]  type = switch|select|text|number|color|slider|segmented
// state: 父组件持有的响应式对象，控件直接改它
// code(state): 依据当前属性返回代码字符串
```

## DemoBlock（组件中心用）

`DemoBlock` 是「组件中心」里包裹每个示例的容器：标题 + 说明 + 实时预览 + 可折叠可复制代码。给新组件写示例时用它即可保持一致体验。

```vue
<DemoBlock title="组件名" desc="说明" :code="codeString">
  <YourComponent />
</DemoBlock>
```
