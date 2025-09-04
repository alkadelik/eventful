<script setup lang="ts">
import { ref, computed } from "vue"
import Icon from "../Icon.vue"

interface Props {
  /** The model value of the file input */
  modelValue?: File | null
  /** The label for the file input */
  label?: string
  /** Whether the input is required */
  required?: boolean
  /** Whether the input is disabled */
  disabled?: boolean
  /** Error message to display */
  error?: string
  /** Hint text to display when there's no error */
  hint?: string
  /** The visual variant of the input */
  variant?: "default" | "error" | "success"
  /** The size of the input */
  size?: "sm" | "md" | "lg"
  /** Accepted file types */
  accept?: string
  /** Maximum file size in MB */
  maxSize?: number
  /** Placeholder text */
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: "Upload File",
  variant: "default",
  size: "md",
  maxSize: 2,
})

const emit = defineEmits<{
  "update:modelValue": [value: File | null]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const currentFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement>()

const handleFileChange = (event: Event) => {
  if (props.disabled) return
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    if (validateFile(file)) {
      currentFile.value = file
      emit("update:modelValue", file)
    } else {
      // Clear the input if validation fails
      target.value = ""
    }
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  if (props.disabled) return

  const file = event.dataTransfer?.files[0]
  if (file && validateFile(file)) {
    currentFile.value = file
    emit("update:modelValue", file)
  }
}

const preventDefaults = (event: DragEvent) => {
  event.preventDefault()
}

const validateFile = (file: File): boolean => {
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024)
  if (fileSizeMB > props.maxSize) {
    // emit error
    console.error(`File size exceeds ${props.maxSize}MB limit`)
    return false
  }
  return true
}

const removeFile = (event: Event) => {
  event.stopPropagation()
  if (props.disabled) return

  currentFile.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ""
  }
  emit("update:modelValue", null)
}

const containerClasses = computed(() => {
  const baseClasses =
    "relative flex w-full cursor-pointer items-center justify-center rounded-xl border overflow-hidden bg-core-25"

  const variantClasses = {
    default:
      "border-core-50 hover:border-primary-300 focus-within:border-primary-300 focus-within:ring-1 focus-within:ring-primary-300",
    error:
      "border-red-300 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500",
    success:
      "border-green-300 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500",
  }

  const sizeClasses = {
    sm: "px-3 py-1.5",
    md: "px-4 py-2",
    lg: "px-4 py-4",
  }

  const disabledClasses = props.disabled ? "opacity-50 cursor-not-allowed" : ""

  // Use error variant if error prop is provided
  const currentVariant = props.error ? "error" : props.variant

  return [baseClasses, variantClasses[currentVariant], sizeClasses[props.size], disabledClasses]
    .filter(Boolean)
    .join(" ")
})

const imagePreview = computed(() => {
  if (currentFile.value && currentFile.value.type.startsWith("image/")) {
    return URL.createObjectURL(currentFile.value)
  }
  return null
})
</script>

<template>
  <div>
    <label v-if="label" class="text-core-800 mb-1.5 block text-sm font-medium">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div :class="containerClasses" @dragover="preventDefaults" @drop="handleDrop">
      <div v-if="currentFile?.name" class="flex w-full items-center gap-3">
        <span
          class="flex size-12 flex-shrink-0 items-center justify-center rounded-md bg-white p-0.5 shadow-sm"
        >
          <img
            v-if="imagePreview"
            :src="imagePreview"
            alt="Preview"
            class="size-10 rounded object-cover"
          />
          <Icon v-else name="folder" class="text-primary-500 !size-6 flex-shrink-0" />
        </span>
        <div class="flex-1">
          <p class="text-core-800 truncate text-sm">
            {{ currentFile?.name }}
          </p>
          <p class="text-core-400 text-xs">
            Size: {{ (currentFile?.size / (1024 * 1024)).toFixed(2) }}MB
          </p>
        </div>
        <button
          type="button"
          class="text-core-400 flex-shrink-0 hover:text-red-500"
          @click.stop="removeFile"
          :disabled="disabled"
        >
          <Icon name="close-circle" class="h-4 w-4" />
        </button>
      </div>
      <div v-else class="flex w-full flex-col items-center justify-center gap-1 py-2 text-center">
        <Icon name="folder" size="32" class="text-core-400" />
        <p>
          Drag and drop file here or
          <span class="text-primary-500 cursor-pointer">choose file</span>
        </p>
        <div class="space-y-1">
          <span class="text-core-600 text-sm">{{ placeholder }}</span>
          <span class="text-core-400 text-xs">Max size: {{ maxSize }}MB</span>
        </div>
      </div>

      <input
        v-if="!currentFile?.name"
        ref="fileInputRef"
        type="file"
        class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        :accept="accept"
        :disabled="disabled"
        @change="handleFileChange"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
    </div>
    <div v-if="error" class="mt-1 flex items-center text-sm text-red-600">
      <Icon name="info-circle" class="mr-1 h-4 w-4 flex-shrink-0" />
      {{ error }}
    </div>
    <div v-if="hint && !error" class="mt-1 text-sm text-gray-500">
      {{ hint }}
    </div>
  </div>
</template>
