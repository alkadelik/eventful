<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <header class="flex h-20 items-center border-b border-gray-200 bg-white">
      <AppSection class="!py-0">
        <img src="/images/logos/leyyow-logo-2.svg?url" class="h-8" alt="leyyow logo" />
      </AppSection>
    </header>

    <!-- Main content -->
    <main>
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-primary-600 py-6 text-white xl:py-10">
      <AppSection class="grid grid-cols-4 items-end">
        <div class="col-span-2">
          <img src="/images/logos/leyyow-logo-2.svg?url" class="h-8" alt="leyyow logo" />
          <h2 class="mt-4 text-xl font-semibold md:text-2xl xl:text-3xl">
            Connecting Organizers & Merchants Seamlessly
          </h2>
        </div>

        <div>
          <div class="border-l-2 p-4">
            <h3 class="text-base font-semibold">For Organizers</h3>
            <button type="button" class="text-sm">Create Event</button>
          </div>
        </div>
        <div>
          <div class="border-l-2 p-4">
            <h3 class="text-base font-semibold">For Vendors</h3>
            <button type="button" class="text-sm">Browse Events</button>
          </div>
        </div>
      </AppSection>
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppSection from "@components/AppSection.vue"
</script>
