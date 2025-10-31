<template>
  <Modal
    :open="open"
    max-width="lg"
    variant="centered"
    modal-class="!bg-base-background !rounded-t-2xl"
    body-class="!pt-0"
    @close="emit('close')"
  >
    <template #header>
      <div class="flex items-center justify-between px-6 py-4">
        <span :class="headerIconContainerClasses">
          <Icon :name="displayHeaderIcon" size="24" />
        </span>
        <Icon name="x-close" size="24" class="text-gray-600" @click="emit('close')" />
      </div>
    </template>

    <h6 class="text-lg font-semibold">{{ title }}</h6>

    <p class="mt-2 mb-4 text-sm text-gray-600">{{ subtitle }}</p>

    <slot name="content"> </slot>

    <div :class="infoBoxClasses">
      <span :class="infoIconContainerClasses">
        <Icon name="info-circle" size="20" />
      </span>
      <p class="text-sm font-medium">{{ displayInfoMessage }}</p>
    </div>

    <div class="mt-5 flex gap-2">
      <AppButton label="Cancel" color="alt" @click="emit('close')" class="flex-1" />
      <AppButton
        :label="displayActionLabel"
        variant="filled"
        :class="actionButtonClasses"
        :loading="loading"
        @click="emit('confirm')"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from "vue"
import Modal from "@/components/Modal.vue"
import AppButton from "@components/AppButton.vue"
import Icon from "@components/Icon.vue"

export interface ConfirmationModalProps {
  /** Whether the modal is open */
  open: boolean
  /** Title text */
  title: string
  /** Subtitle text */
  subtitle: string
  /** Whether the confirm button is in a loading state */
  loading: boolean
  /**
   * The modal variant affecting colors and styling
   * - warning: Yellow/orange color scheme for warnings (default)
   * - error: Red color scheme for destructive actions
   * - success: Green color scheme for positive actions
   * @default "warning"
   */
  variant?: "warning" | "error" | "success"

  /**
   * Custom header icon name (overrides default variant icons)
   * @example "custom-icon"
   */
  headerIcon?: string

  /**
   * Custom info message (overrides default variant messages)
   */
  infoMessage?: string

  /**
   * Custom action button label (overrides default variant labels)
   */
  actionLabel?: string
}

const props = withDefaults(defineProps<ConfirmationModalProps>(), {
  variant: "warning",
})

const emit = defineEmits<{ close: []; confirm: [] }>()

// Default icons for each variant
const defaultIcons = {
  warning: "pause",
  error: "trash",
  success: "check-circle",
}

// Default info messages for each variant
const defaultInfoMessages = {
  warning: "You can reverse this action by reactivating the member.",
  error: "This action cannot be reversed.",
  success: "This action will be completed immediately.",
}

// Default action labels for each variant
const defaultActionLabels = {
  warning: "Suspend",
  error: "Delete",
  success: "Confirm",
}

const displayHeaderIcon = computed(() => props.headerIcon || defaultIcons[props.variant])
const displayInfoMessage = computed(() => props.infoMessage || defaultInfoMessages[props.variant])
const displayActionLabel = computed(() => props.actionLabel || defaultActionLabels[props.variant])

const headerIconContainerClasses = computed(() => {
  const variantClasses = {
    warning: "border-warning-100 bg-warning-200 ring-warning-100 text-warning-700",
    error: "border-red-100 bg-red-200 ring-red-100 text-red-700",
    success: "border-green-100 bg-green-200 ring-green-100 text-green-700",
  }

  return [
    "flex h-12 w-12 items-center justify-center rounded-full border-4 ring-4",
    variantClasses[props.variant],
  ]
})

// Info box classes
const infoBoxClasses = computed(() => {
  const variantClasses = {
    warning: "border-warning-300 bg-warning-50 text-warning-700",
    error: "border-red-300 bg-red-50 text-red-700",
    success: "border-green-300 bg-green-50 text-green-700",
  }

  return ["my-3 flex items-center gap-3 rounded-xl border p-3", variantClasses[props.variant]]
})

const infoIconContainerClasses = computed(() => {
  const variantClasses = {
    warning: "border-warning-200 ring-warning-100 text-warning-600",
    error: "border-red-200 ring-red-100 text-red-600",
    success: "border-green-200 ring-green-100 text-green-600",
  }
  return [
    "rounded-full border-2 p-0.5 size-6 flex items-center justify-center ring-2 ring-offset-2",
    variantClasses[props.variant],
  ]
})

// Action button classes
const actionButtonClasses = computed(() => {
  const variantClasses = {
    warning: "!bg-warning-600 hover:!bg-warning-500",
    error: "!bg-red-600 hover:!bg-red-500",
    success: "!bg-green-600 hover:!bg-green-500",
  }

  return ["flex-1", variantClasses[props.variant]]
})
</script>
