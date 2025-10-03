<template>
  <!-- Overlay -->
  <Transition name="modal-overlay">
    <div
      v-if="open"
      class="fixed inset-0 z-[1200] bg-black/40"
      :class="overlayClasses"
      @click="emit('close')"
    >
      <!-- Modal Card -->
      <Transition name="modal-content">
        <div
          v-if="open"
          :class="['relative bg-white shadow-lg', modalClasses, props.modalClass]"
          @click.stop
        >
          <!-- Header -->
          <slot name="header">
            <div class="flex items-center justify-between px-6 py-4">
              <h2 class="text-core-800 text-lg font-semibold">
                {{ title }}
              </h2>
              <button
                type="button"
                @click="emit('close')"
                class="text-core-800 hover:text-core-600 transition-colors"
              >
                <Icon name="close-circle" size="20" />
              </button>
            </div>
          </slot>

          <!-- Body -->
          <div
            class="bg-base-background px-6 py-4"
            :class="[bodyClasses, props.bodyClass, { 'rounded-b-2xl': !$slots.footer }]"
          >
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="px-6 py-4">
            <slot name="footer" />
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted } from "vue"
import Icon from "./Icon.vue"

/**
 * Modal variant types
 */
type ModalVariant = "centered" | "fullscreen" | "bottom"

/**
 * Props interface for the Modal component
 */
interface Props {
  /** Whether the modal is open/visible */
  open: boolean
  /** Optional title for the modal header */
  title?: string
  /** Modal variant - determines positioning and size behavior
   * - 'centered' - Centered modal with max width
   * - 'fullscreen' - Fullscreen modal
   * - 'bottom' - Bottom navigation style modal (full width on mobile, centered on desktop)
   * @default "bottom"
   */
  variant?: ModalVariant
  /** Custom max width for the modal (e.g., 'sm', 'md', 'lg', 'xl', '2xl', '500px') */
  maxWidth?: string
  /** Additional classes for the modal body */
  bodyClass?: string
  /** Additional classes for the modal container */
  modalClass?: string
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  variant: "bottom",
  maxWidth: "lg",
})

// Define emits
const emit = defineEmits(["close"])

/**
 * Computed classes for the overlay
 */
const overlayClasses = computed(() => {
  switch (props.variant) {
    case "fullscreen":
      return ""
    case "bottom":
      return "flex items-end justify-center md:items-center md:justify-center"
    case "centered":
    default:
      return "flex items-center justify-center"
  }
})

/**
 * Computed classes for the modal content
 */
const modalClasses = computed(() => {
  const baseClasses = []

  // Width and max-width classes
  if (props.variant === "fullscreen") {
    baseClasses.push("w-full h-full")
  } else {
    baseClasses.push("w-full")

    // Max width handling
    const maxWidthMap: Record<string, string> = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
    }

    if (maxWidthMap[props.maxWidth]) {
      baseClasses.push(maxWidthMap[props.maxWidth])
    } else {
      baseClasses.push(`max-w-[${props.maxWidth}]`)
    }
  }

  // Border radius and positioning
  switch (props.variant) {
    case "fullscreen":
      baseClasses.push("")
      break
    case "bottom":
      baseClasses.push("rounded-t-2xl mb-0 md:rounded-2xl")
      break
    case "centered":
    default:
      baseClasses.push("rounded-2xl m-4")
      break
  }

  return baseClasses.join(" ")
})

/**
 * Computed classes for the modal body
 */
const bodyClasses = computed(() => {
  const classes = []

  if (props.variant === "fullscreen") {
    classes.push("h-full overflow-y-auto")
  } else {
    classes.push("max-h-[80vh] overflow-y-auto")
  }

  return classes.join(" ")
})

/**
 * Prevent body scrolling when modal is open and restore on close
 */
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
  },
  { immediate: true },
)
onUnmounted(() => {
  document.body.style.overflow = ""
})
</script>

<style scoped>
/* Modal overlay transitions */
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

/* Modal content transitions */
.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

/* Bottom nav variant specific transitions */
.modal-content-enter-from.bottom-nav,
.modal-content-leave-to.bottom-nav {
  transform: translateY(100%);
}

@media (max-width: 768px) {
  .modal-content-enter-from,
  .modal-content-leave-to {
    transform: translateY(100%);
  }
}
</style>
