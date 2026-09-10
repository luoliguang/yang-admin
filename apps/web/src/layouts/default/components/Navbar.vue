<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useFullscreen } from '@vueuse/core';
import { ElMessageBox } from 'element-plus';
import { Fold, Expand, FullScreen, Setting, Moon, Sunny, ArrowDown } from '@element-plus/icons-vue';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';
import { useTheme } from '@/composables/useTheme';
import { setLocale, localeStore, type LocaleKey } from '@/locales';
import Breadcrumb from './Breadcrumb.vue';

const appStore = useAppStore();
const authStore = useAuthStore();
const router = useRouter();
const { t } = useI18n();
const { isDark, toggleDark } = useTheme();
const { toggle: toggleFullscreen } = useFullscreen();

const displayName = computed(
  () => authStore.userInfo?.nickname || authStore.userInfo?.username || 'Admin',
);
const langLabel = computed(() => (localeStore.value === 'en-US' ? 'EN' : '中'));

function switchLang(l: LocaleKey) {
  setLocale(l);
}

async function onLogout() {
  // ElMessageBox 在点「取消」时会 reject，需捕获，否则抛未处理的 Promise 异常
  try {
    await ElMessageBox.confirm(t('navbar.logoutConfirm'), t('common.tip'), {
      type: 'warning',
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
    });
  } catch {
    return; // 用户取消，不做任何事
  }
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
      <el-tooltip :content="t('navbar.fullscreen')" placement="bottom">
        <el-icon class="navbar__action" @click="toggleFullscreen"><FullScreen /></el-icon>
      </el-tooltip>

      <el-dropdown class="navbar__lang" @command="switchLang">
        <span class="navbar__action navbar__lang-btn">{{ langLabel }}</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN" :disabled="localeStore === 'zh-CN'">简体中文</el-dropdown-item>
            <el-dropdown-item command="en-US" :disabled="localeStore === 'en-US'">English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-tooltip :content="isDark() ? 'Light' : 'Dark'" placement="bottom">
        <el-icon class="navbar__action" @click="toggleDark">
          <Sunny v-if="isDark()" />
          <Moon v-else />
        </el-icon>
      </el-tooltip>

      <el-tooltip :content="t('navbar.settings')" placement="bottom">
        <el-icon class="navbar__action" @click="appStore.openSettings"><Setting /></el-icon>
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
            <el-dropdown-item>{{ t('navbar.profile') }}</el-dropdown-item>
            <el-dropdown-item divided @click="onLogout">{{ t('navbar.logout') }}</el-dropdown-item>
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
.navbar__lang-btn {
  font-size: 14px;
  font-weight: 600;
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
