/**
 * @yang-admin/shared — 跨栈共享层
 * 前后端共享的类型、常量、工具与 API 契约。此包与前端框架无关。
 */

/** 统一 API 响应格式（前后端共同遵守） */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/** 分页请求参数 */
export interface PageQuery {
  page: number;
  pageSize: number;
}

/** 分页响应 */
export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
