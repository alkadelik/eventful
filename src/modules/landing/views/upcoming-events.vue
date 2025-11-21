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
  { title: "Ongoing", key: "active" },
  { title: "Upcoming", key: "upcoming" },
]

const activeTab = ref("active")
const activeTabTitle = computed(() => {
  return tabs.find((t) => t.key === activeTab.value)?.title || ""
})
const params = computed(() => ({ status: activeTab.value, limit: 20 }))
const { data: orgEvents, isPending } = useGetOrganizerEventsPublic(params)

const router = useRouter()

const openEvent = (event: TEvent) => {
  router.push(`/upcoming-events/${event.uid}`)
}
</script>

<template>
  <AppSection class="pt-4 pb-12">
    <BackButton label="Go Back" class="mb-4" />
    <div class="mb-8 flex flex-col md:mb-12">
      <h2 class="mb-2 text-2xl font-semibold md:text-4xl">Upcoming Pop-Up Events</h2>
      <p class="text-lg md:text-xl">Discover events near you and book a booth today.</p>
    </div>

    <Tabs v-model="activeTab" :tabs="tabs" class="max-w-md" />

    <EmptyState
      v-if="!orgEvents?.results.length"
      icon="calendar"
      :title="`No ${activeTabTitle} Events Found`"
      :loading="isPending"
      :description="`There are current no ${activeTabTitle} events available at the moment. Please check back later.`"
    />

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      <EventCard
        v-for="evt in orgEvents.results"
        :key="evt.id"
        :event="evt"
        @click="openEvent(evt)"
      />
    </div>
  </AppSection>
</template>
