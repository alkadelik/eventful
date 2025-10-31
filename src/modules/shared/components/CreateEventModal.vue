<script setup lang="ts">
import AppButton from "@components/AppButton.vue"
import FormField from "@components/form/FormField.vue"
import Icon from "@components/Icon.vue"
import Modal from "@components/Modal.vue"
import StepperWizard from "@components/StepperWizard.vue"
import { ref, computed, watch, onUnmounted } from "vue"
import { useForm } from "vee-validate"
import { useCreateEvent, useUpdateEvent } from "../api"
import type { TEvent } from "../types"
import { useAuthStore } from "@modules/auth/store"
import { toast } from "@/composables/useToast"
import { displayError } from "@/utils/error-handler"
import { useQueryClient } from "@tanstack/vue-query"
import { createEventSchema, eventDetailsSchema } from "../validationSchemas"
import { onInvalidSubmit } from "@/utils/validations"
import { isV2Api } from "@/utils/others"

const emit = defineEmits<{ (e: "close"): void; (e: "refresh"): void }>()
const props = defineProps<{ open: boolean; event?: TEvent; isEditMode?: boolean }>()
const activeStep = ref(0)

const { mutate: createEvent, isPending: isCreating } = useCreateEvent()
const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent()

const isLoading = computed(() => isCreating.value || isUpdating.value)
const modalTitle = computed(() => (props.isEditMode ? "Edit Event" : "Create Event"))
const buttonLabel = computed(() => (props.isEditMode ? "Update Event" : "Create Event"))

// Define form data interface
interface EventFormData {
  event_name: string
  startDate: string
  endDate: string
  venueAddress: string
  registrationCost: number
  capacity: number
  description: string
  eventInstructions: string
  event_flier: File | null
  terms_and_conditions: File | null
}

// Store initial values for comparison
const initialValues = ref<Partial<EventFormData>>({})

// Get initial values for the form
const getInitialValues = (): Partial<EventFormData> => {
  if (props.isEditMode && props.event) {
    const values: Partial<EventFormData> = {
      event_name: props.event.event_name || props.event.name,
      startDate: props.event.start_date,
      endDate: props.event.end_date,
      venueAddress: props.event.location,
      registrationCost: Number(props.event.event_fee || props.event.participant_fee),
      capacity: parseInt(props.event.capacity),
      description: props.event.description,
      eventInstructions: props.event.eventInstructions || "",
      event_flier: null,
      terms_and_conditions: null,
    }
    initialValues.value = { ...values }
    return values
  }
  initialValues.value = {}
  return {}
}

// Helper function to prepare FormData for submission
const prepareFormData = (currentData: Partial<EventFormData>): FormData => {
  const formData = new FormData()

  if (!props.isEditMode || !props.event) {
    // For create mode, include all required fields
    formData.append("organizer", String(user?.account_id ?? user?.id ?? 0))
    formData.append(isV2Api ? "name" : "event_name", currentData.event_name!)
    formData.append("location", currentData.venueAddress!)
    formData.append("description", currentData.description || "")
    formData.append("capacity", currentData.capacity!.toString())
    formData.append("start_date", currentData.startDate!)
    formData.append("end_date", currentData.endDate!)
    formData.append(
      isV2Api ? "participant_fee" : "event_fee",
      currentData.registrationCost!.toString(),
    )

    // Add optional fields
    if (currentData.eventInstructions) {
      formData.append("eventInstructions", currentData.eventInstructions)
    }
    if (currentData.event_flier) {
      formData.append("event_flier", currentData.event_flier)
    }
    if (currentData.terms_and_conditions) {
      formData.append("terms_and_conditions", currentData.terms_and_conditions)
    }
  } else {
    // For edit mode, only include changed fields
    if (currentData.event_name !== initialValues.value.event_name) {
      formData.append(isV2Api ? "name" : "event_name", currentData.event_name!)
    }
    if (currentData.venueAddress !== initialValues.value.venueAddress) {
      formData.append("location", currentData.venueAddress!)
    }
    if (currentData.description !== initialValues.value.description) {
      formData.append("description", currentData.description || "")
    }
    if (currentData.capacity !== initialValues.value.capacity) {
      formData.append("capacity", currentData.capacity!.toString())
    }
    if (currentData.startDate !== initialValues.value.startDate) {
      formData.append("start_date", currentData.startDate!)
    }
    if (currentData.endDate !== initialValues.value.endDate) {
      formData.append("end_date", currentData.endDate!)
    }
    if (currentData.registrationCost !== initialValues.value.registrationCost) {
      formData.append(
        isV2Api ? "participant_fee" : "event_fee",
        currentData.registrationCost!.toString(),
      )
    }
    if (currentData.eventInstructions !== initialValues.value.eventInstructions) {
      formData.append("event_instructions", currentData.eventInstructions || "")
    }
    // Always include files if they are present (they might be new uploads)
    if (currentData.event_flier) {
      formData.append("event_flier", currentData.event_flier)
    }
    if (currentData.terms_and_conditions) {
      formData.append("terms_and_conditions", currentData.terms_and_conditions)
    }
  }

  return formData
}

const validationSchema = computed(() => {
  return activeStep.value === 0 ? eventDetailsSchema : createEventSchema
})
// Initialize VeeValidate form
const { handleSubmit, resetForm, meta, values, validateField, setFieldTouched } = useForm({
  validationSchema: validationSchema.value,
  initialValues: getInitialValues(),
})

