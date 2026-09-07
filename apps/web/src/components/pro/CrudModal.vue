<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage, type FormInstance } from 'element-plus';
import type { FormField } from './types';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    fields: FormField[];
    // 动态表单模型，字段值类型不定，用 any 以支持任意控件双向绑定
    model: Record<string, any>;
    submit: (data: Record<string, unknown>) => Promise<unknown>;
    labelWidth?: string;
    width?: string;
  }>(),
  { title: '', labelWidth: '90px', width: '540px' },
);
const emit = defineEmits<{
  'update:modelValue': [boolean];
  submitted: [];
}>();

const formRef = ref<FormInstance>();
const submitting = ref(false);

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const rulesMap = computed(() => {
  const map: Record<string, unknown> = {};
  props.fields.forEach((f) => {
    if (f.rules) map[f.prop] = f.rules;
  });
  return map;
});

async function onConfirm() {
  await formRef.value?.validate();
  submitting.value = true;
  try {
    await props.submit({ ...props.model });
    ElMessage.success('操作成功');
    visible.value = false;
    emit('submitted');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" :width="width" destroy-on-close append-to-body>
    <el-form ref="formRef" :model="model" :rules="rulesMap as any" :label-width="labelWidth">
      <el-row :gutter="16">
        <el-col v-for="field in fields" :key="field.prop" :span="field.span || 24">
          <el-form-item :label="field.label" :prop="field.prop">
            <!-- select -->
            <el-select
              v-if="field.type === 'select'"
              v-model="model[field.prop]"
              :placeholder="field.placeholder || '请选择'"
              style="width: 100%"
              v-bind="field.props"
            >
              <el-option v-for="o in field.options" :key="String(o.value)" :label="o.label" :value="o.value" />
            </el-select>
            <!-- multiple select via props multiple -->
            <!-- switch -->
            <el-switch
              v-else-if="field.type === 'switch'"
              v-model="model[field.prop]"
              v-bind="field.props"
            />
            <!-- number -->
            <el-input-number
              v-else-if="field.type === 'number'"
              v-model="model[field.prop] as number"
              controls-position="right"
              v-bind="field.props"
            />
            <!-- textarea -->
            <el-input
              v-else-if="field.type === 'textarea'"
              v-model="model[field.prop] as string"
              type="textarea"
              :rows="3"
              :placeholder="field.placeholder"
              v-bind="field.props"
            />
            <!-- password -->
            <el-input
              v-else-if="field.type === 'password'"
              v-model="model[field.prop] as string"
              type="password"
              show-password
              :placeholder="field.placeholder"
              v-bind="field.props"
            />
            <!-- treeSelect -->
            <el-tree-select
              v-else-if="field.type === 'treeSelect'"
              v-model="model[field.prop]"
              :data="field.treeData"
              check-strictly
              :render-after-expand="false"
              style="width: 100%"
              :placeholder="field.placeholder || '请选择'"
              v-bind="field.props"
            />
            <!-- input 默认 -->
            <el-input
              v-else
              v-model="model[field.prop] as string"
              :placeholder="field.placeholder || `请输入${field.label}`"
              v-bind="field.props"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="onConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>
