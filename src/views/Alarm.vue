<template>
  <div class="alarm-container">
    <div class="alarm-header">
      <h2>告警管理</h2>
      <span class="subtitle">实时监控告警信息</span>
    </div>

    <div class="filter-bar">
      <a-space>
        <a-button :type="statusFilter === '' ? 'primary' : ''" @click="statusFilter = ''">全部</a-button>
        <a-button :type="statusFilter === 'pending' ? 'primary' : ''" @click="statusFilter = 'pending'">未处理</a-button>
        <a-button :type="statusFilter === 'handled' ? 'primary' : ''" @click="statusFilter = 'handled'">已处理</a-button>
      </a-space>
      <a-space>
        <a-button :type="levelFilter === '' ? 'primary' : ''" @click="levelFilter = ''">所有级别</a-button>
        <a-button :type="levelFilter === 'danger' ? 'primary' : ''" @click="levelFilter = 'danger'">严重</a-button>
        <a-button :type="levelFilter === 'warning' ? 'primary' : ''" @click="levelFilter = 'warning'">警告</a-button>
        <a-button :type="levelFilter === 'info' ? 'primary' : ''" @click="levelFilter = 'info'">提示</a-button>
      </a-space>
      <a-button type="primary" @click="handleAll" :disabled="pendingCount === 0">
        <component :is="CheckCircleOutlined" />
        全部处理
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="filteredAlarms"
      :pagination="false"
      :row-key="record => record._id || record.id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'level'">
          <status-badge :level="record.level" />
        </template>
        <template v-else-if="column.key === 'status'">
          <span :class="['status-tag', record.handled ? 'handled' : 'pending']">
            {{ record.handled ? '已处理' : '未处理' }}
          </span>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button
            v-if="!record.handled"
            type="primary"
            size="small"
            @click="handleAlarm(record)"
          >
            <component :is="CheckOutlined" />
            处理
          </a-button>
          <span v-else class="handled-text">已处理</span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { CheckCircleOutlined, CheckOutlined } from '@ant-design/icons-vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { getAlarms, handleAlarm as apiHandleAlarm } from '@/api'

const alarms = ref([])
const statusFilter = ref('')
const levelFilter = ref('')

const columns = [
  { title: '告警标题', dataIndex: 'title', key: 'title' },
  { title: '告警级别', dataIndex: 'level', key: 'level' },
  { title: '告警描述', dataIndex: 'description', key: 'description' },
  { title: '设备位置', dataIndex: 'location', key: 'location' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '告警时间', dataIndex: 'time', key: 'time' },
  { title: '操作', dataIndex: 'action', key: 'action' },
]

const filteredAlarms = computed(() => {
  return alarms.value.filter(alarm => {
    const statusMatch = statusFilter.value === '' || 
      (statusFilter.value === 'pending' && !alarm.handled) || 
      (statusFilter.value === 'handled' && alarm.handled)
    const levelMatch = levelFilter.value === '' || alarm.level === levelFilter.value
    return statusMatch && levelMatch
  })
})

const pendingCount = computed(() => {
  return alarms.value.filter(alarm => !alarm.handled).length
})

const loadAlarms = async () => {
  const data = await getAlarms()
  console.log(data, "loadAlarms----")
  if (data && Array.isArray(data)) {
    alarms.value = data.map(alarm => ({
      ...alarm,
      id: alarm._id || alarm.id
    }))
  }
}

const handleAlarm = async (record) => {
  await apiHandleAlarm(record._id || record.id)
  const alarm = alarms.value.find(a => a._id === record._id || a.id === record.id)
  if (alarm) {
    alarm.handled = true
  }
}

const handleAll = async () => {
  const pendingAlarms = alarms.value.filter(a => !a.handled)
  for (const alarm of pendingAlarms) {
    await apiHandleAlarm(alarm._id || alarm.id)
    alarm.handled = true
  }
}

onMounted(() => {
  loadAlarms()
})
</script>