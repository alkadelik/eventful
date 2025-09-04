<script setup lang="ts">
import { formatCurrency } from "@/utils/format-currency"
import Chip from "@components/Chip.vue"
import Icon from "@components/Icon.vue"

interface EventCardProps {
  /**
   * Additional custom classes
   */
  class?: string
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
      <h3 class="truncate text-base font-semibold">Lagos Business Week 2025 International</h3>
      <Chip label="Ongoing" size="sm" color="success" />
    </div>
    <div class="space-y-1.5">
      <p class="flex items-center gap-2 text-sm">
        <Icon name="star" size="20" />
        22-03-2025
      </p>
      <p class="flex items-center gap-2 text-sm">
        <Icon name="star" size="20" />
        Victoria Island, Lagos
      </p>
      <p class="flex items-center gap-2 text-sm">
        <Icon name="star" size="20" />
        {{ formatCurrency(10000) }}
      </p>
      <p class="flex items-center gap-2 text-sm">
        <Icon name="star" size="20" />
        60 Vendors
      </p>
      <p class="flex items-center gap-2 text-sm">
        <Icon name="star" size="20" />
        15 Registered
      </p>
    </div>
  </div>
</template>
