<script setup lang="ts">
import { TrendCharts, User } from '@element-plus/icons-vue';
import { PageHeader, StatCard, DictTag, DemoBlock } from '@/components/pro';

const statusDict = [
  { label: '启用', value: 1, type: 'success' as const },
  { label: '禁用', value: 0, type: 'info' as const },
];

const tokens = [
  { name: '--ya-color-primary', var: 'var(--ya-color-primary)' },
  { name: '--ya-color-success', var: 'var(--ya-color-success)' },
  { name: '--ya-color-warning', var: 'var(--ya-color-warning)' },
  { name: '--ya-color-danger', var: 'var(--ya-color-danger)' },
  { name: '--ya-gray-800', var: 'var(--ya-gray-800)' },
  { name: '--ya-gray-500', var: 'var(--ya-gray-500)' },
  { name: '--ya-gray-300', var: 'var(--ya-gray-300)' },
  { name: '--ya-gray-100', var: 'var(--ya-gray-100)' },
];

const statCode = `<StatCard label="访问量" :value="128430" :icon="TrendCharts"
  color="#4f46e5" delta="+12.5%" up />`;
const dictCode = `<DictTag :value="row.status" :options="[
  { label: '启用', value: 1, type: 'success' },
  { label: '禁用', value: 0, type: 'info' },
]" />`;
const headerCode = `<PageHeader title="页面标题" subtitle="副标题说明">
  <template #extra><el-button type="primary">操作</el-button></template>
</PageHeader>`;
</script>

<template>
  <div>
    <PageHeader title="基础组件与设计令牌" subtitle="后台常用的小组件与全站统一的设计变量。" />

    <DemoBlock title="StatCard 统计卡片" desc="仪表盘 KPI 卡片，传 label/value/icon/color/delta。" :code="statCode">
      <div class="row">
        <StatCard label="访问量" :value="128430" :icon="TrendCharts" color="#4f46e5" delta="+12.5% 较上周" up />
        <StatCard label="新增用户" :value="3782" :icon="User" color="#0ea5e9" delta="-3.1% 较上周" :up="false" />
      </div>
    </DemoBlock>

    <DemoBlock title="PageHeader 页头" desc="统一的页面标题区，支持右侧操作插槽。" :code="headerCode">
      <PageHeader title="页面标题" subtitle="副标题说明文字">
        <template #extra><el-button type="primary">主操作</el-button></template>
      </PageHeader>
    </DemoBlock>

    <DemoBlock title="DictTag 字典标签" desc="按 value 匹配 options 显示带颜色的标签，列表状态列常用。" :code="dictCode">
      <div class="row">
        <DictTag :value="1" :options="statusDict" />
        <DictTag :value="0" :options="statusDict" />
      </div>
    </DemoBlock>

    <DemoBlock title="按钮与标签" desc="直接用 Element Plus，主题色已联动设计令牌。">
      <div class="row">
        <el-button type="primary">主要</el-button>
        <el-button type="success">成功</el-button>
        <el-button type="warning">警告</el-button>
        <el-button type="danger">危险</el-button>
        <el-tag>默认</el-tag>
        <el-tag type="success">成功</el-tag>
        <el-tag type="warning">警告</el-tag>
      </div>
    </DemoBlock>

    <DemoBlock title="Design Tokens 色板" desc="全站只用 --ya-* 变量，不硬编码色值；明暗切换自动适配。">
      <div class="swatches">
        <div v-for="t in tokens" :key="t.name" class="swatch">
          <div class="swatch__color" :style="{ background: t.var }" />
          <code>{{ t.name }}</code>
        </div>
      </div>
    </DemoBlock>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ya-spacing-lg);
  align-items: center;
}
.swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--ya-spacing-lg);
}
.swatch {
  display: flex;
  align-items: center;
  gap: var(--ya-spacing-md);
}
.swatch__color {
  width: 36px;
  height: 36px;
  border-radius: var(--ya-radius-base);
  border: 1px solid var(--ya-border-color);
  flex-shrink: 0;
}
.swatch code {
  font-size: var(--ya-font-xs);
  color: var(--ya-text-regular);
}
</style>
