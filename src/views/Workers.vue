<template>
  <div class="workers-container">
    <div class="workers-header">
      <h2>工人管理</h2>
      <a-button type="primary" @click="showModal = true">
        <component :is="PlusOutlined" />
        添加工人
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="workers"
      :pagination="false"
      :row-key="record => record._id || record.id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <span :class="['status-tag', record.status]">
            {{ record.status === 'online' ? '在线' : '离线' }}
          </span>
        </template>
        <template v-else-if="column.key === 'position'">
          {{ positionMap[record.position] }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button size="small" @click="editWorker(record)">
              <component :is="EditOutlined" />
              编辑
            </a-button>
            <a-button size="small" danger @click="handleDelete(record)">
              <component :is="DeleteOutlined" />
              删除
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="showModal"
      :title="editRecord ? '编辑工人' : '添加工人'"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :model="formData" layout="vertical">
        <a-form-item label="姓名">
          <a-input v-model:value="formData.name" />
        </a-form-item>
        <a-form-item label="工号">
          <a-input v-model:value="formData.workerId" />
        </a-form-item>
        <a-form-item label="职位">
          <a-select v-model:value="formData.position">
            <a-select-option value="worker">工人</a-select-option>
            <a-select-option value="foreman">工长</a-select-option>
            <a-select-option value="engineer">工程师</a-select-option>
            <a-select-option value="manager">管理员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="部门">
          <a-select v-model:value="formData.department">
            <a-select-option value="土建部">土建部</a-select-option>
            <a-select-option value="机电部">机电部</a-select-option>
            <a-select-option value="安全部">安全部</a-select-option>
            <a-select-option value="质量部">质量部</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="formData.phone" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { getWorkers, createWorker, updateWorker, deleteWorker as apiDeleteWorker } from '@/api'

const workers = ref([])
const showModal = ref(false)
const editRecord = ref(null)
const formData = ref({
  name: '',
  workerId: '',
  position: '',
  department: '',
  phone: ''
})

const positionMap = {
  worker: '工人',
  foreman: '工长',
  engineer: '工程师',
  manager: '管理员'
}

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '工号', dataIndex: 'workerId', key: 'workerId' },
  { title: '职位', dataIndex: 'position', key: 'position' },
  { title: '部门', dataIndex: 'department', key: 'department' },
  { title: '手机号', dataIndex: 'phone', key: 'phone' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '入职日期', dataIndex: 'joinDate', key: 'joinDate' },
  { title: '操作', dataIndex: 'action', key: 'action' },
]

const loadWorkers = async () => {
  const data = await getWorkers()
  
  if (data && data.list) {
    workers.value = data.list.map(worker => ({
      ...worker,
      id: worker._id || worker.id
    }))
  }
}

const editWorker = (record) => {
  editRecord.value = record
  formData.value = {
    name: record.name,
    workerId: record.workerId,
    position: record.position,
    department: record.department,
    phone: record.phone
  }
  showModal.value = true
}

const handleDelete = async (record) => {
  await apiDeleteWorker(record._id || record.id)
  await loadWorkers()
}

const handleOk = async () => {
  if (editRecord.value) {
    await updateWorker(editRecord.value._id || editRecord.value.id, formData.value)
  } else {
    await createWorker(formData.value)
  }
  handleCancel()
  await loadWorkers()
}

const handleCancel = () => {
  showModal.value = false
  editRecord.value = null
  formData.value = {
    name: '',
    workerId: '',
    position: '',
    department: '',
    phone: ''
  }
}

onMounted(() => {
  loadWorkers()
})
</script>

<style scoped>
.workers-container {
  padding: 20px;
}

.workers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.workers-header h2 {
  margin: 0;
  font-size: 20px;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
}

.status-tag.online {
  background: #d9f7be;
  color: #52c41a;
}

.status-tag.offline {
  background: #fff2e8;
  color: #fa8c16;
}
</style>