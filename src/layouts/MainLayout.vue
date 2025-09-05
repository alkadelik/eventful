<template>
  <div class="min-h-screen w-full bg-gray-50">
    <div class="flex">
      <!-- Sidebar -->
      <AppSidebar v-if="!isMobile" @logout="logout = true" />

      <!-- Main column -->
      <div
        :class="[
          'flex min-h-screen flex-1 flex-col overflow-x-hidden transition-all duration-200',
          'pt-16 pb-16 lg:pb-0', // height of header
          'lg:pl-72',
        ]"
      >
        <!-- Topbar -->
        <AppHeader />

        <!-- Content -->
        <main>
          <router-view />
        </main>

        <!-- Bottom navigation for mobile -->
        <nav
          v-if="isMobile"
          class="fixed right-0 bottom-0 left-0 z-10 border-t border-gray-200 bg-white"
        >
          <div class="flex items-center justify-around px-2 py-2">
            <SidebarLink label="Dashboard" icon="box" to="/dashboard" />
            <AppButton
              size="sm"
              class="!ring-primary-200 !rounded-full !ring-4"
              icon="add-circle"
            />
            <SidebarLink label="Events" icon="calendar-tick" to="/events" />
          </div>
        </nav>
      </div>
    </div>

    <!--  -->
    <LogoutModal :open="logout" @close="logout = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import AppButton from "@components/AppButton.vue"
import SidebarLink from "./parts/SidebarLink.vue"
import LogoutModal from "@components/core/LogoutModal.vue"
import AppHeader from "./parts/AppHeader.vue"
import AppSidebar from "./parts/AppSidebar.vue"
import { useMediaQuery } from "@vueuse/core"
import { useGetProfile } from "@modules/shared/api"
import { useAuthStore } from "@modules/auth/store"

const isMobile = useMediaQuery("(max-width: 1024px)")
const logout = ref(false)

const { data: profile } = useGetProfile()
const { updateAuthUser } = useAuthStore()

watch(
  profile,
  (val) => {
    if (val) updateAuthUser(val)
  },
  { immediate: true },
)
</script>
