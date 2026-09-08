import { createI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import zhCN from './zh-CN';
import enUS from './en-US';

export type LocaleKey = 'zh-CN' | 'en-US';

export const localeStore = useStorage<LocaleKey>('ya-locale', 'zh-CN');

export const i18n = createI18n({
  legacy: false,
  locale: localeStore.value,
  fallbackLocale: 'zh-CN',
  messages: { 'zh-CN': zhCN, 'en-US': enUS },
});

export function setLocale(locale: LocaleKey) {
  localeStore.value = locale;
  i18n.global.locale.value = locale;
}
