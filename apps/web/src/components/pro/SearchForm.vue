<script setup lang="ts">
import { reactive, watch } from 'vue';
import { Search, RefreshLeft } from '@element-plus/icons-vue';
import type { FormField } from './types';

const props = defineProps<{
  fields: FormField[];
  modelValue?: Record<string, any>;
}>();
const emit = defineEmits<{
  'update:modelValue': [Record<string, any>];
  search: [];
  reset: [];
}>();

const form = reactive<Record<string, any>>({ ...props.modelValue });

watch(
  form,
  () => emit('update:modelValue', { ...form }),
  { deep: true },
);

function onSearch() {
  emit('search');
}
function onReset() {
  props.fields.forEach((f) => (form[f.prop] = undefined));
  emit('update:modelValue', { ...form });
  emit('reset');
}
</script>

<template>
  <el-form :model="form" inline class="search-form">
    <el-form-item v-for="field in fields" :key="field.prop" :label="field.label">
      <el-select
        v-if="field.type === 'select'"
        v-model="form[field.prop]"
        :placeholder="field.placeholder || '请选择'"
        clearable
        style="width: 180px"
        v-bind="field.props"
      >
        <el-option v-for="o in field.options" :key="String(o.value)" :label="o.label" :value="o.value" />
      </el-select>
      <el-date-picker
        v-else-if="field.type === 'daterange'"
        v-model="form[field.prop]"
        type="daterange"
        range-separator="至"
        start-placeholder="开始"
        end-placeholder="结束"
        v-bind="field.props"
      />
      <el-input
        v-else
        v-model="form[field.prop]"
        :placeholder="field.placeholder || `请输入${field.label}`"
        clearable
        style="width: 180px"
        @keyup.enter="onSearch"
        v-bind="field.props"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :icon="Search" @click="onSearch">查询</el-button>
      <el-button :icon="RefreshLeft" @click="onReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.search-form {
  padding: var(--ya-spacing-lg) var(--ya-spacing-lg) 0;
  background: var(--ya-bg-container);
  border-radius: var(--ya-radius-lg) var(--ya-radius-lg) 0 0;
}
</style>
