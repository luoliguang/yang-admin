import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { ElMessage } from 'element-plus';
import type { ApiResponse } from '@yang-admin/shared';
import { useAuthStore } from '@/stores/auth';

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 15000,
});

const mockAdapterReady =
  import.meta.env.VITE_USE_MOCK === 'true'
    ? import('@/mock').then(({ mockAdapter }) => {
        service.defaults.adapter = mockAdapter;
        // eslint-disable-next-line no-console
        console.info('[yang-admin] Mock 模式已启用');
      })
    : Promise.resolve();

// ---- 请求拦截：附加 token ----
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const auth = useAuthStore();
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

service.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  await mockAdapterReady;
  return config;
});

let refreshing = false;
let waitQueue: Array<(token: string) => void> = [];

// ---- 响应拦截：解包 + 错误处理 + 401 刷新 ----
service.interceptors.response.use(
  // 解包后返回 data，故返回类型为 any
  (response): any => {
    const body = response.data as ApiResponse;
    // 后端统一格式 { code, message, data }
    if (body && typeof body === 'object' && 'code' in body) {
      if (body.code === 0) return body.data;
      ElMessage.error(body.message || '请求失败');
      return Promise.reject(new Error(body.message));
    }
    return body;
  },
  async (error) => {
    const { response, config } = error;
    const auth = useAuthStore();

    if (response?.status === 401 && !config._retry && auth.refreshToken) {
      // 令牌过期，尝试刷新一次
      if (refreshing) {
        return new Promise((resolve) => {
          waitQueue.push((token: string) => {
            config.headers.Authorization = `Bearer ${token}`;
            config._retry = true;
            resolve(service(config));
          });
        });
      }
      refreshing = true;
      try {
        const newToken = await auth.doRefresh();
        waitQueue.forEach((cb) => cb(newToken));
        waitQueue = [];
        config._retry = true;
        config.headers.Authorization = `Bearer ${newToken}`;
        return service(config);
      } catch {
        auth.logout();
        window.location.href = '/login';
        return Promise.reject(error);
      } finally {
        refreshing = false;
      }
    }

    const msg =
      response?.data?.message || error.message || '网络异常，请稍后重试';
    if (response?.status === 401) {
      auth.logout();
      window.location.href = '/login';
    } else {
      ElMessage.error(msg);
    }
    return Promise.reject(error);
  },
);

/** 泛型请求，返回解包后的 data */
export function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  return service(config) as unknown as Promise<T>;
}

export default service;
