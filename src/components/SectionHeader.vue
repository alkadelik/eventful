<template>
  <div :class="['flex items-center justify-between', props.class]">
    <div>
      <h3 :class="[titleClasses, 'mb-1 font-semibold']">{{ title }}</h3>
      <p v-if="subtitle || $slots.subtitle" :class="[subtitleClasses, 'text-core-600']">
        <slot name="subtitle">{{ subtitle }}</slot>
      </p>
    </div>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

/**
 * Props interface for the SectionHeader component
 */
interface Props {
  /** The main title/heading text */
  title: string
  /** The subtitle/description text */
  subtitle?: string
  /** Additional CSS classes to apply to the root div */
  class?: string
  /** The size variant of the section header */
  size?: "sm" | "md" | "lg"
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
})

const titleClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "text-lg"
    case "lg":
      return "text-2xl md:text-3xl"
    case "md":
      return "text-xl md:text-2xl"
    default:
      return "text-2xl"
  }
})

const subtitleClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "text-xs"
    case "lg":
      return "text-sm md:text-base"
    case "md":
      return "text-sm md:text-base"
    default:
      return "text-sm"
  }
})
</script>
