#!/usr/bin/env node
/**
 * yang-admin CRUD 代码生成器
 * 读取资源配置(resources/<name>.json)，生成:
 *   - 后端: apps/server/src/modules/<name>/{dto,service,controller,module}
 *   - 前端: apps/web/src/api/<name>.ts + apps/web/src/views/<dir>/index.vue
 *
 * 用法: node packages/skills-templates/generate-crud.mjs <name>
 * 前提: Prisma 中已存在对应 model；生成后需手动在 app.module 引入模块、在菜单中挂路由。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const name = process.argv[2];
if (!name) {
  console.error('用法: node generate-crud.mjs <resource-name>');
  process.exit(1);
}

const cfgPath = join(__dirname, 'resources', `${name}.json`);
if (!existsSync(cfgPath)) {
  console.error(`找不到资源配置: ${cfgPath}`);
  process.exit(1);
}
const cfg = JSON.parse(readFileSync(cfgPath, 'utf-8'));
const { modelName, label, route, permissionPrefix, fields } = cfg;

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const Model = modelName; // Prisma model (PascalCase)
const model = modelName.charAt(0).toLowerCase() + modelName.slice(1); // prisma client 属性
const Name = cap(name);

const isNum = (f) => f.type === 'number' || f.type === 'switch' || (f.type === 'select' && typeof f.options?.[0]?.value === 'number');
const tsType = (f) => (isNum(f) ? 'number' : 'string');
const searchable = fields.filter((f) => f.search && !isNum(f));

function write(path, content) {
  const full = join(ROOT, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
  console.log('  ✓', path);
}

// ---------------- 后端 ----------------
const dtoFields = fields
  .map((f) => {
    const dec = isNum(f) ? '@IsInt()' : f.type === 'textarea' || f.type === 'input' || f.type === 'select' ? '@IsString()' : '@IsString()';
    const req = f.required ? '' : '@IsOptional() ';
    const opt = f.required ? '!' : '?';
    return `  @ApiProperty()\n  ${req}${isNum(f) ? '@IsInt()' : '@IsString()'} ${f.prop}${opt}: ${tsType(f)};`;
  })
  .join('\n');

write(`apps/server/src/modules/${name}/dto/${name}.dto.ts`, `import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class Create${Name}Dto {
${dtoFields}
}

export class Update${Name}Dto extends PartialType(Create${Name}Dto) {}
`);

const whereKeyword = searchable.length
  ? `keyword
      ? { OR: [${searchable.map((f) => `{ ${f.prop}: { contains: keyword } }`).join(', ')}] }
      : {}`
  : `{}`;

write(`apps/server/src/modules/${name}/${name}.service.ts`, `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { PageQueryDto } from '../../common/dto/page-query.dto';
import type { Create${Name}Dto, Update${Name}Dto } from './dto/${name}.dto';

@Injectable()
export class ${Name}Service {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PageQueryDto) {
    const { page, pageSize, keyword } = query;
    const where = ${whereKeyword};
    const [list, total] = await Promise.all([
      this.prisma.${model}.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { id: 'desc' } }),
      this.prisma.${model}.count({ where }),
    ]);
    return { list, total, page, pageSize };
  }

  create(dto: Create${Name}Dto) {
    return this.prisma.${model}.create({ data: dto });
  }

  async update(id: number, dto: Update${Name}Dto) {
    await this.ensure(id);
    return this.prisma.${model}.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.ensure(id);
    return this.prisma.${model}.delete({ where: { id } });
  }

  private async ensure(id: number) {
    const found = await this.prisma.${model}.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('${label}不存在');
  }
}
`);

write(`apps/server/src/modules/${name}/${name}.controller.ts`, `import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ${Name}Service } from './${name}.service';
import { Create${Name}Dto, Update${Name}Dto } from './dto/${name}.dto';
import { PageQueryDto } from '../../common/dto/page-query.dto';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';

@ApiTags('${label}管理')
@ApiBearerAuth()
@Controller('${name}')
export class ${Name}Controller {
  constructor(private readonly ${name}Service: ${Name}Service) {}

  @Get()
  @ApiOperation({ summary: '${label}分页列表' })
  @RequirePermission('${permissionPrefix}:list')
  findAll(@Query() query: PageQueryDto) {
    return this.${name}Service.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: '新增${label}' })
  @RequirePermission('${permissionPrefix}:add')
  create(@Body() dto: Create${Name}Dto) {
    return this.${name}Service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑${label}' })
  @RequirePermission('${permissionPrefix}:edit')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Update${Name}Dto) {
    return this.${name}Service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除${label}' })
  @RequirePermission('${permissionPrefix}:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.${name}Service.remove(id);
  }
}
`);

write(`apps/server/src/modules/${name}/${name}.module.ts`, `import { Module } from '@nestjs/common';
import { ${Name}Service } from './${name}.service';
import { ${Name}Controller } from './${name}.controller';

@Module({
  controllers: [${Name}Controller],
  providers: [${Name}Service],
})
export class ${Name}Module {}
`);

// ---------------- 前端 ----------------
write(`apps/web/src/api/${name}.ts`, `import { request } from '@/utils/request';
import type { PageResult } from '@yang-admin/shared';

export interface ${Name}Item {
  id: number;
${fields.map((f) => `  ${f.prop}?: ${tsType(f)};`).join('\n')}
}

export const get${Name}sApi = (params: Record<string, unknown>) =>
  request<PageResult<${Name}Item>>({ url: '/${name}', method: 'get', params });
export const create${Name}Api = (data: Record<string, unknown>) =>
  request({ url: '/${name}', method: 'post', data });
export const update${Name}Api = (id: number, data: Record<string, unknown>) =>
  request({ url: \`/${name}/\${id}\`, method: 'put', data });
export const delete${Name}Api = (id: number) =>
  request({ url: \`/${name}/\${id}\`, method: 'delete' });
`);

const columns = fields
  .filter((f) => f.column)
  .map((f) => {
    if (f.type === 'switch') return `  { label: '${f.label}', width: 90, tag: (r) => ({ text: r.${f.prop} === 1 ? '启用' : '禁用', type: r.${f.prop} === 1 ? 'success' : 'info' }) },`;
    if (f.type === 'select' && f.options) {
      const map = f.options.map((o) => `${JSON.stringify(o.value)}: '${o.label}'`).join(', ');
      return `  { prop: '${f.prop}', label: '${f.label}', formatter: (r) => (({ ${map} } as Record<string, string>)[String(r.${f.prop})] ?? r.${f.prop}) as string },`;
    }
    return `  { prop: '${f.prop}', label: '${f.label}', minWidth: 140, showOverflowTooltip: true },`;
  })
  .join('\n');

const searchFieldsCode = fields
  .filter((f) => f.search)
  .map((f) => `  { prop: '${f.prop}', label: '${f.label}' },`)
  .join('\n');

const dialogFieldsCode = fields
  .map((f) => {
    let extra = '';
    if (f.required) extra += `, rules: [{ required: true, message: '请输入${f.label}', trigger: 'blur' }]`;
    if (f.type === 'select' && f.options) extra += `, type: 'select', options: ${JSON.stringify(f.options)}`;
    else if (f.type === 'switch') extra += `, type: 'switch', props: { activeValue: 1, inactiveValue: 0 }`;
    else if (f.type === 'textarea') extra += `, type: 'textarea'`;
    else if (f.type === 'number') extra += `, type: 'number'`;
    return `  { prop: '${f.prop}', label: '${f.label}'${extra} },`;
  })
  .join('\n');

write(`apps/web/src/views/${name}/index.vue`, `<script setup lang="ts">
// ⚙️ 由 generate-crud 生成，可继续手动编辑
import { reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { ProTable, CrudModal, type ProColumn, type FormField } from '@/components/pro';
import { get${Name}sApi, create${Name}Api, update${Name}Api, delete${Name}Api, type ${Name}Item } from '@/api/${name}';

const tableRef = ref<InstanceType<typeof ProTable>>();

const columns: ProColumn[] = [
  { prop: 'id', label: 'ID', width: 70 },
${columns}
  { label: '操作', width: 150, fixed: 'right', slot: 'action' },
];

const searchFields: FormField[] = [
${searchFieldsCode}
];

const dialogVisible = ref(false);
const isEdit = ref(false);
const editId = ref<number>();
const model = reactive<Record<string, any>>({});

const dialogFields: FormField[] = [
${dialogFieldsCode}
];

function openCreate() {
  isEdit.value = false;
  editId.value = undefined;
  Object.keys(model).forEach((k) => delete model[k]);
  dialogVisible.value = true;
}
function openEdit(row: ${Name}Item | Record<string, any>) {
  isEdit.value = true;
  editId.value = row.id;
  Object.keys(model).forEach((k) => delete model[k]);
  Object.assign(model, row);
  dialogVisible.value = true;
}
async function submit(data: Record<string, unknown>) {
  if (isEdit.value && editId.value) await update${Name}Api(editId.value, data);
  else await create${Name}Api(data);
}
async function onDelete(row: ${Name}Item | Record<string, any>) {
  await ElMessageBox.confirm('确定删除该${label}吗？', '提示', { type: 'warning' });
  await delete${Name}Api(row.id);
  ElMessage.success('删除成功');
  tableRef.value?.reload();
}
</script>

<template>
  <ProTable ref="tableRef" :columns="columns" :search-fields="searchFields" :request="get${Name}sApi as any">
    <template #toolbar>
      <el-button v-permission="'${permissionPrefix}:add'" type="primary" :icon="Plus" @click="openCreate">新增${label}</el-button>
    </template>
    <template #col-action="{ row }">
      <el-button v-permission="'${permissionPrefix}:edit'" size="small" text type="primary" @click="openEdit(row)">编辑</el-button>
      <el-button v-permission="'${permissionPrefix}:delete'" size="small" text type="danger" @click="onDelete(row)">删除</el-button>
    </template>
  </ProTable>

  <CrudModal
    v-model="dialogVisible"
    :title="isEdit ? '编辑${label}' : '新增${label}'"
    :fields="dialogFields"
    :model="model"
    :submit="submit"
    @submitted="tableRef?.reload()"
  />
</template>
`);

console.log(`\\n✅ 已生成 ${label}(${name}) CRUD。后续手动步骤:`);
console.log(`  1. 确认 Prisma 有 model ${Model} 并已迁移`);
console.log(`  2. 在 apps/server/src/app.module.ts 引入 ${Name}Module`);
console.log(`  3. 通过「菜单管理」新增路由 ${route}(component: ${name}/index)与按钮权限 ${permissionPrefix}:*`);
