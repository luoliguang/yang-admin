<script setup lang="ts">
import { reactive, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Close } from '@element-plus/icons-vue';
import { useTabsStore } from '@/stores/tabs';

const route = useRoute();
const router = useRouter();
const tabsStore = useTabsStore();
const { t } = useI18n();

// 路由变化即登记标签
watch(
  () => route.path,
  () => {
    if (route.meta?.title) tabsStore.addTab(route);
    closeMenu();
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

// ---- 右键菜单 ----
const menu = reactive({ visible: false, x: 0, y: 0, path: '', affix: false });

function openMenu(e: MouseEvent, tab: { path: string; affix?: boolean }) {
  e.preventDefault();
  menu.path = tab.path;
  menu.affix = !!tab.affix;
  menu.x = e.clientX;
  menu.y = e.clientY;
  menu.visible = true;
  // 延迟注册，避免当前这次右键事件冒泡到 document 立即关闭菜单
  setTimeout(() => {
    document.addEventListener('click', closeMenu);
    document.addEventListener('contextmenu', closeMenu);
  }, 0);
}

function closeMenu() {
  if (!menu.visible) return;
  menu.visible = false;
  document.removeEventListener('click', closeMenu);
  document.removeEventListener('contextmenu', closeMenu);
}

/** 若当前路由已被关闭，则跳到 fallback */
function ensureVisible(fallback: string) {
  if (!tabsStore.tabs.some((tb) => tb.path === route.path)) router.push(fallback);
}

function onCloseCurrent() {
  closeTab(menu.path);
  closeMenu();
}
function onCloseOthers() {
  tabsStore.removeOthers(menu.path);
  ensureVisible(menu.path);
  closeMenu();
}
function onCloseRight() {
  tabsStore.removeRight(menu.path);
  ensureVisible(menu.path);
  closeMenu();
}
function onCloseAll() {
  const last = tabsStore.closeAll();
  ensureVisible(last?.path || '/');
  closeMenu();
}

onBeforeUnmount(closeMenu);
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
          @contextmenu="openMenu($event, tab)"
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

    <!-- 右键上下文菜单 -->
    <ul
      v-if="menu.visible"
      class="tabs__menu"
      :style="{ left: menu.x + 'px', top: menu.y + 'px' }"
      @click.stop
    >
      <li v-if="!menu.affix" class="tabs__menu-item" @click="onCloseCurrent">
        {{ t('tabs.closeCurrent') }}
      </li>
      <li class="tabs__menu-item" @click="onCloseOthers">{{ t('tabs.closeOthers') }}</li>
      <li class="tabs__menu-item" @click="onCloseRight">{{ t('tabs.closeRight') }}</li>
      <li class="tabs__menu-item" @click="onCloseAll">{{ t('tabs.closeAll') }}</li>
    </ul>
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
/* 仅非激活标签在 hover 时变主色，避免激活态白字被改成主色而与主色背景同色（文字消失） */
.tabs__item:not(.tabs__item--active):hover {
  color: var(--ya-color-primary);
  border-color: var(--ya-color-primary);
  background: var(--ya-hover-bg, rgba(0, 0, 0, 0.02));
}
.tabs__item--active {
  color: #fff;
  background: var(--ya-color-primary);
  border-color: var(--ya-color-primary);
}
/* 激活标签 hover 时保持白字，仅轻微加深背景 */
.tabs__item--active:hover {
  color: #fff;
  filter: brightness(0.95);
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

/* 右键菜单 */
.tabs__menu {
  position: fixed;
  z-index: 3000;
  min-width: 120px;
  margin: 0;
  padding: 4px;
  list-style: none;
  background: var(--ya-bg-container);
  border: 1px solid var(--ya-border-color-light);
  border-radius: var(--ya-radius-base);
  box-shadow: var(--ya-shadow-lg);
}
.tabs__menu-item {
  padding: 7px 14px;
  font-size: var(--ya-font-sm);
  color: var(--ya-text-regular);
  border-radius: var(--ya-radius-sm);
  cursor: pointer;
  white-space: nowrap;
}
.tabs__menu-item:hover {
  color: var(--ya-color-primary);
  background: var(--ya-hover-bg, rgba(0, 0, 0, 0.04));
}
</style>
