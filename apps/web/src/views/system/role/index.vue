<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { ProTable, CrudModal, type ProColumn, type FormField } from '@/components/pro';
import {
  getRolesApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
  getMenuTreeApi,
  type RoleItem,
} from '@/api/system';
import type { MenuNode } from '@/api/auth';

const tableRef = ref<InstanceType<typeof ProTable>>();
const menuTree = ref<MenuNode[]>([]);

const searchFields: FormField[] = [
  { prop: 'keyword', label: '关键字', placeholder: '角色名 / 标识' },
];

const columns: ProColumn[] = [
  { prop: 'id', label: 'ID', width: 70 },
  { prop: 'name', label: '角色名称', minWidth: 140 },
  { prop: 'code', label: '标识', minWidth: 120 },
  { prop: 'remark', label: '备注', minWidth: 160, showOverflowTooltip: true },
  { label: '菜单数', width: 90, formatter: (r) => String((r.menuIds as number[])?.length ?? 0) },
  { label: '状态', width: 90, tag: (r) => ({ text: r.status === 1 ? '启用' : '禁用', type: r.status === 1 ? 'success' : 'info' }) },
  { label: '操作', width: 150, fixed: 'right', slot: 'action' },
];

const dialogVisible = ref(false);
const isEdit = ref(false);
const editId = ref<number>();
const model = reactive<Record<string, unknown>>({});

const dialogFields = computed<FormField[]>(() => [
  { prop: 'name', label: '角色名称', rules: [{ required: true, message: '请输入角色名称', trigger: 'blur' }] },
  { prop: 'code', label: '标识', rules: [{ required: true, message: '请输入标识', trigger: 'blur' }], props: { disabled: isEdit.value } },
  { prop: 'remark', label: '备注', type: 'textarea' },
  {
    prop: 'menuIds',
    label: '菜单权限',
    type: 'treeSelect',
    treeData: menuTree.value,
    props: {
      multiple: true,
      showCheckbox: true,
      nodeKey: 'id',
      checkStrictly: true,
      props: { label: 'title', children: 'children' },
    },
  },
  { prop: 'status', label: '状态', type: 'switch', props: { activeValue: 1, inactiveValue: 0 } },
]);

function openCreate() {
  isEdit.value = false;
  editId.value = undefined;
  Object.keys(model).forEach((k) => delete model[k]);
  Object.assign(model, { status: 1, menuIds: [] });
  dialogVisible.value = true;
}

function openEdit(row: RoleItem | Record<string, any>) {
  isEdit.value = true;
  editId.value = row.id;
  Object.keys(model).forEach((k) => delete model[k]);
  Object.assign(model, {
    name: row.name,
    code: row.code,
    remark: row.remark,
    status: row.status,
    menuIds: [...(row.menuIds || [])],
  });
  dialogVisible.value = true;
}

async function submit(data: Record<string, unknown>) {
  if (isEdit.value && editId.value) {
    await updateRoleApi(editId.value, data);
  } else {
    await createRoleApi(data);
  }
}

async function onDelete(row: RoleItem | Record<string, any>) {
  await ElMessageBox.confirm(`确定删除角色「${row.name}」吗？`, '提示', { type: 'warning' });
  await deleteRoleApi(row.id);
  ElMessage.success('删除成功');
  tableRef.value?.reload();
}

onMounted(async () => {
  menuTree.value = await getMenuTreeApi();
});
</script>

<template>
  <div>
  <ProTable
    ref="tableRef"
    :columns="columns"
    :search-fields="searchFields"
    :request="getRolesApi as any"
  >
    <template #toolbar>
      <el-button v-permission="'system:role:add'" type="primary" :icon="Plus" @click="openCreate">
        新增角色
      </el-button>
    </template>
    <template #col-action="{ row }">
      <el-button v-permission="'system:role:edit'" size="small" text type="primary" @click="openEdit(row)">编辑</el-button>
      <el-button v-permission="'system:role:delete'" size="small" text type="danger" @click="onDelete(row)">删除</el-button>
    </template>
  </ProTable>

  <CrudModal
    v-model="dialogVisible"
    :title="isEdit ? '编辑角色' : '新增角色'"
    :fields="dialogFields"
    :model="model"
    :submit="submit"
    @submitted="tableRef?.reload()"
  />
  </div>
</template>
