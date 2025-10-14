<script setup lang="ts">
import AppSection from "@components/AppSection.vue"
import { useGetOrganizerEventsPublic } from "@modules/shared/api"
import { computed, ref } from "vue"
import EventCard from "../components/EventCard.vue"
import { TEvent } from "@modules/shared/types"
import Tabs from "@components/Tabs.vue"
import BackButton from "@components/BackButton.vue"
import EmptyState from "@components/EmptyState.vue"
import { useRouter } from "vue-router"

const tabs = [
  { title: "Ongoing", key: "ongoing" },
  { title: "Upcoming", key: "upcoming" },
]

const { data: orgEvents, isPending } = useGetOrganizerEventsPublic()
// events that are upcoming or ongoing
const filteredEvents = computed(() => {
  if (!orgEvents.value) return []

  if (activeTab.value === "ongoing") {
    return (
      orgEvents.value?.filter(
        (evt) => new Date(evt.start_date) <= new Date() && new Date(evt.end_date) >= new Date(),
      ) || []
    )
  }

  if (activeTab.value === "upcoming") {
    return orgEvents.value?.filter((evt) => new Date(evt.start_date) > new Date()) || []
  }

  return orgEvents.value
})

const activeTab = ref("ongoing")
const router = useRouter()

const openEvent = (event: TEvent) => {
  router.push(`/upcoming-events/${event.id}`)
}
</script>

<template>
  <AppSection class="pt-4 pb-12">
    <BackButton label="Go Back" class="mb-4" />
    <div class="mb-8 flex flex-col md:mb-12">
      <h2 class="mb-2 text-2xl font-semibold md:text-4xl">Upcoming Pop-Up Events</h2>
      <p class="text-lg md:text-xl">Discover events near you and book a booth today.</p>
    </div>

    <EmptyState
      v-if="!filteredEvents.length"
      icon="calendar"
      title="No Events Found"
      :loading="isPending"
      description="There are no events available at the moment. Please check back later."
    />

    <template v-else>
      <Tabs v-model="activeTab" :tabs="tabs" class="max-w-md" />

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <EventCard
          v-for="evt in filteredEvents"
          :key="evt.id"
          :event="evt"
          @click="openEvent(evt)"
        />
      </div>
    </template>
  </AppSection>
</template>
