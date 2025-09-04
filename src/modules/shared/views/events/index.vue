<template>
  <section class="px-8 py-6">
    <SectionHeader
      :title="`My Events`"
      subtitle="Stay updated with the latest happenings in your events."
      class="mb-6 md:mb-10"
      size="md"
    />

    <Tabs
      v-if="myEvents?.results?.length"
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
          :data="myEvents?.results ?? []"
          :columns="EVENT_COLUMN"
          :loading="isPending"
          @row-click="(item) => $router.push(`/events/${item.id}`)"
          :empty-state="{
            icon: 'box',
            title: `You don't have any event yet`,
            description: `Once you create an event, you'll see all your attendee stats, ticket sales, and engagement updates right here.`,
            actionLabel: 'Create Event',
            actionIcon: 'add',
          }"
          hide-total
          @empty-action="openCreate = true"
        >
          <template #cell:action>
            <div class="flex gap-2">
              <Icon name="eye" size="16" class="text-core-500 hover:text-core-700 cursor-pointer" />
            </div>
          </template>

          <template #action>
            <AppButton label="Create Event" icon="add" @click="openCreate = true" />
          </template>
        </DataTable>
      </div>
    </div>

    <!-- Create Event Modal -->
    <CreateEventModal v-model:open="openCreate" @close="openCreate = false" />
  </section>
</template>

<script setup lang="ts">
import DataTable from "@components/DataTable.vue"
import SectionHeader from "@components/SectionHeader.vue"
import AppButton from "@components/AppButton.vue"
import { EVENT_COLUMN } from "../../constants"
import Tabs from "@components/Tabs.vue"
import { computed, ref } from "vue"
import Icon from "@components/Icon.vue"
import CreateEventModal from "@modules/shared/components/CreateEventModal.vue"
import { useGetOrganizerEvents } from "@modules/shared/api"

const openCreate = ref(false)
const status = ref("all")

const limit = ref(10)
const page = ref(1)
const pagination = computed(() => ({
  limit: limit.value,
  offset: page.value * limit.value - limit.value,
  ...(status.value !== "all" ? { status: status.value } : {}),
}))
const { data: myEvents, isPending } = useGetOrganizerEvents(pagination)
</script>
