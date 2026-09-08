import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { setupRouterGuard } from './guard';

/** 常量路由：无需权限即可访问 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hideMenu: true },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', hideMenu: true },
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layouts/default/index.vue'),
    redirect: '/dashboard',
    children: [],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFoundFallback',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', hideMenu: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ top: 0 }),
});

setupRouterGuard(router);

export default router;
