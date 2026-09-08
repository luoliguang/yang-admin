import type { EChartsOption } from 'echarts';
import chinaGeo from '@/assets/geo/china.json';

/** 读取当前品牌主色（随主题切换的 CSS 变量） */
function primary(): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--ya-color-primary').trim();
  return v || '#4f46e5';
}

function hexAlpha(hex: string, alpha: number): string {
  const v = hex.replace('#', '');
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ---- 趋势面积图（近 30 天访问量）----
export function trendOption(): EChartsOption {
  const p = primary();
  const days = Array.from({ length: 30 }, (_, i) => `${i + 1}日`);
  let base = 3200;
  const data = days.map(() => {
    base += Math.round((Math.random() - 0.45) * 400);
    return Math.max(1200, base);
  });
  return {
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: days,
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.3)' } },
      axisLabel: { interval: 4 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data,
        lineStyle: { color: p, width: 2.5 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: hexAlpha(p, 0.35) },
              { offset: 1, color: hexAlpha(p, 0.02) },
            ],
          },
        },
      },
    ],
  };
}

// ---- 访问来源饼图 ----
export function sourceOption(): EChartsOption {
  const p = primary();
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, icon: 'circle' },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: ['45%', '68%'],
        center: ['50%', '42%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: 'transparent', borderWidth: 2 },
        label: { show: false },
        data: [
          { value: 4200, name: '搜索引擎' },
          { value: 3100, name: '直接访问' },
          { value: 2400, name: '社交媒体' },
          { value: 1600, name: '外部链接' },
          { value: 900, name: '其它' },
        ],
        color: [p, hexAlpha(p, 0.75), hexAlpha(p, 0.55), hexAlpha(p, 0.38), hexAlpha(p, 0.22)],
      },
    ],
  };
}

// ---- 中国地图访客分布 ----
// 名称归一化：GeoJSON 全称 <-> 数据简称
const shorten = (s: string) =>
  (s || '')
    .replace(/特别行政区$/, '')
    .replace(/(维吾尔|壮族|回族)?自治区$/, '')
    .replace(/省$/, '')
    .replace(/市$/, '')
    .trim();

const SHORT_TO_FULL: Record<string, string> = {};
(chinaGeo as { features: { properties: { name: string } }[] }).features.forEach((f) => {
  SHORT_TO_FULL[shorten(f.properties.name)] = f.properties.name;
});

// 示例访客数据（简称）
const SAMPLE = [
  ['广东', 1286], ['江苏', 942], ['浙江', 878], ['北京', 815], ['上海', 764],
  ['山东', 623], ['四川', 541], ['湖北', 498], ['河南', 456], ['福建', 421],
  ['湖南', 389], ['河北', 356], ['陕西', 312], ['辽宁', 287], ['安徽', 265],
  ['重庆', 243], ['天津', 198], ['云南', 176], ['广西', 154], ['新疆', 98],
];

export function mapOption(): EChartsOption {
  const p = primary();
  const data = SAMPLE.map(([name, value]) => ({
    name: SHORT_TO_FULL[name as string] || (name as string),
    value: value as number,
  }));
  const max = Math.max(...SAMPLE.map((d) => d[1] as number));
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: unknown) => {
        const p2 = params as { name: string; value?: number };
        return `${shorten(p2.name)}<br/>访客数：${p2.value ?? '暂无'}`;
      },
    },
    visualMap: {
      min: 1,
      max,
      left: 16,
      bottom: 16,
      calculable: true,
      text: ['高', '低'],
      inRange: {
        // 低端用明显亮色，避免小值没入深底
        color: [hexAlpha(p, 0.35), p, '#a5b4fc'],
      },
      textStyle: { color: 'inherit' },
    },
    series: [
      {
        name: '访客分布',
        type: 'map',
        map: 'china',
        roam: false,
        zoom: 1.2,
        itemStyle: {
          areaColor: 'rgba(148,163,184,0.12)',
          borderColor: 'rgba(148,163,184,0.35)',
        },
        emphasis: {
          itemStyle: { areaColor: p },
          label: { show: true, color: '#fff' },
        },
        // 无数据省份 value 缺省 → 落在 visualMap 之外，只显示深底
        data,
      },
    ],
  };
}
