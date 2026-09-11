#!/usr/bin/env node
/**
 * 组件速查表生成器（单一数据源）
 * -------------------------------------------------------------
 * 扫描 apps/web/src/components/pro/*.vue，从 defineProps 自动解析 props，
 * 合并本文件里的人工元数据(分类/一句话用途)，生成组件速查表，注入到：
 *   1. packages/skills-templates/catalog.md  → MCP `list_components` 自动同步
 *   2. README.md                              → GitHub 访客可见
 * 用法：node packages/skills-templates/gen-catalog.mjs
 *
 * 新增组件后：在 index.ts 导出 + 在下方 META 里补一行分类/用途，再跑本脚本即可。
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const PRO_DIR = join(ROOT, 'apps', 'web', 'src', 'components', 'pro');
const INDEX = join(PRO_DIR, 'index.ts');
const CATALOG = join(__dirname, 'catalog.md');
const README = join(ROOT, 'README.md');
// 插件自带的 catalog 副本（对外可安装 skill 的参考资料，需与源保持同步）
const PLUGIN_CATALOG = join(ROOT, 'plugins', 'yang-admin', 'skills', 'yang-admin', 'reference', 'catalog.md');

/** 人工元数据：分类 + 一句话用途（代码里读不出来的部分） */
const META = {
  ProTable: { cat: '业务级', desc: '配置驱动表格：搜索 + 分页 + 工具栏 + 树表，写 columns/request 即可' },
  SearchForm: { cat: '业务级', desc: '配置驱动查询表单，与 ProTable 搭配' },
  CrudModal: { cat: '业务级', desc: '配置驱动的增删改查弹窗（表单项由 fields 描述）' },
  Upload: { cat: '业务级', desc: '图片上传：带 token、预览、体积/类型校验' },
  StatCard: { cat: '基础', desc: 'KPI 统计卡片：图标 + 数值 + 涨跌' },
  PageHeader: { cat: '基础', desc: '页头：标题 + 副标题 + #extra 操作位' },
  DictTag: { cat: '基础', desc: '字典标签：按 value 匹配 options 渲染彩色 el-tag' },
  StatusDot: { cat: '基础', desc: '状态圆点 + 文字（在线/离线等语义色）' },
  Empty: { cat: '基础', desc: '空状态占位，可插入操作按钮' },
  DemoBlock: { cat: '文档', desc: '组件中心用：实时预览 + 可折叠代码 + 复制为 AI 指令' },
  Playground: { cat: '文档', desc: '组件中心用：实时调 props → 同步生成代码 → 复制为 AI 指令' },
};

const CAT_ORDER = ['业务级', '基础', '文档'];

/** 从源码中截取第一个 defineProps<{ ... }> 的对象体（花括号配对） */
function extractPropsBody(src) {
  const marker = 'defineProps<{';
  const start = src.indexOf(marker);
  if (start === -1) return null;
  let i = start + marker.length;
  let depth = 1;
  let body = '';
  for (; i < src.length && depth > 0; i++) {
    const ch = src[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) break;
    }
    body += ch;
  }
  return body;
}

/** 解析 withDefaults 第二个实参里的简单默认值 { key: value } */
function extractDefaults(src) {
  const map = {};
  const m = src.match(/withDefaults\(\s*defineProps<\{[\s\S]*?\}>\(\),\s*\{([\s\S]*?)\}\s*,?\s*\)/);
  if (!m) return map;
  const body = m[1];
  const re = /(\w+)\s*:\s*([^,\n]+?)\s*,?\s*(?:\/\/.*)?$/gm;
  let x;
  while ((x = re.exec(body))) map[x[1]] = x[2].trim();
  return map;
}

/** 把 props 对象体解析为 [{ name, optional, type, comment, def }] */
function parseProps(body, defaults) {
  const props = [];
  let pendingComment = '';
  // 按换行与分号拆分：prop 之间以 ; 或换行分隔，而 prop 类型内部不含 ;（函数/泛型/联合都无）
  for (const raw of body.split(/[\n;]/)) {
    const line = raw.trim();
    if (!line) continue;
    const cm = line.match(/^\/\*\*\s*(.*?)\s*\*\/$/);
    if (cm) {
      pendingComment = cm[1];
      continue;
    }
    if (line.startsWith('//') || line.startsWith('*') || line.startsWith('/*')) continue;
    const pm = line.match(/^(\w+)(\?)?\s*:\s*(.+?);?$/);
    if (pm) {
      const name = pm[1];
      props.push({
        name,
        optional: !!pm[2],
        type: pm[3].trim(),
        comment: pendingComment,
        def: defaults[name],
      });
      pendingComment = '';
    } else {
      pendingComment = '';
    }
  }
  return props;
}

