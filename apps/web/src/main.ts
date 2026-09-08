import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { i18n } from './locales';
import { setupDirectives } from './directives/permission';

// 设计令牌（明暗双主题）
import '@yang-admin/design-tokens/tokens.css';
// Element Plus 暗色 css 变量
import 'element-plus/theme-chalk/dark/css-vars.css';
// 全局样式
import './styles/index.scss';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(i18n);
setupDirectives(app);
app.mount('#app');
