<script setup lang="ts">
import AppButton from "@components/AppButton.vue"
import AppSection from "@components/AppSection.vue"
import { useAuthStore } from "@modules/auth/store"
import { computed } from "vue"

const appVersion = __APP_VERSION__
console.log("App Version:", appVersion)

const isAuthenticated = computed(() => useAuthStore().isAuthenticated)

type FooterLink = {
  name: string
  href: string
  new?: boolean
}

const footerLinks: Record<string, FooterLink[]> = {
  Contact: [
    { name: "hello@leyyow.com", href: "mailto:hello@leyyow.com" },
    { name: "Instagram", href: "https://www.instagram.com/leyyow_app" },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/leyyow" },
    { name: "WhatsApp", href: "https://wa.me/1234567890" },
  ],
  Products: [
    { name: "Leyyow Sales", href: "/dashboard/sales/orders" },
    { name: "Eventful", href: "https://eventful.leyyow.com", new: true },
  ],
  Resources: [
    {
      name: "Terms",
      href: "https://leyyow.notion.site/Refund-policy-162f3934f3148085a337fc0d3cbffb99?pvs=4",
    },
    {
      name: "Privacy",
      href: "https://leyyow.notion.site/Refund-policy-162f3934f3148085a337fc0d3cbffb99?pvs=4",
    },
    { name: "Help & Support", href: "https://leyyow.notion.site/faq?pvs=4" },
    { name: "FAQs", href: "/#faqs" },
  ],
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <header
      class="sticky top-0 z-50 flex h-16 items-center border-b border-gray-200 bg-white md:h-20"
    >
      <AppSection class="flex items-center justify-between gap-3 !py-0">
        <router-link to="/">
          <img src="/LYW.svg?url" class="h-6 md:h-8" alt="leyyow logo" />
        </router-link>

        <div v-if="!isAuthenticated" class="flex gap-2">
          <AppButton
            variant="text"
            label="Log in"
            class="!text-base"
            @click="$router.push('/login')"
          />
          <AppButton label="Get Started" @click="$router.push('/signup')" />
        </div>

        <AppButton
          v-if="isAuthenticated"
          label="Go to Dashboard"
          @click="$router.push('/dashboard')"
        />
      </AppSection>
    </header>

    <!-- Main content -->
    <main>
      <router-view />
    </main>

    <footer class="border-t border-gray-200 pt-16 pb-4">
      <AppSection class="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div class="flex flex-col">
          <h1 class="text-primary-600 mb-1 text-2xl font-bold">Eventful</h1>
          <div class="flex items-center gap-2 text-gray-600">
            Powered by <img src="/LYW.svg?url" alt="Leyyow Logo" class="h-5 grayscale filter" />
          </div>

          <div class="mt-8 flex flex-col gap-3 lg:mt-auto">
            <RouterLink
              to="/upcoming-events"
              class="hover:text-brand-500 font-medium text-gray-600 hover:underline"
              >Browse Events</RouterLink
            >
            <RouterLink
              to="/events?open=create"
              class="hover:text-brand-500 font-medium text-gray-600 hover:underline"
              >Create Event
              <span
                :class="[
                  'bg-primary-600 text-xs text-white',
                  'ml-1 inline-flex items-center rounded-full px-2 py-1 font-medium',
                ]"
              >
                For Organizers
              </span></RouterLink
            >
          </div>
        </div>
        <div class="col-span-1 grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div v-for="key in Object.keys(footerLinks)" :key="key">
            <h3 class="mb-4 text-sm font-semibold text-gray-500">{{ key }}</h3>
            <div class="flex flex-col gap-3">
              <a
                v-for="link in footerLinks[key]"
                :key="link.name"
                :href="link.href"
                :target="link.href.startsWith('http') ? '_blank' : undefined"
                class="hover:text-brand-500 font-medium text-gray-600 hover:underline"
              >
                {{ link.name }}
                <span
                  v-if="link.new"
                  :class="[
                    'text-brand-500 border border-green-400 bg-green-100 text-xs',
                    'ml-2 inline-flex items-center rounded-full px-2 py-0.5 font-medium',
                  ]"
                >
                  New
                </span>
              </a>
            </div>
          </div>
        </div>
      </AppSection>
      <div class="mt-16 border-t border-gray-200" />
      <AppSection
        class="flex flex-col items-start justify-between gap-4 py-8 md:flex-row md:items-end"
      >
        <div>
          <h3 class="mb-2 text-lg font-medium text-gray-900 md:text-xl">Eventful by Leyyow</h3>
          <p class="text-sm text-gray-600 md:text-base">
            Connecting Organizers & Vendors Seamlessly
          </p>
        </div>
        <p class="mt-4 text-sm text-gray-500 md:mt-0 md:text-base">
          &copy; {{ new Date().getFullYear() }} Leyyow. All rights reserved.
        </p>
      </AppSection>
    </footer>
  </div>
</template>
