<script setup lang="ts">
import { computed } from 'vue';
import { TrendCharts, User, ShoppingCart, Money } from '@element-plus/icons-vue';
import Chart from '@/components/chart/Chart.vue';
import { useTheme } from '@/composables/useTheme';
import { trendOption, sourceOption, mapOption } from './charts';

const { themeMode } = useTheme();

const stats = [
  { label: '访问量', value: '128,430', delta: '+12.5%', up: true, icon: TrendCharts, color: '#4f46e5' },
  { label: '新增用户', value: '3,782', delta: '+8.2%', up: true, icon: User, color: '#0ea5e9' },
  { label: '订单数', value: '9,214', delta: '-3.1%', up: false, icon: ShoppingCart, color: '#f59e0b' },
  { label: '销售额', value: '¥ 642,180', delta: '+21.7%', up: true, icon: Money, color: '#22c55e' },
];

// 依赖 themeMode，切换主题时重算（主色随之更新）
const trend = computed(() => (themeMode.value, trendOption()));
const source = computed(() => (themeMode.value, sourceOption()));
const map = computed(() => (themeMode.value, mapOption()));
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
        <div class="panel__title">访问趋势（近 30 天）</div>
        <Chart :option="trend" height="300px" />
      </div>
      <div class="panel">
        <div class="panel__title">访问来源</div>
        <Chart :option="source" height="300px" />
      </div>
    </div>

    <div class="panel">
      <div class="panel__title">访客地区分布</div>
      <Chart :option="map" height="460px" />
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
  margin-bottom: var(--ya-spacing-lg);
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

@media (max-width: 1100px) {
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .panel-grid {
    grid-template-columns: 1fr;
  }
}
</style>
