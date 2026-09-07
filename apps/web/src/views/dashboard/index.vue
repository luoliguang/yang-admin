<script setup lang="ts">
import { TrendCharts, User, ShoppingCart, Money } from '@element-plus/icons-vue';

const stats = [
  { label: '访问量', value: '128,430', delta: '+12.5%', up: true, icon: TrendCharts, color: '#4f46e5' },
  { label: '新增用户', value: '3,782', delta: '+8.2%', up: true, icon: User, color: '#0ea5e9' },
  { label: '订单数', value: '9,214', delta: '-3.1%', up: false, icon: ShoppingCart, color: '#f59e0b' },
  { label: '销售额', value: '¥ 642,180', delta: '+21.7%', up: true, icon: Money, color: '#22c55e' },
];
</script>

<template>
  <div class="dashboard">
    <div class="page-header">
      <h2>仪表盘</h2>
      <p>欢迎回来，这是 yang-admin 基座的示例首页。</p>
    </div>

    <div class="stat-grid">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <div class="stat-card__icon" :style="{ background: s.color + '1a', color: s.color }">
          <el-icon :size="24"><component :is="s.icon" /></el-icon>
        </div>
        <div class="stat-card__body">
          <div class="stat-card__label">{{ s.label }}</div>
          <div class="stat-card__value">{{ s.value }}</div>
          <div class="stat-card__delta" :class="s.up ? 'is-up' : 'is-down'">
            {{ s.delta }} 较上周
          </div>
        </div>
      </div>
    </div>

    <div class="panel-grid">
      <div class="panel panel--main">
        <div class="panel__title">趋势概览</div>
        <div class="panel__placeholder">
          <el-icon :size="40"><TrendCharts /></el-icon>
          <span>图表将在 P5 阶段接入 ECharts</span>
        </div>
      </div>
      <div class="panel">
        <div class="panel__title">待办事项</div>
        <ul class="todo">
          <li v-for="i in 4" :key="i">
            <span class="todo__dot" />
            示例待办任务 {{ i }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: var(--ya-spacing-xl);
}
.page-header h2 {
  margin: 0 0 4px;
  font-size: var(--ya-font-xl);
  color: var(--ya-text-primary);
}
.page-header p {
  margin: 0;
  color: var(--ya-text-secondary);
  font-size: var(--ya-font-base);
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--ya-spacing-lg);
  margin-bottom: var(--ya-spacing-xl);
}
.stat-card {
  display: flex;
  align-items: center;
  gap: var(--ya-spacing-lg);
  padding: var(--ya-spacing-xl);
  background: var(--ya-bg-container);
  border: 1px solid var(--ya-border-color-light);
  border-radius: var(--ya-radius-lg);
  box-shadow: var(--ya-shadow-sm);
  transition: box-shadow var(--ya-transition-base), transform var(--ya-transition-base);
}
.stat-card:hover {
  box-shadow: var(--ya-shadow-lg);
  transform: translateY(-2px);
}
.stat-card__icon {
  width: 52px;
  height: 52px;
  border-radius: var(--ya-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-card__label {
  font-size: var(--ya-font-sm);
  color: var(--ya-text-secondary);
}
.stat-card__value {
  font-size: var(--ya-font-2xl);
  font-weight: 700;
  color: var(--ya-text-primary);
  line-height: 1.3;
}
.stat-card__delta {
  font-size: var(--ya-font-xs);
}
.stat-card__delta.is-up {
  color: var(--ya-color-success);
}
.stat-card__delta.is-down {
  color: var(--ya-color-danger);
}
.panel-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--ya-spacing-lg);
}
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
.panel__placeholder {
  height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ya-spacing-md);
  color: var(--ya-text-secondary);
  border: 1px dashed var(--ya-border-color);
  border-radius: var(--ya-radius-base);
}
.todo {
  list-style: none;
  margin: 0;
  padding: 0;
}
.todo li {
  display: flex;
  align-items: center;
  gap: var(--ya-spacing-md);
  padding: var(--ya-spacing-md) 0;
  border-bottom: 1px solid var(--ya-border-color-light);
  color: var(--ya-text-regular);
  font-size: var(--ya-font-base);
}
.todo li:last-child {
  border-bottom: none;
}
.todo__dot {
  width: 8px;
  height: 8px;
  border-radius: var(--ya-radius-full);
  background: var(--ya-color-primary);
}

@media (max-width: 1100px) {
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .panel-grid {
    grid-template-columns: 1fr;
  }
}
</style>
