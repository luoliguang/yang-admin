<script setup lang="ts">
import { computed } from 'vue';
import { ElMessage, type UploadProps } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    /** 最大体积 MB */
    maxSize?: number;
  }>(),
  { modelValue: '', maxSize: 5 },
);
const emit = defineEmits<{ 'update:modelValue': [string] }>();

const auth = useAuthStore();
const action = `${import.meta.env.VITE_API_BASE || '/api'}/upload`;
const headers = computed(() => ({ Authorization: `Bearer ${auth.token}` }));

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/');
  const okSize = file.size / 1024 / 1024 < props.maxSize;
  if (!isImage) ElMessage.error('只能上传图片');
  else if (!okSize) ElMessage.error(`图片不能超过 ${props.maxSize}MB`);
  return isImage && okSize;
};

const onSuccess: UploadProps['onSuccess'] = (res) => {
  // 后端统一响应 { code, message, data:{ url } }
  const url = res?.data?.url;
  if (url) {
    emit('update:modelValue', url);
    ElMessage.success('上传成功');
  } else {
    ElMessage.error(res?.message || '上传失败');
  }
};

const onError: UploadProps['onError'] = () => ElMessage.error('上传失败');

function clear() {
  emit('update:modelValue', '');
}
</script>

<template>
  <div class="ya-upload">
    <el-upload
      :action="action"
      :headers="headers"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      accept="image/*"
    >
      <div class="ya-upload__box">
        <img v-if="modelValue" :src="modelValue" class="ya-upload__img" alt="" />
        <el-icon v-else class="ya-upload__icon"><Plus /></el-icon>
      </div>
    </el-upload>
    <el-button v-if="modelValue" link type="danger" size="small" @click="clear">移除</el-button>
  </div>
</template>

<style scoped>
.ya-upload {
  display: flex;
  align-items: flex-end;
  gap: var(--ya-spacing-md);
}
.ya-upload__box {
  width: 110px;
  height: 110px;
  border: 1px dashed var(--ya-border-color);
  border-radius: var(--ya-radius-base);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: border-color var(--ya-transition-base);
  background: var(--ya-bg-page);
}
.ya-upload__box:hover {
  border-color: var(--ya-color-primary);
}
.ya-upload__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ya-upload__icon {
  font-size: 26px;
  color: var(--ya-text-secondary);
}
</style>
