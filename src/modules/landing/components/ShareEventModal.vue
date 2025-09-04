<script setup lang="ts">
import AppButton from "@components/AppButton.vue"
import Icon from "@components/Icon.vue"
import Modal from "@components/Modal.vue"
import { computed } from "vue"

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: "close"): void
}>()

const socialLinks = computed(() => [
  { name: "Facebook", url: "#", color: "#4461A0" },
  { name: "X", url: "#", color: "#000000" },
  { name: "WhatsApp", url: "#", color: "#67C15E" },
  { name: "Telegram", url: "#", color: "#40B3E0" },
  { name: "LinkedIn", url: "#", color: "#1275B1" },
])
</script>

<template>
  <Modal :open="open" @close="emit('close')" title="Share Event Link">
    <div
      class="bg-primary-50 border-primary-600 flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-base"
    >
      <p class="text-core-700 truncate font-medium">www.leyyow.com/popup/slug</p>
      <AppButton label="Copy" icon="copy" size="sm" color="alt" />
    </div>

    <div class="mt-6 flex flex-col items-center gap-2">
      <!-- barcode -->
      <img src="https://placehold.co/150x150" class="size-80 rounded-2xl bg-white p-2 shadow" />
      <p class="text-core-700 text-sm">
        Shoppers can scan the code to visit your store during the event.
      </p>
      <AppButton label="Download QR Code" icon="box" color="alt" />
    </div>

    <template #footer>
      <div>
        <p class="mb-4 text-sm">Share to</p>
        <div class="grid grid-cols-5 gap-2">
          <a
            href="#"
            v-for="v in socialLinks"
            :key="v.name"
            class="flex flex-col items-center gap-1 text-sm"
          >
            <Icon :name="v.name.toLowerCase()" size="40" :style="`color: ${v.color}`" />
            <span>{{ v.name }}</span>
          </a>
        </div>
      </div>
    </template>
  </Modal>
</template>
