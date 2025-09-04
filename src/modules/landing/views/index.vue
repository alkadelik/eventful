<script setup lang="ts">
import AppButton from "@components/AppButton.vue"
import AppSection from "@components/AppSection.vue"
import Avatar from "@components/Avatar.vue"
import Icon from "@components/Icon.vue"
import EventCard from "../components/EventCard.vue"
import EventDetailsDrawer from "../components/EventDetailsDrawer.vue"
import { ref } from "vue"

const openDetails = ref(false)
</script>

<template>
  <div>
    <AppSection class="py-20">
      <div class="flex items-center gap-8">
        <div class="w-1/2">
          <h2 class="text-5xl font-semibold">
            Plan Everything <br />About Your Next <br />
            Pop-up
          </h2>
          <p class="mt-6 text-lg">Quickly get started to create and manage your events.</p>
          <div class="mt-6 flex gap-4">
            <AppButton label="Create Event" size="lg" />
            <AppButton label="Browse Events" variant="outlined" size="lg" />
          </div>
        </div>

        <div class="w-1/2">
          <img src="https://placehold.co/500x500" alt="Event" class="rounded-xl" />
        </div>
      </div>
    </AppSection>

    <AppSection background="bg-white" class="py-20">
      <div class="mb-12 flex flex-col text-center">
        <h2 class="mb-2 text-4xl font-semibold">Your Journey Starts Here 🚀</h2>
        <p class="text-xl">Are you here to sell or to host? Let's get you set up in seconds.</p>
      </div>

      <div class="grid grid-cols-2 gap-12">
        <div
          v-for="v in ['organizers', 'vendors']"
          :key="v"
          class="divide-y rounded-2xl border"
          :class="[
            { 'bg-primary-50 border-primary-600 divide-primary-600': v === 'organizers' },
            { 'divide-gray-200 border-gray-200 bg-white': v === 'vendors' },
          ]"
        >
          <div class="px-10 py-6">
            <span class="text-xl font-semibold capitalize">For {{ v }}</span>
          </div>
          <div class="px-10 py-6">
            <h3 class="text-3xl font-semibold">
              {{
                v === "organizers"
                  ? "Plan, organize and track payments in your next event"
                  : "Discover and register for upcoming events."
              }}
            </h3>
            <p class="mt-2 text-base">Quickly get started to create and manage your events.</p>
            <img src="" :alt="v" class="mt-6 h-60 w-full rounded-lg bg-gray-100" />
          </div>
          <div class="px-10 py-6">
            <div class="mb-4 flex justify-between">
              <p class="text-xl font-semibold">
                {{ v === "organizers" ? "From Other Organizers" : "Ongoing Events" }}
              </p>
              <span class="flex gap-2">
                <Icon
                  name="arrow-right"
                  size="24"
                  class="rotate-180 cursor-pointer rounded-full border border-gray-200 bg-white p-1"
                />
                <Icon
                  name="arrow-right"
                  size="24"
                  class="cursor-pointer rounded-full border border-gray-200 bg-white p-1"
                />
              </span>
            </div>
            <EventCard :class="v === 'vendors' ? '!bg-gray-50' : ''" @click="openDetails = true" />
          </div>
          <div class="px-10 py-6">
            <p class="mb-3 text-xl font-semibold">Get The Best of Leyyow Events</p>
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
          <div class="px-10 py-6">
            <AppButton
              :label="v === 'organizers' ? 'Create Event' : 'Browse Events'"
              size="lg"
              :variant="v === 'organizers' ? 'filled' : 'outlined'"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </AppSection>

    <AppSection class="py-20">
      <div class="mb-12 flex flex-col">
        <h2 class="mb-2 text-4xl font-semibold">Upcoming Pop-Up Events</h2>
        <p class="text-xl">Discover events near you and book a booth today.</p>
      </div>
      <div class="grid grid-cols-3 gap-6">
        <EventCard
          v-for="x in 6"
          :key="x"
          class="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5"
          @click="openDetails = true"
        />
      </div>
    </AppSection>

    <AppSection background="bg-white" class="py-20">
      <div class="mb-12 flex flex-col text-center">
        <h2 class="mb-2 text-4xl font-semibold">What Our Organizers and Vendors Say</h2>
        <p class="text-xl">Real stories from successful events and happy merchants.</p>
      </div>

      <div class="flex gap-6">
        <div class="bg-primary-600 flex w-80 flex-col rounded-2xl p-6 text-white">
          <Icon name="quote-up" size="120" />
          <h3 class="mt-3 mb-6 text-3xl font-semibold">
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

        <div class="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-8">
          <div class="inline-flex gap-2">
            <Icon
              v-for="v in 5"
              :key="v"
              size="24"
              name="star-filled"
              :class="v <= 4 ? 'text-primary-400' : 'text-gray-300'"
            />
          </div>
          <p class="mt-4 mb-10 text-xl">
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

    <AppSection background="bg-white" class="py-20 text-white">
      <div
        class="rounded-3xl bg-[linear-gradient(to_bottom_right,_#443685,_#670047,_#dd9790,_#ffb263)] px-14 py-16"
      >
        <h2 class="mb-4 text-5xl font-semibold">Ready to host or join an event?</h2>
        <p class="text-2xl">Create your pop-up or book a booth in minutes.</p>
        <div class="mt-8 flex justify-end gap-4">
          <AppButton label="Create Event" size="lg" />
          <AppButton label="Browse Events" color="alt" size="lg" />
        </div>
      </div>
    </AppSection>

    <!-- Event Details Drawer -->
    <EventDetailsDrawer :open="openDetails" @close="openDetails = false" />
  </div>
</template>
