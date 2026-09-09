import {
  Odometer,
  Grid,
  List,
  Document,
  InfoFilled,
  Fold,
  Expand,
  FullScreen,
  Setting,
  Moon,
  Sunny,
  Close,
  CircleClose,
  ArrowDown,
  ShoppingCart,
  Menu as MenuIcon,
} from '@element-plus/icons-vue';
import type { Component } from 'vue';

/** meta.icon 字符串 → Element Plus 图标组件 */
export const iconMap: Record<string, Component> = {
  Odometer,
  Grid,
  List,
  Document,
  InfoFilled,
  Fold,
  Expand,
  FullScreen,
  Setting,
  Moon,
  Sunny,
  Close,
  CircleClose,
  ArrowDown,
  ShoppingCart,
  Menu: MenuIcon,
};

export function resolveIcon(name?: string): Component | undefined {
  return name ? iconMap[name] : undefined;
}
