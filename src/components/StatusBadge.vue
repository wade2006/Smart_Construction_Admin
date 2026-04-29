<template>
  <span class="status-badge" :style="{ backgroundColor: bgColor, color: textColor }">
    <span class="status-dot" :style="{ backgroundColor: dotColor }"></span>
    {{ text }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  text: {
    type: String,
    default: ''
  }
})

const statusConfig = {
  normal: { bg: '#f6ffed', text: '#52c41a', dot: '#52c41a' },
  warning: { bg: '#fff7e6', text: '#faad14', dot: '#faad14' },
  danger: { bg: '#fff2f0', text: '#f5222d', dot: '#f5222d' },
  online: { bg: '#f6ffed', text: '#52c41a', dot: '#52c41a' },
  offline: { bg: '#f5f5f5', text: '#d9d9d9', dot: '#d9d9d9' },
  working: { bg: '#e6f7ff', text: '#1890ff', dot: '#1890ff' },
  idle: { bg: '#f5f5f5', text: '#999', dot: '#999' },
  handled: { bg: '#f6ffed', text: '#52c41a', dot: '#52c41a' },
  unhandled: { bg: '#fff2f0', text: '#f5222d', dot: '#f5222d' }
}

const config = computed(() => statusConfig[props.status] || statusConfig.normal)
const bgColor = computed(() => config.value.bg)
const textColor = computed(() => config.value.text)
const dotColor = computed(() => config.value.dot)
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}
</style>