<template>
  <div :class="containerClasses">
    <div class="flex items-center justify-between">
      <p :class="titleClasses">{{ title }}</p>
      <div :class="iconContainerClasses">
        <Icon :name="icon" :size="iconSize" :class="iconClasses" />
      </div>
    </div>
    <div class="flex items-end gap-2">
      <h3 :class="valueClasses">{{ formattedValue }}</h3>
      <div v-if="trend" :class="trendClasses">
        <Icon :name="trendIcon" size="16" :class="trendIconClasses" />
        <span class="text-sm">{{ trend }}%</span>
      </div>
    </div>
    <p v-if="subtitle" :class="subtitleClasses">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
import Icon from "@components/Icon.vue"
import { computed } from "vue"

/**
 * Color theme type for the summary card
 */
export type SummaryCardColor = "blue" | "green" | "red" | "yellow" | "purple" | "gray" | "primary"

/**
 * Size variants for the summary card
 */
export type SummaryCardSize = "sm" | "md" | "lg"

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
  /** Optional subtitle text displayed below the value */
  subtitle?: string
  /** Optional trend percentage (positive/negative number) */
  trend?: number
  /** Size variant of the card */
  size?: SummaryCardSize
  /** Additional CSS classes for the container */
  class?: string
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  iconClass: "primary",
  size: "md",
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
 * Determine trend direction and icon
 */
const trendIcon = computed(() => {
  if (!props.trend) return ""
  return props.trend > 0 ? "arrow-right" : "arrow-right"
})

/**
 * Container classes
 */
const containerClasses = computed(() => {
  const baseClasses = [
    "border-core-100",
    "flex",
    "flex-col",
    "gap-3",
    "rounded-xl",
    "border",
    "bg-white",
  ]

  // Size-based padding and spacing
  const sizeClasses = {
    sm: "px-4 py-3",
    md: "px-6 py-4",
    lg: "px-8 py-6",
  }

  const classes = [...baseClasses, sizeClasses[props.size]]

  if (props.class) {
    classes.push(props.class)
  }

  return classes
})

/**
 * Title classes
 */
const titleClasses = computed(() => {
  const baseClasses = ["text-core-600", "font-medium"]

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return [...baseClasses, sizeClasses[props.size]]
})

/**
 * Value classes
 */
const valueClasses = computed(() => {
  const baseClasses = ["font-bold", "text-core-800"]

  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  }

  return [...baseClasses, sizeClasses[props.size]]
})

/**
 * Subtitle classes
 */
const subtitleClasses = computed(() => {
  const baseClasses = ["text-core-500"]

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-sm",
  }

  return [...baseClasses, sizeClasses[props.size]]
})

/**
 * Icon container classes
 */
const iconContainerClasses = computed(() => {
  const baseClasses = [
    "flex",
    "items-center",
    "justify-center",
    "rounded-xl",
    "transition-colors",
    "duration-200",
  ]

  // Size-based dimensions
  const sizeClasses = {
    sm: "size-8 p-1.5",
    md: "size-10 p-2",
    lg: "size-12 p-2.5",
  }

  // Color-based background
  //   const colorClasses = {
  //     blue: "bg-blue-50",
  //     green: "bg-green-50",
  //     red: "bg-red-50",
  //     yellow: "bg-yellow-50",
  //     purple: "bg-purple-50",
  //     gray: "bg-gray-50",
  //     primary: "bg-primary-50",
  //   }
  // colorClasses[props.iconClass]

  return [...baseClasses, sizeClasses[props.size], "bg-core-50"]
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

/**
 * Icon size based on card size
 */
const iconSize = computed(() => {
  const sizeMap = {
    sm: "16",
    md: "20",
    lg: "24",
  }

  return sizeMap[props.size]
})

/**
 * Trend container classes
 */
const trendClasses = computed(() => {
  if (!props.trend) return []

  const baseClasses = ["flex", "items-center", "gap-1", "px-2", "py-1", "rounded-md", "text-xs"]

  const trendColorClasses =
    props.trend > 0 ? ["bg-green-50", "text-green-600"] : ["bg-red-50", "text-red-600"]

  return [...baseClasses, ...trendColorClasses]
})

/**
 * Trend icon classes
 */
const trendIconClasses = computed(() => {
  if (!props.trend) return ""

  return props.trend > 0 ? "text-green-600" : "text-red-600"
})
</script>
