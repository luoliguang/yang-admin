#!/usr/bin/env node
/**
 * yang-admin 视图生成器（组件级 vibecoding）
 * 读取视图规格(views/<name>.json)，用组件库积木拼出一个可运行的页面 .vue。
 *
 * 用法: node packages/skills-templates/generate-view.mjs <name>
 *
 * 规格格式见 catalog.md。blocks 支持:
 *   page-header | stat-cards | pro-table | chart | descriptions
 * 生成的页面自包含（表格/图表用示例数据），可直接跑，再按需替换真实接口。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const name = process.argv[2];
if (!name) {
  console.error('用法: node generate-view.mjs <view-name>');
  process.exit(1);
}
const specPath = join(__dirname, 'views', `${name}.json`);
if (!existsSync(specPath)) {
  console.error(`找不到视图规格: ${specPath}`);
  process.exit(1);
}
const spec = JSON.parse(readFileSync(specPath, 'utf-8'));

const pro = new Set(); // 从 @/components/pro 引入
const icons = new Set(); // 从 @element-plus/icons-vue 引入
let needChart = false;
const scriptLines = [];
const tplLines = [];
let needStatGrid = false;

const esc = (s) => String(s ?? '').replace(/"/g, '&quot;');

spec.blocks.forEach((b, i) => {
  switch (b.type) {
    case 'page-header': {
      pro.add('PageHeader');
      tplLines.push(`    <PageHeader title="${esc(b.title)}" subtitle="${esc(b.subtitle)}" />`);
      break;
    }
    case 'stat-cards': {
      pro.add('StatCard');
      needStatGrid = true;
      const items = (b.items || []).map((it) => {
        if (it.icon) icons.add(it.icon);
        return `  { label: '${it.label}', value: '${it.value}', color: '${it.color || '#4f46e5'}', delta: '${it.delta || ''}', up: ${it.up !== false}, icon: ${it.icon || 'undefined'} }`;
      });
      scriptLines.push(`const stats${i} = [\n${items.join(',\n')}\n];`);
      tplLines.push(
        `    <div class="stat-grid">\n` +
          `      <StatCard v-for="s in stats${i}" :key="s.label" :label="s.label" :value="s.value" :color="s.color" :delta="s.delta" :up="s.up" :icon="s.icon" />\n` +
          `    </div>`,
      );
      break;
    }
    case 'pro-table': {
      pro.add('ProTable');
      const cols = b.columns || [{ prop: 'name', label: '名称' }];
      const colDefs = cols
        .map((c) =>
          c.tag
            ? `  { label: '${c.label}', width: 90, tag: (r) => ({ text: r.${c.prop} === 1 ? '启用' : '禁用', type: r.${c.prop} === 1 ? 'success' : 'info' }) }`
            : `  { prop: '${c.prop}', label: '${c.label}', minWidth: 140 }`,
        )
        .join(',\n');
      // 示例数据
      const rowFields = cols
        .map((c) => (c.tag ? `${c.prop}: i % 3 === 0 ? 0 : 1` : `${c.prop}: '${c.label} ' + (i + 1)`))
        .join(', ');
      const strCols = cols.filter((c) => !c.tag).map((c) => c.prop);
      scriptLines.push(
        `const _rows${i} = Array.from({ length: 23 }, (_, i) => ({ id: i + 1, ${rowFields} }));\n` +
          `function request${i}(params: Record<string, unknown>): Promise<FetchResult> {\n` +
          `  const { page = 1, pageSize = 10, keyword } = params as any;\n` +
          `  let list = _rows${i};\n` +
          `  if (keyword) list = list.filter((r) => [${strCols.map((p) => `r.${p}`).join(', ')}].some((v) => String(v).includes(keyword)));\n` +
          `  const start = (page - 1) * pageSize;\n` +
          `  return Promise.resolve({ list: list.slice(start, start + pageSize), total: list.length });\n` +
          `}\n` +
          `const columns${i}: ProColumn[] = [\n${colDefs},\n  { label: '操作', width: 130, fixed: 'right', slot: 'action' },\n];\n` +
          `const searchFields${i}: FormField[] = [{ prop: 'keyword', label: '关键字' }];`,
      );
      tplLines.push(
        `    <ProTable :columns="columns${i}" :search-fields="searchFields${i}" :request="request${i}">\n` +
          `      <template #toolbar><el-button type="primary">新增</el-button></template>\n` +
          `      <template #col-action>\n` +
          `        <el-button size="small" text type="primary">编辑</el-button>\n` +
          `        <el-button size="small" text type="danger">删除</el-button>\n` +
          `      </template>\n` +
          `    </ProTable>`,
      );
      break;
    }
    case 'chart': {
      needChart = true;
      const kind = b.kind || 'line';
      const title = b.title || '图表';
      if (kind === 'pie') {
        scriptLines.push(
          `const chartOption${i}: EChartsOption = {\n` +
            `  tooltip: { trigger: 'item' }, legend: { bottom: 0 },\n` +
            `  series: [{ type: 'pie', radius: ['45%', '68%'], data: [\n` +
            `    { value: 4200, name: 'A' }, { value: 3100, name: 'B' }, { value: 2400, name: 'C' }, { value: 1600, name: 'D' },\n` +
            `  ] }],\n};`,
        );
      } else if (kind === 'bar') {
        scriptLines.push(
          `const chartOption${i}: EChartsOption = {\n` +
            `  tooltip: {}, grid: { left: 40, right: 20, top: 20, bottom: 30 },\n` +
            `  xAxis: { type: 'category', data: ['一月', '二月', '三月', '四月', '五月', '六月'] }, yAxis: { type: 'value' },\n` +
            `  series: [{ type: 'bar', data: [120, 200, 150, 80, 170, 210], itemStyle: { color: 'var(--ya-color-primary)' } }],\n};`,
        );
      } else {
        scriptLines.push(
          `const chartOption${i}: EChartsOption = {\n` +
            `  tooltip: { trigger: 'axis' }, grid: { left: 40, right: 20, top: 20, bottom: 30 },\n` +
            `  xAxis: { type: 'category', boundaryGap: false, data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },\n` +
            `  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } } },\n` +
            `  series: [{ name: '数值', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2.5 }, areaStyle: { opacity: 0.15 }, data: [820, 932, 901, 934, 1290, 1330, 1320, 1450, 1200, 1100, 1400, 1520] }],\n};`,
        );
      }
      tplLines.push(
        `    <div class="panel">\n` +
          `      <div class="panel__title">${esc(title)}</div>\n` +
          `      <Chart :option="chartOption${i}" height="320px" />\n` +
          `    </div>`,
      );
      break;
    }
    case 'descriptions': {
      const items = (b.items || []).map((it) => `      <el-descriptions-item label="${esc(it.label)}">${esc(it.value)}</el-descriptions-item>`).join('\n');
      tplLines.push(
        `    <div class="panel">\n` +
          `      <div class="panel__title">${esc(b.title || '详情')}</div>\n` +
          `      <el-descriptions :column="${b.column || 3}" border>\n${items}\n      </el-descriptions>\n` +
          `    </div>`,
      );
      break;
    }
    default:
      console.warn(`[generate-view] 未知 block 类型: ${b.type}`);
  }
});

// ---- 组装 imports ----
const importLines = [];
if (needChart) {
  importLines.push(`import Chart from '@/components/chart/Chart.vue';`);
  importLines.push(`import type { EChartsOption } from 'echarts';`);
}
if (pro.size) {
  const proTypes = [];
  if ([...pro].includes('ProTable')) proTypes.push('type ProColumn', 'type FormField', 'type FetchResult');
  importLines.push(`import { ${[...pro, ...proTypes].join(', ')} } from '@/components/pro';`);
}
if (icons.size) importLines.push(`import { ${[...icons].join(', ')} } from '@element-plus/icons-vue';`);

// ---- 样式 ----
const styles = [];
if (needStatGrid)
  styles.push(
    `.stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--ya-spacing-lg); margin-bottom: var(--ya-spacing-xl); }`,
  );
if (tplLines.some((l) => l.includes('class="panel"')))
  styles.push(
    `.panel { background: var(--ya-bg-container); border: 1px solid var(--ya-border-color-light); border-radius: var(--ya-radius-lg); padding: var(--ya-spacing-xl); box-shadow: var(--ya-shadow-sm); margin-bottom: var(--ya-spacing-lg); }`,
    `.panel__title { font-size: var(--ya-font-md); font-weight: 600; color: var(--ya-text-primary); margin-bottom: var(--ya-spacing-lg); }`,
  );

const out = `<script setup lang="ts">
// ⚙️ 由 generate-view 生成（组件级 vibecoding）。示例数据可替换为真实接口。
${importLines.join('\n')}

${scriptLines.join('\n\n')}
</script>

<template>
  <div class="gen-view">
${tplLines.join('\n\n')}
  </div>
</template>

<style scoped>
${styles.join('\n')}
</style>
`;

const target = `apps/web/src/views/${name}/index.vue`;
const full = join(ROOT, target);
mkdirSync(dirname(full), { recursive: true });
writeFileSync(full, out);
console.log('  ✓', target);
console.log(`\n✅ 已生成视图「${spec.title || name}」。后续: 通过「菜单管理」挂路由 component: ${name}/index`);
