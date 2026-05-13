import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// 添加请求拦截器，携带 token
api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 添加响应拦截器，统一处理响应
api.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const getOverview = () => api.get("/overview");
export const getOverviewChart = () => api.get("/overview/chart");
export const getAlarms = () => api.get("/alarms");
export const handleAlarm = (id) => api.put(`/alarms/${id}/handle`);
export const getWorkers = () => api.get("/workers");
export const createWorker = (data) => api.post("/workers", data);
export const updateWorker = (id, data) => api.put(`/workers/${id}`, data);
export const deleteWorker = (id) => api.delete(`/workers/${id}`);

// 登录接口
export const login = (username, password) => 
  api.post("/auth/login", { username, password });

// 注册接口
export const register = (username, email, password) => 
  api.post("/auth/register", { username, email, password });

// 获取当前用户信息
export const getCurrentUser = () => api.get("/auth/me");

export default api;
