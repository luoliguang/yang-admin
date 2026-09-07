<script setup lang="ts">
const rows = [
  { id: 1, name: '张三', role: '管理员', status: '启用', date: '2026-09-01' },
  { id: 2, name: '李四', role: '运营', status: '启用', date: '2026-09-03' },
  { id: 3, name: '王五', role: '访客', status: '禁用', date: '2026-09-05' },
];
</script>

<template>
  <div class="panel">
    <div class="panel__title">数据表格（示例）</div>
    <el-alert
      class="tip"
      type="info"
      :closable="false"
      title="这是原生 el-table 示例。P4 阶段将封装为「配置驱动 ProTable」——列/搜索/分页/CRUD 皆由配置生成。"
    />
    <el-table :data="rows" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="role" label="角色" />
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === '启用' ? 'success' : 'info'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="创建时间" />
      <el-table-column label="操作" width="140">
        <template #default>
          <el-button size="small" text type="primary">编辑</el-button>
          <el-button size="small" text type="danger">删除</el-button>
        </template>
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
