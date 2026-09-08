import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * 轻量 Mock 适配层：VITE_USE_MOCK=true 时启用，让前端脱离后端也能登录演示。
 * 仅覆盖打通所需的核心接口，非全量。
 */

const menuTree = [
  { id: 1, parentId: null, type: 1, title: '仪表盘', name: 'Dashboard', path: '/dashboard', component: 'dashboard/index', icon: 'Odometer' },
  {
    id: 2, parentId: null, type: 0, title: '系统管理', path: '/system', icon: 'Setting',
    children: [
      { id: 3, parentId: 2, type: 1, title: '用户管理', name: 'SystemUser', path: '/system/user', component: 'system/user/index', permission: 'system:user:list' },
      { id: 7, parentId: 2, type: 1, title: '角色管理', name: 'SystemRole', path: '/system/role', component: 'system/role/index', permission: 'system:role:list' },
      { id: 11, parentId: 2, type: 1, title: '菜单管理', name: 'SystemMenu', path: '/system/menu', component: 'system/menu/index', permission: 'system:menu:list' },
    ],
  },
  {
    id: 20, parentId: null, type: 0, title: '组件中心', path: '/components', icon: 'Grid',
    children: [
      { id: 21, parentId: 20, type: 1, title: '概览', name: 'CompOverview', path: '/components/overview', component: 'components/overview', icon: 'Grid' },
      { id: 27, parentId: 20, type: 1, title: '交互演练场', name: 'CompPlayground', path: '/components/playground', component: 'components/playground', icon: 'Odometer' },
      { id: 22, parentId: 20, type: 1, title: '基础与令牌', name: 'CompBasic', path: '/components/basic', component: 'components/basic', icon: 'List' },
      { id: 23, parentId: 20, type: 1, title: 'ProTable', name: 'CompTable', path: '/components/table', component: 'components/table', icon: 'List' },
      { id: 24, parentId: 20, type: 1, title: '表单与弹窗', name: 'CompForm', path: '/components/form', component: 'components/form', icon: 'Document' },
      { id: 25, parentId: 20, type: 1, title: '文件上传', name: 'CompUpload', path: '/components/upload', component: 'components/upload', icon: 'Document' },
      { id: 26, parentId: 20, type: 1, title: '图表', name: 'CompChart', path: '/components/chart', component: 'components/chart', icon: 'Odometer' },
    ],
  },
];

const users = [
  { id: 1, username: 'admin', nickname: '管理员（Mock）', email: 'admin@yang-admin.dev', status: 1, createdAt: new Date().toISOString(), roles: [{ id: 1, name: '超级管理员', code: 'admin' }] },
];
const roles = [
  { id: 1, name: '超级管理员', code: 'admin', remark: 'Mock 数据', status: 1, menuIds: [1, 2, 3, 7, 11] },
  { id: 2, name: '访客', code: 'guest', remark: '仅仪表盘', status: 1, menuIds: [1] },
];

function ok(data: unknown): Partial<AxiosResponse> {
  return { data: { code: 0, message: 'ok', data }, status: 200, statusText: 'OK' };
}

function match(config: InternalAxiosRequestConfig): Partial<AxiosResponse> {
  const url = (config.url || '').replace(config.baseURL || '', '');
  const method = (config.method || 'get').toLowerCase();

  if (url.endsWith('/auth/login')) {
    return ok({ accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' });
  }
  if (url.endsWith('/auth/refresh')) {
    return ok({ accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' });
  }
  if (url.endsWith('/auth/profile')) {
    return ok({
      user: { id: 1, username: 'admin', nickname: '管理员（Mock）', avatar: '', email: 'admin@yang-admin.dev' },
      roles: ['admin'],
      permissions: ['*'],
      routes: menuTree,
    });
  }
  if (url.includes('/users') && method === 'get') {
    return ok({ list: users, total: users.length, page: 1, pageSize: 10 });
  }
  if (url.includes('/roles') && method === 'get') {
    return ok({ list: roles, total: roles.length, page: 1, pageSize: 10 });
  }
  if (url.endsWith('/menus/tree')) {
    return ok(menuTree);
  }
  // 其它写操作统一返回成功
  return ok(null);
}

export const mockAdapter: AxiosAdapter = (config) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const res = match(config as InternalAxiosRequestConfig);
      resolve({ ...res, headers: {}, config } as AxiosResponse);
    }, 200);
  });
