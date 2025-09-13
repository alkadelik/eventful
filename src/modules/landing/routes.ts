import type { RouteRecordRaw } from "vue-router"

const landingRoutes: RouteRecordRaw[] = [
  {
    path: "",
    name: "Home",
    component: () => import("./views/index.vue"),
  },
  {
    path: "upcoming-events",
    name: "UpcomingEvents",
    component: () => import("./views/upcoming-events.vue"),
  },
]

export default landingRoutes
