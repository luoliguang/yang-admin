<script setup lang="ts">
import { ref } from 'vue';

const version = ref('P0 · 地基已就绪');
</script>

<template>
  <div class="landing">
    <div class="card">
      <h1>yang-admin</h1>
      <p class="subtitle">通用型全栈中后台基座 · Vue3 + Element Plus + NestJS</p>
      <el-tag type="success" size="large">{{ version }}</el-tag>
      <p class="hint">前端空壳已跑通。下一步进入 P1：设计系统 + 布局骨架。</p>
    </div>
  </div>
</template>

<style scoped>
.landing {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}
.card {
  text-align: center;
  padding: 48px 64px;
  background: #fff;
  border-radius: var(--ya-radius-base, 8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}
h1 {
  margin: 0 0 8px;
  color: var(--ya-color-primary, #4f46e5);
  font-size: 40px;
}
.subtitle {
  color: #606266;
  margin-bottom: 24px;
}
.hint {
  margin-top: 24px;
  color: #909399;
  font-size: 14px;
}
</style>
