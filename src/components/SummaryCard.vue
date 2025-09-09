<script setup lang="ts">
import Icon from "@components/Icon.vue"
import { computed } from "vue"

/**
 * Color theme type for the summary card
 */
export type SummaryCardColor = "blue" | "green" | "red" | "yellow" | "purple" | "gray" | "primary"

/**
 * Props interface for the SummaryCard component
 */
interface Props {
  /** The title/label text displayed at the top */
  title: string
  /** The main value to display (number or string) */
  value: number | string
  /** Icon name to display in the top-right corner */
  icon: string
  /** Color theme for the icon background and styling */
  iconClass?: SummaryCardColor
  /** Additional CSS classes for the container */
  class?: string
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  iconClass: "green",
})

/**
 * Format the value for display
 */
const formattedValue = computed(() => {
  if (typeof props.value === "number") {
    // Format large numbers with abbreviations (K, M, B)
    if (props.value >= 1000000000) {
      return (props.value / 1000000000).toFixed(1) + "B"
    } else if (props.value >= 1000000) {
      return (props.value / 1000000).toFixed(1) + "M"
    } else if (props.value >= 1000) {
      return (props.value / 1000).toFixed(1) + "K"
    }
  }
  return props.value.toString()
})

/**
 * Container classes
 */
const containerClasses = computed(() => {
  const baseClasses = [
    "border-core-100 shadow-xs flex flex-col gap-1 rounded-xl",
    "md:border bg-white p-4 md:px-6",
  ]

  const classes = [...baseClasses]

  if (props.class) classes.push(props.class)

  return classes
})

/**
 * Title classes
 */
const titleClasses = computed(() => {
  const baseClasses = ["text-core-600 font-medium text-sm"]
  return [...baseClasses]
})

/**
 * Value classes
 */
const valueClasses = computed(() => {
  const baseClasses = ["font-bold text-core-800 text-2xl"]
  return [...baseClasses]
})

/**
 * Icon container classes
 */
const iconContainerClasses = computed(() => {
  const baseClasses = [
    "flex items-center justify-center flex-shrink-0 rounded-xl",
    "transition-colors duration-200 bg-gray-100",
  ]
  return [...baseClasses, "bg-core-50 size-10 p-2"]
})

/**
 * Icon classes
 */
const iconClasses = computed(() => {
  const colorClasses = {
    blue: "text-blue-700",
    green: "text-green-700",
    red: "text-red-700",
    yellow: "text-yellow-700",
    purple: "text-purple-700",
    gray: "text-gray-700",
    primary: "text-primary-700",
  }

  return colorClasses[props.iconClass]
})
</script>

<template>
  <div :class="containerClasses">
    <div class="flex flex-col-reverse gap-1 sm:flex-row sm:items-center sm:justify-between">
      <p :class="titleClasses">{{ title }}</p>
      <div :class="iconContainerClasses">
        <Icon :name="icon" :size="20" :class="iconClasses" />
      </div>
    </div>

    <h3 :class="valueClasses">{{ formattedValue }}</h3>
  </div>
</template>
