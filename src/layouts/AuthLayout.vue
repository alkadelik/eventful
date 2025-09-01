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
          <img src="/images/logos/leyyow-logo-2.svg?url" alt="leyyow logo" class="h-8" />
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>
