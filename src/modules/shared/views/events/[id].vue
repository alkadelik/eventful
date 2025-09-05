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
import { clipboardCopy } from "@/utils/others"
import { TEvent } from "@modules/shared/types"

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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-GB").replace(/\//g, "-")
}

const eventUrl = computed(() => `www.leyyow.com/popup/${details?.value?.event_slug || ""}`)

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
      title: "Avg. Revenue / Event",
      value: totalRevenue && events?.total ? formatCurrency(totalRevenue / (events.total || 1)) : 0,
      icon: "shop",
      iconClass: "green" as const,
    },
  ]
})
</script>

<template>
  <div class="p-4 md:p-6">
    <div v-if="isPending" class="flex min-h-[50vh] items-center justify-center">
      <Icon name="loader" size="80" class="text-primary-500 animate-spin" />
    </div>

    <section v-else class="space-y-4 md:space-y-6">
      <header class="space-y-4">
        <!-- Mobile: Stack vertically -->
        <div class="flex items-center gap-4 md:hidden">
          <button type="button">
            <Icon name="arrow-left" size="24" @click="$router.back()" />
          </button>
          <h3 class="flex-1 truncate text-lg font-semibold">{{ details?.event_name }}</h3>
          <DropdownMenu
            :items="[
              { label: 'Edit Event', icon: 'edit', action: () => (openEdit = true) },
              { label: 'Share Event', icon: 'box', action: () => (openShare = true) },
              { divider: true },
              {
                label: 'Delete Event',
                icon: 'copy',
                class: 'text-red-600 hover:bg-red-50',
                iconClass: 'text-red-600',
                action: () => {},
              },
            ]"
          >
            <template #trigger>
              <Icon name="dots-vertical" size="20" />
            </template>
          </DropdownMenu>
        </div>

        <!-- Desktop: Original layout -->
        <div class="hidden items-start gap-4 md:flex">
          <button type="button">
            <Icon name="arrow-left" size="28" @click="$router.back()" />
          </button>
          <div class="flex-1">
            <div class="mb-2 flex items-center gap-6">
              <h3 class="truncate text-xl font-semibold">{{ details?.event_name }}</h3>
              <Chip
                :label="eventStatus"
                class="capitalize"
                size="sm"
                :color="
                  eventStatus === 'ongoing'
                    ? 'success'
                    : eventStatus === 'upcoming'
                      ? 'primary'
                      : 'alt'
                "
              />
            </div>
            <div class="space-y-1.5">
              <p class="flex items-center gap-2 text-sm">
                <Icon name="calendar-tick" size="20" />
                {{ formatDate(details?.start_date || "") }} -
                {{ formatDate(details?.end_date || "") }}
              </p>
              <p class="flex items-center gap-2 text-sm">
                <Icon name="star" size="20" />
                {{ details?.location }}
              </p>

              <div class="mt-2 inline-flex items-center gap-4 text-sm">
                <p>{{ eventUrl }}</p>
                <Icon
                  name="copy"
                  size="16"
                  class="text-primary-600 cursor-pointer"
                  @click="clipboardCopy(eventUrl)"
                />
              </div>
            </div>
          </div>

          <AppButton label="Edit Event" icon="edit" size="sm" @click="openEdit = true" />
          <DropdownMenu
            :items="[
              { label: 'Share Event', icon: 'box', action: () => (openShare = true) },
              { divider: true },
              {
                label: 'Delete Event',
                icon: 'copy',
                class: 'text-red-600 hover:bg-red-50',
                iconClass: 'text-red-600',
                action: () => {},
              },
            ]"
          >
            <template #trigger>
              <Icon name="dots-vertical" class="mt-2" />
            </template>
          </DropdownMenu>
        </div>

        <!-- Mobile: Event details -->
        <div class="space-y-3 md:hidden">
          <div class="flex items-center justify-between">
            <Chip
              :label="eventStatus"
              class="capitalize"
              size="sm"
              :color="
                eventStatus === 'ongoing'
                  ? 'success'
                  : eventStatus === 'upcoming'
                    ? 'primary'
                    : 'alt'
              "
            />
          </div>

          <div class="space-y-2">
            <p class="flex items-center gap-2 text-sm">
              <Icon name="calendar-tick" size="18" />
              {{ formatDate(details?.start_date || "") }} -
              {{ formatDate(details?.end_date || "") }}
            </p>
            <p class="flex items-center gap-2 text-sm">
              <Icon name="star" size="18" />
              {{ details?.location }}
            </p>

            <div class="flex items-center gap-2 text-sm">
              <p class="flex-1 truncate">{{ eventUrl }}</p>
              <Icon
                name="copy"
                size="16"
                class="text-primary-600 flex-shrink-0 cursor-pointer"
                @click="clipboardCopy(eventUrl)"
              />
            </div>
          </div>
        </div>
      </header>

      <Tabs v-model="activeTab" :tabs="['overview', 'vendors']">
        <template #overview>
          <div class="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:grid-cols-3">
            <SummaryCard
              v-for="stat in STATS"
              :key="stat.title"
              :title="stat.title"
              :value="stat.value"
              :icon="stat.icon"
              :icon-class="stat.iconClass"
            />
          </div>

          <div class="rounded-2xl bg-white p-4 md:p-6">
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
          <div class="overflow-x-auto">
            <DataTable
              title="Registered Vendors"
              :data="details?.registered_merchants ?? []"
              :columns="VENDORS_COLUMN"
              :loading="false"
              :empty-state="{
                icon: 'box',
                title: `No attendee yet!`,
                description: `Once people start registering, you'll see them here. Share your event to kick things off!`,
                actionLabel: 'Share Event',
                actionIcon: 'add',
              }"
              hide-total
              @empty-action="openShare = true"
            >
              <template #cell:name="{ value }">
                <Avatar :name="String(value)" :extra-text="true" />
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
