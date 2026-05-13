<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>智慧工地管理平台</h1>
        <p>请登录您的账号</p>
      </div>
      
      <a-form :model="formData" @submit.prevent="handleLogin">
        <a-form-item label="用户名">
          <a-input 
            v-model:value="formData.username" 
            placeholder="请输入用户名"
            :status="usernameError ? 'error' : ''"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
          <a-form-explain v-if="usernameError">{{ usernameError }}</a-form-explain>
        </a-form-item>
        
        <a-form-item label="密码">
          <a-input-password 
            v-model:value="formData.password" 
            placeholder="请输入密码"
            :status="passwordError ? 'error' : ''"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
          <a-form-explain v-if="passwordError">{{ passwordError }}</a-form-explain>
        </a-form-item>
        
        <a-form-item>
          <a-checkbox v-model:checked="formData.rememberMe">
            记住我
          </a-checkbox>
        </a-form-item>
        
        <a-form-item>
          <a-button 
            type="primary" 
            html-type="submit" 
            class="login-button"
            :loading="loading"
          >
            登 录
          </a-button>
        </a-form-item>
        
        <a-form-item class="register-link">
          <a href="#" @click.prevent="showRegister = true">
            还没有账号？立即注册
          </a>
        </a-form-item>
      </a-form>
      
      <a-modal 
        v-model:open="showRegister" 
        title="用户注册" 
        :footer="null"
      >
        <a-form :model="registerForm" @submit.prevent="handleRegister">
          <a-form-item label="用户名">
            <a-input 
              v-model:value="registerForm.username" 
              placeholder="请输入用户名"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>
          
          <a-form-item label="邮箱">
            <a-input 
              v-model:value="registerForm.email" 
              placeholder="请输入邮箱"
            >
              <template #prefix>
                <MailOutlined />
              </template>
            </a-input>
          </a-form-item>
          
          <a-form-item label="密码">
            <a-input-password 
              v-model:value="registerForm.password" 
              placeholder="请输入密码（至少6位）"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>
          
          <a-form-item label="确认密码">
            <a-input-password 
              v-model:value="registerForm.confirmPassword" 
              placeholder="请再次输入密码"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>
          
          <a-form-item>
            <a-button 
              type="primary" 
              html-type="submit" 
              class="register-button"
              :loading="registerLoading"
            >
              注 册
            </a-button>
            <a-button 
              class="cancel-button"
              @click="showRegister = false"
            >
              取 消
            </a-button>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script setup>import { ref, reactive } from 'vue';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { login, register } from '@/api';
const router = useRouter();
const formData = reactive({
 username: '',
 password: '',
 rememberMe: false
});
const registerForm = reactive({
 username: '',
 email: '',
 password: '',
 confirmPassword: ''
});
const loading = ref(false);
const registerLoading = ref(false);
const showRegister = ref(false);
const usernameError = ref('');
const passwordError = ref('');
const validateForm = () => {
 usernameError.value = '';
 passwordError.value = '';
 if (!formData.username.trim()) {
 usernameError.value = '请输入用户名';
 return false;
 }
 if (!formData.password) {
 passwordError.value = '请输入密码';
 return false;
 }
 return true;
};
const handleLogin = async () => {
 if (!validateForm())
 return;
 loading.value = true;
 try {
 const response = await login(formData.username, formData.password);
 if (response.code === 200) {
 localStorage.setItem('token', response.data.token);
 localStorage.setItem('user', JSON.stringify(response.data.user));
 router.push('/');
 }
 else {
 a-message.error(response.message);
 }
 }
 catch (error) {
 a-message.error('登录失败，请重试');
 }
 finally {
 loading.value = false;
 }
};
const handleRegister = async () => {
 if (!registerForm.username.trim()) {
 a-message.warning('请输入用户名');
 return;
 }
 if (!registerForm.email.trim()) {
 a-message.warning('请输入邮箱');
 return;
 }
 if (!registerForm.password || registerForm.password.length < 6) {
 a-message.warning('密码至少6位');
 return;
 }
 if (registerForm.password !== registerForm.confirmPassword) {
 a-message.warning('两次输入的密码不一致');
 return;
 }
 registerLoading.value = true;
 try {
 const response = await register(registerForm.username, registerForm.email, registerForm.password);
 if (response.code === 200) {
 a-message.success('注册成功，请登录');
 showRegister.value = false;
 }
 else {
 a-message.error(response.message);
 }
 }
 catch (error) {
 a-message.error('注册失败，请重试');
 }
 finally {
 registerLoading.value = false;
 }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #1890ff;
}

.login-header p {
  margin: 0;
  color: #666;
}

.login-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.register-link {
  text-align: center;
}

.register-link a {
  color: #1890ff;
}

.register-button {
  margin-right: 8px;
}

.cancel-button {
  margin-left: 8px;
}
</style>