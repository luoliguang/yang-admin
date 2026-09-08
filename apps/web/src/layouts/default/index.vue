<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/stores/app';
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';
import TabsView from './components/TabsView.vue';
import SettingsDrawer from './components/SettingsDrawer.vue';

const appStore = useAppStore();
const sidebarWidth = computed(() =>
  appStore.sidebarCollapsed
    ? 'var(--ya-sidebar-width-collapsed)'
    : 'var(--ya-sidebar-width)',
);
</script>

<template>
  <div class="layout">
    <aside class="layout__sidebar" :style="{ width: sidebarWidth }">
      <Sidebar />
    </aside>
    <div class="layout__main">
      <header class="layout__header">
        <Navbar />
        <TabsView />
      </header>
      <main class="layout__content">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </main>
    </div>
    <SettingsDrawer />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.layout__sidebar {
  flex-shrink: 0;
  height: 100%;
  background: var(--ya-sidebar-bg);
  transition: width var(--ya-transition-base);
  z-index: var(--ya-z-sidebar);
}
.layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.layout__header {
  flex-shrink: 0;
  background: var(--ya-bg-container);
  border-bottom: 1px solid var(--ya-border-color);
  box-shadow: var(--ya-shadow-sm);
  z-index: var(--ya-z-header);
}
.layout__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--ya-spacing-xl);
  background: var(--ya-bg-page);
}
</style>
