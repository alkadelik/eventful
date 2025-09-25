<script setup lang="ts">
import { formatCurrency } from "@/utils/format-currency"
import { formatDate } from "@/utils/format-date"
import Chip from "@components/Chip.vue"
import Icon from "@components/Icon.vue"
import { TEvent } from "@modules/shared/types"
import { getEventStatus } from "@modules/shared/utils"

interface EventCardProps {
  /** Additional custom classes */
  class?: string
  /** Event data object */
  event: TEvent
}

const props = defineProps<EventCardProps>()

const emit = defineEmits<{ (e: "click"): void }>()

const getFirst3Initials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 3)
    .toUpperCase()
}
</script>

<template>
  <div
    class="cursor-pointer rounded-2xl border border-gray-200 bg-white"
    :class="props.class"
    @click="emit('click')"
  >
    <div class="relative z-[1] rounded-t-lg">
      <img
        src="@/assets/images/eventful-noise-grid.svg?url"
        :alt="event.event_name"
        class="h-40 w-full rounded-t-lg bg-amber-600 object-cover"
      />

      <div
        class="absolute top-0 bottom-0 flex w-full items-center justify-center text-4xl font-black text-white"
      >
        {{ getFirst3Initials(event.event_name) }}
      </div>
    </div>

    <div class="p-3">
      <div class="mb-2 flex items-center justify-between gap-2">
        <h3 class="truncate text-base font-semibold capitalize">{{ event.event_name }}</h3>
        <Chip
          :label="getEventStatus(event)"
          size="sm"
          :color="
            getEventStatus(event) === 'upcoming'
              ? 'primary'
              : getEventStatus(event) === 'ongoing'
                ? 'success'
                : 'alt'
          "
        />
      </div>
      <div class="space-y-1.5">
        <p class="flex items-center gap-2 text-sm">
          <Icon name="calendar" size="20" />
          {{ formatDate(event.start_date) }} - {{ formatDate(event.end_date) }}
        </p>
        <p class="flex items-center gap-2 text-sm">
          <Icon name="location" size="20" />
          {{ event.location }}
        </p>
        <p class="flex items-center gap-2 text-sm">
          <Icon name="dollar-circle" size="20" />
          {{ event.participant_fee ? formatCurrency(event.participant_fee) : "Free" }}
        </p>
      </div>
    </div>
  </div>
</template>
