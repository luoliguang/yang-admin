import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// 设计令牌（明暗双主题）
import '@yang-admin/design-tokens/tokens.css';
// Element Plus 暗色 css 变量（组件按需引入，暗色变量需整体引入）
import 'element-plus/theme-chalk/dark/css-vars.css';
// 全局样式
import './styles/index.scss';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
