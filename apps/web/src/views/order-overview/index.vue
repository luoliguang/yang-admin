<script setup lang="ts">
// ⚙️ 由 generate-view 生成（组件级 vibecoding）。示例数据可替换为真实接口。
import Chart from '@/components/chart/Chart.vue';
import type { EChartsOption } from 'echarts';
import { PageHeader, StatCard, ProTable, type ProColumn, type FormField, type FetchResult } from '@/components/pro';
import { ShoppingCart, Money, User } from '@element-plus/icons-vue';

const stats1 = [
  { label: '订单数', value: '9,214', color: '#4f46e5', delta: '+5.2% 较上周', up: true, icon: ShoppingCart },
  { label: '销售额', value: '¥ 642,180', color: '#22c55e', delta: '+21.7% 较上周', up: true, icon: Money },
  { label: '新增客户', value: '3,782', color: '#0ea5e9', delta: '-3.1% 较上周', up: false, icon: User }
];

const chartOption2: EChartsOption = {
  tooltip: { trigger: 'axis' }, grid: { left: 40, right: 20, top: 20, bottom: 30 },
  xAxis: { type: 'category', boundaryGap: false, data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } } },
  series: [{ name: '数值', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2.5 }, areaStyle: { opacity: 0.15 }, data: [820, 932, 901, 934, 1290, 1330, 1320, 1450, 1200, 1100, 1400, 1520] }],
};

const _rows3 = Array.from({ length: 23 }, (_, i) => ({ id: i + 1, orderNo: '订单号 ' + (i + 1), customer: '客户 ' + (i + 1), amount: '金额 ' + (i + 1), status: i % 3 === 0 ? 0 : 1 }));
function request3(params: Record<string, unknown>): Promise<FetchResult> {
  const { page = 1, pageSize = 10, keyword } = params as any;
  let list = _rows3;
  if (keyword) list = list.filter((r) => [r.orderNo, r.customer, r.amount].some((v) => String(v).includes(keyword)));
  const start = (page - 1) * pageSize;
  return Promise.resolve({ list: list.slice(start, start + pageSize), total: list.length });
}
const columns3: ProColumn[] = [
  { prop: 'orderNo', label: '订单号', minWidth: 140 },
  { prop: 'customer', label: '客户', minWidth: 140 },
  { prop: 'amount', label: '金额', minWidth: 140 },
  { label: '状态', width: 90, tag: (r) => ({ text: r.status === 1 ? '启用' : '禁用', type: r.status === 1 ? 'success' : 'info' }) },
  { label: '操作', width: 130, fixed: 'right', slot: 'action' },
];
const searchFields3: FormField[] = [{ prop: 'keyword', label: '关键字' }];
</script>

<template>
  <div class="gen-view">
    <PageHeader title="订单概览" subtitle="由视图生成器组合的示例页（组件级 vibecoding）" />

    <div class="stat-grid">
      <StatCard v-for="s in stats1" :key="s.label" :label="s.label" :value="s.value" :color="s.color" :delta="s.delta" :up="s.up" :icon="s.icon" />
    </div>

    <div class="panel">
      <div class="panel__title">订单趋势（近 12 月）</div>
      <Chart :option="chartOption2" height="320px" />
    </div>

    <ProTable :columns="columns3" :search-fields="searchFields3" :request="request3">
      <template #toolbar><el-button type="primary">新增</el-button></template>
      <template #col-action>
        <el-button size="small" text type="primary">编辑</el-button>
        <el-button size="small" text type="danger">删除</el-button>
      </template>
    </ProTable>
  </div>
</template>

<style scoped>
.stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--ya-spacing-lg); margin-bottom: var(--ya-spacing-xl); }
.panel { background: var(--ya-bg-container); border: 1px solid var(--ya-border-color-light); border-radius: var(--ya-radius-lg); padding: var(--ya-spacing-xl); box-shadow: var(--ya-shadow-sm); margin-bottom: var(--ya-spacing-lg); }
.panel__title { font-size: var(--ya-font-md); font-weight: 600; color: var(--ya-text-primary); margin-bottom: var(--ya-spacing-lg); }
</style>
