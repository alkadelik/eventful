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
</script>

<template>
  <div
    class="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5"
    :class="props.class"
    @click="emit('click')"
  >
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
</template>
