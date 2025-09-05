<script setup lang="ts">
import { getFullName, TNameObj } from "@/utils/format-strings"
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

const { user } = useAuthStore()
const { data: recentEvents, isPending, refetch } = useGetOrganizerEvents({ limit: 5 })
const { data: evtStats } = useGetOrganizerEventStats()

const openCreate = ref(false)

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
</script>

<template>
  <div
    v-if="!recentEvents?.results?.length && !isPending"
    class="bg-primary-50 text-primary-600 flex items-center gap-3 px-4 py-3"
  >
    <span
      class="border-primary-200 ring-primary-300 flex size-6 items-center justify-center rounded-full border-2 ring-2 ring-offset-2"
    >
      <Icon name="info-circle" size="20" />
    </span>
    <div class="flex-1 text-sm">
      <span class="mr-1 font-medium">You haven't created an event yet! </span> Create your first
      event in just a few steps and start inviting attendees today.
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

  <section class="space-y-8 p-4 md:p-8">
    <SectionHeader
      :title="`Good Afternoon, ${getFullName(user as TNameObj)} 👋`"
      subtitle="Here's what's happening in your events this week:"
    />

    <div class="grid grid-cols-2 gap-2 md:gap-6 lg:grid-cols-4">
      <SummaryCard
        v-for="stat in STATS"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :icon="stat.icon"
        :icon-class="stat.iconClass"
      />
    </div>

    <div class="border-core-100 space-y-6 rounded-xl border bg-white">
      <div class="bg-white">
        <DataTable
          title="Recent Events"
          :data="recentEvents?.results ?? []"
          :columns="EVENT_COLUMN"
          :loading="isPending"
          :empty-state="{
            icon: 'box',
            title: 'No recent events',
            description:
              'You have not created any events recently. Create an event to see it listed here.',
            actionLabel: 'Create Event',
            actionIcon: 'add',
          }"
          hide-total
          @empty-action="openCreate = true"
        >
          <template #action>
            <AppButton label="Create Event" icon="add" @click="openCreate = true" />
          </template>

          <!-- Cells -->
          <template #cell:action>
            <div class="flex gap-2">
              <Icon name="eye" size="16" class="text-core-500 hover:text-core-700 cursor-pointer" />
            </div>
          </template>
        </DataTable>
      </div>
    </div>

    <!-- Create Event Modal -->
    <CreateEventModal v-model:open="openCreate" @close="openCreate = false" @refresh="refetch" />
  </section>
</template>
