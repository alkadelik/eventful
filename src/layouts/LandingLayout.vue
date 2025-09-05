<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <header class="sticky top-0 flex h-16 items-center border-b border-gray-200 bg-white md:h-20">
      <AppSection class="!py-0">
        <img src="/images/logos/leyyow-logo-2.svg?url" class="h-6 md:h-8" alt="leyyow logo" />
      </AppSection>
    </header>

    <!-- Main content -->
    <main>
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-primary-600 py-6 text-white md:py-8 xl:py-10">
      <AppSection class="grid grid-cols-1 gap-6 md:grid-cols-4 md:items-end">
        <div class="md:col-span-2">
          <img src="/images/logos/leyyow-logo-2.svg?url" class="h-6 md:h-8" alt="leyyow logo" />
          <h2 class="mt-3 text-lg font-semibold md:mt-4 md:text-xl xl:text-3xl">
            Connecting Organizers & Merchants Seamlessly
          </h2>
        </div>

        <div class="grid grid-cols-2 gap-4 md:contents">
          <div>
            <div class="border-l-2 p-3 md:p-4">
              <h3 class="text-sm font-semibold md:text-base">For Organizers</h3>
              <button type="button" class="text-xs md:text-sm">Create Event</button>
            </div>
          </div>
          <div>
            <div class="border-l-2 p-3 md:p-4">
              <h3 class="text-sm font-semibold md:text-base">For Vendors</h3>
              <button type="button" class="text-xs md:text-sm">Browse Events</button>
            </div>
          </div>
        </div>
      </AppSection>
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppSection from "@components/AppSection.vue"
</script>
