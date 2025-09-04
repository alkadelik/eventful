<script setup lang="ts">
import Drawer from "@components/Drawer.vue"

defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: "close"): void }>()
</script>

<template>
  <Drawer title="Notifications" :open="open" @close="emit('close')"></Drawer>
</template>
