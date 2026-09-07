<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getMenuTreeApi } from '@/api/system';
import type { MenuNode } from '@/api/auth';

const loading = ref(false);
const tree = ref<MenuNode[]>([]);
const typeText = ['目录', '菜单', '按钮'];

async function load() {
  loading.value = true;
  try {
    tree.value = await getMenuTreeApi();
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>

<template>
  <div class="panel">
    <div class="panel__title">菜单管理</div>
    <el-alert class="tip" type="info" :closable="false"
      title="真实后端菜单树。P4 将补充菜单的增删改与图标选择。" />
    <el-table v-loading="loading" :data="tree" row-key="id" default-expand-all
      :tree-props="{ children: 'children' }">
      <el-table-column prop="title" label="名称" />
      <el-table-column label="类型" width="90">
        <template #default="{ row }">
          <el-tag size="small" :type="row.type === 2 ? 'warning' : row.type === 0 ? 'info' : 'primary'">
            {{ typeText[row.type] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路由" />
      <el-table-column prop="permission" label="权限标识" />
    </el-table>
  </div>
</template>

<style scoped>
.panel {
  background: var(--ya-bg-container);
  border: 1px solid var(--ya-border-color-light);
  border-radius: var(--ya-radius-lg);
  padding: var(--ya-spacing-xl);
  box-shadow: var(--ya-shadow-sm);
}
.panel__title {
  font-size: var(--ya-font-md);
  font-weight: 600;
  color: var(--ya-text-primary);
  margin-bottom: var(--ya-spacing-lg);
}
.tip {
  margin-bottom: var(--ya-spacing-lg);
}
</style>
