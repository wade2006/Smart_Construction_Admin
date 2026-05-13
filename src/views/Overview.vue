<template>
  <div class="overview-container">
    <div class="page-header">
      <h1>项目概况</h1>
      <p class="text-gray-500">实时监控数据概览</p>
    </div>

    <div class="stats-grid">
      <StatCard
        title="空气质量指数"
        :value="overviewData?.airQuality?.aqi || '--'"
        :icon="DeleteOutlined"
        :color="airQualityColor"
        :bgColor="airQualityBgColor"
        :subtitle="airQualityLevel"
      />
      <StatCard
        title="PM2.5浓度"
        :value="`${overviewData?.dustData?.pm25 || '--'} μg/m³`"
        :icon="DeleteOutlined"
        color="#91cc75"
        bgColor="#f6ffed"
        :subtitle="
          overviewData?.dustData?.pm10
            ? `PM10: ${overviewData?.dustData?.pm10} μg/m³`
            : ''
        "
      />
      <StatCard
        title="在线工人"
        :value="overviewData?.statistics?.onlineWorkers || '--'"
        :icon="DeleteOutlined"
        color="#1890ff"
        bgColor="#e6f7ff"
        :subtitle="`总计: ${overviewData?.statistics?.totalWorkers || '--'} 人`"
      />
      <StatCard
        title="运行塔机"
        :value="overviewData?.towerCrane?.running || '--'"
        :icon="BuildOutlined"
        color="#faad14"
        bgColor="#fff7e6"
        :subtitle="`总计: ${overviewData?.towerCrane?.total || '--'} 台`"
      />
      <StatCard
        title="今日告警"
        :value="overviewData?.statistics?.todayAlarms || '--'"
        :icon="BellOutlined"
        :color="
          overviewData?.statistics?.todayAlarms > 0 ? '#f5222d' : '#52c41a'
        "
        :bgColor="
          overviewData?.statistics?.todayAlarms > 0 ? '#fff2f0' : '#f6ffed'
        "
        :subtitle="`未处理: ${overviewData?.statistics?.unhandledAlarms || '--'} 条`"
      />
      <StatCard
        title="设备在线率"
        :value="`${overviewData?.statistics?.deviceOnlineRate || '--'}%`"
        :icon="DeleteOutlined"
        color="#52c41a"
        bgColor="#f6ffed"
        :subtitle="`在线: ${overviewData?.statistics?.onlineDevices || '--'} / ${overviewData?.statistics?.totalDevices || '--'}`"
      />
    </div>

    <div class="charts-grid">
      <div class="chart-item">
        <AirQualityChart :data="chartData.airQualityHistory || []" />
      </div>
      <div class="chart-item">
        <DustChart :data="chartData.dustHistory || []" />
      </div>
      <div class="chart-item full-width">
        <TowerCraneChart :data="chartData.towerCraneStatus || []" />
      </div>
    </div>

    <div class="bottom-section">
      <a-card title="实时数据监控" :bordered="false" class="monitor-card">
        <div class="monitor-grid">
          <div
            class="monitor-item"
            v-for="item in realtimeData"
            :key="item.label"
          >
            <div class="monitor-label">{{ item.label }}</div>
            <div class="monitor-value" :style="{ color: item.color }">
              {{ item.value }}
            </div>
            <StatusBadge :status="item.status" :text="item.statusText" />
          </div>
        </div>
      </a-card>

      <a-card title="最新告警" :bordered="false" class="alarm-card">
        <a-timeline mode="left">
          <a-timeline-item
            v-for="alarm in latestAlarms"
            :key="alarm.id"
            :color="
              alarm.level === 'danger'
                ? '#f5222d'
                : alarm.level === 'warning'
                  ? '#faad14'
                  : '#1890ff'
            "
          >
            <template #dot>
              <component
                :is="
                  alarm.level === 'danger'
                    ? DeleteOutlined
                    : alarm.level === 'warning'
                      ? DeleteOutlined
                      : InfoCircleOutlined
                "
              />
            </template>
            <p class="font-medium">{{ alarm.title }}</p>
            <p class="text-gray-500 text-sm">{{ alarm.description }}</p>
            <p class="text-gray-400 text-xs">{{ alarm.time }}</p>
          </a-timeline-item>
        </a-timeline>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { io } from "socket.io-client";
