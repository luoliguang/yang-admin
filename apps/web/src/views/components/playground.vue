<script setup lang="ts">
import { reactive, computed } from 'vue';
import { TrendCharts, User, ShoppingCart, Money, Odometer } from '@element-plus/icons-vue';
import { PageHeader, StatCard, StatusDot, Empty, Playground, type PlaygroundControl } from '@/components/pro';

const typeOptions = [
  { label: 'primary', value: 'primary' }, { label: 'success', value: 'success' },
  { label: 'warning', value: 'warning' }, { label: 'danger', value: 'danger' }, { label: 'info', value: 'info' },
];

// ---- StatCard ----
const iconMap: Record<string, any> = { TrendCharts, User, ShoppingCart, Money, Odometer };
const statState = reactive({ label: '访问量', value: '128,430', color: '#4f46e5', delta: '+12.5% 较上周', up: true, icon: 'TrendCharts' });
const statIcon = computed(() => iconMap[statState.icon]);
const statControls: PlaygroundControl[] = [
  { key: 'label', label: '标题', type: 'text' },
  { key: 'value', label: '数值', type: 'text' },
  { key: 'color', label: '主色', type: 'color' },
  { key: 'delta', label: '趋势文字', type: 'text' },
  { key: 'up', label: '上升(绿)', type: 'switch' },
  { key: 'icon', label: '图标', type: 'select', options: ['TrendCharts', 'User', 'ShoppingCart', 'Money', 'Odometer'].map((v) => ({ label: v, value: v })) },
];
const statCode = (s: Record<string, any>) => `<StatCard label="${s.label}" :value="'${s.value}'" color="${s.color}" delta="${s.delta}" :up="${s.up}" :icon="${s.icon}" />`;

// ---- Button ----
const btnState = reactive({ text: '按钮', type: 'primary', size: 'default', plain: false, round: false });
const btnControls: PlaygroundControl[] = [
  { key: 'text', label: '文字', type: 'text' },
  { key: 'type', label: '类型', type: 'select', options: typeOptions },
  { key: 'size', label: '尺寸', type: 'segmented', options: [{ label: '大', value: 'large' }, { label: '中', value: 'default' }, { label: '小', value: 'small' }] },
  { key: 'plain', label: '朴素', type: 'switch' },
  { key: 'round', label: '圆角', type: 'switch' },
];
const btnCode = (s: Record<string, any>) => `<el-button type="${s.type}" size="${s.size}"${s.plain ? ' plain' : ''}${s.round ? ' round' : ''}>${s.text}</el-button>`;

// ---- Tag ----
const tagState = reactive({ text: '标签', type: 'success', effect: 'light' });
const tagControls: PlaygroundControl[] = [
  { key: 'text', label: '文字', type: 'text' },
  { key: 'type', label: '类型', type: 'select', options: typeOptions },
  { key: 'effect', label: '风格', type: 'segmented', options: [{ label: 'light', value: 'light' }, { label: 'dark', value: 'dark' }, { label: 'plain', value: 'plain' }] },
];
const tagCode = (s: Record<string, any>) => `<el-tag type="${s.type}" effect="${s.effect}">${s.text}</el-tag>`;

// ---- Alert ----
const alertState = reactive({ title: '这是一条提示', type: 'success', showIcon: true, closable: true, center: false });
const alertControls: PlaygroundControl[] = [
  { key: 'title', label: '标题', type: 'text' },
  { key: 'type', label: '类型', type: 'select', options: [{ label: 'success', value: 'success' }, { label: 'warning', value: 'warning' }, { label: 'info', value: 'info' }, { label: 'error', value: 'error' }] },
  { key: 'showIcon', label: '显示图标', type: 'switch' },
  { key: 'closable', label: '可关闭', type: 'switch' },
  { key: 'center', label: '居中', type: 'switch' },
];
const alertCode = (s: Record<string, any>) => `<el-alert title="${s.title}" type="${s.type}"${s.showIcon ? ' show-icon' : ''}${s.center ? ' center' : ''} :closable="${s.closable}" />`;

// ---- Progress ----
const progState = reactive({ percentage: 60, type: 'line', status: '', strokeWidth: 10 });
const progControls: PlaygroundControl[] = [
  { key: 'percentage', label: '百分比', type: 'slider', min: 0, max: 100 },
  { key: 'type', label: '类型', type: 'segmented', options: [{ label: '条形', value: 'line' }, { label: '环形', value: 'circle' }] },
  { key: 'status', label: '状态', type: 'select', options: [{ label: '默认', value: '' }, { label: 'success', value: 'success' }, { label: 'warning', value: 'warning' }, { label: 'exception', value: 'exception' }] },
  { key: 'strokeWidth', label: '粗细', type: 'slider', min: 4, max: 24 },
];
const progCode = (s: Record<string, any>) => `<el-progress :percentage="${s.percentage}" type="${s.type}"${s.status ? ` status="${s.status}"` : ''} :stroke-width="${s.strokeWidth}" />`;

// ---- Switch ----
const swState = reactive({ value: true, size: 'default', activeText: '开', inactiveText: '关' });
const swControls: PlaygroundControl[] = [
  { key: 'value', label: '开关', type: 'switch' },
  { key: 'size', label: '尺寸', type: 'segmented', options: [{ label: '大', value: 'large' }, { label: '中', value: 'default' }, { label: '小', value: 'small' }] },
  { key: 'activeText', label: '开文字', type: 'text' },
  { key: 'inactiveText', label: '关文字', type: 'text' },
];
const swCode = (s: Record<string, any>) => `<el-switch v-model="v" size="${s.size}" active-text="${s.activeText}" inactive-text="${s.inactiveText}" />`;

