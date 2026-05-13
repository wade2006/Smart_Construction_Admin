<template>
  <router-view v-if="!isAuthenticated && route.path === '/login'" />
  <a-layout v-else class="min-h-screen">
    <a-layout-sider v-model:collapsed="collapsed" width="256" class="bg-dark fixed-sidebar">
      <div
        class="logo flex items-center justify-center h-16 text-white text-xl font-bold"
      >
        <component
          :is="collapsed ? MenuFoldOutlined : MenuUnfoldOutlined"
          class="mr-2"
        />
        <span v-if="!collapsed">智慧工地</span>
      </div>
      <a-menu
        mode="inline"
        theme="dark"
        :selected-keys="selectedKeys"
        class="mt-4"
      >
        <a-menu-item key="/overview" @click="navigate('/overview')">
          <component :is="DashboardOutlined" />
          <span>项目概况</span>
        </a-menu-item>
        <a-menu-item key="/alarm" @click="navigate('/alarm')">
          <component :is="BellOutlined" />
          <span>告警管理</span>
        </a-menu-item>
        <a-menu-item key="/workers" @click="navigate('/workers')">
          <component :is="UserOutlined" />
          <span>工人管理</span>
        </a-menu-item>
        <a-menu-item key="/ai-assistant" @click="navigate('/ai-assistant')">
          <component :is="MessageOutlined" />
          <span>智慧AI助手</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        class="bg-white shadow-sm flex items-center justify-end px-6"
      >
        <div class="flex items-center">
          <a-badge :count="alarmCount" :overflow-count="99">
            <a-button @click="navigate('/alarm')" class="mr-4">
              <component :is="BellOutlined" />
            </a-button>
          </a-badge>
          <a-dropdown>
            <a class="flex items-center">
              <component :is="UserOutlined" class="mr-2" />
              <span>{{ currentUser?.username || '管理员' }}</span>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="1">个人设置</a-menu-item>
                <a-menu-item key="2" @click="handleLogout">退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="p-6 content-area">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  BellOutlined,
  UserOutlined,
  MessageOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const store = useStore()

const collapsed = ref(false)
const currentUser = ref(null)

const isAuthenticated = computed(() => {
  return localStorage.getItem('token') !== null
})

const selectedKeys = computed(() => [route.path])

const alarmCount = computed(() => store.state.alarm.alarmCount)

const navigate = (path) => {
  router.push(path)
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  currentUser.value = null
  router.push('/login')
}

onMounted(() => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    currentUser.value = JSON.parse(userStr)
  }
  store.dispatch('alarm/fetchAlarms')
  store.dispatch('overview/fetchOverviewData')
})
</script>

<style scoped>
.logo {
  font-size: 18px;
}

.fixed-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.content-area {
  margin-left: 256px;
  min-height: calc(100vh - 64px);
}
</style>
