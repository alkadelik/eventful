<script setup lang="ts">
import AppButton from "@components/AppButton.vue"
import AppSection from "@components/AppSection.vue"
import Avatar from "@components/Avatar.vue"
import Icon from "@components/Icon.vue"
import EventCard from "../components/EventCard.vue"
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useGetOrganizerEventsPublic } from "@modules/shared/api"

const router = useRouter()

const openCreateEvent = () => {
  router.push("/events?open=create")
}

const { data: orgEvents } = useGetOrganizerEventsPublic()

// events that are upcoming or ongoing
const filteredEvents = computed(() => {
  return (
    orgEvents.value?.filter(
      (evt) => new Date(evt.start_date) >= new Date() || new Date(evt.end_date) >= new Date(),
    ) || []
  )
})
</script>

<template>
  <div>
    <AppSection class="py-12 md:py-20">
      <div class="flex flex-col items-center gap-8 md:flex-row">
        <div class="w-full md:w-1/2">
          <h2 class="text-3xl leading-[1.35] font-bold md:text-5xl">
            Plan Everything <br />About Your Next <br />
            Pop-up
          </h2>
          <p class="mt-4 text-base md:mt-6 md:text-lg">
            Quickly get started to create and manage your events.
          </p>
          <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4 md:mt-6">
            <AppButton
              label="Create Event"
              size="lg"
              class="w-full sm:w-auto"
              @click="openCreateEvent"
            />
            <AppButton
              label="Browse Events"
              variant="outlined"
              size="lg"
              class="w-full sm:w-auto"
              @click="router.push('/upcoming-events')"
            />
          </div>
        </div>

        <div class="w-full md:w-1/2">
          <img src="/images/hero.png" alt="Event" class="rounded-xl" />
        </div>
      </div>
    </AppSection>

    <AppSection background="bg-white" class="py-12 md:py-20">
      <div class="mb-8 flex flex-col text-center md:mb-12">
        <h2 class="mb-2 text-2xl font-semibold md:text-4xl">Your Journey Starts Here 🚀</h2>
        <p class="text-lg md:text-xl">
          Are you here to sell or to host? Let's get you set up in seconds.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        <div
          v-for="v in ['organizers', 'vendors']"
          :key="v"
          class="divide-y rounded-2xl border"
          :class="[
            { 'bg-primary-50 border-primary-600 divide-primary-600': v === 'organizers' },
            { 'divide-gray-200 border-gray-200 bg-white': v === 'vendors' },
          ]"
        >
          <div class="px-6 py-4 md:px-10 md:py-6">
            <span class="text-lg font-semibold capitalize md:text-xl">For {{ v }}</span>
          </div>
          <div class="px-6 py-4 md:px-10 md:py-6">
            <h3 class="text-xl font-semibold md:text-3xl">
              {{
                v === "organizers"
                  ? "Plan, organize and track payments in your next event"
                  : "Discover and register for upcoming events."
              }}
            </h3>
            <p class="mt-2 text-sm md:text-base">
              Quickly get started to create and manage your events.
            </p>
            <img
              :src="v === 'organizers' ? '/images/event.png' : '/images/booth.png'"
              :alt="v"
              class="mt-4 h-40 w-full rounded-lg bg-gray-100 md:mt-6 md:h-60"
            />
          </div>
          <div class="px-6 py-4 md:px-10 md:py-6">
            <p class="mb-3 text-lg font-semibold md:text-xl">Get The Best of Leyyow Events</p>
            <div class="space-y-1.5">
              <p
                v-for="x in [
                  'Plan events',
                  'Send event links to vendors',
                  'Track registrations and payments',
                ]"
                :key="x"
                class="flex items-center gap-2 text-sm"
              >
                <Icon name="check-circle" size="20" class="text-primary-600" />
                {{ x }}
              </p>
            </div>
          </div>
          <div class="px-6 py-4 md:px-10 md:py-6">
            <AppButton
              :label="v === 'organizers' ? 'Create Event' : 'Browse Events'"
              size="lg"
              :variant="v === 'organizers' ? 'filled' : 'outlined'"
              class="w-full"
              @click="v === 'organizers' ? openCreateEvent() : router.push('/upcoming-events')"
            />
          </div>
        </div>
      </div>
    </AppSection>

    <AppSection class="py-12 md:py-20">
      <div class="mb-8 flex flex-col md:mb-12">
        <h2 class="mb-2 text-2xl font-semibold md:text-4xl">Upcoming Pop-Up Events</h2>
        <p class="text-lg md:text-xl">Discover events near you and book a booth today.</p>
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <EventCard
          v-for="evt in filteredEvents.slice(0, 6)"
          :key="evt.id"
          :event="evt"
          @click="
            () => {
              $router.push(`/upcoming-events/${evt.id}`)
            }
          "
        />
      </div>
    </AppSection>

    <AppSection background="bg-white" class="py-12 md:py-20">
      <div class="mb-8 flex flex-col text-center md:mb-12">
        <h2 class="mb-2 text-2xl font-semibold md:text-4xl">What Our Organizers and Vendors Say</h2>
        <p class="text-lg md:text-xl">Real stories from successful events and happy merchants.</p>
      </div>

      <div class="flex flex-col gap-6 lg:flex-row">
        <div class="bg-primary-600 flex w-full flex-col rounded-2xl p-6 text-white lg:w-80">
          <Icon name="quote-up" class="!size-16 md:!size-[120px]" />
          <h3 class="mt-3 mb-6 text-xl font-semibold md:text-3xl">
            Trusted by Event <br />
            Professionals
          </h3>
          <div class="mt-auto flex items-center justify-between gap-4">
            <Icon name="arrow-left" size="20" />
            <div class="h-1.5 w-full rounded-full bg-gray-200">
              <div class="bg-primary-300 h-1.5 rounded-full" style="width: 45%"></div>
            </div>
            <Icon name="arrow-right" size="20" />
          </div>
        </div>

        <div class="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
          <div class="inline-flex gap-2">
            <Icon
              v-for="v in 5"
              :key="v"
              size="20"
              name="star-filled"
              :class="[v <= 4 ? 'text-primary-400' : 'text-gray-300', 'md:size-6']"
            />
          </div>
          <p class="mt-4 mb-6 text-base md:mb-10 md:text-xl">
            "Leyyow made organizing our pop-up event a breeze. The platform's intuitive interface
            and seamless vendor management tools saved us countless hours. Our vendors were thrilled
            with the exposure they received, and attendees loved the variety of offerings. Leyyow
            truly connects organizers and merchants in a way that benefits everyone involved."
          </p>
          <Avatar
            url="https://randomuser.me/api/portraits/women/2.jpg"
            name="Tolu A."
            size="lg"
            extra-text="Marketing Lead at a Lagos Fintech Startup"
            class="mt-auto"
          />
        </div>
      </div>
    </AppSection>

    <AppSection background="bg-white" class="py-12 text-white md:py-20">
      <div
        class="rounded-3xl bg-[linear-gradient(to_bottom_right,_#443685,_#670047,_#dd9790,_#ffb263)] px-8 py-12 md:px-14 md:py-16"
      >
        <h2 class="mb-4 text-3xl font-semibold md:text-5xl">Ready to host or join an event?</h2>
        <p class="text-lg md:text-2xl">Create your pop-up or book a booth in minutes.</p>
        <div class="mt-6 flex flex-col justify-end gap-3 sm:flex-row sm:gap-4 md:mt-8">
          <AppButton
            label="Create Event"
            size="lg"
            class="w-full sm:w-auto"
            @click="openCreateEvent"
          />
          <AppButton
            label="Browse Events"
            color="alt"
            size="lg"
            class="w-full sm:w-auto"
            @click="router.push('/upcoming-events')"
          />
        </div>
      </div>
    </AppSection>
  </div>
</template>
