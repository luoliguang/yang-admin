<script setup lang="ts">
import { computed } from 'vue';
import { TrendCharts, User, ShoppingCart, Money } from '@element-plus/icons-vue';
import Chart from '@/components/chart/Chart.vue';
import { PageHeader, StatCard } from '@/components/pro';
import { useTheme } from '@/composables/useTheme';
import { trendOption, sourceOption, mapOption } from './charts';

const { themeMode } = useTheme();

const stats = [
  { label: '访问量', value: '128,430', delta: '+12.5% 较上周', up: true, icon: TrendCharts, color: '#4f46e5' },
  { label: '新增用户', value: '3,782', delta: '+8.2% 较上周', up: true, icon: User, color: '#0ea5e9' },
  { label: '订单数', value: '9,214', delta: '-3.1% 较上周', up: false, icon: ShoppingCart, color: '#f59e0b' },
  { label: '销售额', value: '¥ 642,180', delta: '+21.7% 较上周', up: true, icon: Money, color: '#22c55e' },
];

// 依赖 themeMode，切换主题时重算（主色随之更新）
const trend = computed(() => (themeMode.value, trendOption()));
const source = computed(() => (themeMode.value, sourceOption()));
const map = computed(() => (themeMode.value, mapOption()));
</script>

<template>
  <div class="dashboard">
    <PageHeader title="仪表盘" subtitle="欢迎回来，这是 yang-admin 基座的示例首页。" />

    <div class="stat-grid">
      <StatCard
        v-for="s in stats"
        :key="s.label"
        :label="s.label"
        :value="s.value"
        :icon="s.icon"
        :color="s.color"
        :delta="s.delta"
        :up="s.up"
      />
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
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--ya-spacing-lg);
  margin-bottom: var(--ya-spacing-xl);
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
