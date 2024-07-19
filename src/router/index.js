import { createRouter, createWebHistory } from "vue-router";
import axios from "@/plugins/axios";
import LoginView from "@/views/Login.vue";
import ToDoView from "@/views/ToDo.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/",
    name: "Secure",
    component: ToDoView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      next("/login");
    } else {
      try {
        const response = await axios.get("/verify-token");
        if (response.data.valid) {
          next();
        } else {
          localStorage.removeItem("token");
          next("/login");
        }
      } catch (error) {
        console.error("Ошибка проверки токена:", error);
        localStorage.removeItem("token");
        next("/login");
      }
    }
  } else {
    next();
  }
});

export default router;
