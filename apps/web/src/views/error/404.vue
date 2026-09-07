<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <div class="error-page">
    <div class="error-code">404</div>
    <p class="error-text">抱歉，你访问的页面不存在</p>
    <el-button type="primary" @click="router.push('/')">返回首页</el-button>
  </div>
</template>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: var(--ya-spacing-lg);
}
.error-code {
  font-size: 96px;
  font-weight: 800;
  color: var(--ya-color-primary);
  line-height: 1;
}
.error-text {
  color: var(--ya-text-secondary);
  font-size: var(--ya-font-md);
  margin: 0;
}
</style>
