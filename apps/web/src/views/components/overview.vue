<script setup lang="ts">
import { useRouter } from 'vue-router';
import { PageHeader } from '@/components/pro';

const router = useRouter();

const groups = [
  {
    title: '交互演练场',
    items: [
      { name: '🎛 Playground', desc: '实时调 props/样式看效果，代码同步生成', path: '/components/playground' },
    ],
  },
  {
    title: '业务级组件',
    items: [
      { name: 'ProTable', desc: '配置驱动表格：搜索 + 分页 + 工具栏 + 树表', path: '/components/table' },
      { name: 'CrudModal / SearchForm', desc: '配置驱动的增删改查弹窗与查询表单', path: '/components/form' },
      { name: 'Upload', desc: '图片上传（带 token、预览、校验）', path: '/components/upload' },
      { name: 'Chart', desc: '主题感知 ECharts：折线 / 饼图 / 中国地图', path: '/components/chart' },
    ],
  },
  {
    title: '基础组件与设计令牌',
    items: [
      { name: 'StatCard / PageHeader / DictTag', desc: 'KPI 卡片、页头、字典标签', path: '/components/basic' },
      { name: 'Design Tokens', desc: '色板 / 间距 / 圆角 / 阴影 · 明暗双主题', path: '/components/basic' },
    ],
  },
];
</script>

<template>
  <div>
    <PageHeader title="组件中心" subtitle="每个组件都有实时预览 + 可复制用法，拿来即用。起新项目时可整块删除本目录。" />
    <div v-for="g in groups" :key="g.title" class="group">
      <div class="group__title">{{ g.title }}</div>
      <div class="grid">
        <div v-for="it in g.items" :key="it.name" class="card" @click="router.push(it.path)">
          <div class="card__name">{{ it.name }}</div>
          <div class="card__desc">{{ it.desc }}</div>
          <div class="card__link">查看用法 →</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group {
  margin-bottom: var(--ya-spacing-2xl);
}
.group__title {
  font-size: var(--ya-font-md);
  font-weight: 600;
  color: var(--ya-text-primary);
  margin-bottom: var(--ya-spacing-lg);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--ya-spacing-lg);
}
.card {
  padding: var(--ya-spacing-xl);
  background: var(--ya-bg-container);
  border: 1px solid var(--ya-border-color-light);
  border-radius: var(--ya-radius-lg);
  box-shadow: var(--ya-shadow-sm);
  cursor: pointer;
  transition: all var(--ya-transition-base);
}
.card:hover {
  box-shadow: var(--ya-shadow-lg);
  transform: translateY(-2px);
  border-color: var(--ya-color-primary);
}
.card__name {
  font-size: var(--ya-font-md);
  font-weight: 600;
  color: var(--ya-color-primary);
}
.card__desc {
  margin: 8px 0 12px;
  font-size: var(--ya-font-sm);
  color: var(--ya-text-secondary);
  line-height: 1.6;
}
.card__link {
  font-size: var(--ya-font-sm);
  color: var(--ya-text-regular);
}
</style>
