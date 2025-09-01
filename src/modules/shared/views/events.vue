<template>
  <section class="px-8 py-6">
    <SectionHeader
      :title="`My Events`"
      subtitle="Stay updated with the latest happenings in your events."
      class="mb-6 md:mb-10"
      size="md"
    />

    <Tabs
      v-model="status"
      :tabs="[
        { title: 'All', key: 'all' },
        { title: 'Upcoming', key: 'upcoming' },
        { title: 'Ongoing', key: 'ongoing' },
        { title: 'Past', key: 'past' },
      ]"
    />

    <div class="border-core-100 space-y-6 rounded-xl border bg-white">
      <div class="bg-white">
        <DataTable
          title="Recent Events"
          :data="EVENTS"
          :columns="EVENT_COLUMN"
          :loading="isFetching"
        >
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

    <div>{{ events }}</div>
  </section>
</template>

<script setup lang="ts">
import DataTable from "@components/DataTable.vue"
import SectionHeader from "@components/SectionHeader.vue"
import AppButton from "@components/AppButton.vue"
import { EVENT_COLUMN, EVENTS } from "../constants"
import Tabs from "@components/Tabs.vue"
import { computed, ref } from "vue"
import { useGetOrganizerEvents } from "../api"
import Icon from "@components/Icon.vue"

const status = ref("all")

const params = computed(() => {
  if (status.value === "all") return undefined
  return { status: status.value }
})
const { data: events, isFetching } = useGetOrganizerEvents(params)
</script>
