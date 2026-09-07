<script setup lang="ts">
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Close } from '@element-plus/icons-vue';
import { useTabsStore } from '@/stores/tabs';

const route = useRoute();
const router = useRouter();
const tabsStore = useTabsStore();

// 路由变化即登记标签
watch(
  () => route.path,
  () => {
    if (route.meta?.title) tabsStore.addTab(route);
  },
  { immediate: true },
);

function goTab(path: string) {
  if (path !== route.path) router.push(path);
}

function closeTab(path: string) {
  const next = tabsStore.removeTab(path);
  if (path === route.path && next) router.push(next.path);
}

function isActive(path: string) {
  return path === route.path;
}
</script>

<template>
  <div class="tabs">
    <el-scrollbar>
      <div class="tabs__list">
        <div
          v-for="tab in tabsStore.tabs"
          :key="tab.path"
          class="tabs__item"
          :class="{ 'tabs__item--active': isActive(tab.path) }"
          @click="goTab(tab.path)"
        >
          <span class="tabs__dot" />
          <span class="tabs__title">{{ tab.title }}</span>
          <el-icon
            v-if="!tab.affix"
            class="tabs__close"
            @click.stop="closeTab(tab.path)"
          >
            <Close />
          </el-icon>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.tabs {
  height: var(--ya-tabs-height);
  border-top: 1px solid var(--ya-border-color-light);
  padding: 0 var(--ya-spacing-md);
  display: flex;
  align-items: center;
}
.tabs__list {
  display: flex;
  align-items: center;
  gap: var(--ya-spacing-sm);
  padding: 6px 0;
}
.tabs__item {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  font-size: var(--ya-font-sm);
  color: var(--ya-text-regular);
  background: var(--ya-bg-page);
  border: 1px solid var(--ya-border-color);
  border-radius: var(--ya-radius-sm);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--ya-transition-base);
}
.tabs__item:hover {
  color: var(--ya-color-primary);
}
.tabs__item--active {
  color: #fff;
  background: var(--ya-color-primary);
  border-color: var(--ya-color-primary);
}
.tabs__dot {
  width: 7px;
  height: 7px;
  border-radius: var(--ya-radius-full);
  background: currentColor;
  opacity: 0.6;
}
.tabs__item--active .tabs__dot {
  opacity: 1;
}
.tabs__close {
  font-size: 12px;
  border-radius: var(--ya-radius-full);
  transition: background var(--ya-transition-base);
}
.tabs__close:hover {
  background: rgba(0, 0, 0, 0.15);
}
</style>
