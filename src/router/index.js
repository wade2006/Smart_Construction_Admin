import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/overview",
    name: "Overview",
    component: () => import("../views/Overview.vue"),
  },
  {
    path: "/alarm",
    name: "Alarm",
    component: () => import("../views/Alarm.vue"),
  },
  {
    path: "/workers",
    name: "Workers",
    component: () => import("../views/Workers.vue"),
  },
  {
    path: "/ai-assistant",
    name: "AiAssistant",
    component: () => import("../views/AiAssistant.vue"),
  },
  {
    path: "/",
    redirect: "/overview",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
