<script setup lang="ts">
import AppButton from "@components/AppButton.vue"
import FormField from "@components/form/FormField.vue"
import Icon from "@components/Icon.vue"
import Modal from "@components/Modal.vue"
import StepperWizard from "@components/StepperWizard.vue"
import { ref } from "vue"
import { useForm } from "vee-validate"
import { createEventSchema } from "@/utils/validationSchemas"
import { useCreateEvent } from "../api"
import type { EventPayload } from "../types"
import { useAuthStore } from "@modules/auth/store"
import { toast } from "@/composables/useToast"
import { displayError } from "@/utils/error-handler"

defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: "close"): void; (e: "refresh"): void }>()
const activeStep = ref(0)

const { mutate: createEvent, isPending } = useCreateEvent()

// const INIT_VAL = {
//   event_name: "Something Awesome",
//   startDate: "2025-09-01",
//   endDate: "2025-09-12",
//   venueAddress: "123 Main St",
//   registrationCost: 20000,
//   capacity: 50,
//   description: "",
//   eventInstructions: "",
//   terms: null,
//   externalLink: "",
// }

// Initialize VeeValidate form
const { handleSubmit, meta, values, errors } = useForm({
  validationSchema: createEventSchema,
  //   initialValues: INIT_VAL,
})

const { user } = useAuthStore()

const onSubmit = handleSubmit((data) => {
  const payload: EventPayload = {
    organizer: user?.account_id ?? user?.id ?? 0,
    event_name: data.event_name,
    location: data.venueAddress,
    description: data.description || "",
    capacity: data.capacity.toString(),
    start_date: data.startDate,
    end_date: data.endDate,
    participant_fee: data.registrationCost,
  }

  createEvent(payload, {
    onSuccess: () => {
      toast.success("Event created successfully")
      emit("refresh")
      emit("close")
    },
    onError: displayError,
  })
})

// Check if we can proceed to next step (validate required fields for current step)
const canProceedToNextStep = () => {
  const step0RequiredFields = [
    "event_name",
    "startDate",
    "endDate",
    "venueAddress",
    "registrationCost",
    "capacity",
  ]
  return step0RequiredFields.every(
    (field) => values[field] && values[field] !== "" && values[field] !== 0,
  )
}
</script>

<template>
  <Modal :open="open" @close="emit('close')" title="Create Event" max-width="2xl">
    <form @submit.prevent="onSubmit">
      <StepperWizard
        v-model="activeStep"
        :steps="['Event Details', 'Event Instructions']"
        :show-indicators="false"
        v-slot="{ step }"
      >
        {{ errors }} - {{ meta.valid }}
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

          <div class="grid grid-cols-2 gap-6">
            <FormField name="registrationCost" type="number" required />
            <FormField name="capacity" label="Maximum No. of Registrants" type="number" required />
          </div>

          <FormField name="description" type="textarea" :rows="4" />
        </div>

        <div v-show="step === 1" class="space-y-6">
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
        </div>
      </StepperWizard>
    </form>

    <template #footer>
      <div v-if="activeStep >= 1" class="grid grid-cols-2 gap-4">
        <AppButton color="alt" label="Back" @click="activeStep--" icon="arrow-left" type="button" />
        <AppButton
          label="Create Event"
          type="button"
          :disabled="Object.keys(errors).length > 0"
          :loading="isPending"
          @click="onSubmit"
        />
      </div>
      <AppButton
        v-else
        label="Next"
        class="w-full"
        size="lg"
        @click="activeStep++"
        type="button"
        :disabled="!canProceedToNextStep()"
      />
    </template>
  </Modal>
</template>
