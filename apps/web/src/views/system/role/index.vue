<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getRolesApi, type RoleItem } from '@/api/system';

const loading = ref(false);
const list = ref<RoleItem[]>([]);

async function load() {
  loading.value = true;
  try {
    const res = await getRolesApi({ page: 1, pageSize: 10 });
    list.value = res.list;
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>

<template>
  <div class="panel">
    <div class="panel__title">角色管理</div>
    <el-alert class="tip" type="info" :closable="false"
      title="真实后端数据。P4 将补充角色的新增/编辑与菜单授权树。" />
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="code" label="标识" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="菜单数" width="100">
        <template #default="{ row }">{{ row.menuIds?.length ?? 0 }}</template>
      </el-table-column>
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
