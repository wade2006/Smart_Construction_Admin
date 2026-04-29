<template>
  <a-card :bordered="false" class="stat-card">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-gray-500 text-sm mb-1">{{ title }}</p>
        <p class="text-2xl font-bold" :style="{ color: color }">{{ value }}</p>
        <p v-if="subtitle" class="text-gray-400 text-xs mt-1">{{ subtitle }}</p>
      </div>
      <div class="icon-wrapper" :style="{ backgroundColor: bgColor }">
        <component :is="icon" :style="{ color: color }" :size="24" />
      </div>
    </div>
  </a-card>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: Object,
    required: true
  },
  color: {
    type: String,
    default: '#1890ff'
  },
  bgColor: {
    type: String,
    default: '#e6f7ff'
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.stat-card {
  height: 100%;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>