<template>
  <ChartCard title="空气质量趋势" :option="chartOption" />
</template>

<script setup>
import { computed } from 'vue'
import * as echarts from 'echarts'
import ChartCard from './ChartCard.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: props.data.map(item => item.time),
    axisLine: { lineStyle: { color: '#ccc' } },
    axisLabel: { color: '#666', fontSize: 10 }
  },
  yAxis: {
    type: 'value',
    name: 'AQI',
    axisLine: { lineStyle: { color: '#ccc' } },
    axisLabel: { color: '#666' }
  },
  series: [
    {
      name: 'AQI',
      type: 'line',
      smooth: true,
      data: props.data.map(item => item.value),
      lineStyle: { color: '#5470c6', width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(84, 112, 198, 0.3)' },
          { offset: 1, color: 'rgba(84, 112, 198, 0.05)' }
        ])
      },
      itemStyle: { color: '#5470c6' }
    }
  ]
}))
</script>