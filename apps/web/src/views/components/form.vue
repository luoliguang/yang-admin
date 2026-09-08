<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { PageHeader, CrudModal, DemoBlock, type FormField } from '@/components/pro';

const visible = ref(false);
const model = reactive<Record<string, any>>({ status: 1 });

const fields: FormField[] = [
  { prop: 'name', label: '名称', rules: [{ required: true, message: '请输入名称', trigger: 'blur' }] },
  { prop: 'type', label: '类型', type: 'select', options: [
    { label: '类型 A', value: 'a' }, { label: '类型 B', value: 'b' },
  ] },
  { prop: 'count', label: '数量', type: 'number', span: 12 },
  { prop: 'status', label: '启用', type: 'switch', span: 12, props: { activeValue: 1, inactiveValue: 0 } },
  { prop: 'remark', label: '备注', type: 'textarea' },
];

function open() {
  visible.value = true;
}
function submit(data: Record<string, unknown>) {
  ElMessage.success('提交：' + JSON.stringify(data));
  return Promise.resolve();
}

const code = `<CrudModal v-model="visible" title="编辑" :fields="fields" :model="model" :submit="submit" />

const fields: FormField[] = [
  { prop: 'name', label: '名称', rules: [{ required: true, message: '请输入名称', trigger: 'blur' }] },
  { prop: 'type', label: '类型', type: 'select', options: [...] },
  { prop: 'count', label: '数量', type: 'number', span: 12 },
  { prop: 'status', label: '启用', type: 'switch', span: 12, props: { activeValue: 1, inactiveValue: 0 } },
  { prop: 'remark', label: '备注', type: 'textarea' },
];
// 支持类型: input/textarea/password/number/select/switch/date/daterange/treeSelect`;
</script>

<template>
  <div>
    <PageHeader title="CrudModal 表单弹窗" subtitle="配置字段即生成表单，含校验、栅格布局、多种控件。" />
    <DemoBlock title="配置驱动表单" desc="点击打开弹窗，字段全由 fields 配置生成。" :code="code">
      <el-button type="primary" @click="open">打开表单弹窗</el-button>
      <span class="hint">当前 model：{{ JSON.stringify(model) }}</span>
    </DemoBlock>

    <CrudModal v-model="visible" title="示例表单" :fields="fields" :model="model" :submit="submit" />
  </div>
</template>

<style scoped>
.hint {
  margin-left: var(--ya-spacing-lg);
  font-size: var(--ya-font-sm);
  color: var(--ya-text-secondary);
}
</style>
