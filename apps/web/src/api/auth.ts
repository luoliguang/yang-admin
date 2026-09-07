import { request } from '@/utils/request';

export interface LoginParams {
  username: string;
  password: string;
}
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
export interface MenuNode {
  id: number;
  parentId: number | null;
  type: number;
  title: string;
  name?: string;
  path?: string;
  component?: string;
  icon?: string;
  permission?: string;
  children?: MenuNode[];
}
export interface Profile {
  user: { id: number; username: string; nickname?: string; avatar?: string; email?: string };
  roles: string[];
  permissions: string[];
  routes: MenuNode[];
}

export const loginApi = (data: LoginParams) =>
  request<TokenPair>({ url: '/auth/login', method: 'post', data });

export const refreshApi = (refreshToken: string) =>
  request<TokenPair>({ url: '/auth/refresh', method: 'post', data: { refreshToken } });

export const getProfileApi = () => request<Profile>({ url: '/auth/profile', method: 'get' });
