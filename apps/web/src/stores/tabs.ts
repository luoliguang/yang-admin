import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';

export interface TabItem {
  path: string;
  title: string;
  name: string;
  affix?: boolean;
}

/** 多标签页（tags view）状态 */
export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<TabItem[]>([]);

  function addTab(route: RouteLocationNormalized) {
    if (route.meta?.hideTab) return;
    const title = (route.meta?.title as string) || route.name?.toString() || '未命名';
    if (tabs.value.some((t) => t.path === route.path)) return;
    tabs.value.push({
      path: route.path,
      title,
      name: route.name?.toString() || route.path,
      affix: route.meta?.affix as boolean | undefined,
    });
  }

  function removeTab(path: string): TabItem | undefined {
    const idx = tabs.value.findIndex((t) => t.path === path);
    if (idx === -1) return;
    const removed = tabs.value[idx];
    if (removed.affix) return;
    tabs.value.splice(idx, 1);
    // 返回相邻标签，供调用方决定跳转目标
    return tabs.value[idx] || tabs.value[idx - 1];
  }

  function removeOthers(path: string) {
    tabs.value = tabs.value.filter((t) => t.affix || t.path === path);
  }

  /** 关闭指定标签右侧的所有可关闭标签 */
  function removeRight(path: string) {
    const idx = tabs.value.findIndex((t) => t.path === path);
    if (idx === -1) return;
    tabs.value = tabs.value.filter((t, i) => i <= idx || t.affix);
  }

  /** 关闭所有可关闭标签，返回剩余的最后一个（供跳转） */
  function closeAll(): TabItem | undefined {
    tabs.value = tabs.value.filter((t) => t.affix);
    return tabs.value[tabs.value.length - 1];
  }

  return { tabs, addTab, removeTab, removeOthers, removeRight, closeAll };
});
