<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { ProTable, CrudModal, type ProColumn, type FormField } from '@/components/pro';
import {
  getUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  getRolesApi,
  type UserItem,
} from '@/api/system';

const tableRef = ref<InstanceType<typeof ProTable>>();
const roleOptions = ref<{ label: string; value: number }[]>([]);

const searchFields: FormField[] = [
  { prop: 'keyword', label: '关键字', placeholder: '用户名 / 昵称' },
];

const columns: ProColumn[] = [
  { prop: 'id', label: 'ID', width: 70 },
  { prop: 'username', label: '用户名', minWidth: 120 },
  { prop: 'nickname', label: '昵称', minWidth: 120 },
  { label: '角色', slot: 'roles', minWidth: 160 },
  { label: '状态', width: 90, tag: (r) => ({ text: r.status === 1 ? '启用' : '禁用', type: r.status === 1 ? 'success' : 'info' }) },
  { prop: 'email', label: '邮箱', minWidth: 180, showOverflowTooltip: true },
  { label: '创建时间', width: 170, formatter: (r) => new Date(r.createdAt as string).toLocaleString() },
  { label: '操作', width: 150, fixed: 'right', slot: 'action' },
];

// ---- 弹窗 ----
const dialogVisible = ref(false);
const isEdit = ref(false);
const editId = ref<number>();
const model = reactive<Record<string, unknown>>({});

const dialogFields = computed<FormField[]>(() => {
  const base: FormField[] = [
    { prop: 'username', label: '用户名', rules: [{ required: true, message: '请输入用户名', trigger: 'blur' }], props: { disabled: isEdit.value } },
  ];
  if (!isEdit.value) {
    base.push({ prop: 'password', label: '密码', type: 'password', rules: [{ required: true, min: 5, message: '密码至少 5 位', trigger: 'blur' }] });
  }
  base.push(
    { prop: 'nickname', label: '昵称' },
    { prop: 'email', label: '邮箱' },
    { prop: 'roleIds', label: '角色', type: 'select', options: roleOptions.value, props: { multiple: true, style: 'width:100%' } },
    { prop: 'status', label: '状态', type: 'switch', props: { activeValue: 1, inactiveValue: 0 } },
  );
  return base;
});

function openCreate() {
  isEdit.value = false;
  editId.value = undefined;
  Object.keys(model).forEach((k) => delete model[k]);
  Object.assign(model, { status: 1, roleIds: [] });
  dialogVisible.value = true;
}

function openEdit(row: UserItem | Record<string, any>) {
  isEdit.value = true;
  editId.value = row.id;
  Object.keys(model).forEach((k) => delete model[k]);
  Object.assign(model, {
    username: row.username,
    nickname: row.nickname,
    email: row.email,
    status: row.status,
    roleIds: (row.roles as { id: number }[]).map((r) => r.id),
  });
  dialogVisible.value = true;
}

async function submit(data: Record<string, unknown>) {
  if (isEdit.value && editId.value) {
    await updateUserApi(editId.value, data);
  } else {
    await createUserApi(data);
  }
}

async function onDelete(row: UserItem | Record<string, any>) {
  await ElMessageBox.confirm(`确定删除用户「${row.username}」吗？`, '提示', { type: 'warning' });
  await deleteUserApi(row.id);
  ElMessage.success('删除成功');
  tableRef.value?.reload();
}

onMounted(async () => {
  const res = await getRolesApi({ page: 1, pageSize: 100 });
  roleOptions.value = res.list.map((r) => ({ label: r.name, value: r.id }));
});
</script>

<template>
  <div>
  <ProTable
    ref="tableRef"
    :columns="columns"
    :search-fields="searchFields"
    :request="getUsersApi as any"
  >
    <template #toolbar>
      <el-button v-permission="'system:user:add'" type="primary" :icon="Plus" @click="openCreate">
        新增用户
      </el-button>
    </template>

    <template #col-roles="{ row }">
      <el-tag v-for="r in row.roles" :key="r.id" size="small" class="tag">{{ r.name }}</el-tag>
    </template>

    <template #col-action="{ row }">
      <el-button v-permission="'system:user:edit'" size="small" text type="primary" @click="openEdit(row)">
        编辑
      </el-button>
      <el-button v-permission="'system:user:delete'" size="small" text type="danger" @click="onDelete(row)">
        删除
      </el-button>
    </template>
  </ProTable>

  <CrudModal
    v-model="dialogVisible"
    :title="isEdit ? '编辑用户' : '新增用户'"
    :fields="dialogFields"
    :model="model"
    :submit="submit"
    @submitted="tableRef?.reload()"
  />
  </div>
</template>

<style scoped>
.tag {
  margin-right: 6px;
}
</style>
