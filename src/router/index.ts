import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"
import { useAuthStore } from "@modules/auth/store"
import { toast } from "@/composables/useToast"

// Layout imports
import LandingLayout from "@/layouts/LandingLayout.vue"
import MainLayout from "@/layouts/MainLayout.vue"
import AuthLayout from "@/layouts/AuthLayout.vue"

// Module route imports
import authRoutes from "@modules/auth/routes"
import landingRoutes from "@modules/landing/routes"
import settingsRoutes from "@modules/settings/routes"
import sharedRoutes from "@modules/shared/routes"

const routes: RouteRecordRaw[] = [
  // Public pages routes with LandingLayout
  {
    path: "/",
    component: LandingLayout,
    children: [...landingRoutes],
  },

  // Auth routes with AuthLayout
  {
    path: "/",
    component: AuthLayout,
    children: [...authRoutes],
  },

  // Main app routes with MainLayout - authenticated users only
  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [...settingsRoutes, ...sharedRoutes],
  },
  {
    path: "/",
    meta: { requiresAuth: true },
    children: [...settingsRoutes],
  },

  // 404 - Catch all route (must be last)
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: ":pathMatch(.*)*",
        name: "NotFound",
        component: () => import("@modules/404.vue"),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    else return { top: 0, behavior: "smooth" }
  },
})

/**
 * ======= Navigation guards =======
 *  */
router.beforeEach((to, _from, next) => {
  const { isAuthenticated, user } = useAuthStore()
  // user is authenticated but email is not confirmed ==> confirm email page
  if (isAuthenticated && user && !user.email_confirmed && to.path !== "/confirm-email") {
    return next({ path: "/confirm-email" })
  }

  // route requiresAuth but user is not authenticated ==> login page
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ path: "/login", query: { redirect: to.fullPath } })
  }

  // route is public but user is authenticated ==> dashboard
  // (only if it’s a valid matched route, not a 404)
  const is404 = to.matched.some((v) => v.name === "NotFound")
  if (!to.meta.requiresAuth && isAuthenticated && !is404) {
    toast.info("You already have an active session.")
    return next({ path: "/dashboard" })
  }

  next()
})

export default router
