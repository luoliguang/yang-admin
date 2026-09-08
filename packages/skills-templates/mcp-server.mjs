#!/usr/bin/env node
/**
 * yang-admin MCP 服务：把 CRUD 生成器暴露为 MCP 工具，供 Claude Code / 其它 MCP 客户端调用。
 * 工具：
 *   - list_resources    列出已有资源配置
 *   - scaffold_resource 写入一份新的资源配置 json
 *   - generate_crud     依据配置生成后端模块 + 前端页面
 *
 * 接入（Claude Code）：在 .mcp.json / settings 中加：
 *   { "mcpServers": { "yang-admin": { "command": "node",
 *     "args": ["packages/skills-templates/mcp-server.mjs"] } } }
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RES_DIR = join(__dirname, 'resources');
const GEN = join(__dirname, 'generate-crud.mjs');

const server = new Server(
  { name: 'yang-admin', version: '1.0.0' },
  { capabilities: { tools: {} } },
);

const TOOLS = [
  {
    name: 'list_resources',
    description: '列出已有的 CRUD 资源配置（resources/*.json）',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'scaffold_resource',
    description: '创建一份新的 CRUD 资源配置 json（写入 resources/<name>.json）',
    inputSchema: {
      type: 'object',
      required: ['name', 'modelName', 'label', 'route', 'permissionPrefix', 'fields'],
      properties: {
        name: { type: 'string', description: '资源名（小写，文件/目录用）' },
        modelName: { type: 'string', description: 'Prisma model（PascalCase）' },
        label: { type: 'string', description: '中文名' },
        route: { type: 'string', description: '前端路由，如 /system/notice' },
        permissionPrefix: { type: 'string', description: '权限前缀，如 system:notice' },
        fields: {
          type: 'array',
          description: '字段数组，每项 { prop, label, type, search?, required?, column?, options? }',
          items: { type: 'object' },
        },
      },
    },
  },
  {
    name: 'generate_crud',
    description: '依据资源配置生成后端模块 + 前端页面。需先有对应 Prisma model 与配置文件。',
    inputSchema: {
      type: 'object',
      required: ['name'],
      properties: { name: { type: 'string', description: '资源名（对应 resources/<name>.json）' } },
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args = {} } = req.params;
  try {
    if (name === 'list_resources') {
      const files = existsSync(RES_DIR) ? readdirSync(RES_DIR).filter((f) => f.endsWith('.json')) : [];
      const list = files.map((f) => {
        const cfg = JSON.parse(readFileSync(join(RES_DIR, f), 'utf-8'));
        return `${f.replace('.json', '')} → ${cfg.label} (${cfg.route})`;
      });
      return { content: [{ type: 'text', text: list.join('\n') || '（暂无资源配置）' }] };
    }

    if (name === 'scaffold_resource') {
      const { name: res, ...cfg } = args;
      const path = join(RES_DIR, `${res}.json`);
      writeFileSync(path, JSON.stringify(cfg, null, 2));
      return { content: [{ type: 'text', text: `已写入配置: resources/${res}.json` }] };
    }

    if (name === 'generate_crud') {
      const out = execFileSync('node', [GEN, args.name], { encoding: 'utf-8' });
      return { content: [{ type: 'text', text: out }] };
    }

    return { content: [{ type: 'text', text: `未知工具: ${name}` }], isError: true };
  } catch (e) {
    return { content: [{ type: 'text', text: `执行失败: ${e.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
// eslint-disable-next-line no-console
console.error('yang-admin MCP server ready (stdio)');
