<template>
  <div>
    <router-view />
    <ConsentBanner />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import ToastContainer from "@components/core/ToastContainer.vue"
import ConsentBanner from "@modules/shared/components/ConsentBanner.vue"
</script>
