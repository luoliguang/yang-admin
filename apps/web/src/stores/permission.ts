import { defineStore } from 'pinia';
import { ref, markRaw } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import type { MenuNode } from '@/api/auth';

// 所有页面组件（懒加载）。相对路径以确保 glob key 稳定。
const viewModules = import.meta.glob('../views/**/*.vue');
// 目录型菜单的占位父组件
const ParentView = () => import('@/layouts/default/components/ParentView.vue');

function resolveComponent(component?: string) {
  if (!component) return ParentView;
  const key = `../views/${component}.vue`;
  const loader = viewModules[key];
  if (!loader) {
    // eslint-disable-next-line no-console
    console.warn(`[permission] 未找到视图组件: ${key}`);
    return () => import('../views/error/404.vue');
  }
  return loader as () => Promise<unknown>;
}

/** 后端菜单树 → Vue Router 路由（保留层级，供面包屑使用） */
function toRoutes(menus: MenuNode[]): RouteRecordRaw[] {
  return menus
    .filter((m) => m.type !== 2 && m.path)
    .map((m) => {
      // RouteRecordRaw 是判别联合，用宽松对象构造再断言，避免联合分支报错
      const route: Record<string, unknown> = {
        path: m.path!,
        name: m.name || `menu-${m.id}`,
        component: markRaw(resolveComponent(m.component)),
        meta: { title: m.title, icon: m.icon },
      };
      const children = m.children ? toRoutes(m.children) : [];
      if (children.length) {
        route.children = children;
        // 目录默认重定向到首个子路由
        if (!m.component) route.redirect = (children[0] as { path: string }).path;
      }
      return route as unknown as RouteRecordRaw;
    });
}

export const usePermissionStore = defineStore('permission', () => {
  const menus = ref<MenuNode[]>([]);
  const dynamicRoutes = ref<RouteRecordRaw[]>([]);
  const generated = ref(false);

  function generateRoutes(menuTree: MenuNode[]): RouteRecordRaw[] {
    menus.value = menuTree;
    dynamicRoutes.value = toRoutes(menuTree);
    generated.value = true;
    return dynamicRoutes.value;
  }

  function reset() {
    menus.value = [];
    dynamicRoutes.value = [];
    generated.value = false;
  }

  return { menus, dynamicRoutes, generated, generateRoutes, reset };
});
