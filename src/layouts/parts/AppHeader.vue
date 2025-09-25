<template>
  <header class="fixed top-0 right-0 left-0 z-[50] border-b border-gray-200 bg-white lg:left-72">
    <AppSection class="flex h-16 items-center gap-1.5 px-4">
      <img v-if="showLogo" src="/LYW.svg?url" alt="Leyyow" class="h-8 w-auto" />
      <div class="flex-1" />

      <!-- Notifications -->
      <button class="rounded-xl p-2 hover:bg-gray-100" @click="openNotif = true">
        <Icon name="bell" size="20" />
      </button>
      <!-- Settings -->
      <button class="rounded-xl p-2 hover:bg-gray-100" @click="$router.push('/settings')">
        <Icon name="setting" size="20" />
      </button>
      <!-- User or CTA -->
      <Avatar v-if="isMobile" name="John Doe" clickable />
    </AppSection>

    <!-- Notifications -->
    <NotificationDrawer :open="openNotif" @close="openNotif = false" />
  </header>
</template>

<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core"
import Avatar from "@components/Avatar.vue"
import Icon from "@components/Icon.vue"
import AppSection from "@components/AppSection.vue"
import NotificationDrawer from "./NotificationDrawer.vue"
import { ref } from "vue"

defineProps<{ showLogo?: boolean }>()

const isMobile = useMediaQuery("(max-width: 1024px)")
const openNotif = ref(false)
</script>
