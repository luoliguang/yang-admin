<script setup lang="ts">
import { computed, watch } from 'vue';
import { useAppStore } from '@/stores/app';
import { useTheme } from '@/composables/useTheme';
import { usePrimaryColor } from '@/composables/usePrimaryColor';

const appStore = useAppStore();
const { themeMode, setTheme } = useTheme();
const { primaryColor, setPrimary, presets, reapply } = usePrimaryColor();

const open = computed({
  get: () => appStore.settingsOpen,
  set: (v: boolean) => (appStore.settingsOpen = v),
});

// 切换明暗后，重新应用主色阴影（明/暗混合方向不同）
watch(themeMode, () => setTimeout(reapply, 0));
</script>

<template>
  <el-drawer v-model="open" title="主题设置" direction="rtl" size="300px">
    <div class="settings">
      <div class="settings__section">
        <div class="settings__label">主题模式</div>
        <el-radio-group :model-value="themeMode" @update:model-value="setTheme($event as any)">
          <el-radio-button label="light">浅色</el-radio-button>
          <el-radio-button label="dark">深色</el-radio-button>
        </el-radio-group>
      </div>

      <div class="settings__section">
        <div class="settings__label">主题色</div>
        <div class="settings__swatches">
          <button
            v-for="c in presets"
            :key="c"
            class="settings__swatch"
            :class="{ 'settings__swatch--active': c === primaryColor }"
            :style="{ background: c }"
            @click="setPrimary(c)"
          />
        </div>
      </div>

      <el-alert
        type="info"
        :closable="false"
        title="更多布局设置（多标签开关、面包屑、灰色模式等）将在后续阶段扩充。"
      />
    </div>
  </el-drawer>
</template>

<style scoped>
.settings__section {
  margin-bottom: var(--ya-spacing-xl);
}
.settings__label {
  font-size: var(--ya-font-sm);
  color: var(--ya-text-secondary);
  margin-bottom: var(--ya-spacing-md);
}
.settings__swatches {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ya-spacing-md);
}
.settings__swatch {
  width: 28px;
  height: 28px;
  border-radius: var(--ya-radius-base);
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  transition: transform var(--ya-transition-base);
}
.settings__swatch:hover {
  transform: scale(1.1);
}
.settings__swatch--active {
  border-color: var(--ya-text-primary);
  box-shadow: 0 0 0 2px var(--ya-bg-container) inset;
}
</style>
