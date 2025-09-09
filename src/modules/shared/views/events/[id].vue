<script setup lang="ts">
import { formatCurrency } from "@/utils/format-currency"
import { startCase } from "@/utils/format-strings"
import AppButton from "@components/AppButton.vue"
import Chip from "@components/Chip.vue"
import Icon from "@components/Icon.vue"
import SummaryCard from "@components/SummaryCard.vue"
import { computed, ref } from "vue"
import DropdownMenu from "@components/DropdownMenu.vue"
import Tabs from "@components/Tabs.vue"
import ShareEventModal from "@modules/landing/components/ShareEventModal.vue"
import DataTable from "@components/DataTable.vue"
import { VENDORS_COLUMN } from "@modules/shared/constants"
import Avatar from "@components/Avatar.vue"
import CreateEventModal from "@modules/shared/components/CreateEventModal.vue"
import { useRoute } from "vue-router"
import { useGetOrganizerEventDetails, useGetSingleEventStatistics } from "@modules/shared/api"
import { TEvent } from "@modules/shared/types"
import EmptyState from "@components/EmptyState.vue"
import { useMediaQuery } from "@vueuse/core"

const openShare = ref(false)
const openEdit = ref(false)
const activeTab = ref("overview")
const route = useRoute()

const eventId = route.params.id as string
const { data: details, isPending, refetch } = useGetOrganizerEventDetails(eventId)
const { data: stats } = useGetSingleEventStatistics(eventId)

const otherInfo = computed(() => {
  return {
    registrationCost: formatCurrency(details?.value?.participant_fee || 0),
    maximumCapacity: details?.value?.capacity || "N/A",
    description: details?.value?.description || "",
    eventInstructions: details?.value?.eventInstructions || "",
    "Terms & Conditions": details?.value?.termsAndConditions || "",
  }
})

// check whether event is ongoing, upcoming or past
const getEventStatus = (event: TEvent) => {
  const now = new Date()
  const start = new Date(event.start_date)
  const end = new Date(event.end_date)

  if (now < start) return "upcoming"
  if (now >= start && now <= end) return "ongoing"
  return "past"
}

const eventStatus = computed(() => getEventStatus(details?.value as TEvent))
const chipColor = computed(() =>
  eventStatus.value === "ongoing"
    ? "success"
    : eventStatus.value === "upcoming"
      ? "primary"
      : "alt",
)

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-GB").replace(/\//g, "-")
}

const isMobile = useMediaQuery("(max-width: 768px)")

const STATS = computed(() => {
  const { events, revenue, registrations } = stats?.value || {}
  const totalRevenue = Number(revenue?.total) || 0
  return [
    {
      title: "Total Registrations",
      value: registrations?.total || 0,
      icon: "shop",
      iconClass: "green" as const,
    },
    {
      title: "Total Revenue",
      value: totalRevenue || 0,
      icon: "shop",
      iconClass: "green" as const,
    },
    {
      title: "Avg. Revenue / Vendor",
      value: totalRevenue && events?.total ? formatCurrency(totalRevenue / (events.total || 1)) : 0,
      icon: "shop",
      iconClass: "green" as const,
    },
  ].slice(0, isMobile.value ? 2 : 3)
})

const actionMenu = computed(() => {
  return [
    { label: "Edit event", icon: "edit", action: () => (openEdit.value = true) },
    { divider: true },
    { label: "Share Event", icon: "share", action: () => (openShare.value = true) },
  ].filter((item) => isMobile.value || (!isMobile.value && item.icon === "share"))
})
</script>

