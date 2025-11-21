<script setup lang="ts">
import { formatCurrency } from "@/utils/format-currency"
import { formatDate } from "@/utils/format-date"
import Chip from "@components/Chip.vue"
import Icon from "@components/Icon.vue"
import { TEvent } from "@modules/shared/types"
import { getEventStatus } from "@modules/shared/utils"
import fallBackImage from "@/assets/images/eventful-noise-grid.svg?url"

interface EventCardProps {
  /** Additional custom classes */
  class?: string
  /** Event data object */
  event: TEvent
}

const props = defineProps<EventCardProps>()

const emit = defineEmits<{ (e: "click"): void }>()
</script>

<template>
  <div
    class="cursor-pointer rounded-2xl border border-gray-200 bg-white"
    :class="props.class"
    @click="emit('click')"
  >
    <div class="relative z-[1] rounded-t-lg">
      <img
        :src="event.image || fallBackImage"
        :alt="event.name"
        class="h-40 w-full rounded-t-lg bg-amber-600 object-cover"
      />

      <span
        class="absolute top-4 left-0 flex items-center justify-center rounded-r bg-white px-3 py-1 text-sm font-medium shadow"
      >
        {{ Number(event.participant_fee) ? formatCurrency(event.participant_fee) : "Free" }}
      </span>

      <img src="/images/logos/leyyow-icon-1.svg?url" class="absolute right-2 bottom-2 size-8" />
    </div>

    <div class="p-3">
      <div class="mb-2 flex items-center justify-between gap-2">
        <h3 class="truncate text-base font-semibold capitalize">{{ event.name }}</h3>
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
      <div>
        <p class="flex items-center gap-2 text-sm">
          <Icon name="calendar" size="20" class="text-primary-600" />
          {{ formatDate(event.start_date) }} - {{ formatDate(event.end_date) }}
        </p>
        <p class="my-2 flex items-center gap-2 truncate text-sm">
          <Icon name="location" size="20" class="text-primary-600" />
          <span class="truncate">
            {{ event.location }}
          </span>
        </p>
        <button
          type="button"
          class="text-primary-600 mt-3 flex items-center gap-2 text-sm font-medium"
        >
          Register
          <Icon name="arrow-right" size="16" />
        </button>
      </div>
    </div>
  </div>
</template>