// ---- Input ----
const inputState = reactive({ placeholder: '请输入内容', size: 'default', clearable: true, disabled: false });
const inputControls: PlaygroundControl[] = [
  { key: 'placeholder', label: '占位符', type: 'text' },
  { key: 'size', label: '尺寸', type: 'segmented', options: [{ label: '大', value: 'large' }, { label: '中', value: 'default' }, { label: '小', value: 'small' }] },
  { key: 'clearable', label: '可清空', type: 'switch' },
  { key: 'disabled', label: '禁用', type: 'switch' },
];
const inputCode = (s: Record<string, any>) => `<el-input v-model="v" placeholder="${s.placeholder}" size="${s.size}" :clearable="${s.clearable}" :disabled="${s.disabled}" />`;

// ---- Badge ----
const badgeState = reactive({ value: 5, type: 'danger', isDot: false, max: 99 });
const badgeControls: PlaygroundControl[] = [
  { key: 'value', label: '数值', type: 'number', min: 0, max: 200 },
  { key: 'type', label: '类型', type: 'select', options: typeOptions },
  { key: 'max', label: '封顶', type: 'number', min: 1, max: 999 },
  { key: 'isDot', label: '小圆点', type: 'switch' },
];
const badgeCode = (s: Record<string, any>) => `<el-badge :value="${s.value}" type="${s.type}" :max="${s.max}" :is-dot="${s.isDot}"><el-button>消息</el-button></el-badge>`;

// ---- StatusDot ----
const dotState = reactive({ text: '运行中', type: 'success' });
const dotControls: PlaygroundControl[] = [
  { key: 'text', label: '文字', type: 'text' },
  { key: 'type', label: '类型', type: 'select', options: typeOptions },
];
const dotCode = (s: Record<string, any>) => `<StatusDot text="${s.text}" type="${s.type}" />`;

// ---- Empty ----
const emptyState = reactive({ description: '暂无数据', imageSize: 90 });
const emptyControls: PlaygroundControl[] = [
  { key: 'description', label: '描述', type: 'text' },
  { key: 'imageSize', label: '图片尺寸', type: 'slider', min: 40, max: 160 },
];
const emptyCode = (s: Record<string, any>) => `<Empty description="${s.description}" :image-size="${s.imageSize}" />`;
</script>

<template>
  <div>
    <PageHeader title="交互演练场" subtitle="拖动/切换右侧控件实时调样式，下方代码同步生成——所见即所得。" />

    <Playground title="StatCard 统计卡片" :controls="statControls" :state="statState" :code="statCode">
      <template #default="{ state }">
        <StatCard :label="state.label" :value="state.value" :color="state.color" :delta="state.delta" :up="state.up" :icon="statIcon" />
      </template>
    </Playground>

    <Playground title="Button 按钮" :controls="btnControls" :state="btnState" :code="btnCode">
      <template #default="{ state }">
        <el-button :type="state.type" :size="state.size" :plain="state.plain" :round="state.round">{{ state.text }}</el-button>
      </template>
    </Playground>

    <Playground title="Tag 标签" :controls="tagControls" :state="tagState" :code="tagCode">
      <template #default="{ state }">
        <el-tag :type="state.type" :effect="state.effect">{{ state.text }}</el-tag>
      </template>
    </Playground>

    <Playground title="Alert 警告提示" :controls="alertControls" :state="alertState" :code="alertCode">
      <template #default="{ state }">
        <el-alert style="width: 100%" :title="state.title" :type="state.type" :show-icon="state.showIcon" :closable="state.closable" :center="state.center" />
      </template>
    </Playground>

    <Playground title="Progress 进度" :controls="progControls" :state="progState" :code="progCode">
      <template #default="{ state }">
        <el-progress :percentage="state.percentage" :type="state.type" :status="state.status || undefined" :stroke-width="state.strokeWidth" :width="120" style="min-width: 240px" />
      </template>
    </Playground>

    <Playground title="Switch 开关" :controls="swControls" :state="swState" :code="swCode">
      <template #default="{ state }">
        <el-switch v-model="state.value" :size="state.size" :active-text="state.activeText" :inactive-text="state.inactiveText" />
      </template>
    </Playground>

    <Playground title="Input 输入框" :controls="inputControls" :state="inputState" :code="inputCode">
      <template #default="{ state }">
        <el-input style="max-width: 280px" :placeholder="state.placeholder" :size="state.size" :clearable="state.clearable" :disabled="state.disabled" />
      </template>
    </Playground>

    <Playground title="Badge 徽标" :controls="badgeControls" :state="badgeState" :code="badgeCode">
      <template #default="{ state }">
        <el-badge :value="state.value" :type="state.type" :max="state.max" :is-dot="state.isDot">
          <el-button>消息</el-button>
        </el-badge>
      </template>
    </Playground>

    <Playground title="StatusDot 状态点" :controls="dotControls" :state="dotState" :code="dotCode">
      <template #default="{ state }">
        <StatusDot :text="state.text" :type="state.type" />
      </template>
    </Playground>

    <Playground title="Empty 空状态" :controls="emptyControls" :state="emptyState" :code="emptyCode">
      <template #default="{ state }">
        <Empty :description="state.description" :image-size="state.imageSize" />
      </template>
    </Playground>
  </div>
</template>
