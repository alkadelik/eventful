<script setup lang="ts">
import { formatCurrency } from "@/utils/format-currency"
import { startCase } from "@/utils/format-strings"
import AppButton from "@components/AppButton.vue"
import Chip from "@components/Chip.vue"
import Drawer from "@components/Drawer.vue"
import Icon from "@components/Icon.vue"
import { computed, ref } from "vue"
import ShareEventModal from "./ShareEventModal.vue"
import { TEvent } from "@modules/shared/types"
import { getEventStatus } from "@modules/shared/utils"
import { formatDate } from "@/utils/format-date"

const props = defineProps<{ open: boolean; event: TEvent | null }>()
const openShare = ref(false)

const emit = defineEmits<{ (e: "close"): void }>()

const otherInfo = computed(() => {
  return {
    registrationCost: Number(props.event?.participant_fee)
      ? formatCurrency(props.event?.participant_fee)
      : "Free",
    description: props.event?.description || "N/A",
    eventInstructions: props.event?.event_instructions || "N/A",
    "Terms & Conditions": props.event?.terms_and_conditions || "N/A",
  }
})

const openRegisterPage = () => {
  // https://suite-staging-branch.vercel.app
  const baseUrl = window.location.origin.includes("localhost")
    ? `http://localhost:8080`
    : `https://suite.leyyow.com`

  window.open(`${baseUrl}/popups/eventful/${props.event?.uid}`, "_blank")
}

const slotsRemaining = computed(() => {
  if (!props.event) return 0
  return Number(props.event.capacity) - (props.event.registration_stats?.total_registered || 0)
})
</script>

<template>
  <Drawer :open="open" title="Event Details" @close="emit('close')" max-width="2xl">
    <section class="space-y-6">
      <div class="rounded-2xl border border-gray-200 bg-green-950 p-5 text-white">
        <div class="mb-2 flex items-center gap-2">
          <h3 class="truncate text-xl font-semibold capitalize">{{ event?.name }}</h3>
          <Chip
            :label="getEventStatus(event as TEvent)"
            size="sm"
            :color="
              getEventStatus(event) === 'upcoming'
                ? 'primary'
                : getEventStatus(event) === 'ongoing'
                  ? 'success'
                  : 'alt'
            "
          />
          <Icon name="share" size="28" class="ml-auto" @click="openShare = true" />
        </div>
        <div class="space-y-1.5">
          <p class="flex items-center gap-2 text-sm">
            <Icon name="calendar" size="20" />
            {{ formatDate(event?.start_date || "") }} - {{ formatDate(event?.end_date || "") }}
          </p>
          <p class="flex items-center gap-2 text-sm">
            <Icon name="location" size="20" />
            {{ event?.location || "N/A" }}
          </p>

          <!-- <div
            class="mt-2 inline-flex items-center gap-4 rounded-md border border-white/20 bg-green-200/20 px-2 py-1 text-sm"
          >
            <p>www.leyyow.com/popup/slug</p>
            <Icon name="copy" size="16" class="text-primary-600" />
          </div> -->
          <div class="flex items-center gap-2">
            <Icon name="dollar-circle" size="20" />
            <p class="mr-2 text-sm">
              {{ Number(event?.participant_fee) ? formatCurrency(event?.participant_fee) : "Free" }}
            </p>
            <Chip
              v-if="slotsRemaining < 30"
              :label="`${slotsRemaining} spots left`"
              size="sm"
              color="error"
              class="!border-error border"
            />
          </div>
        </div>
      </div>

      <div class="border-core-100 rounded-2xl border bg-white p-6 shadow-xs">
        <h3 class="mb-4 text-lg font-semibold">Other Information</h3>

        <div class="space-y-3">
          <div
            v-for="(value, key) in otherInfo"
            :key="key"
            class="flex flex-col gap-1 text-sm md:flex-row"
          >
            <p class="text-core-600 flex-1 font-semibold">{{ startCase(key) }}</p>
            <p class="flex-2 font-medium">{{ value }}</p>
          </div>
        </div>
      </div>
    </section>

    <template #footer>
      <div class="grid grid-cols-2 gap-4">
        <AppButton color="alt" label="Share Event" @click="openShare = true" />
        <AppButton label="Register For  Event" @click="openRegisterPage" />
      </div>
    </template>

    <!--  -->
  </Drawer>
  <ShareEventModal :open="openShare" @close="openShare = false" :event="event as TEvent" />
</template>
