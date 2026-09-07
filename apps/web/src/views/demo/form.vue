<script setup lang="ts">
import { reactive } from 'vue';

const form = reactive({
  name: '',
  role: 'operator',
  status: true,
  desc: '',
});
</script>

<template>
  <div class="panel">
    <div class="panel__title">表单页（示例）</div>
    <el-form :model="form" label-width="90px" class="form">
      <el-form-item label="名称">
        <el-input v-model="form.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="form.role" placeholder="请选择">
          <el-option label="管理员" value="admin" />
          <el-option label="运营" value="operator" />
          <el-option label="访客" value="guest" />
        </el-select>
      </el-form-item>
      <el-form-item label="启用状态">
        <el-switch v-model="form.status" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.desc" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
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
.form {
  max-width: 520px;
}
</style>
