<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { usePermissionStore } from '@/stores/permission';
import SidebarItem from './SidebarItem.vue';

const appStore = useAppStore();
const permissionStore = usePermissionStore();
const route = useRoute();

// 菜单来自后端权限树（排除按钮 type=2）
const menuTree = computed(() =>
  permissionStore.menus.filter((m) => m.type !== 2),
);
const activeMenu = computed(() => route.path);
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__logo">
      <div class="sidebar__logo-mark">Y</div>
      <transition name="fade">
        <span v-show="!appStore.sidebarCollapsed" class="sidebar__logo-text">
          yang-admin
        </span>
      </transition>
    </div>
    <el-scrollbar class="sidebar__scroll">
      <el-menu
        :default-active="activeMenu"
        :collapse="appStore.sidebarCollapsed"
        :collapse-transition="false"
        router
        background-color="var(--ya-sidebar-bg)"
        text-color="var(--ya-sidebar-text)"
        active-text-color="var(--ya-sidebar-text-active)"
      >
        <SidebarItem v-for="item in menuTree" :key="item.id" :item="item" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.sidebar__logo {
  height: var(--ya-header-height);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 18px;
  background: var(--ya-sidebar-logo-bg);
  overflow: hidden;
  white-space: nowrap;
}
.sidebar__logo-mark {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: var(--ya-radius-base);
  background: var(--ya-color-primary);
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sidebar__logo-text {
  color: #fff;
  font-size: var(--ya-font-md);
  font-weight: 600;
  letter-spacing: 0.3px;
}
.sidebar__scroll {
  flex: 1;
}
.sidebar :deep(.el-menu) {
  border-right: none;
}
.sidebar :deep(.el-menu-item.is-active) {
  background: var(--ya-sidebar-active-bg) !important;
}
.sidebar :deep(.el-menu-item.is-active)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--ya-color-primary);
}
.sidebar :deep(.el-menu-item:hover),
.sidebar :deep(.el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.04) !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
