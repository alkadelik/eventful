import type { RouteRecordRaw } from "vue-router"

const authRoutes: RouteRecordRaw[] = [
  // Direct auth routes without /auth prefix
  {
    path: "login",
    name: "Login",
    component: () => import("./views/login.vue"),
  },
  {
    path: "signup",
    name: "Signup",
    component: () => import("./views/signup.vue"),
  },
  {
    path: "forgot-password",
    name: "ForgotPassword",
    component: () => import("./views/forgot-password.vue"),
  },
  {
    path: "reset-password",
    name: "ResetPassword",
    component: () => import("./views/reset-password.vue"),
  },
  {
    path: "confirm-email",
    name: "ConfirmEmail",
    component: () => import("./views/confirm-email.vue"),
  },
  {
    path: "add-bank",
    name: "AddBank",
    component: () => import("./views/add-bank.vue"),
    // Removed requiresAuth meta since this is part of onboarding flow
  },
]

export default authRoutes
