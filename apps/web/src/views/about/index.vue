<script setup lang="ts">
const roadmap = [
  { phase: 'P0', title: '地基', done: true },
  { phase: 'P1', title: '设计系统 + 布局骨架', done: true },
  { phase: 'P2', title: '后端基座（NestJS + Prisma + RBAC）', done: true },
  { phase: 'P3', title: '前端打通（登录 + 动态路由 + Mock）', done: true },
  { phase: 'P4', title: '核心组件（ProTable / SearchForm / CrudModal）', done: true },
  { phase: 'P5', title: '增强（图表 / 地图 / 上传 / 国际化）', done: true },
  { phase: 'P6', title: 'AI 开发期提效（CRUD 生成 skill + MCP）', done: true },
  { phase: 'P7', title: '文档（复用指南 + 组件文档）', done: true },
];
</script>

<template>
  <div class="panel">
    <div class="panel__title">关于 yang-admin</div>
    <p class="intro">
      通用型全栈中后台基座 · Vue 3 + Element Plus + NestJS。目标：沉淀一套可长期复用的
      设计系统、业务级组件与工程规范。
    </p>
    <div class="roadmap">
      <div v-for="r in roadmap" :key="r.phase" class="roadmap__item" :class="{ 'is-done': r.done }">
        <span class="roadmap__phase">{{ r.phase }}</span>
        <span class="roadmap__title">{{ r.title }}</span>
        <el-tag v-if="r.done" type="success" size="small">已完成</el-tag>
        <el-tag v-else type="info" size="small">规划中</el-tag>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  background: var(--ya-bg-container);
  border: 1px solid var(--ya-border-color-light);
  border-radius: var(--ya-radius-lg);
  padding: var(--ya-spacing-xl);
  box-shadow: var(--ya-shadow-sm);
  max-width: 720px;
}
.panel__title {
  font-size: var(--ya-font-md);
  font-weight: 600;
  color: var(--ya-text-primary);
  margin-bottom: var(--ya-spacing-lg);
}
.intro {
  color: var(--ya-text-regular);
  line-height: 1.7;
  margin-bottom: var(--ya-spacing-xl);
}
.roadmap__item {
  display: flex;
  align-items: center;
  gap: var(--ya-spacing-md);
  padding: var(--ya-spacing-md) 0;
  border-bottom: 1px solid var(--ya-border-color-light);
}
.roadmap__item:last-child {
  border-bottom: none;
}
.roadmap__phase {
  width: 34px;
  font-weight: 700;
  color: var(--ya-color-primary);
}
.roadmap__title {
  flex: 1;
  color: var(--ya-text-regular);
}
.roadmap__item.is-done .roadmap__title {
  color: var(--ya-text-primary);
}
</style>
