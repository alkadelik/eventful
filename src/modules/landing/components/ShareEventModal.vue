<script setup lang="ts">
import { clipboardCopy } from "@/utils/others"
import AppButton from "@components/AppButton.vue"
import Icon from "@components/Icon.vue"
import Modal from "@components/Modal.vue"
import { TEvent } from "@modules/shared/types"
import { computed } from "vue"

const props = defineProps<{
  open: boolean
  event: TEvent | undefined
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

const eventUrl = computed(() => {
  const baseUrl = window.location.origin.includes("localhost")
    ? "http://localhost:8082"
    : "https://eventful.leyyow.com"
  return `${baseUrl}/upcoming-events/${props.event?.id || props.event?.uid}`
})

// ====== TODO: configure open graph meta tags for better sharing
// ================================================================
const handleShareSocial = (platform: string) => {
  const url = encodeURIComponent(eventUrl.value)
  const title = encodeURIComponent(props.event?.event_name || "")
  const description = encodeURIComponent(props.event?.description || "")

  let shareUrl = ""

  switch (platform) {
    case "Facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}%20-%20${description}`
      break
    case "X":
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
      break
    case "WhatsApp":
      shareUrl = `https://api.whatsapp.com/send?text=${title}%20-%20${url}`
      break
    case "Telegram":
      shareUrl = `https://t.me/share/url?url=${url}&text=${title}`
      break
    case "LinkedIn":
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
      break
    default:
      return
  }

  window.open(shareUrl, "_blank")
}
</script>

<template>
  <Modal :open="open" @close="emit('close')" title="Share Event Link">
    <div
      class="bg-primary-50 border-primary-600 flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-base"
    >
      <p class="text-core-700 truncate font-medium">{{ eventUrl }}</p>
      <AppButton label="Copy" icon="copy" size="sm" color="alt" @click="clipboardCopy(eventUrl)" />
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
            @click="handleShareSocial(v.name)"
          >
            <Icon :name="v.name.toLowerCase()" size="40" :style="`color: ${v.color}`" />
            <span>{{ v.name }}</span>
          </a>
        </div>
      </div>
    </template>
  </Modal>
</template>