<template>
  <div class="px-4 py-8 md:px-6 md:py-10">
    <EmptyState
      v-if="isPending || !details"
      title="Fetching Event Details..."
      :loading="isPending"
      description="Details of this event will appear here soon"
    />

    <section v-else class="space-y-4 md:space-y-6">
      <header class="flex flex-col items-start space-y-4 md:flex-row md:gap-4">
        <button
          type="button"
          class="text-primary-600 md:text-core-800 inline-flex items-center gap-1 text-sm"
        >
          <Icon name="arrow-left" class="!size-5 md:!size-7" @click="$router.push('/events')" />
          <span class="md:hidden">Back</span>
        </button>

        <div class="flex w-full flex-1 gap-3">
          <div class="flex-1 truncate">
            <div class="mb-3 flex items-center gap-2">
              <h3 class="truncate text-xl font-semibold">{{ details?.event_name }}</h3>
              <Chip :label="eventStatus" class="capitalize" size="sm" :color="chipColor" />
            </div>
            <div class="space-y-2">
              <p class="flex items-center gap-2 text-sm">
                <Icon name="calendar" size="20" />
                {{ formatDate(details?.start_date || "") }} -
                {{ formatDate(details?.end_date || "") }}
              </p>
              <p class="flex items-center gap-2 text-sm">
                <Icon name="location" size="20" />
                {{ details?.location }}
              </p>

              <div class="mt-1 inline-flex items-center gap-4 text-base font-semibold">
                {{ details?.participant_fee ? formatCurrency(details?.participant_fee) : "Free" }}
              </div>
            </div>
          </div>

          <AppButton
            label="Edit Event"
            icon="edit"
            class="!hidden md:!inline-flex"
            size="sm"
            @click="openEdit = true"
          />
          <div>
            <DropdownMenu :items="actionMenu">
              <template #trigger>
                <Icon name="dots-vertical" class="mt-1" />
              </template>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <Tabs v-model="activeTab" :tabs="['overview', 'vendors']" class="max-w-md">
        <template #overview>
          <div class="grid grid-cols-2 gap-2 rounded-xl bg-gray-50 p-2 md:grid-cols-3 md:gap-6">
            <SummaryCard
              v-for="stat in STATS"
              :key="stat.title"
              :title="stat.title"
              :value="stat.value"
              :icon="stat.icon"
              :icon-class="stat.iconClass"
            />
          </div>

          <div class="mt-6 rounded-2xl border border-gray-50 bg-white p-4 shadow-sm md:p-6">
            <h3 class="mb-4 text-lg font-semibold md:mb-6">Other Information</h3>

            <div class="space-y-3">
              <div
                v-for="(value, key) in otherInfo"
                :key="key"
                class="flex flex-col gap-1 text-sm md:flex-row md:gap-1"
              >
                <p class="text-core-600 font-semibold md:flex-1">{{ startCase(key) }}</p>
                <p class="font-medium md:flex-3">{{ value || "N/A" }}</p>
              </div>
            </div>
          </div>
        </template>

        <template #vendors>
          <EmptyState
            v-if="!details?.registered_merchants?.length"
            title="No attendee yet!"
            description="Once people start registering, you'll see them here. Share your event to kick things off!"
            action-label="Share Event"
            action-icon="share"
            :loading="isPending"
            @action="openShare = true"
          />

          <div v-else>
            <div class="flex items-center gap-2 py-4 md:px-4">
              <h2 class="text-lg font-semibold">Registered Vendors</h2>
              <Chip :label="details?.registered_merchants?.length?.toLocaleString()" size="sm" />
            </div>
            <DataTable
              :data="details?.registered_merchants ?? []"
              :columns="VENDORS_COLUMN"
              :loading="isPending"
            >
              <template #cell:name="{ value }">
                <Avatar :name="String(value)" :extra-text="true" />
              </template>

              <template #mobile-card="{ item }">
                <div
                  class="bg-core-25 border-core-300 flex items-start gap-3 rounded-2xl border px-4 py-5"
                >
                  <Avatar
                    :name="item.name"
                    background-color="#edd5d8"
                    text-color="var(--color-core-600)"
                  />
                  <div class="text-core-600 flex-1">
                    <h3 class="text-core-700 mb-1.5 text-base font-semibold capitalize">
                      {{ item.name }}
                    </h3>
                    <p class="mb-1 flex items-center gap-2">
                      <Icon name="sms" size="14" /> {{ item.email }}
                    </p>
                    <p class="flex items-center gap-2">
                      <Icon name="call" size="14" /> {{ item.phone }}
                    </p>
                  </div>
                </div>
              </template>
            </DataTable>
          </div>
        </template>
      </Tabs>
    </section>

    <!-- Modals -->
    <ShareEventModal :open="openShare" @close="openShare = false" />
    <CreateEventModal
      :open="openEdit"
      @close="openEdit = false"
      :is-edit-mode="true"
      :event="details"
      @refresh="refetch"
    />
  </div>
</template>
