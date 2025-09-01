import type { RouteRecordRaw } from "vue-router"

const settingsRoutes: RouteRecordRaw[] = [
  {
    path: "settings/",
    component: () => import("./views/index.vue"),
    name: "Settings",
    redirect: { name: "Profile" },
    children: [
      {
        path: "profile",
        name: "Profile",
        component: () => import("./views/profile.vue"),
      },
      {
        path: "password",
        name: "Password",
        component: () => import("./views/password.vue"),
      },
    ],
  },
]

export default settingsRoutes
