<script setup lang="ts">
import { computed } from 'vue';
import VChart from 'vue-echarts';
import type { EChartsOption } from 'echarts';
import './echarts';
import { useTheme } from '@/composables/useTheme';

const props = withDefaults(
  defineProps<{
    option: EChartsOption;
    height?: string;
  }>(),
  { height: '320px' },
);

const { isDark } = useTheme();

// 主题相关的默认文字色，随明暗切换
const themedOption = computed<EChartsOption>(() => {
  const textColor = isDark() ? '#a6adba' : '#475569';
  return {
    textStyle: { color: textColor },
    ...props.option,
  };
});
</script>

<template>
  <!-- key 绑定主题，切换明暗时重建实例，确保配色重算 -->
  <VChart
    :key="isDark() ? 'dark' : 'light'"
    class="chart"
    :option="themedOption"
    autoresize
    :style="{ height }"
  />
</template>

<style scoped>
.chart {
  width: 100%;
}
</style>
