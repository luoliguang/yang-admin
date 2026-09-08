# 配置驱动组件

全部位于 `apps/web/src/components/pro`，通过 `import { ProTable, CrudModal, SearchForm, Upload } from '@/components/pro'` 使用。核心理念：**写页面 = 写配置**，不重复手写 el-table / el-form 样板。

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
