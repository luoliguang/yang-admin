// ECharts 按需注册（tree-shaking）+ 中国地图注册
import { use, registerMap } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart, PieChart, MapChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  DataZoomComponent,
} from 'echarts/components';
import chinaGeo from '@/assets/geo/china.json';

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  MapChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  DataZoomComponent,
]);

// 注册一次中国地图
registerMap('china', chinaGeo as never);
