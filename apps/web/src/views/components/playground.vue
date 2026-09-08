<script setup lang="ts">
import { reactive, computed } from 'vue';
import { TrendCharts, User, ShoppingCart, Money, Odometer } from '@element-plus/icons-vue';
import { PageHeader, StatCard, Playground, type PlaygroundControl } from '@/components/pro';

// ---- StatCard 演练 ----
const iconMap: Record<string, any> = { TrendCharts, User, ShoppingCart, Money, Odometer };
const statState = reactive({
  label: '访问量',
  value: '128,430',
  color: '#4f46e5',
  delta: '+12.5% 较上周',
  up: true,
  icon: 'TrendCharts',
});
const statIcon = computed(() => iconMap[statState.icon]);
const statControls: PlaygroundControl[] = [
  { key: 'label', label: '标题', type: 'text' },
  { key: 'value', label: '数值', type: 'text' },
  { key: 'color', label: '主色', type: 'color' },
  { key: 'delta', label: '趋势文字', type: 'text' },
  { key: 'up', label: '上升(绿)', type: 'switch' },
  { key: 'icon', label: '图标', type: 'select', options: [
    { label: 'TrendCharts', value: 'TrendCharts' }, { label: 'User', value: 'User' },
    { label: 'ShoppingCart', value: 'ShoppingCart' }, { label: 'Money', value: 'Money' },
    { label: 'Odometer', value: 'Odometer' },
  ] },
];
const statCode = (s: Record<string, any>) =>
  `<StatCard\n  label="${s.label}"\n  :value="'${s.value}'"\n  color="${s.color}"\n  delta="${s.delta}"\n  :up="${s.up}"\n  :icon="${s.icon}"\n/>`;

// ---- Button 演练 ----
const btnState = reactive({ text: '按钮', type: 'primary', size: 'default', plain: false, round: false });
const btnControls: PlaygroundControl[] = [
  { key: 'text', label: '文字', type: 'text' },
  { key: 'type', label: '类型', type: 'select', options: [
    { label: 'primary', value: 'primary' }, { label: 'success', value: 'success' },
    { label: 'warning', value: 'warning' }, { label: 'danger', value: 'danger' }, { label: 'info', value: 'info' },
  ] },
  { key: 'size', label: '尺寸', type: 'segmented', options: [
    { label: '大', value: 'large' }, { label: '中', value: 'default' }, { label: '小', value: 'small' },
  ] },
  { key: 'plain', label: '朴素', type: 'switch' },
  { key: 'round', label: '圆角', type: 'switch' },
];
const btnCode = (s: Record<string, any>) =>
  `<el-button type="${s.type}" size="${s.size}"${s.plain ? ' plain' : ''}${s.round ? ' round' : ''}>${s.text}</el-button>`;

// ---- Tag 演练 ----
const tagState = reactive({ text: '标签', type: 'success', effect: 'light' });
const tagControls: PlaygroundControl[] = [
  { key: 'text', label: '文字', type: 'text' },
  { key: 'type', label: '类型', type: 'select', options: [
    { label: 'primary', value: 'primary' }, { label: 'success', value: 'success' },
    { label: 'warning', value: 'warning' }, { label: 'danger', value: 'danger' }, { label: 'info', value: 'info' },
  ] },
  { key: 'effect', label: '风格', type: 'segmented', options: [
    { label: 'light', value: 'light' }, { label: 'dark', value: 'dark' }, { label: 'plain', value: 'plain' },
  ] },
];
const tagCode = (s: Record<string, any>) =>
  `<el-tag type="${s.type}" effect="${s.effect}">${s.text}</el-tag>`;
</script>

<template>
  <div>
    <PageHeader title="交互演练场" subtitle="拖动/切换右侧控件实时调样式，下方代码同步生成——所见即所得。" />

    <Playground title="StatCard 统计卡片" desc="调标题/数值/主色/趋势/图标，实时预览。" :controls="statControls" :state="statState" :code="statCode">
      <template #default="{ state }">
        <StatCard :label="state.label" :value="state.value" :color="state.color" :delta="state.delta" :up="state.up" :icon="statIcon" />
      </template>
    </Playground>

    <Playground title="Button 按钮" desc="调类型/尺寸/朴素/圆角。" :controls="btnControls" :state="btnState" :code="btnCode">
      <template #default="{ state }">
        <el-button :type="state.type" :size="state.size" :plain="state.plain" :round="state.round">{{ state.text }}</el-button>
      </template>
    </Playground>

    <Playground title="Tag 标签" desc="调类型与风格。" :controls="tagControls" :state="tagState" :code="tagCode">
      <template #default="{ state }">
        <el-tag :type="state.type" :effect="state.effect">{{ state.text }}</el-tag>
      </template>
    </Playground>
  </div>
</template>
