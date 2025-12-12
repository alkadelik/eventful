<template>
  <header class="fixed top-0 right-0 left-0 z-[50] border-b border-gray-200 bg-white lg:left-72">
    <AppSection class="flex h-16 items-center gap-1.5 px-4">
      <img v-if="showLogo" src="/logo.svg" alt="Eventful" class="h-8 w-auto" />
      <div class="flex-1" />

      <!-- Notifications -->
      <button class="rounded-xl p-2 hover:bg-gray-100" @click="openNotif = true">
        <Icon name="bell" size="20" />
      </button>
      <!-- Settings -->
      <!-- <button class="rounded-xl p-2 hover:bg-gray-100" @click="$router.push('/settings')">
        <Icon name="setting" size="20" />
      </button> -->
      <DropdownMenu :items="profileMenuItems" menuClass="w-56">
        <template #prepend>
          <div class="max-w-xs overflow-hidden border-b border-gray-200 px-4 py-2">
            <p class="text-core-800 block w-full max-w-xs truncate text-sm font-medium">
              {{ user?.first_name + " " + user?.last_name }}
            </p>
            <p class="text-core-600 block w-full max-w-xs truncate text-xs">
              {{ user?.email }}
            </p>
          </div>
        </template>
        <template #trigger>
          <Avatar
            :name="user?.first_name + ' ' + user?.last_name"
            backgroundColor="var(--color-core-950)"
          />
        </template>
      </DropdownMenu>
    </AppSection>

    <!-- Notifications -->
    <NotificationDrawer :open="openNotif" @close="openNotif = false" />
  </header>
</template>

<script setup lang="ts">
import Avatar from "@components/Avatar.vue"
import Icon from "@components/Icon.vue"
import AppSection from "@components/AppSection.vue"
import NotificationDrawer from "./NotificationDrawer.vue"
import { ref } from "vue"
import DropdownMenu from "@components/DropdownMenu.vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@modules/auth/store"
import { computed } from "vue"

defineProps<{ showLogo?: boolean }>()
const emit = defineEmits<{ logout: [value: boolean] }>()
const router = useRouter()

const openNotif = ref(false)
const user = computed(() => useAuthStore().user)

const profileMenuItems = [
  {
    label: "Settings",
    icon: "setting",
    action: () => router.push("/settings"),
  },
  { divider: true },
  {
    label: "Logout",
    icon: "signoutt",
    class: "text-red-600 hover:bg-red-50",
    iconClass: "text-red-600",
    action: () => emit("logout", true),
  },
]
</script>
