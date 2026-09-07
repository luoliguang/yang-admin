import { request } from '@/utils/request';
import type { PageResult } from '@yang-admin/shared';
import type { MenuNode } from './auth';

export interface PageParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

// ---- 用户 ----
export interface UserItem {
  id: number;
  username: string;
  nickname?: string;
  email?: string;
  status: number;
  createdAt: string;
  roles: { id: number; name: string; code: string }[];
}
export const getUsersApi = (params: PageParams) =>
  request<PageResult<UserItem>>({ url: '/users', method: 'get', params });
export const createUserApi = (data: Record<string, unknown>) =>
  request({ url: '/users', method: 'post', data });
export const updateUserApi = (id: number, data: Record<string, unknown>) =>
  request({ url: `/users/${id}`, method: 'put', data });
export const deleteUserApi = (id: number) =>
  request({ url: `/users/${id}`, method: 'delete' });

// ---- 角色 ----
export interface RoleItem {
  id: number;
  name: string;
  code: string;
  remark?: string;
  status: number;
  menuIds: number[];
}
export const getRolesApi = (params: PageParams) =>
  request<PageResult<RoleItem>>({ url: '/roles', method: 'get', params });
export const createRoleApi = (data: Record<string, unknown>) =>
  request({ url: '/roles', method: 'post', data });
export const updateRoleApi = (id: number, data: Record<string, unknown>) =>
  request({ url: `/roles/${id}`, method: 'put', data });
export const deleteRoleApi = (id: number) =>
  request({ url: `/roles/${id}`, method: 'delete' });

// ---- 菜单 ----
export const getMenuTreeApi = () => request<MenuNode[]>({ url: '/menus/tree', method: 'get' });
export const createMenuApi = (data: Record<string, unknown>) =>
  request({ url: '/menus', method: 'post', data });
export const updateMenuApi = (id: number, data: Record<string, unknown>) =>
  request({ url: `/menus/${id}`, method: 'put', data });
export const deleteMenuApi = (id: number) =>
  request({ url: `/menus/${id}`, method: 'delete' });
