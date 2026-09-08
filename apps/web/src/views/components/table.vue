<script setup lang="ts">
import { PageHeader, ProTable, DemoBlock, type ProColumn, type FormField, type FetchResult } from '@/components/pro';

// 演示用本地数据（真实项目里换成接口）
const ALL = Array.from({ length: 26 }, (_, i) => ({
  id: i + 1,
  name: `示例用户 ${i + 1}`,
  role: ['管理员', '运营', '访客'][i % 3],
  status: i % 4 === 0 ? 0 : 1,
  createdAt: `2026-09-${String((i % 28) + 1).padStart(2, '0')}`,
}));

function request(params: Record<string, unknown>): Promise<FetchResult> {
  const { page = 1, pageSize = 10, keyword } = params as { page: number; pageSize: number; keyword?: string };
  let list = ALL;
  if (keyword) list = list.filter((r) => r.name.includes(keyword as string));
  const start = (page - 1) * pageSize;
  return Promise.resolve({ list: list.slice(start, start + pageSize), total: list.length });
}

const searchFields: FormField[] = [{ prop: 'keyword', label: '关键字', placeholder: '用户名' }];

const columns: ProColumn[] = [
  { prop: 'id', label: 'ID', width: 70 },
  { prop: 'name', label: '姓名', minWidth: 140 },
  { prop: 'role', label: '角色' },
  { label: '状态', width: 90, tag: (r) => ({ text: r.status === 1 ? '启用' : '禁用', type: r.status === 1 ? 'success' : 'info' }) },
  { prop: 'createdAt', label: '创建时间', width: 140 },
  { label: '操作', width: 130, fixed: 'right', slot: 'action' },
];

const code = `<ProTable :columns="columns" :search-fields="searchFields" :request="request">
  <template #toolbar>
    <el-button v-permission="'x:add'" type="primary" :icon="Plus">新增</el-button>
  </template>
  <template #col-action="{ row }">
    <el-button text type="primary" @click="edit(row)">编辑</el-button>
    <el-button text type="danger" @click="del(row)">删除</el-button>
  </template>
</ProTable>

// columns: ProColumn[]  — 支持 tag/formatter/slot 三种自定义列
// request: (params) => Promise<{ list, total }>  — 自动传入 page/pageSize/搜索项`;
</script>

<template>
  <div>
    <PageHeader title="ProTable" subtitle="配置驱动表格：内置搜索栏、工具栏、分页。写 columns + request 即可。" />
    <DemoBlock title="基础用法" desc="搜索、分页、自定义状态列(tag)、操作列(slot)全由配置生成。" :code="code">
      <ProTable :columns="columns" :search-fields="searchFields" :request="request">
        <template #toolbar>
          <el-button type="primary">新增</el-button>
        </template>
        <template #col-action>
          <el-button size="small" text type="primary">编辑</el-button>
          <el-button size="small" text type="danger">删除</el-button>
        </template>
      </ProTable>
    </DemoBlock>
  </div>
</template>