import {
  BuildOutlined,
  BellOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons-vue";
import StatCard from "../components/StatCard.vue";
import AirQualityChart from "../components/AirQualityChart.vue";
import DustChart from "../components/DustChart.vue";
import TowerCraneChart from "../components/TowerCraneChart.vue";
import StatusBadge from "../components/StatusBadge.vue";

const store = useStore();

const overviewData = computed(() => store.getters["overview/overviewData"]);
const chartData = computed(() => store.getters["overview/chartData"]);

const airQualityInfo = computed(() => {
  const aqi = overviewData?.value?.airQuality?.aqi || 0;
  if (aqi <= 50) return { level: "优", color: "#00e400" };
  if (aqi <= 100) return { level: "良", color: "#ffff00" };
  if (aqi <= 150) return { level: "轻度污染", color: "#ff7e00" };
  if (aqi <= 200) return { level: "中度污染", color: "#ff0000" };
  if (aqi <= 300) return { level: "重度污染", color: "#99004c" };
  return { level: "严重污染", color: "#7e0023" };
});

const airQualityColor = computed(() => airQualityInfo.value.color);
const airQualityBgColor = computed(() => airQualityInfo.value.color + "20");
const airQualityLevel = computed(() => airQualityInfo.value.level);

const realtimeData = ref([
  {
    label: "温度",
    value: "--",
    status: "normal",
    statusText: "正常",
    color: "#1890ff",
    key: "temperature",
  },
  {
    label: "湿度",
    value: "--",
    status: "normal",
    statusText: "正常",
    color: "#52c41a",
    key: "humidity",
  },
  {
    label: "风速",
    value: "--",
    status: "normal",
    statusText: "正常",
    color: "#faad14",
    key: "windSpeed",
  },
  {
    label: "噪音",
    value: "--",
    status: "normal",
    statusText: "正常",
    color: "#91cc75",
    key: "noise",
  },
  {
    label: "光照",
    value: "--",
    status: "normal",
    statusText: "正常",
    color: "#fac858",
    key: "light",
  },
  {
    label: "降雨量",
    value: "--",
    status: "normal",
    statusText: "正常",
    color: "#73d13d",
    key: "rainfall",
  },
]);

let socket = null;
let heartbeatInterval = null;
let reconnectInterval = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;

const latestAlarms = computed(() => {
  return store.getters["alarm/unhandledAlarms"].slice(0, 5);
});

let updateInterval = null;

const connectSocket = () => {
  socket = io("http://localhost:3000", {
    reconnection: false,
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Socket.IO connected");
    reconnectAttempts = 0;

    heartbeatInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit("heartbeat");
      }
    }, 5000);
  });

  socket.on("heartbeat", () => {
    console.log("Heartbeat received");
  });

  socket.on("realtimeData", (data) => {
    realtimeData.value = realtimeData.value.map((item) => {
      const newValue = data[item.key];
      return newValue !== undefined ? { ...item, value: newValue } : item;
    });
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket.IO disconnected:", reason);

    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }

    if (reason !== "io client disconnect") {
      startReconnect();
    }
  });

  socket.on("connect_error", (error) => {
    console.error("Socket.IO connection error:", error);
    startReconnect();
  });
};

const startReconnect = () => {
  if (reconnectInterval) {
    clearInterval(reconnectInterval);
  }

  if (reconnectAttempts < maxReconnectAttempts) {
    reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);

    console.log(
      `Reconnecting attempt ${reconnectAttempts}/${maxReconnectAttempts} in ${delay}ms`,
    );

    reconnectInterval = setTimeout(() => {
      connectSocket();
    }, delay);
  } else {
    console.error("Max reconnect attempts reached");
  }
};

const initChartData = () => {
  const hours = [];
  const airQualityHistory = [];
  const dustHistory = [];

  for (let i = 23; i >= 0; i--) {
    const hour = new Date();
    hour.setHours(hour.getHours() - i);
    hours.push(`${hour.getHours().toString().padStart(2, "0")}:00`);

    airQualityHistory.push({
      time: hours[hours.length - 1],
      value: Math.floor(Math.random() * 80) + 40,
    });

    dustHistory.push({
      time: hours[hours.length - 1],
      pm25: Math.floor(Math.random() * 40) + 10,
      pm10: Math.floor(Math.random() * 60) + 20,
    });
  }

  const towerCraneStatus = [
    {
      name: "塔机1号",
      load: Math.floor(Math.random() * 40) + 40,
      height: Math.floor(Math.random() * 30) + 20,
    },
    {
      name: "塔机2号",
      load: Math.floor(Math.random() * 40) + 40,
      height: Math.floor(Math.random() * 30) + 20,
    },
    {
      name: "塔机3号",
      load: Math.floor(Math.random() * 40) + 40,
      height: Math.floor(Math.random() * 30) + 20,
    },
    {
      name: "塔机4号",
      load: Math.floor(Math.random() * 40) + 40,
      height: Math.floor(Math.random() * 30) + 20,
    },
    {
      name: "塔机5号",
      load: Math.floor(Math.random() * 40) + 40,
      height: Math.floor(Math.random() * 30) + 20,
    },
  ];

  store.commit("overview/SET_CHART_DATA", {
    airQualityHistory,
    dustHistory,
    towerCraneStatus,
  });
};

const initOverviewData = () => {
  store.commit("overview/SET_OVERVIEW_DATA", {
    airQuality: { aqi: Math.floor(Math.random() * 100) + 30 },
    dustData: {
      pm25: Math.floor(Math.random() * 50) + 10,
      pm10: Math.floor(Math.random() * 80) + 20,
    },
    towerCrane: { running: Math.floor(Math.random() * 3) + 2, total: 5 },
    statistics: {
      onlineWorkers: Math.floor(Math.random() * 50) + 80,
      totalWorkers: 150,
      todayAlarms: Math.floor(Math.random() * 10),
      unhandledAlarms: Math.floor(Math.random() * 5),
      deviceOnlineRate: Math.floor(Math.random() * 10) + 90,
      onlineDevices: Math.floor(Math.random() * 20) + 80,
      totalDevices: 100,
    },
  });
};

onMounted(() => {
  initOverviewData();
  initChartData();

  connectSocket();
});

onUnmounted(() => {
  if (updateInterval) clearInterval(updateInterval);
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  if (reconnectInterval) clearInterval(reconnectInterval);
  if (socket) {
    socket.close();
  }
});
</script>

<style scoped>
.overview-container {
  min-height: 100%;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.charts-grid .full-width {
  grid-column: span 2;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .charts-grid .full-width {
    grid-column: span 1;
  }
}

.chart-item {
  min-height: 300px;
}

.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 768px) {
  .bottom-section {
    grid-template-columns: 1fr;
  }
}

.monitor-card {
  min-height: 280px;
}

.monitor-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.monitor-item {
  text-align: center;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.monitor-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.monitor-value {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.alarm-card {
  min-height: 280px;
}
</style>
