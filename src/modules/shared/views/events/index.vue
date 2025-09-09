<script setup lang="ts">
import DataTable from "@components/DataTable.vue"
import SectionHeader from "@components/SectionHeader.vue"
import AppButton from "@components/AppButton.vue"
import { EVENT_COLUMN } from "../../constants"
import Tabs from "@components/Tabs.vue"
import { computed, onMounted, ref } from "vue"
import Icon from "@components/Icon.vue"
import CreateEventModal from "@modules/shared/components/CreateEventModal.vue"
import { useGetOrganizerEvents } from "@modules/shared/api"
import { useRoute } from "vue-router"
import EmptyState from "@components/EmptyState.vue"
import ShareEventModal from "@modules/landing/components/ShareEventModal.vue"
import TableEventCard from "@modules/shared/components/TableEventCard.vue"
import DropdownMenu from "@components/DropdownMenu.vue"

const openCreate = ref(false)
const openShare = ref(false)
const status = ref("all")

const route = useRoute()

const limit = ref(10)
const page = ref(1)
const pagination = computed(() => ({
  limit: limit.value,
  offset: page.value * limit.value - limit.value,
  ...(status.value !== "all" ? { status: status.value } : {}),
}))
const { data: myEvents, isPending, refetch } = useGetOrganizerEvents(pagination)

// trigger create-event modal open if route.query.open
onMounted(() => {
  if (route.query.open === "create") openCreate.value = true
})

const isEmpty = computed(() => !myEvents?.value?.results?.length)
</script>

<template>
  <section class="p-4 md:px-8 md:py-6">
    <SectionHeader
      :title="`My Events`"
      subtitle="Stay updated with the latest happenings in your events."
      class="mb-6 md:mb-10"
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
      <Tabs
        v-if="myEvents?.results?.length"
        v-model="status"
        :tabs="[
          { title: 'All', key: 'all' },
          { title: 'Upcoming', key: 'upcoming' },
        ]"
        class="max-w-md"
      />

      <div class="border-core-100 md:rounded-3xl md:border md:bg-white md:shadow-xs">
        <div class="flex items-center justify-between gap-2 px-0 py-4 md:p-6">
          <h2 class="text-lg font-semibold">All Events</h2>
          <AppButton label="Create Event" icon="add" @click="openCreate = true" />
        </div>
        <DataTable
          :data="myEvents?.results ?? []"
          :columns="EVENT_COLUMN"
          :loading="isPending"
          :show-pagination="true"
        >
          <!-- @row-click="(item) => $router.push(`/events/${item.id}`)" -->
          <template #cell:action="{ item }">
            <div class="inline-flex gap-3">
              <Icon name="eye" @click.stop="() => $router.push(`/events/${item.id}`)" />

              <DropdownMenu
                :items="[
                  {
                    label: 'View Event',
                    icon: 'eye',
                    action: () => $router.push(`/events/${item.id}`),
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
            <TableEventCard :event="item" @share="openShare = true" />
          </template>
        </DataTable>
      </div>
    </template>

    <!-- Create Event Modal -->
    <CreateEventModal v-model:open="openCreate" @close="openCreate = false" @refresh="refetch" />

    <ShareEventModal v-model:open="openShare" @close="openShare = false" />
  </section>
</template>
