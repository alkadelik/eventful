<template>
  <div class="text-core-500 text-center" :class="containerClasses">
    <!-- Icon -->
    <Icon :name="icon" :size="iconSize" class="mx-auto mb-4" />

    <!-- Title -->
    <h3 class="mb-2 font-semibold" :class="titleClasses">
      {{ title }}
    </h3>

    <!-- Description -->
    <p v-if="description" class="mb-6" :class="descriptionClasses">
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
import { computed } from "vue"
import AppButton from "./AppButton.vue"
import Icon from "./Icon.vue"

/**
 * Empty state size variants
 */
type EmptyStateSize = "sm" | "md" | "lg"

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
  /** Size variant for the empty state */
  size?: EmptyStateSize
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
  size: "md",
})

// Define emits
const emit = defineEmits<Emits>()

/**
 * Handle action button click
 */
const handleAction = () => {
  emit("action")
}

/**
 * Computed classes for the container
 */
const containerClasses = computed(() => {
  const classes = []

  // Size-based padding
  switch (props.size) {
    case "sm":
      classes.push("py-4")
      break
    case "lg":
      classes.push("py-10")
      break
    case "md":
    default:
      classes.push("py-6")
      break
  }

  // Add custom classes if provided
  if (props.class) {
    classes.push(props.class)
  }

  return classes.join(" ")
})

/**
 * Computed icon size based on component size
 */
const iconSize = computed(() => {
  switch (props.size) {
    case "sm":
      return "60"
    case "lg":
      return "100"
    case "md":
    default:
      return "80"
  }
})

/**
 * Computed classes for the title
 */
const titleClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "text-lg"
    case "lg":
      return "text-2xl"
    case "md":
    default:
      return "text-xl"
  }
})

/**
 * Computed classes for the description
 */
const descriptionClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "text-xs"
    case "lg":
      return "text-base"
    case "md":
    default:
      return "text-sm"
  }
})
</script>
