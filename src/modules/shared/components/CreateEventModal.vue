<script setup lang="ts">
import AppButton from "@components/AppButton.vue"
import FormField from "@components/form/FormField.vue"
import Icon from "@components/Icon.vue"
import Modal from "@components/Modal.vue"
import StepperWizard from "@components/StepperWizard.vue"
import { ref, computed, watch } from "vue"
import { useForm } from "vee-validate"
import { useCreateEvent, useUpdateEvent } from "../api"
import type { EventPayload, TEvent } from "../types"
import { useAuthStore } from "@modules/auth/store"
import { toast } from "@/composables/useToast"
import { displayError } from "@/utils/error-handler"
import { useQueryClient } from "@tanstack/vue-query"
import { createEventSchema } from "../validationSchemas"

const emit = defineEmits<{ (e: "close"): void; (e: "refresh"): void }>()
const props = defineProps<{ open: boolean; event?: TEvent; isEditMode?: boolean }>()
const activeStep = ref(0)

const { mutate: createEvent, isPending: isCreating } = useCreateEvent()
const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent()

const isLoading = computed(() => isCreating.value || isUpdating.value)
const modalTitle = computed(() => (props.isEditMode ? "Edit Event" : "Create Event"))
const buttonLabel = computed(() => (props.isEditMode ? "Update Event" : "Create Event"))

// Define form data interface
interface FormData {
  event_name: string
  startDate: string
  endDate: string
  venueAddress: string
  registrationCost: number
  capacity: number
  description: string
  // eventInstructions: string
  // terms: File | null
  // externalLink: string
}

// Store initial values for comparison
const initialValues = ref<Partial<FormData>>({})

// Get initial values for the form
const getInitialValues = (): Partial<FormData> => {
  if (props.isEditMode && props.event) {
    const values: FormData = {
      event_name: props.event.event_name,
      startDate: props.event.start_date,
      endDate: props.event.end_date,
      venueAddress: props.event.location,
      registrationCost: props.event.participant_fee,
      capacity: parseInt(props.event.capacity),
      description: props.event.description,
    }
    initialValues.value = { ...values }
    return values
  }
  initialValues.value = {}
  return {}
}

// Helper function to get only changed values
const getChangedValues = (currentData: Partial<FormData>): EventPayload | Partial<EventPayload> => {
  if (!props.isEditMode || !props.event) {
    // For create mode, return all values
    return {
      organizer: user?.account_id ?? user?.id ?? 0,
      event_name: currentData.event_name!,
      location: currentData.venueAddress!,
      description: currentData.description || "",
      capacity: currentData.capacity!.toString(),
      start_date: currentData.startDate!,
      end_date: currentData.endDate!,
      participant_fee: currentData.registrationCost!,
    }
  }

  // For edit mode, only include changed fields
  const changes: Partial<EventPayload> = {}

  if (currentData.event_name !== initialValues.value.event_name) {
    changes.event_name = currentData.event_name
  }

  if (currentData.venueAddress !== initialValues.value.venueAddress) {
    changes.location = currentData.venueAddress
  }

  if (currentData.description !== initialValues.value.description) {
    changes.description = currentData.description || ""
  }

  if (currentData.capacity !== initialValues.value.capacity) {
    changes.capacity = currentData.capacity?.toString()
  }

  if (currentData.startDate !== initialValues.value.startDate) {
    changes.start_date = currentData.startDate
  }

  if (currentData.endDate !== initialValues.value.endDate) {
    changes.end_date = currentData.endDate
  }

  if (currentData.registrationCost !== initialValues.value.registrationCost) {
    changes.participant_fee = currentData.registrationCost
  }

  return changes
}

// Initialize VeeValidate form
const { handleSubmit, resetForm, meta } = useForm({
  validationSchema: createEventSchema,
  initialValues: getInitialValues(),
})

const { user } = useAuthStore()
const queryClient = useQueryClient()

const onSubmit = handleSubmit((data) => {
  const payload = getChangedValues(data)

  if (props.isEditMode && props.event) {
    // Only send update if there are actual changes
    if (Object.keys(payload).length === 0) {
      toast.success("No changes to update")
      emit("close")
      return
    }

    // Update existing event with only changed fields
    updateEvent(
      { id: props.event.id, body: payload as Partial<EventPayload> },
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
    // Create new event with all required fields
    createEvent(payload as EventPayload, {
      onSuccess: () => {
        toast.success("Event created successfully")
        emit("refresh")
        queryClient.invalidateQueries({ queryKey: ["organizerEvents", "eventStats"] })
        emit("close")
      },
      onError: displayError,
    })
  }
})

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
    }
  },
  { immediate: true },
)
</script>

<template>
  <Modal :open="open" @close="emit('close')" :title="modalTitle" max-width="2xl">
    <form @submit.prevent="onSubmit">
      <StepperWizard
        v-model="activeStep"
        :steps="[
          'Event Details',
          // 'Event Instructions'
        ]"
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

        <!-- <div v-show="step === 1" class="space-y-6">
          <div>
            <span class="bg-core-200 flex size-10 items-center justify-center rounded-lg p-2">
              <Icon name="shop-add" size="32" />
            </span>
            <h3 class="mt-1 text-sm font-medium">Provide instructions for merchants.</h3>
          </div>

          <FormField
            name="eventInstructions"
            type="textarea"
            :rows="4"
            placeholder="e.g. Vendors should arrive 1hr before..."
          />

          <FormField
            name="terms"
            label="Terms & Conditions"
            accept="image/*,.pdf"
            type="file"
            :max-size="2"
          />

          <div class="flex items-center justify-between gap-4">
            <hr class="flex-1 border-t border-gray-300" />
            <span>OR</span>
            <hr class="flex-1 border-t border-gray-300" />
          </div>
          <FormField
            name="externalLink"
            label="Add external form link"
            placeholder="www.docs.google.com/..."
            prefix="https://"
          />
        </div> -->
      </StepperWizard>
    </form>

    <template #footer>
      <!-- <div v-if="activeStep >= 1" class="grid grid-cols-2 gap-4">
        <AppButton color="alt" label="Back" @click="activeStep--" icon="arrow-left" type="button" />
        <AppButton
          label="Create Event"
          type="button"
          :disabled="Object.keys(errors).length > 0"
          :loading="isLoading"
          @click="onSubmit"
        />
      </div> -->
      <AppButton
        class="w-full"
        :label="buttonLabel"
        size="lg"
        :inactive="!meta.valid"
        :loading="isLoading"
        @click="onSubmit"
      />
      <!-- label="Next" -->
      <!-- @click="activeStep++" -->
    </template>
  </Modal>
</template>
