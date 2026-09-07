import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { loginApi, refreshApi, getProfileApi, type LoginParams, type MenuNode } from '@/api/auth';
import { usePermissionStore } from './permission';

export const useAuthStore = defineStore('auth', () => {
  const token = useStorage('ya-token', '');
  const refreshToken = useStorage('ya-refresh-token', '');
  const userInfo = ref<{ username: string; nickname?: string; avatar?: string } | null>(null);
  const roles = ref<string[]>([]);
  const permissions = ref<string[]>([]);
  const loaded = ref(false);

  async function login(params: LoginParams) {
    const { accessToken, refreshToken: rt } = await loginApi(params);
    token.value = accessToken;
    refreshToken.value = rt;
  }

  async function doRefresh(): Promise<string> {
    const { accessToken, refreshToken: rt } = await refreshApi(refreshToken.value);
    token.value = accessToken;
    refreshToken.value = rt;
    return accessToken;
  }

  /** 拉取用户资料并返回后端菜单树 */
  async function fetchProfile(): Promise<MenuNode[]> {
    const profile = await getProfileApi();
    userInfo.value = profile.user;
    roles.value = profile.roles;
    permissions.value = profile.permissions;
    loaded.value = true;
    return profile.routes;
  }

  function hasPermission(code: string) {
    return permissions.value.includes('*') || permissions.value.includes(code);
  }

  function logout() {
    token.value = '';
    refreshToken.value = '';
    userInfo.value = null;
    roles.value = [];
    permissions.value = [];
    loaded.value = false;
    usePermissionStore().reset();
  }

  return {
    token,
    refreshToken,
    userInfo,
    roles,
    permissions,
    loaded,
    login,
    doRefresh,
    fetchProfile,
    hasPermission,
    logout,
  };
});
