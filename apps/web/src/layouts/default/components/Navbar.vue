<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFullscreen } from '@vueuse/core';
import { ElMessageBox } from 'element-plus';
import { Fold, Expand, FullScreen, Setting, Moon, Sunny, ArrowDown } from '@element-plus/icons-vue';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';
import { useTheme } from '@/composables/useTheme';
import Breadcrumb from './Breadcrumb.vue';

const appStore = useAppStore();
const authStore = useAuthStore();
const router = useRouter();
const { isDark, toggleDark } = useTheme();
const { toggle: toggleFullscreen } = useFullscreen();

const displayName = computed(
  () => authStore.userInfo?.nickname || authStore.userInfo?.username || 'Admin',
);

async function onLogout() {
  await ElMessageBox.confirm('确定退出登录吗？', '提示', { type: 'warning' });
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <div class="navbar">
    <div class="navbar__left">
      <el-icon class="navbar__collapse" @click="appStore.toggleSidebar">
        <Expand v-if="appStore.sidebarCollapsed" />
        <Fold v-else />
      </el-icon>
      <Breadcrumb />
    </div>

    <div class="navbar__right">
      <el-tooltip content="全屏" placement="bottom">
        <el-icon class="navbar__action" @click="toggleFullscreen">
          <FullScreen />
        </el-icon>
      </el-tooltip>

      <el-tooltip :content="isDark() ? '切换到浅色' : '切换到深色'" placement="bottom">
        <el-icon class="navbar__action" @click="toggleDark">
          <Sunny v-if="isDark()" />
          <Moon v-else />
        </el-icon>
      </el-tooltip>

      <el-tooltip content="主题设置" placement="bottom">
        <el-icon class="navbar__action" @click="appStore.openSettings">
          <Setting />
        </el-icon>
      </el-tooltip>

      <el-dropdown class="navbar__user">
        <div class="navbar__user-inner">
          <el-avatar :size="30" src="" class="navbar__avatar">
            {{ displayName.charAt(0).toUpperCase() }}
          </el-avatar>
          <span class="navbar__username">{{ displayName }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item divided @click="onLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  height: var(--ya-header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--ya-spacing-lg);
}
.navbar__left {
  display: flex;
  align-items: center;
  gap: var(--ya-spacing-lg);
}
.navbar__collapse {
  font-size: 20px;
  cursor: pointer;
  color: var(--ya-text-regular);
  transition: color var(--ya-transition-base);
}
.navbar__collapse:hover {
  color: var(--ya-color-primary);
}
.navbar__right {
  display: flex;
  align-items: center;
  gap: var(--ya-spacing-sm);
}
.navbar__action {
  font-size: 18px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--ya-radius-base);
  cursor: pointer;
  color: var(--ya-text-regular);
  transition: all var(--ya-transition-base);
}
.navbar__action:hover {
  color: var(--ya-color-primary);
  background: var(--ya-bg-hover);
}
.navbar__user {
  margin-left: var(--ya-spacing-sm);
}
.navbar__user-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: var(--ya-radius-base);
  cursor: pointer;
  outline: none;
  transition: background var(--ya-transition-base);
}
.navbar__user-inner:hover {
  background: var(--ya-bg-hover);
}
.navbar__avatar {
  background: var(--ya-color-primary);
  color: #fff;
  font-size: 13px;
}
.navbar__username {
  font-size: var(--ya-font-base);
  color: var(--ya-text-primary);
}
</style>
