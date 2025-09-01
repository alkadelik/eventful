<template>
  <div class="bg-primary-50 text-primary-600 flex items-center gap-3 px-4 py-3">
    <div class="flex-1 text-sm">
      <span class="mr-1 font-medium">You haven't created an event yet! </span> Create your first
      event in just a few steps and start inviting attendees today.
    </div>
    <AppButton
      variant="text"
      label="Create Event"
      icon="arrow-right"
      class="flex-row-reverse underline underline-offset-4"
    />
  </div>

  <section class="space-y-8 p-8">
    <SectionHeader
      :title="`Good Afternoon, ${getFullName(user as TNameObj)} 👋`"
      subtitle="Here's what's happening in your events this week:"
    />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
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
        <DataTable title="Recent Events" :data="EVENTS" :columns="EVENT_COLUMN" :loading="false">
          <template #cell:action>
            <div class="flex gap-2">
              <Icon name="eye" size="16" class="text-core-500 hover:text-core-700 cursor-pointer" />
            </div>
          </template>

          <template #action>
            <AppButton label="Create Event" icon="add" />
          </template>
        </DataTable>
      </div>
    </div>

    <div>
      {{ events }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { getFullName, TNameObj } from "@/utils/format-strings"
import DataTable from "@components/DataTable.vue"
import SectionHeader from "@components/SectionHeader.vue"
import { useAuthStore } from "@modules/auth/store"
import { EVENT_COLUMN, EVENTS } from "../constants"
import AppButton from "@components/AppButton.vue"
import { computed } from "vue"
import SummaryCard from "../components/SummaryCard.vue"
import { useGetOrganizerEvents } from "../api"
import Icon from "@components/Icon.vue"

const { user } = useAuthStore()
const { data: events } = useGetOrganizerEvents()

const STATS = computed(() => [
  {
    title: "Total Events",
    value: EVENTS.length,
    icon: "shop-add",
    iconClass: "blue" as const,
  },
  {
    title: "Upcoming Events",
    value: EVENTS.filter((event) => event.start > new Date()).length,
    icon: "shop",
    iconClass: "green" as const,
  },
  {
    title: "Past Events",
    value: EVENTS.filter((event) => event.end < new Date()).length,
    icon: "calendar-tick",
    iconClass: "red" as const,
  },
  {
    title: "Ongoing Events",
    value: EVENTS.filter((event) => event.start <= new Date() && event.end >= new Date()).length,
    icon: "calendar-tick",
    iconClass: "yellow" as const,
  },
])
</script>
