<template>
  <div class="pt-16">
    <AppHeader show-logo />

    <AppSection>
      <main class="flex min-h-screen flex-col rounded-xl bg-white py-4">
        <header class="border-b border-gray-200 pb-4">
          <BackButton to="/dashboard" />
          <h2 class="mt-3 text-2xl font-bold">Settings</h2>
          <p>shop.leyyow.com</p>
        </header>

        <div class="flex h-full flex-1 gap-2">
          <aside class="h-full w-48 py-3">
            <nav>
              <ul class="space-y-1">
                <li v-for="link in LINKS" :key="link.path">
                  <router-link
                    :to="link.path"
                    :class="[
                      'hover:text-primary-700 block border-l-2 px-3.5 py-2.5 font-medium',
                      $route.path === link.path
                        ? 'text-primary-700 border-primary-700'
                        : 'text-core-800 border-transparent',
                    ]"
                  >
                    {{ link.label }}
                  </router-link>
                </li>
              </ul>
            </nav>
          </aside>
          <main class="h-full flex-1 px-3 py-3">
            <router-view />
          </main>
        </div>
      </main>
    </AppSection>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "@/layouts/parts/AppHeader.vue"
import AppSection from "@components/AppSection.vue"
import BackButton from "@components/BackButton.vue"

const LINKS = [
  { label: "Profile", path: "/settings/profile" },
  { label: "Password", path: "/settings/password" },
]
</script>
