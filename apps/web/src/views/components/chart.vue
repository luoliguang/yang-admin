<script setup lang="ts">
import { computed } from 'vue';
import { PageHeader, DemoBlock } from '@/components/pro';
import Chart from '@/components/chart/Chart.vue';
import { useTheme } from '@/composables/useTheme';
import { trendOption, sourceOption, mapOption } from '@/views/dashboard/charts';

const { themeMode } = useTheme();
const trend = computed(() => (themeMode.value, trendOption()));
const source = computed(() => (themeMode.value, sourceOption()));
const map = computed(() => (themeMode.value, mapOption()));

const code = `<Chart :option="option" height="300px" />

// option 是标准 ECharts option；Chart 会随明暗主题重建、配色跟随品牌色
// 中国地图 choropleth 做法见 views/dashboard/charts.ts 的 mapOption()`;
</script>

<template>
  <div>
    <PageHeader title="Chart 图表" subtitle="主题感知的 ECharts 封装，明暗切换自动重建、配色随品牌色。" />

    <DemoBlock title="折线 / 面积图" :code="code">
      <Chart :option="trend" height="280px" />
    </DemoBlock>

    <DemoBlock title="环形饼图" :code="code">
      <Chart :option="source" height="280px" />
    </DemoBlock>

    <DemoBlock title="中国地图 choropleth" desc="按数值着色，区域名归一化，无数据省深底。" :code="code">
      <Chart :option="map" height="440px" />
    </DemoBlock>
  </div>
</template>
