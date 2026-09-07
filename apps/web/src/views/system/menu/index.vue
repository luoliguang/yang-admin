<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { ProTable, CrudModal, type ProColumn, type FormField, type FetchResult } from '@/components/pro';
import { getMenuTreeApi, createMenuApi, updateMenuApi, deleteMenuApi } from '@/api/system';
import type { MenuNode } from '@/api/auth';

const tableRef = ref<InstanceType<typeof ProTable>>();
const menuTree = ref<MenuNode[]>([]);
const typeText = ['目录', '菜单', '按钮'];

async function loadTree(): Promise<FetchResult> {
  const tree = await getMenuTreeApi();
  menuTree.value = tree;
  return { list: tree as unknown as Record<string, unknown>[], total: tree.length };
}

const columns: ProColumn[] = [
  { prop: 'title', label: '名称', minWidth: 180 },
  { label: '类型', width: 90, tag: (r) => ({ text: typeText[r.type as number], type: r.type === 2 ? 'warning' : r.type === 0 ? 'info' : 'primary' }) },
  { prop: 'path', label: '路由', minWidth: 160 },
  { prop: 'permission', label: '权限标识', minWidth: 160 },
  { prop: 'sort', label: '排序', width: 80 },
  { label: '操作', width: 150, fixed: 'right', slot: 'action' },
];

const dialogVisible = ref(false);
const isEdit = ref(false);
const editId = ref<number>();
const model = reactive<Record<string, unknown>>({});

const dialogFields = computed<FormField[]>(() => [
  {
    prop: 'parentId',
    label: '上级菜单',
    type: 'treeSelect',
    treeData: menuTree.value,
    placeholder: '不选则为顶级',
    props: { nodeKey: 'id', checkStrictly: true, clearable: true, props: { label: 'title', children: 'children' } },
  },
  { prop: 'type', label: '类型', type: 'select', options: [
    { label: '目录', value: 0 }, { label: '菜单', value: 1 }, { label: '按钮', value: 2 },
  ], rules: [{ required: true, message: '请选择类型', trigger: 'change' }] },
  { prop: 'title', label: '名称', rules: [{ required: true, message: '请输入名称', trigger: 'blur' }], span: 12 },
  { prop: 'sort', label: '排序', type: 'number', defaultValue: 0, span: 12 },
  { prop: 'name', label: '路由名', span: 12 },
  { prop: 'icon', label: '图标', span: 12 },
  { prop: 'path', label: '路由路径' },
  { prop: 'component', label: '组件路径', placeholder: '如 system/user/index' },
  { prop: 'permission', label: '权限标识', placeholder: '如 system:user:add' },
]);

function openCreate() {
  isEdit.value = false;
  editId.value = undefined;
  Object.keys(model).forEach((k) => delete model[k]);
  Object.assign(model, { type: 1, sort: 0 });
  dialogVisible.value = true;
}

function openEdit(row: MenuNode | Record<string, any>) {
  isEdit.value = true;
  editId.value = row.id;
  Object.keys(model).forEach((k) => delete model[k]);
  Object.assign(model, {
    parentId: row.parentId ?? undefined,
    type: row.type,
    title: row.title,
    name: row.name,
    icon: row.icon,
    path: row.path,
    component: row.component,
    permission: row.permission,
    sort: (row as { sort?: number }).sort ?? 0,
  });
  dialogVisible.value = true;
}

async function submit(data: Record<string, unknown>) {
  if (isEdit.value && editId.value) {
    await updateMenuApi(editId.value, data);
  } else {
    await createMenuApi(data);
  }
}

async function onDelete(row: MenuNode | Record<string, any>) {
  await ElMessageBox.confirm(`确定删除「${row.title}」及其子项吗？`, '提示', { type: 'warning' });
  await deleteMenuApi(row.id);
  ElMessage.success('删除成功');
  tableRef.value?.reload();
}
</script>

<template>
  <ProTable
    ref="tableRef"
    :columns="columns"
    :request="loadTree"
    :show-pagination="false"
    row-key="id"
    :tree-props="{ children: 'children' }"
    default-expand-all
  >
    <template #toolbar>
      <el-button v-permission="'system:menu:add'" type="primary" :icon="Plus" @click="openCreate">
        新增菜单
      </el-button>
    </template>
    <template #col-action="{ row }">
      <el-button v-permission="'system:menu:edit'" size="small" text type="primary" @click="openEdit(row)">编辑</el-button>
      <el-button v-permission="'system:menu:delete'" size="small" text type="danger" @click="onDelete(row)">删除</el-button>
    </template>
  </ProTable>

  <CrudModal
    v-model="dialogVisible"
    :title="isEdit ? '编辑菜单' : '新增菜单'"
    :fields="dialogFields"
    :model="model"
    :submit="submit"
    width="620px"
    @submitted="tableRef?.reload()"
  />
</template>
