<template>
  <div>
    <router-view />
    <!-- <h2>Hello World</h2> -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import ToastContainer from "@components/core/ToastContainer.vue"
</script>
