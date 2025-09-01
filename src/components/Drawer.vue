<template>
  <!-- Overlay -->
  <Transition name="drawer-overlay">
    <div v-if="open" class="fixed inset-0 z-40 bg-black/40" @click="close">
      <!-- Drawer Panel -->
      <Transition :name="drawerTransitionName">
        <div v-if="open" class="relative bg-white shadow-lg" :class="drawerClasses" @click.stop>
          <!-- Header -->
          <slot name="header">
            <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 class="text-core-800 text-lg font-semibold">
                {{ title }}
              </h2>
              <button
                type="button"
                @click="close"
                class="text-core-800 hover:text-core-600 transition-colors"
              >
                <Icon name="close-circle" size="20" />
              </button>
            </div>
          </slot>

          <!-- Body -->
          <div
            class="bg-core-25 flex-1 overflow-y-auto px-6 py-4"
            :class="[bodyClasses, props.bodyClass]"
          >
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="border-t border-gray-200 px-6 py-4">
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
 * Drawer position types
 */
type DrawerPosition = "left" | "right" | "top" | "bottom"

/**
 * Props interface for the Drawer component
 */
interface Props {
  /** Whether the drawer is open/visible */
  open: boolean
  /** Optional title for the drawer header */
  title?: string
  /** Position from which the drawer slides in */
  position?: DrawerPosition
  /** Custom max width for the drawer (e.g., 'sm', 'md', 'lg', 'xl', '2xl', '500px') */
  maxWidth?: string
  /** Additional classes for the drawer body */
  bodyClass?: string
}

/**
 * Events emitted by the Drawer component
 */
interface Emits {
  /** Emitted when the drawer should be closed */
  (e: "close"): void
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  position: "right",
  maxWidth: "md",
})

// Define emits
const emit = defineEmits<Emits>()

/**
 * Close the drawer
 */
const close = () => emit("close")

/**
 * Computed transition name based on position
 */
const drawerTransitionName = computed(() => {
  return `drawer-${props.position}`
})

/**
 * Computed classes for the drawer content
 */
const drawerClasses = computed(() => {
  const baseClasses = ["fixed", "h-full", "flex", "flex-col"]

  // Position classes
  switch (props.position) {
    case "left":
      baseClasses.push("left-0", "top-0")
      break
    case "right":
      baseClasses.push("right-0", "top-0")
      break
    case "top":
      baseClasses.push("top-0", "left-0", "right-0", "!h-auto", "max-h-[80vh]")
      break
    case "bottom":
      baseClasses.push("bottom-0", "left-0", "right-0", "!h-auto", "max-h-[80vh]")
      break
  }

  // Width classes for left/right drawers
  if (props.position === "left" || props.position === "right") {
    const maxWidthMap: Record<string, string> = {
      xs: "w-80", // 320px
      sm: "w-96", // 384px
      md: "w-[28rem]", // 448px
      lg: "w-[32rem]", // 512px
      xl: "w-[36rem]", // 576px
      "2xl": "w-[42rem]", // 672px
      full: "w-full",
    }

    if (maxWidthMap[props.maxWidth]) {
      baseClasses.push(maxWidthMap[props.maxWidth])
    } else {
      // Custom width value
      baseClasses.push(`w-[${props.maxWidth}]`)
    }

    // Ensure drawer doesn't exceed screen width on mobile
    baseClasses.push("max-w-[90vw]", "sm:max-w-none")
  }

  return baseClasses.join(" ")
})

/**
 * Computed classes for the drawer body
 */
const bodyClasses = computed(() => {
  return ""
})

/**
 * Prevent body scrolling when drawer is open
 */
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      // Prevent body scrolling
      document.body.style.overflow = "hidden"
    } else {
      // Restore body scrolling
      document.body.style.overflow = ""
    }
  },
  { immediate: true },
)

/**
 * Cleanup: restore body scrolling when component is unmounted
 */
onUnmounted(() => {
  document.body.style.overflow = ""
})
</script>

<style scoped>
/* Drawer overlay transitions */
.drawer-overlay-enter-active,
.drawer-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-overlay-enter-from,
.drawer-overlay-leave-to {
  opacity: 0;
}

/* Left drawer transitions */
.drawer-left-enter-active,
.drawer-left-leave-active {
  transition: transform 0.3s ease;
}

.drawer-left-enter-from,
.drawer-left-leave-to {
  transform: translateX(-100%);
}

/* Right drawer transitions */
.drawer-right-enter-active,
.drawer-right-leave-active {
  transition: transform 0.3s ease;
}

.drawer-right-enter-from,
.drawer-right-leave-to {
  transform: translateX(100%);
}

/* Top drawer transitions */
.drawer-top-enter-active,
.drawer-top-leave-active {
  transition: transform 0.3s ease;
}

.drawer-top-enter-from,
.drawer-top-leave-to {
  transform: translateY(-100%);
}

/* Bottom drawer transitions */
.drawer-bottom-enter-active,
.drawer-bottom-leave-active {
  transition: transform 0.3s ease;
}

.drawer-bottom-enter-from,
.drawer-bottom-leave-to {
  transform: translateY(100%);
}
</style>
