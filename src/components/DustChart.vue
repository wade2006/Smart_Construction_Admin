<template>
  <ChartCard title="扬尘浓度趋势" :option="chartOption" />
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
    name: 'μg/m³',
    axisLine: { lineStyle: { color: '#ccc' } },
    axisLabel: { color: '#666' }
  },
  series: [
    {
      name: 'PM2.5',
      type: 'line',
      smooth: true,
      data: props.data.map(item => item.pm25),
      lineStyle: { color: '#91cc75', width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(145, 204, 117, 0.3)' },
          { offset: 1, color: 'rgba(145, 204, 117, 0.05)' }
        ])
      },
      itemStyle: { color: '#91cc75' }
    },
    {
      name: 'PM10',
      type: 'line',
      smooth: true,
      data: props.data.map(item => item.pm10),
      lineStyle: { color: '#fac858', width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(250, 200, 88, 0.3)' },
          { offset: 1, color: 'rgba(250, 200, 88, 0.05)' }
        ])
      },
      itemStyle: { color: '#fac858' }
    }
  ]
}))
</script>