// Function to validate step 0 fields before moving to next step
const validateStep0 = async (): Promise<boolean> => {
  // List of fields in step 0
  const step0Fields: Array<keyof EventFormData> = [
    "event_name",
    "startDate",
    "endDate",
    "venueAddress",
    "registrationCost",
    "capacity",
    "description",
  ]

  // Touch and validate all fields in step 0
  const validationResults = await Promise.all(
    step0Fields.map(async (field) => {
      setFieldTouched(field, true)
      const result = await validateField(field)
      return result.valid
    }),
  )

  // Return true only if all fields are valid
  return validationResults.every((valid) => valid)
}

// Function to handle moving to next step
const handleContinue = async () => {
  const isValid = await validateStep0()
  if (isValid) {
    activeStep.value++
  }
}

const { user } = useAuthStore()
const queryClient = useQueryClient()

// Computed properties for file previews
const eventFlierPreview = computed(() => {
  const file = values.event_flier as File | null
  if (file && file.type.startsWith("image/")) {
    return URL.createObjectURL(file)
  }
  return null
})

const onSubmit = handleSubmit((data) => {
  const formData = prepareFormData(data)

  if (props.isEditMode && props.event) {
    // Check if there are any changes by checking if formData has entries
    let hasChanges = false
    for (const [,] of formData.entries()) {
      hasChanges = true
      break
    }

    if (!hasChanges) {
      toast.success("No changes to update")
      emit("close")
      return
    }

    // Update existing event with FormData
    updateEvent(
      { id: props.event.id, body: formData },
      {
        onSuccess: () => {
          toast.success("Event updated successfully")
          emit("refresh")
          queryClient.invalidateQueries({ queryKey: ["organizerEvents", "eventStats"] })
          emit("close")
        },
        onError: displayError,
      },
    )
  } else {
    // Create new event with FormData
    createEvent(formData, {
      onSuccess: () => {
        toast.success("Event created successfully")
        emit("refresh")
        queryClient.invalidateQueries({ queryKey: ["organizerEvents", "eventStats"] })
        emit("close")
      },
      onError: displayError,
    })
  }
}, onInvalidSubmit)

// Cleanup function for object URLs
const cleanup = () => {
  if (eventFlierPreview.value) {
    URL.revokeObjectURL(eventFlierPreview.value)
  }
}

// Watch for prop changes to reset form when switching between create/edit
watch(
  () => [props.open, props.isEditMode, props.event],
  ([open]) => {
    if (open) {
      // Reset step when modal opens
      activeStep.value = 0
      // Reset form with new initial values
      const newInitialValues = getInitialValues()
      resetForm({ values: newInitialValues })
    } else {
      // Cleanup when modal closes
      cleanup()
    }
  },
  { immediate: true },
)

// Cleanup on unmount
onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <Modal :open="open" @close="emit('close')" :title="modalTitle" max-width="2xl">
    <form @submit.prevent="onSubmit">
      <StepperWizard
        v-model="activeStep"
        :steps="['Event Details', 'Additional Details']"
        :show-indicators="false"
        v-slot="{ step }"
      >
        <div v-show="step === 0" class="space-y-6">
          <div>
            <span class="bg-core-200 flex size-10 items-center justify-center rounded-lg p-2">
              <Icon name="shop-add" size="32" />
            </span>
            <h3 class="mt-1 text-sm font-medium">Add the core details about your pop-up event.</h3>
          </div>
          <FormField name="event_name" required />

          <div class="grid grid-cols-2 gap-6">
            <FormField name="startDate" type="date" required />
            <FormField name="endDate" type="date" required />
          </div>

          <FormField name="venueAddress" required />

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField name="registrationCost" type="number" required />
            <FormField name="capacity" label="Maximum No. of Registrants" type="number" required />
          </div>

          <FormField name="description" type="textarea" :rows="4" />
        </div>

        <div v-show="step === 1" class="space-y-6">
          <div>
            <span class="bg-core-200 flex size-10 items-center justify-center rounded-lg p-2">
              <Icon name="document-upload" size="32" />
            </span>
            <h3 class="mt-1 text-sm font-medium">Additional event details and attachments.</h3>
            <p class="mt-1 text-xs text-gray-500">All fields in this step are optional</p>
          </div>

          <FormField
            name="eventInstructions"
            label="Event Instructions"
            type="textarea"
            :rows="4"
            placeholder="e.g. Vendors should arrive 1hr before event start time..."
          />

          <div class="space-y-4">
            <FormField
              name="terms_and_conditions"
              label="Terms & Conditions"
              accept=".pdf,.doc,.docx"
              type="file"
              :max-size="2"
              placeholder="Supported formats: PDF, Word"
            />
          </div>

          <div class="space-y-4">
            <FormField
              name="event_flier"
              label="Event Flier"
              placeholder="Supported formats: PNG, JPG"
              accept="image/png,image/jpeg,image/jpg"
              type="file"
              :max-size="2"
            />
          </div>
        </div>
      </StepperWizard>
    </form>

    <template #footer>
      <div v-if="activeStep === 0" class="w-full">
        <AppButton
          class="w-full"
          label="Continue"
          size="lg"
          type="button"
          icon="arrow-right"
          icon-position="right"
          :inactive="!meta.valid"
          @click="handleContinue"
        />
      </div>

      <div v-else-if="activeStep === 1" class="grid grid-cols-2 gap-4">
        <AppButton color="alt" label="Back" @click="activeStep--" icon="arrow-left" type="button" />
        <AppButton
          :label="buttonLabel"
          :inactive="!meta.valid"
          :loading="isLoading"
          @click="onSubmit"
        />
      </div>
    </template>
  </Modal>
</template>
