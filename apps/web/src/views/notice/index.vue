<script setup lang="ts">
// ⚙️ 由 generate-crud 生成，可继续手动编辑
import { reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { ProTable, CrudModal, type ProColumn, type FormField } from '@/components/pro';
import { getNoticesApi, createNoticeApi, updateNoticeApi, deleteNoticeApi, type NoticeItem } from '@/api/notice';

const tableRef = ref<InstanceType<typeof ProTable>>();

const columns: ProColumn[] = [
  { prop: 'id', label: 'ID', width: 70 },
  { prop: 'title', label: '标题', minWidth: 140, showOverflowTooltip: true },
  { prop: 'type', label: '类型', formatter: (r) => (({ 1: '通知', 2: '公告' } as Record<string, string>)[String(r.type)] ?? r.type) as string },
  { label: '状态', width: 90, tag: (r) => ({ text: r.status === 1 ? '启用' : '禁用', type: r.status === 1 ? 'success' : 'info' }) },
  { label: '操作', width: 150, fixed: 'right', slot: 'action' },
];

const searchFields: FormField[] = [
  { prop: 'title', label: '标题' },
];

const dialogVisible = ref(false);
const isEdit = ref(false);
const editId = ref<number>();
const model = reactive<Record<string, any>>({});

const dialogFields: FormField[] = [
  { prop: 'title', label: '标题', rules: [{ required: true, message: '请输入标题', trigger: 'blur' }] },
  { prop: 'type', label: '类型', type: 'select', options: [{"label":"通知","value":1},{"label":"公告","value":2}] },
  { prop: 'content', label: '内容', type: 'textarea' },
  { prop: 'status', label: '状态', type: 'switch', props: { activeValue: 1, inactiveValue: 0 } },
];

function openCreate() {
  isEdit.value = false;
  editId.value = undefined;
  Object.keys(model).forEach((k) => delete model[k]);
  dialogVisible.value = true;
}
function openEdit(row: NoticeItem | Record<string, any>) {
  isEdit.value = true;
  editId.value = row.id;
  Object.keys(model).forEach((k) => delete model[k]);
  Object.assign(model, row);
  dialogVisible.value = true;
}
async function submit(data: Record<string, unknown>) {
  if (isEdit.value && editId.value) await updateNoticeApi(editId.value, data);
  else await createNoticeApi(data);
}
async function onDelete(row: NoticeItem | Record<string, any>) {
  await ElMessageBox.confirm('确定删除该公告吗？', '提示', { type: 'warning' });
  await deleteNoticeApi(row.id);
  ElMessage.success('删除成功');
  tableRef.value?.reload();
}
</script>

<template>
  <ProTable ref="tableRef" :columns="columns" :search-fields="searchFields" :request="getNoticesApi as any">
    <template #toolbar>
      <el-button v-permission="'system:notice:add'" type="primary" :icon="Plus" @click="openCreate">新增公告</el-button>
    </template>
    <template #col-action="{ row }">
      <el-button v-permission="'system:notice:edit'" size="small" text type="primary" @click="openEdit(row)">编辑</el-button>
      <el-button v-permission="'system:notice:delete'" size="small" text type="danger" @click="onDelete(row)">删除</el-button>
    </template>
  </ProTable>

  <CrudModal
    v-model="dialogVisible"
    :title="isEdit ? '编辑公告' : '新增公告'"
    :fields="dialogFields"
    :model="model"
    :submit="submit"
    @submitted="tableRef?.reload()"
  />
</template>
