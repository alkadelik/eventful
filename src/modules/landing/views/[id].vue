<script setup lang="ts">
import { formatCurrency } from "@/utils/format-currency"
import { startCase } from "@/utils/format-strings"
import AppButton from "@components/AppButton.vue"
import Chip from "@components/Chip.vue"
import Icon from "@components/Icon.vue"
import { computed, onMounted, ref } from "vue"
import { getEventStatus } from "@modules/shared/utils"
import { formatDate } from "@/utils/format-date"
import ShareEventModal from "../components/ShareEventModal.vue"
import AppSection from "@components/AppSection.vue"
import BackButton from "@components/BackButton.vue"
import { useRoute } from "vue-router"
import { useGetPublicOrganizerEventById } from "@modules/shared/api"
import { TEvent } from "@modules/shared/types"
import EmptyState from "@components/EmptyState.vue"

const route = useRoute()

const { data: orgEvent, isLoading } = useGetPublicOrganizerEventById(route.params.id as string)
onMounted(() => {
  console.log("data", orgEvent.value)
})

const openShare = ref(false)

const otherInfo = computed(() => {
  return {
    registrationCost: orgEvent.value?.participant_fee
      ? formatCurrency(orgEvent.value?.participant_fee)
      : "Free",
    description: orgEvent.value?.description || "N/A",
    eventInstructions: orgEvent.value?.eventInstructions || "N/A",
    "Terms & Conditions": orgEvent.value?.termsAndConditions || "N/A",
  }
})

const openRegisterPage = () => {
  // https://suite-staging-branch.vercel.app
  const baseUrl = window.location.origin.includes("localhost")
    ? "http://localhost:5173"
    : "https://suite-staging-branch.vercel.app"

  window.open(`${baseUrl}/dashboard/sales/upcoming-events/${orgEvent.value?.id}`, "_blank")
}

const slotsRemaining = computed(() => {
  if (!orgEvent.value) return 0
  return (
    Number(orgEvent.value?.capacity) - (orgEvent.value?.registration_stats?.total_registered || 0)
  )
})
</script>

<template>
  <EmptyState
    v-if="isLoading"
    title="Event Details"
    description="Details for this event is currently not available."
    :loading="isLoading"
  />

  <AppSection v-else class="flex min-h-[80vh] flex-col py-4 md:py-8">
    <BackButton label="Go Back" class="mb-6" />

    <section class="space-y-6">
      <div class="rounded-2xl border border-gray-200 bg-green-950 p-5 text-white">
        <div class="mb-2 flex items-center gap-2">
          <h3 class="truncate text-xl font-semibold capitalize">{{ orgEvent?.event_name }}</h3>
          <Chip
            :label="getEventStatus(orgEvent as TEvent)"
            size="sm"
            :color="
              getEventStatus(orgEvent as TEvent) === 'upcoming'
                ? 'primary'
                : getEventStatus(orgEvent as TEvent) === 'ongoing'
                  ? 'success'
                  : 'alt'
            "
          />
          <Icon name="share" size="28" class="ml-auto" @click="openShare = true" />
        </div>
        <div class="space-y-1.5">
          <p class="flex items-center gap-2 text-sm">
            <Icon name="calendar" size="20" />
            {{ formatDate(orgEvent?.start_date || "") }} -
            {{ formatDate(orgEvent?.end_date || "") }}
          </p>
          <p class="flex items-center gap-2 text-sm">
            <Icon name="location" size="20" />
            {{ orgEvent?.location || "N/A" }}
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
              {{ orgEvent?.participant_fee ? formatCurrency(orgEvent?.participant_fee) : "Free" }}
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

    <div class="mt-auto grid grid-cols-2 gap-4">
      <AppButton color="alt" label="Share Event" @click="openShare = true" />
      <AppButton label="Register For  Event" @click="openRegisterPage" />
    </div>

    <ShareEventModal :open="openShare" @close="openShare = false" />
  </AppSection>
</template>
