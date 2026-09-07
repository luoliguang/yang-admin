import type { Router } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePermissionStore } from '@/stores/permission';

const WHITE_LIST = ['/login', '/404'];

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to) => {
    const auth = useAuthStore();

    // 已登录访问登录页 → 回首页
    if (to.path === '/login') {
      return auth.token ? '/' : true;
    }

    // 无 token
    if (!auth.token) {
      if (WHITE_LIST.includes(to.path)) return true;
      return { path: '/login', query: { redirect: to.fullPath } };
    }

    // 已登录但动态路由未生成 → 拉取权限并注册
    const permission = usePermissionStore();
    if (!permission.generated) {
      try {
        const menuTree = await auth.fetchProfile();
        const routes = permission.generateRoutes(menuTree);
        routes.forEach((r) => router.addRoute('Layout', r));
        // 兜底 404
        router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/404' });
        // 重新进入以命中新注册的路由
        return { ...to, replace: true };
      } catch {
        auth.logout();
        return { path: '/login', query: { redirect: to.fullPath } };
      }
    }

    return true;
  });
}