/** 读取 index.ts 里导出的组件名（保持声明顺序） */
function readExports() {
  const src = readFileSync(INDEX, 'utf-8');
  const names = [];
  const re = /export\s*\{\s*default\s+as\s+(\w+)\s*\}/g;
  let m;
  while ((m = re.exec(src))) names.push(m[1]);
  return names;
}

function buildComponents() {
  const names = readExports();
  const list = [];
  for (const name of names) {
    const file = join(PRO_DIR, `${name}.vue`);
    if (!existsSync(file)) continue;
    const src = readFileSync(file, 'utf-8');
    const body = extractPropsBody(src);
    const defaults = extractDefaults(src);
    const props = body ? parseProps(body, defaults) : [];
    const meta = META[name] || { cat: '其他', desc: '' };
    list.push({ name, ...meta, props });
  }
  return list;
}

/** 速查总表（README + catalog 顶部）*/
function renderSummary(list) {
  const lines = ['| 组件 | 分类 | 用途 | 主要 props |', '|---|---|---|---|'];
  const sorted = [...list].sort(
    (a, b) => CAT_ORDER.indexOf(a.cat) - CAT_ORDER.indexOf(b.cat),
  );
  for (const c of sorted) {
    const keyProps = c.props
      .slice(0, 4)
      .map((p) => `\`${p.name}${p.optional ? '?' : ''}\``)
      .join(' ');
    lines.push(`| **${c.name}** | ${c.cat} | ${c.desc} | ${keyProps || '—'} |`);
  }
  return lines.join('\n');
}

/** 逐组件详细 props 表（仅 catalog，给 AI 精确参考）*/
function renderDetails(list) {
  const out = [];
  for (const c of list) {
    if (!c.props.length) {
      out.push(`### ${c.name}\n\n${c.desc}（无 props，或通过插槽/事件使用）\n`);
      continue;
    }
    out.push(`### ${c.name}\n\n${c.desc}\n`);
    out.push('| prop | 类型 | 必填 | 默认 | 说明 |');
    out.push('|---|---|---|---|---|');
    for (const p of c.props) {
      const type = p.type.replace(/\|/g, '\\|'); // 转义管道符，避免破坏表格列
      out.push(
        `| \`${p.name}\` | \`${type}\` | ${p.optional ? '否' : '是'} | ${p.def ? `\`${p.def}\`` : '—'} | ${p.comment || '—'} |`,
      );
    }
    out.push('');
  }
  return out.join('\n');
}

/** 在标记区之间注入内容（无标记则跳过并告警） */
function inject(file, key, content) {
  const START = `<!-- ${key}:START -->`;
  const END = `<!-- ${key}:END -->`;
  let src = readFileSync(file, 'utf-8');
  const s = src.indexOf(START);
  const e = src.indexOf(END);
  if (s === -1 || e === -1) {
    console.warn(`⚠ ${file} 缺少 ${START} / ${END} 标记，跳过`);
    return false;
  }
  const before = src.slice(0, s + START.length);
  const after = src.slice(e);
  src = `${before}\n${content}\n${after}`;
  writeFileSync(file, src);
  return true;
}

function main() {
  const list = buildComponents();
  const summary = renderSummary(list);
  const details = renderDetails(list);
  const stamp = `> 本表由 \`node packages/skills-templates/gen-catalog.mjs\` 自动生成，勿手改。共 ${list.length} 个组件。`;

  inject(CATALOG, 'COMPONENTS', `\n${stamp}\n\n${summary}\n\n${details}`);
  inject(README, 'COMPONENTS', `\n${summary}\n`);

  // 同步一份到对外 skill 插件的参考资料，保持单一数据源
  mkdirSync(dirname(PLUGIN_CATALOG), { recursive: true });
  copyFileSync(CATALOG, PLUGIN_CATALOG);

  console.log(`✓ 已生成组件速查表（${list.length} 个组件）→ catalog.md + README.md + 插件 reference`);
}

main();
