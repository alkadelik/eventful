<template>
  <div class="text-core-800 py-8 text-center" :class="props.class">
    <!-- Icon -->
    <Icon :name="icon" :size="80" class="mx-auto mb-4" />

    <!-- Title -->
    <h3 class="mb-2 text-lg font-semibold">
      {{ title }}
    </h3>

    <!-- Description -->
    <p v-if="description" class="text-core-600 mb-6 text-sm">
      {{ description }}
    </p>

    <!-- Action Button -->
    <AppButton
      v-if="actionLabel"
      :variant="actionVariant"
      :color="actionColor"
      :label="actionLabel"
      :icon="actionIcon"
      @click="handleAction"
    />

    <!-- Custom slot for additional content -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import AppButton from "./AppButton.vue"
import Icon from "./Icon.vue"

/**
 * Props interface for the EmptyState component
 */
interface Props {
  /** Icon name to display */
  icon?: string
  /** Title text */
  title: string
  /** Optional description text */
  description?: string
  /** Optional action button label */
  actionLabel?: string
  /** Optional action button icon */
  actionIcon?: string
  /** Action button variant */
  actionVariant?: "filled" | "outlined" | "text"
  /** Action button color */
  actionColor?: "primary" | "error" | "success" | "alt"
  /** Additional CSS classes for the container */
  class?: string
}

/**
 * Events emitted by the EmptyState component
 */
interface Emits {
  /** Emitted when the action button is clicked */
  (e: "action"): void
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  icon: "box",
  actionVariant: "outlined",
  actionColor: "primary",
})

// Define emits
const emit = defineEmits<Emits>()

/**
 * Handle action button click
 */
const handleAction = () => {
  emit("action")
}
</script>
