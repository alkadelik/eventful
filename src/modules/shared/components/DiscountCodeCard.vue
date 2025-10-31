<script setup lang="ts">
import DropdownMenu from "@components/DropdownMenu.vue"
import Icon from "@components/Icon.vue"
import { TDiscountCode } from "../types"
import { formatCurrency } from "@/utils/format-currency"
import Chip from "@components/Chip.vue"

const emit = defineEmits(["edit", "deactivate", "delete", "toggle"])

withDefaults(defineProps<{ item: TDiscountCode; showActions?: boolean }>(), { showActions: true })

const actions = [
  { label: "Edit Code", icon: "edit", action: () => emit("edit") },
  { label: "Deactivate Code", icon: "close-circle", action: () => emit("deactivate") },
  { divider: true },
  {
    label: "Delete Code",
    icon: "trash",
    class: "text-red-500",
    iconClass: "text-red-500",
    action: () => emit("delete"),
  },
]
</script>

<template>
  <div
    class="bg-core-25 border-core-300 text-core-700 flex cursor-pointer gap-4 rounded-2xl border px-4 py-5"
  >
    <div class="mb-4 flex size-10 items-center justify-center rounded-xl bg-gray-100 p-2">
      <Icon name="discount" size="24" class="text-primary-600" />
    </div>

    <div class="flex-1 space-y-2">
      <h3 class="line-clamp-1 text-base font-semibold uppercase">{{ item.code }}</h3>
      <p class="flex items-center gap-2 text-sm">
        <Icon name="discount" size="20" />
        {{ formatCurrency(item.amount || item.discount_value) }}
      </p>
      <p v-if="item.max_uses || item.usage_limit" class="flex items-center gap-2 text-sm">
        <Icon name="people" size="20" />
        {{ item.max_uses || item.usage_limit }} Users
      </p>
      <p class="flex items-center gap-2 text-sm">
        <Chip
          v-if="item.max_uses || item.usage_limit"
          color="blue"
          :label="`${((item.usage_count || item.used_count || 0) / (item.max_uses || item.usage_limit || 1)) * 100}% usage`"
        />
        <Chip color="success" label="Active" />
      </p>
    </div>

    <DropdownMenu v-if="showActions" @toggle="() => emit('toggle')" :items="actions" />
  </div>
</template>
