<script setup lang="ts">
import Icon from "@components/Icon.vue"
import { useAuthStore } from "@modules/auth/store"

// No script logic needed for this layout component
</script>

<template>
  <div class="flex h-screen">
    <!-- Left Side -->
    <div class="relative hidden flex-1 lg:block">
      <div class="relative h-full w-full overflow-hidden">
        <img
          src="../assets/images/jpegs/auth-layout-image.jpeg"
          alt="gradient background image"
          class="h-full w-full object-cover"
        />
      </div>
    </div>

    <!-- Right Side -->
    <div class="flex-1 overflow-auto">
      <div class="w-full px-6 py-10 md:px-24 md:py-12">
        <div class="mb-10 flex items-center gap-2 md:mb-10">
          <h3 class="text-lg font-bold">Eventful by</h3>
          <router-link to="/">
            <img src="/images/logos/leyyow-logo-2.svg?url" alt="leyyow logo" class="h-8" />
          </router-link>

          <template v-if="!($route.path.includes('login') || $route.path.includes('signup'))">
            <span class="flex-1" />
            <button
              type="button"
              class="rounded-xl hover:bg-red-100"
              @click="useAuthStore().logout()"
            >
              <Icon name="signout" size="20" class="text-core-600" />
            </button>
          </template>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>
