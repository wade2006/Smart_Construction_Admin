import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/overview",
    name: "Overview",
    component: () => import("../views/Overview.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/alarm",
    name: "Alarm",
    component: () => import("../views/Alarm.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/workers",
    name: "Workers",
    component: () => import("../views/Workers.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/ai-assistant",
    name: "AiAssistant",
    component: () => import("../views/AiAssistant.vue"),
    meta: { requiresAuth: true },
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

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    next("/overview");
  } else {
    next();
  }
});

export default router;