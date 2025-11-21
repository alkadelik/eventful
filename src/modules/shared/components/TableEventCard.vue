<script setup lang="ts">
import { formatCurrency } from "@/utils/format-currency"
import Chip from "@components/Chip.vue"
import Icon from "@components/Icon.vue"
import { TEvent } from "../types"
import DropdownMenu from "@components/DropdownMenu.vue"
import { formatDate } from "@/utils/format-date"
import { getEventStatus } from "../utils"

interface EventCardProps {
  /**
   * Additional custom classes
   */
  class?: string

  /** event item */
  event: TEvent
}

const props = defineProps<EventCardProps>()

const emit = defineEmits<{ (e: "click"): void; (e: "share"): void; (e: "edit"): void }>()
</script>

<template>
  <div
    class="bg-core-25 border-core-300 cursor-pointer rounded-2xl border px-4 py-5"
    :class="props.class"
    @click="emit('click')"
  >
    <div class="mb-2 flex items-center justify-between gap-2">
      <h3 class="flex-1 truncate text-base font-semibold">
        {{ event.name }}
      </h3>

      <span v-if="Number(event.participant_fee) && event.registration_count" class="font-medium">
        {{ formatCurrency(Number(event.participant_fee) * event.registration_count) }}
      </span>

      <DropdownMenu
        :items="
          [
            { label: 'Edit Event', icon: 'edit', action: () => emit('edit') },
            { label: 'View Event', icon: 'eye', action: () => emit('click') },
            { divider: true },
            { label: 'Share Event', icon: 'share', action: () => emit('share') },
          ].filter((d) => d.icon !== 'edit' || !event.registration_count)
        "
      >
        <template #trigger>
          <Icon name="dots-vertical" size="20" />
        </template>
      </DropdownMenu>
    </div>
    <div class="space-y-1.5">
      <p class="flex items-center gap-2 text-sm">
        {{ Number(event.participant_fee) ? formatCurrency(event.participant_fee) : "Free" }}
        <span>&middot;</span>
        {{ Number(event.capacity).toLocaleString() }}
      </p>
      <p class="flex items-center gap-2 text-sm">
        {{ formatDate(event?.start_date || "") }} -
        {{ formatDate(event?.end_date || "") }}
      </p>
      <Chip
        :label="getEventStatus(event)"
        class="capitalize"
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
  </div>
</template>
