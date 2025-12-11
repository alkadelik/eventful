<script setup lang="ts">
import DataTable from "@components/DataTable.vue"
import SectionHeader from "@components/SectionHeader.vue"
import { useAuthStore } from "@modules/auth/store"
import { EVENT_COLUMN } from "../constants"
import AppButton from "@components/AppButton.vue"
import { computed, ref } from "vue"
import { useGetOrganizerEvents, useGetOrganizerEventStats } from "../api"
import Icon from "@components/Icon.vue"
import SummaryCard from "@components/SummaryCard.vue"
import CreateEventModal from "../components/CreateEventModal.vue"
import { formatCurrency } from "@/utils/format-currency"
import EmptyState from "@components/EmptyState.vue"
import DropdownMenu from "@components/DropdownMenu.vue"
import TableEventCard from "../components/TableEventCard.vue"
import { TEvent } from "../types"
import ShareEventModal from "@modules/landing/components/ShareEventModal.vue"

const { user } = useAuthStore()
const { data: recentEvents, isPending, refetch } = useGetOrganizerEvents({ limit: 5 })
const { data: evtStats, refetch: refetchStats } = useGetOrganizerEventStats()

const openCreate = ref(false)
const openShare = ref(false)
const selectedEvent = ref<TEvent>()

const STATS = computed(() => {
  const { events, revenue, registrations } = evtStats?.value || {}

  const totalRevenue = Number(revenue?.total) || 0
  return [
    {
      title: "Total Events",
      value: events?.total || 0,
      icon: "shop",
      iconClass: "green" as const,
    },
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

const greeting = computed(() => {
  const thisHour = new Date().getHours()
  if (thisHour > 17) return "Good Evening"
  if (thisHour < 12) return "Good Morning"
  return "Good Afternoon"
})

const isEmpty = computed(() => !recentEvents.value?.results?.length)
</script>

<template>
  <div
    v-if="isEmpty && !isPending"
    class="bg-primary-25 text-warning-700 border-warning-300 flex flex-col items-start gap-3 border-b px-6 py-3 md:flex-row md:items-center"
  >
    <span
      class="border-primary-200 ring-primary-100 hidden size-8 items-center justify-center rounded-full border-2 p-0.5 ring-2 ring-offset-2 md:flex"
    >
      <Icon name="alert-circle" size="20" />
    </span>
    <div class="flex flex-1 flex-col gap-1 text-sm md:flex-row">
      <span class="font-medium">You haven't created an event yet! </span> Create your first event in
      just a few steps and start inviting attendees today.
    </div>
    <AppButton
      variant="text"
      label="Create Event"
      icon="arrow-right"
      size="sm"
      class="flex-row-reverse underline underline-offset-4"
      @click="openCreate = true"
    />
  </div>

  <section class="space-y-8 p-4 md:px-6 md:py-10">
    <SectionHeader
      :title="`${greeting}, ${user?.first_name} 👋`"
      subtitle="Here's what's happening in your events this week:"
      size="md"
    />

    <EmptyState
      v-if="isEmpty"
      title="You don't have any events yet"
      description="Once you create an event, you’ll see all your attendee stats, ticket sales, and engagement updates right here."
      action-label="Create Event"
      action-icon="add"
      :loading="isPending"
      @action="openCreate = true"
    />

    <template v-else>
      <div class="grid grid-cols-2 gap-2 rounded-xl bg-gray-50 p-2 md:gap-6 lg:grid-cols-4">
        <SummaryCard
          v-for="stat in STATS"
          :key="stat.title"
          :title="stat.title"
          :value="stat.value"
          :icon="stat.icon"
          :icon-class="stat.iconClass"
        />
      </div>

      <div class="border-core-100 md:rounded-3xl md:border md:bg-white md:shadow-xs">
        <div class="flex items-center justify-between gap-2 px-0 py-4 md:p-6">
          <h2 class="text-lg font-semibold">Recent Events List</h2>
          <AppButton label="Create Event" icon="add" @click="openCreate = true" />
        </div>
        <DataTable
          :data="recentEvents?.results ?? []"
          :columns="EVENT_COLUMN"
          :loading="isPending"
          :show-pagination="false"
          @row-click="(item) => $router.push(`/events/${item.id || item.uid}`)"
        >
          <template #cell:action="{ item }">
            <div class="inline-flex gap-3">
              <Icon name="eye" @click.stop="() => $router.push(`/events/${item.id || item.uid}`)" />

              <DropdownMenu
                @toggle="selectedEvent = item"
                :items="[
                  {
                    label: 'View Event',
                    icon: 'eye',
                    action: () => $router.push(`/events/${item.id || item.uid}`),
                  },
                  { divider: true },
                  { label: 'Share Event', icon: 'share', action: () => (openShare = true) },
                ]"
              >
                <template #trigger>
                  <Icon name="dots-vertical" size="20" />
                </template>
              </DropdownMenu>
            </div>
          </template>

          <template #mobile-card="{ item }">
            <TableEventCard
              :event="item"
              @view="() => $router.push(`/events/${item.id || item.uid}`)"
              @click="() => $router.push(`/events/${item.id || item.uid}`)"
              @share="
                () => {
                  selectedEvent = item
                  openShare = true
                }
              "
            />
          </template>
        </DataTable>

        <div class="border-core-100 flex justify-end p-4 md:border-t md:p-6">
          <AppButton color="alt" label="View All" @click="() => $router.push('/events')" />
        </div>
      </div>
    </template>

    <!-- Create Event Modal -->
    <CreateEventModal
      v-model:open="openCreate"
      @close="openCreate = false"
      @refresh="
        () => {
          refetch()
          refetchStats()
        }
      "
    />

    <ShareEventModal :open="openShare" @close="openShare = false" :event="selectedEvent" />
  </section>
</template>
