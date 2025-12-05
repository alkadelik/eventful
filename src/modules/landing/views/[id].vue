<script setup lang="ts">
import { formatCurrency } from "@/utils/format-currency"
import { startCase } from "@/utils/format-strings"
import AppButton from "@components/AppButton.vue"
import Chip from "@components/Chip.vue"
import Icon from "@components/Icon.vue"
import { computed, ref } from "vue"
import { getEventStatus } from "@modules/shared/utils"
import { formatDate } from "@/utils/format-date"
import ShareEventModal from "../components/ShareEventModal.vue"
import AppSection from "@components/AppSection.vue"
import BackButton from "@components/BackButton.vue"
import { useRoute } from "vue-router"
import { useGetOrganizerEventsPublic, useGetPublicOrganizerEventById } from "@modules/shared/api"
import { TEvent } from "@modules/shared/types"
import EmptyState from "@components/EmptyState.vue"
import EventCard from "../components/EventCard.vue"
import TextField from "@components/form/TextField.vue"
import fallbackImage from "@/assets/images/eventful-noise-grid.svg?url"

const route = useRoute()

const { data: orgEvent, isLoading } = useGetPublicOrganizerEventById(route.params.id as string)

const openShare = ref(false)

const otherInfo = computed(() => {
  return {
    registrationCost: Number(orgEvent.value?.participant_fee)
      ? formatCurrency(Number(orgEvent.value?.participant_fee), { kobo: true })
      : "Free",
    description: orgEvent.value?.description || "N/A",
    eventInstructions: orgEvent.value?.event_instructions || "N/A",
    "Terms & Conditions": orgEvent.value?.terms_and_conditions || "N/A",
  }
})

const openRegisterPage = () => {
  const baseUrl = window.location.origin.includes("localhost")
    ? "http://localhost:8080"
    : "https://suite.leyyow.com"

  window.open(`${baseUrl}/popups/eventful/${orgEvent.value?.uid}`, "_blank")
}

const slotsRemaining = computed(() => {
  if (!orgEvent.value) return 0
  return (
    Number(orgEvent.value?.capacity) - (orgEvent.value?.registration_stats?.total_registered || 0)
  )
})

const params = computed(() => ({ limit: 4, status: "upcoming" }))
const { data: orgEvents } = useGetOrganizerEventsPublic(params)
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
      <div class="relative z-[1] rounded-xl">
        <img
          :src="orgEvent?.image || fallbackImage"
          :alt="orgEvent?.name"
          class="h-40 w-full rounded-xl bg-amber-600 object-cover"
        />

        <span
          class="absolute top-4 left-0 flex items-center justify-center rounded-r bg-white px-3 py-1 text-sm font-medium shadow"
        >
          {{
            Number(orgEvent?.participant_fee) ? formatCurrency(orgEvent?.participant_fee) : "Free"
          }}
        </span>

        <img src="/images/logos/leyyow-icon-1.svg?url" class="absolute right-2 bottom-2 size-8" />
      </div>

      <section class="flex flex-col gap-6 md:flex-row">
        <div class="flex-1">
          <div class="mb-3 flex items-center gap-2">
            <h3 class="truncate text-xl font-semibold capitalize">{{ orgEvent?.name }}</h3>
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
          </div>
          <div class="space-y-3">
            <p class="flex items-center gap-2 text-sm">
              <Icon name="calendar" size="20" />
              {{ formatDate(orgEvent?.start_date || "") }} -
              {{ formatDate(orgEvent?.end_date || "") }}
            </p>
            <p class="flex items-center gap-2 text-sm capitalize">
              <Icon name="location" size="20" />
              {{ orgEvent?.location || "N/A" }}
            </p>

            <div class="flex items-center gap-2">
              <Icon name="dollar-circle" size="20" />
              <p class="mr-2 text-sm">
                {{
                  Number(orgEvent?.participant_fee)
                    ? formatCurrency(orgEvent?.participant_fee)
                    : "Free"
                }}
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

        <div class="grid grid-cols-2 gap-4">
          <AppButton color="alt" label="Share Event" @click="openShare = true" />
          <AppButton label="Register For  Event" @click="openRegisterPage" />
        </div>
      </section>

      <div class="rounded-2xl bg-white p-6 shadow-xs">
        <h3 class="mb-4 text-lg font-semibold">Other Information</h3>

        <div class="divide-core-100 divide-y">
          <div
            v-for="(value, key) in otherInfo"
            :key="key"
            class="flex flex-col gap-1 py-3 text-sm"
          >
            <p class="text-core-600 flex-1 font-semibold">{{ startCase(key) }}</p>
            <p v-if="key === 'Terms & Conditions'" class="flex-2 font-medium">
              <a
                :href="value"
                target="_blank"
                class="text-primary-600 hover:text-primary-800 underline"
                >View Terms & Conditions</a
              >
            </p>
            <p v-else class="flex-2 font-medium">{{ value }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-12">
      <h2 class="mb-4 text-2xl font-semibold">Other events you may like</h2>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <EventCard
          v-for="evt in orgEvents?.results.slice(0, 3)"
          :key="evt.uid"
          :event="evt"
          @click="
            () => {
              $router.push(`/upcoming-events/${evt.uid}`)
            }
          "
        />
      </div>
    </section>

    <section
      class="relative mt-12 flex min-h-80 flex-col items-center justify-center overflow-hidden rounded-xl bg-white py-12 shadow-xs"
    >
      <!-- Background Images -->
      <img
        src="/images/left-ellipse.svg?url"
        alt=""
        class="pointer-events-none absolute top-0 -left-1/4 h-full object-contain opacity-20 md:left-0"
      />
      <img
        src="/images/right-ellipse.svg?url"
        alt=""
        class="pointer-events-none absolute top-0 -right-1/4 h-full object-contain opacity-20 md:right-0"
      />

      <!-- Content -->
      <div class="relative z-10 mx-auto max-w-screen-sm px-6">
        <h2 class="mb-2 text-center text-2xl font-semibold md:text-3xl">
          Get notified about future events like this.
        </h2>
        <p class="mb-8 text-center text-lg md:text-xl">
          Create your pop-up or book a booth in minutes.
        </p>
        <form @submit.prevent="console.log" class="grid gap-4">
          <TextField type="email" placeholder="e.g. Adebola99@gmail.com" required />
          <AppButton type="submit" label="Subscribe Now" size="lg" class="w-full" />
        </form>
      </div>
    </section>

    <ShareEventModal :open="openShare" @close="openShare = false" :event="orgEvent" />
  </AppSection>
</template>
