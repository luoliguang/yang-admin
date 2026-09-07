import type { App, Directive } from 'vue';
import { useAuthStore } from '@/stores/auth';

/**
 * v-permission="'system:user:add'" 或 v-permission="['a','b']"
 * 当前用户不具备权限时移除该元素。
 */
const permission: Directive = {
  mounted(el: HTMLElement, binding) {
    const auth = useAuthStore();
    const value = binding.value as string | string[];
    const codes = Array.isArray(value) ? value : [value];
    const ok = auth.permissions.includes('*') || codes.some((c) => auth.permissions.includes(c));
    if (!ok) el.parentNode?.removeChild(el);
  },
};

export function setupDirectives(app: App) {
  app.directive('permission', permission);
}
