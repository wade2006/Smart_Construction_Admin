import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// 添加响应拦截器，统一处理响应
api.interceptors.response.use(
  function (response) {
    // 只在 data 存在且有 code 和 data 字段时才处理
    if (
      response.data &&
      typeof response.data === "object" &&
      "code" in response.data &&
      "data" in response.data
    ) {
      // 直接返回内部的 data
      return response.data.data;
    }
    return response.data.data;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export const getOverview = () => api.get("/overview");
export const getOverviewChart = () => api.get("/overview/chart");
export const getAlarms = () => api.get("/alarms");
export const handleAlarm = (id) => api.put(`/alarms/${id}/handle`);
export const getWorkers = () => api.get("/workers");
export const createWorker = (data) => api.post("/workers", data);
export const updateWorker = (id, data) => api.put(`/workers/${id}`, data);
export const deleteWorker = (id) => api.delete(`/workers/${id}`);

export default api;
