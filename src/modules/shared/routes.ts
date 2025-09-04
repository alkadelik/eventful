import type { RouteRecordRaw } from "vue-router"

const sharedRoutes: RouteRecordRaw[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("./views/dashboard.vue"),
  },
  {
    path: "/events",
    name: "Events",
    component: () => import("./views/events/index.vue"),
  },
  {
    path: "/events/:id",
    name: "Event Details",
    component: () => import("./views/events/[id].vue"),
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: () => import("./views/notifications.vue"),
  },
]

export default sharedRoutes
