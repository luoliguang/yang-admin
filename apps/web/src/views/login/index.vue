<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const formRef = ref<FormInstance>();
const loading = ref(false);
const form = reactive({ username: 'admin', password: 'admin123' });

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

async function onSubmit() {
  await formRef.value?.validate();
  loading.value = true;
  try {
    await auth.login(form);
    ElMessage.success(t('login.success'));
    const redirect = (route.query.redirect as string) || '/';
    router.push(redirect);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login">
    <div class="login__card">
      <div class="login__brand">
        <div class="login__logo">Y</div>
        <h1>{{ t('login.title') }}</h1>
        <p>{{ t('login.subtitle') }}</p>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" size="large" @keyup.enter="onSubmit">
        <el-form-item prop="username">
          <el-input v-model="form.username" :placeholder="t('login.username')" :prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            :placeholder="t('login.password')"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-button type="primary" class="login__btn" :loading="loading" @click="onSubmit">
          {{ t('login.submit') }}
        </el-button>
        <p class="login__hint">{{ t('login.hint') }}</p>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a2130 0%, #2d1b4e 100%);
}
.login__card {
  width: 380px;
  padding: 40px 36px;
  background: var(--ya-bg-container);
  border-radius: var(--ya-radius-lg);
  box-shadow: var(--ya-shadow-lg);
}
.login__brand {
  text-align: center;
  margin-bottom: 28px;
}
.login__logo {
  width: 52px;
  height: 52px;
  margin: 0 auto 12px;
  border-radius: var(--ya-radius-lg);
  background: var(--ya-color-primary);
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login__brand h1 {
  margin: 0 0 4px;
  font-size: var(--ya-font-xl);
  color: var(--ya-text-primary);
}
.login__brand p {
  margin: 0;
  color: var(--ya-text-secondary);
  font-size: var(--ya-font-sm);
}
.login__btn {
  width: 100%;
  margin-top: 8px;
}
.login__hint {
  text-align: center;
  margin: 16px 0 0;
  color: var(--ya-text-secondary);
  font-size: var(--ya-font-xs);
}
</style>
