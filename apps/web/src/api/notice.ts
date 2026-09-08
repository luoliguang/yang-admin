import { request } from '@/utils/request';
import type { PageResult } from '@yang-admin/shared';

export interface NoticeItem {
  id: number;
  title?: string;
  type?: number;
  content?: string;
  status?: number;
}

export const getNoticesApi = (params: Record<string, unknown>) =>
  request<PageResult<NoticeItem>>({ url: '/notice', method: 'get', params });
export const createNoticeApi = (data: Record<string, unknown>) =>
  request({ url: '/notice', method: 'post', data });
export const updateNoticeApi = (id: number, data: Record<string, unknown>) =>
  request({ url: `/notice/${id}`, method: 'put', data });
export const deleteNoticeApi = (id: number) =>
  request({ url: `/notice/${id}`, method: 'delete' });
