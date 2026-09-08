<script setup lang="ts">
import { computed } from 'vue';

interface DictOption {
  label: string;
  value: string | number;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

const props = defineProps<{
  value: string | number;
  options: DictOption[];
}>();

const matched = computed(() => props.options.find((o) => o.value === props.value));
</script>

<template>
  <el-tag v-if="matched" :type="matched.type || 'info'" disable-transitions>
    {{ matched.label }}
  </el-tag>
  <span v-else>{{ value }}</span>
</template>
