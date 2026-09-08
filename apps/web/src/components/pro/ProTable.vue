<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Refresh } from '@element-plus/icons-vue';
import type { ProColumn, FormField, FetchResult } from './types';
import SearchForm from './SearchForm.vue';

const props = withDefaults(
  defineProps<{
    columns: ProColumn[];
    request: (params: Record<string, unknown>) => Promise<FetchResult>;
    searchFields?: FormField[];
    rowKey?: string;
    showPagination?: boolean;
    /** 树表：传入即启用 */
    treeProps?: Record<string, unknown>;
    defaultExpandAll?: boolean;
    immediate?: boolean;
  }>(),
  {
    rowKey: 'id',
    showPagination: true,
    immediate: true,
  },
);

const loading = ref(false);
const data = ref<Record<string, unknown>[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const searchParams = ref<Record<string, unknown>>({});

const tagType = (t?: string) => t as never;

async function fetchData() {
  loading.value = true;
  try {
    const params: Record<string, unknown> = { ...searchParams.value };
    if (props.showPagination) {
      params.page = page.value;
      params.pageSize = pageSize.value;
    }
    const res = await props.request(params);
    data.value = res.list;
    total.value = res.total ?? res.list.length;
  } finally {
    loading.value = false;
  }
}

function onSearch() {
  page.value = 1;
  fetchData();
}
function onReset() {
  page.value = 1;
  fetchData();
}
function onSizeChange(size: number) {
  pageSize.value = size;
  fetchData();
}
function onPageChange(p: number) {
  page.value = p;
  fetchData();
}

/** 供父组件调用：刷新（保持当前页） */
function reload() {
  fetchData();
}
/** 重置到第一页刷新 */
function refresh() {
  page.value = 1;
  fetchData();
}

defineExpose({ reload, refresh });

onMounted(() => {
  if (props.immediate) fetchData();
});
</script>

<template>
  <div class="pro-table">
    <SearchForm
      v-if="searchFields?.length"
      v-model="searchParams"
      :fields="searchFields"
      @search="onSearch"
      @reset="onReset"
    />

    <div class="pro-table__toolbar">
      <div class="pro-table__toolbar-left">
        <slot name="toolbar" />
      </div>
      <div class="pro-table__toolbar-right">
        <el-tooltip content="刷新">
          <el-button :icon="Refresh" circle @click="reload" />
        </el-tooltip>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="data"
      :row-key="rowKey"
      :tree-props="treeProps"
      :default-expand-all="defaultExpandAll"
      stripe
      class="pro-table__table"
    >
      <template v-for="col in columns" :key="col.prop || col.label">
        <el-table-column
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :min-width="col.minWidth"
          :align="col.align"
          :fixed="col.fixed"
          :sortable="col.sortable"
          :show-overflow-tooltip="col.showOverflowTooltip"
        >
          <template #default="{ row }">
            <!-- 自定义插槽列 -->
            <slot v-if="col.slot" :name="`col-${col.slot}`" :row="row" />
            <!-- tag 列 -->
            <el-tag v-else-if="col.tag" :type="tagType(col.tag(row).type)">
              {{ col.tag(row).text }}
            </el-tag>
            <!-- 格式化列 -->
            <span v-else-if="col.formatter">{{ col.formatter(row) }}</span>
            <!-- 默认列 -->
            <span v-else>{{ col.prop ? row[col.prop] : '' }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <div v-if="showPagination" class="pro-table__pager">
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="onSizeChange"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.pro-table {
  background: var(--ya-bg-container);
  border: 1px solid var(--ya-border-color-light);
  border-radius: var(--ya-radius-lg);
  box-shadow: var(--ya-shadow-sm);
  overflow: hidden;
}
.pro-table__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--ya-spacing-lg);
}
.pro-table__toolbar-left {
  display: flex;
  gap: var(--ya-spacing-sm);
}
.pro-table__table {
  padding: 0 var(--ya-spacing-lg);
}
.pro-table__pager {
  display: flex;
  justify-content: flex-end;
  padding: var(--ya-spacing-lg);
}
</style>
