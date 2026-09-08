import type { FormItemRule } from 'element-plus';

/** 表单/搜索控件类型 */
export type FieldType =
  | 'input'
  | 'textarea'
  | 'password'
  | 'number'
  | 'select'
  | 'switch'
  | 'date'
  | 'daterange'
  | 'treeSelect';

export interface FieldOption {
  label: string;
  value: string | number | boolean;
}

/** 表单/搜索字段配置 */
export interface FormField {
  prop: string;
  label: string;
  type?: FieldType;
  options?: FieldOption[];
  placeholder?: string;
  /** 栅格跨度（表单布局用，1-24），默认 24 */
  span?: number;
  rules?: FormItemRule[];
  /** 透传给底层 Element 组件的额外属性 */
  props?: Record<string, unknown>;
  /** treeSelect 的树数据 */
  treeData?: any[];
  /** 默认值（新增时填充） */
  defaultValue?: unknown;
}

/** 表格列配置 */
export interface ProColumn {
  prop?: string;
  label: string;
  width?: number | string;
  minWidth?: number | string;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  sortable?: boolean;
  showOverflowTooltip?: boolean;
  /** 具名插槽渲染：#col-[slot] */
  slot?: string;
  /** 文本格式化 */
  formatter?: (row: Record<string, unknown>) => string;
  /** 渲染为 el-tag：返回文本与类型 */
  tag?: (row: Record<string, unknown>) => { text: string; type?: string };
}

/** 分页请求返回 */
export interface FetchResult<T = Record<string, unknown>> {
  list: T[];
  total: number;
}
