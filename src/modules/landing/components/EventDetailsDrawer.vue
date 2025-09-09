<script setup lang="ts">
import { formatCurrency } from "@/utils/format-currency"
import { startCase } from "@/utils/format-strings"
import AppButton from "@components/AppButton.vue"
import Chip from "@components/Chip.vue"
import Drawer from "@components/Drawer.vue"
import Icon from "@components/Icon.vue"
import { computed, ref } from "vue"
import ShareEventModal from "./ShareEventModal.vue"

defineProps<{ open: boolean }>()
const openShare = ref(false)

const emit = defineEmits<{ (e: "close"): void }>()

const otherInfo = computed(() => {
  return {
    registrationCost: formatCurrency(10000),
    description:
      "Lagos Business Week 2025 is the largest business and innovation conference in West Africa, bringing together entrepreneurs, investors, corporate leaders, and policymakers. This year’s theme, ‘Future-Proofing African Businesses,’ focuses on digital transformation, sustainability, and cross-border trade opportunities.",
    eventInstructions:
      "Vendors should complete their registration through the official vendor registration form. Ensure all booth details and payments are confirmed before the event date. Detailed setup guidelines will be shared upon successful registration.",
    "Terms & Conditions": "https://www.lagosbusinessweek.com/terms-and-conditions",
  }
})
</script>

<template>
  <Drawer :open="open" title="Event Details" @close="emit('close')" max-width="2xl">
    <section class="space-y-6">
      <div class="rounded-2xl border border-gray-200 bg-green-950 p-5 text-white">
        <div class="mb-2 flex items-center justify-between gap-2">
          <h3 class="truncate text-xl font-semibold">Lagos Business Week 2025 International</h3>
          <Chip label="Ongoing" size="sm" color="success" />
          <Icon name="arrow-down-double" size="28" class="-rotate-90" />
        </div>
        <div class="space-y-1.5">
          <p class="flex items-center gap-2 text-sm">
            <Icon name="calendar-tick" size="20" />
            22-03-2025 - 28-03-2025
          </p>
          <p class="flex items-center gap-2 text-sm">
            <Icon name="star" size="20" />
            Victoria Island, Lagos
          </p>

          <div
            class="mt-2 inline-flex items-center gap-4 rounded-md border border-white/20 bg-green-200/20 px-2 py-1 text-sm"
          >
            <p>www.leyyow.com/popup/slug</p>
            <Icon name="copy" size="16" class="text-primary-600" />
          </div>
        </div>
      </div>

      <div class="rounded-2xl bg-white p-6">
        <h3 class="mb-4 text-lg font-semibold">Other Information</h3>

        <div class="space-y-3">
          <div v-for="(value, key) in otherInfo" :key="key" class="flex gap-1 text-sm">
            <p class="text-core-600 flex-1 font-semibold">{{ startCase(key) }}</p>
            <p class="flex-2 font-medium">{{ value }}</p>
          </div>
        </div>
      </div>
    </section>

    <template #footer>
      <div class="grid grid-cols-2 gap-4">
        <AppButton color="alt" label="Share Event" @click="openShare = true" />
        <AppButton label="Register For  Event" />
      </div>
    </template>

    <!--  -->
  </Drawer>
  <ShareEventModal :open="openShare" @close="openShare = false" />
</template>
