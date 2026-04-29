<template>
  <a-card :title="title" :bordered="false" class="chart-card">
    <div ref="chartRef" class="chart-container"></div>
  </a-card>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  option: {
    type: Object,
    required: true
  }
})

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    chartInstance.setOption(props.option)
  }
}

const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

watch(() => props.option, (newOption) => {
  chartInstance?.setOption(newOption, true)
}, { deep: true })

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped>
.chart-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-container {
  flex: 1;
  min-height: 250px;
}
</style>