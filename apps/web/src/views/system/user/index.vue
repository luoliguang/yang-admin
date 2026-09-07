<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getUsersApi, type UserItem } from '@/api/system';

const loading = ref(false);
const list = ref<UserItem[]>([]);
const total = ref(0);

async function load() {
  loading.value = true;
  try {
    const res = await getUsersApi({ page: 1, pageSize: 10 });
    list.value = res.list;
    total.value = res.total;
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>

<template>
  <div class="panel">
    <div class="panel__title">用户管理</div>
    <el-alert
      class="tip"
      type="success"
      :closable="false"
      title="下方数据来自真实后端接口（已通过登录鉴权 + 权限校验）。P4 阶段将升级为配置驱动 ProTable + 增删改查弹窗。"
    />
    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column label="角色">
        <template #default="{ row }">
          <el-tag v-for="r in row.roles" :key="r.id" size="small" class="role-tag">
            {{ r.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" />
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
.role-tag {
  margin-right: 6px;
}
</style>
