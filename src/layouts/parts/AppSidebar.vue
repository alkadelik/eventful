<template>
  <aside
    :class="[
      'fixed z-40 h-screen w-72 border-r border-gray-200 bg-white transition-all duration-200',
      'flex h-full flex-col divide-y divide-gray-200',
      isMobile ? (mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0',
    ]"
  >
    <!-- Brand -->
    <div class="flex items-center gap-3 px-4 py-4">
      <img src="/images/logos/leyyow-logo-4.svg?url" alt="Leyyow" class="h-8 w-auto" />
    </div>

    <!-- User Info -->
    <div class="bg-gray-50 px-4 py-4">
      <div class="flex items-center gap-4">
        <Avatar
          :name="getFullName(user as TNameObj)"
          :extraText="user?.email"
          clickable
          class="truncate"
          @click="$router.push('/settings/profile')"
        />
      </div>
    </div>

    <!-- Home & Get Started -->
    <div class="space-y-1 px-4 py-2">
      <SidebarLink icon="house" label="Dashboard" to="/dashboard" />
      <SidebarLink icon="calendar-tick" label="Events" to="/events" />
    </div>

    <section class="mt-auto space-y-2 px-4 pb-4">
      <SidebarLink icon="life-buoy" label="Support" to="/support" />
      <button @click="$emit('logout', true)" type="button" class="w-full">
        <SidebarLink icon="signout" label="Logout" to="#" />
      </button>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from "@modules/auth/store"
import { getFullName, TNameObj } from "@/utils/format-strings"
import { useMediaQuery } from "@vueuse/core"
import Avatar from "@components/Avatar.vue"
import SidebarLink from "./SidebarLink.vue"

defineProps<{ mobileSidebarOpen: boolean }>()

defineEmits<{ logout: [value: boolean] }>()

const { user } = useAuthStore()
const isMobile = useMediaQuery("(max-width: 1024px)")
</script>
