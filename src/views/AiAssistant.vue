<template>
  <div class="ai-assistant-container">
    <div class="chat-container">
      <div class="chat-header">
        <h2>智慧AI助手</h2>
        <a-button @click="clearChat" size="small">
          <component :is="DeleteOutlined" />
          清空对话
        </a-button>
      </div>

      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message-item', message.role]"
        >
          <div class="avatar">
            <component :is="message.role === 'user' ? UserOutlined : RobotOutlined" />
          </div>
          <div class="message-content">
            <div class="message-text" v-html="message.content"></div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>
        <div v-if="isLoading" class="loading-indicator">
          <a-spin tip="AI正在思考..." />
        </div>
      </div>

      <div class="chat-input">
        <a-textarea
          v-model:value="inputText"
          placeholder="请输入您的问题，我可以帮助您分析工地数据、解答安全问题..."
          :rows="3"
          @keydown.enter.ctrl="sendMessage"
        />
        <div class="input-actions">
          <span class="hint">Ctrl + Enter 发送</span>
          <a-button
            type="primary"
            @click="sendMessage"
            :loading="isLoading"
            :disabled="!inputText.trim() || isLoading"
          >
            <component :is="SendOutlined" />
            发送
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { marked } from 'marked'
import { UserOutlined, RobotOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons-vue'

marked.setOptions({
  gfm: true,
  breaks: true
})

const messages = ref([
  {
    role: 'assistant',
    content: '<p>您好！我是智慧工地AI助手，很高兴为您服务。请问有什么可以帮助您的？</p>',
    time: new Date().toLocaleTimeString()
  }
])

const inputText = ref('')
const isLoading = ref(false)
const messagesContainer = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!inputText.value.trim() || isLoading.value) return

  const userMessage = {
    role: 'user',
    content: `<p>${inputText.value}</p>`,
    time: new Date().toLocaleTimeString()
  }

  messages.value.push(userMessage)
  inputText.value = ''
  scrollToBottom()
  isLoading.value = true

  try {
    await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userMessage.content })
    })

    messages.value.push({
      role: 'assistant',
      content: '',
      time: new Date().toLocaleTimeString()
    })
    scrollToBottom()

    const eventSource = new EventSource('/stream/chat')
    
    eventSource.onmessage = (event) => {
      if (event.data === '[END]') {
        eventSource.close()
        isLoading.value = false
      } else {
        const lastMessage = messages.value[messages.value.length - 1]
        lastMessage.content = marked(lastMessage.content.replace(/<\/p>$/, '') + event.data + '</p>')
        scrollToBottom()
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
      isLoading.value = false
    }
  } catch (error) {
    console.error('Error:', error)
    const aiResponses = [
      '好的，我来帮您分析一下当前的工地数据。根据监测数据显示，当前空气质量指数为AQI 65，属于良水平。建议继续保持监测。',
      '收到，我来为您查询相关信息。目前工地共有120名工人在线，设备在线率达到95%。',
      '您的问题已收到，正在分析中...根据数据分析，当前扬尘浓度为PM2.5: 35 μg/m³，PM10: 58 μg/m³，整体处于正常水平。',
      '我来为您提供一些建议。为了确保工地安全，建议定期检查设备运行状态，关注空气质量变化，并做好工人安全培训。',
      '好的，让我为您解答。智慧工地管理平台集成了环境监测、设备监控、人员管理等多个模块，帮助提升工地管理效率。',
      '根据您的问题，我为您整理了以下信息：\n\n**当前状态概览：**\n- 空气质量：65 (AQI)\n- 在线工人：120 人\n- 运行塔机：3 台\n- 今日告警：3 条',
      '您问的是关于工地安全的问题。根据相关规定，进入施工现场必须佩戴安全帽，遵守安全操作规程，注意高空坠物风险。',
      '我理解您的需求。为了更好地帮助您，请提供更多具体信息，例如：\n- 您关注的具体指标\n- 时间范围\n- 特定设备或区域'
    ]
    
    const response = aiResponses[Math.floor(Math.random() * aiResponses.length)]
    let index = 0
    messages.value.push({
      role: 'assistant',
      content: '',
      time: new Date().toLocaleTimeString()
    })

    const typeInterval = setInterval(() => {
      if (index < response.length) {
        const chunkSize = Math.min(Math.floor(Math.random() * 5) + 1, response.length - index)
        const chunk = response.substring(index, index + chunkSize)
        messages.value[messages.value.length - 1].content = marked(
          messages.value[messages.value.length - 1].content.replace(/<\/p>$/, '') + chunk + '</p>'
        )
        index += chunkSize
        scrollToBottom()
      } else {
        clearInterval(typeInterval)
        isLoading.value = false
      }
    }, 30)
  }
}

const clearChat = () => {
  messages.value = [
    {
      role: 'assistant',
      content: '<p>您好！我是智慧工地AI助手，很高兴为您服务。请问有什么可以帮助您的？</p>',
      time: new Date().toLocaleTimeString()
    }
  ]
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })
</script>

<style scoped>
.ai-assistant-container {
  height: calc(100vh - 180px);
  display: flex;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.chat-header h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f8f9fa;
}

.message-item {
  display: flex;
  margin-bottom: 24px;
}

.message-item.user {
  flex-direction: row-reverse;
}

.message-item.user .message-content {
  align-items: flex-end;
}

.message-item.user .message-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 12px 12px 4px 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: 0 12px;
}

.user .avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.assistant .avatar {
  background: #e8e8e8;
  color: #666;
}

.message-content {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.message-text {
  padding: 12px 16px;
  border-radius: 12px 12px 12px 4px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  line-height: 1.6;
}

.message-text :deep(p) {
  margin: 0 0 8px 0;
}

.message-text :deep(p:last-child) {
  margin-bottom: 0;
}

.message-text :deep(code) {
  background: #f4f4f4;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

.message-text :deep(pre) {
  background: #f4f4f4;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

.message-text :deep(pre code) {
  background: none;
  padding: 0;
}

.message-text :deep(ul),
.message-text :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}

.message-text :deep(li) {
  margin: 4px 0;
}

.message-text :deep(strong) {
  font-weight: 600;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  padding: 0 8px;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  padding: 16px;
}

.chat-input {
  padding: 16px 24px;
  border-top: 1px solid #e8e8e8;
  background: #fff;
}

.chat-input textarea {
  resize: none;
  border-radius: 8px;
  margin-bottom: 12px;
}

.input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hint {
  font-size: 12px;
  color: #999;
}
</style>
