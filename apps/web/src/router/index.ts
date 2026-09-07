import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

/**
 * 路由表。meta.title / meta.icon 同时驱动侧边栏菜单与面包屑。
 * P3 阶段将改为按权限动态生成，这里先用静态路由打通布局。
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/default/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'Odometer', affix: true },
      },
      {
        path: 'demo',
        name: 'Demo',
        redirect: '/demo/table',
        meta: { title: '组件示例', icon: 'Grid' },
        children: [
          {
            path: 'table',
            name: 'DemoTable',
            component: () => import('@/views/demo/table.vue'),
            meta: { title: '数据表格', icon: 'List' },
          },
          {
            path: 'form',
            name: 'DemoForm',
            component: () => import('@/views/demo/form.vue'),
            meta: { title: '表单页', icon: 'Document' },
          },
        ],
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/about/index.vue'),
        meta: { title: '关于', icon: 'InfoFilled' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

export default router;
