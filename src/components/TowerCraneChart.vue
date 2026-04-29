<template>
  <ChartCard title="塔机运行状态" :option="chartOption" />
</template>

<script setup>
import { computed } from 'vue'
import ChartCard from './ChartCard.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: props.data.map(item => item.name),
    axisLine: { lineStyle: { color: '#ccc' } },
    axisLabel: { color: '#666', fontSize: 10 }
  },
  yAxis: [
    {
      type: 'value',
      name: '负载(%)',
      axisLine: { lineStyle: { color: '#ccc' } },
      axisLabel: { color: '#666' }
    },
    {
      type: 'value',
      name: '高度(m)',
      axisLine: { lineStyle: { color: '#ccc' } },
      axisLabel: { color: '#666' }
    }
  ],
  series: [
    {
      name: '负载',
      type: 'bar',
      data: props.data.map(item => item.load),
      itemStyle: {
        color: props.data.map(item => item.load > 80 ? '#f5222d' : item.load > 60 ? '#faad14' : '#52c41a'),
        borderRadius: [4, 4, 0, 0]
      }
    },
    {
      name: '高度',
      type: 'line',
      yAxisIndex: 1,
      data: props.data.map(item => item.height),
      lineStyle: { color: '#1890ff', width: 2 },
      itemStyle: { color: '#1890ff' }
    }
  ]
}))
</script>