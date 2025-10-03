<template>
  <Modal
    :open="open"
    title="Export Registered Vendors"
    body-class="!p-0"
    max-width="xl"
    @close="emit('close')"
  >
    <AppForm :schema="schema" @submit="onSubmit" v-slot="{ meta, values }">
      <div class="space-y-4 px-4 py-4 md:space-y-8 md:px-6">
        <div class="space-y-4">
          <div class="bg-core-50 mb-4 flex size-10 items-center justify-center rounded-xl p-2">
            <Icon name="download-cloud" size="28" />
          </div>

          <p class="text-xs md:text-sm">
            Your vendor list will be prepared and delivered to your inbox shortly.
          </p>
        </div>

        <FormField
          name="export_fields"
          label="What fields do you want to export?"
          type="tags"
          :options="EXPORT_FIELD_OPTIONS"
          placeholder="Select Export Fields"
          required
        />

        <FormField
          name="period"
          label="Period"
          type="select"
          :options="EXPORT_PERIOD_OPTIONS"
          placeholder="Select period"
          required
          placement="top"
        />

        <!-- Conditional date fields when period is "custom" -->
        <div
          v-if="values?.period?.value === 'custom'"
          class="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <FormField
            name="start_date"
            label="Start Date"
            type="date"
            placeholder="Select start date"
            required
          />

          <FormField
            name="end_date"
            label="End Date"
            type="date"
            placeholder="Select end date"
            required
          />
        </div>
      </div>

      <div class="space-y-3 bg-white px-6 py-4">
        <AppButton
          type="submit"
          label="Send CSV to my email"
          :loading="isPending"
          class="w-full"
          :inactive="!meta.valid"
        />
      </div>
    </AppForm>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from "vue"
import * as yup from "yup"
import { toast } from "@/composables/useToast"
import AppButton from "@/components/AppButton.vue"
import Modal from "@/components/Modal.vue"
import AppForm from "@/components/form/AppForm.vue"
import FormField from "@/components/form/FormField.vue"
import Icon from "@components/Icon.vue"
import { EXPORT_FIELD_OPTIONS, EXPORT_PERIOD_OPTIONS } from "../constants"
import { IExportPayload } from "../types"
import { displayError } from "@/utils/error-handler"
import { useExportRegVendors } from "../api"

interface FormValues {
  export_fields: string[]
  period: { label: string; value: string }
  activity: string
  start_date?: string
  end_date?: string
}

const props = defineProps<{ open: boolean; eventId: number }>()
const emit = defineEmits(["close"])

const { mutate: exportVendors, isPending } = useExportRegVendors()

// Dynamic validation schema
const schema = computed(() => {
  const baseSchema = {
    export_fields: yup.array().of(yup.string()).min(1).required(),
    period: yup
      .object({ label: yup.string().required(), value: yup.string().required() })
      .required(),
    activity: yup.string().default("all"),
  }
  // Add date validation when period is "custom"
  return yup.object({
    ...baseSchema,
    start_date: yup.string().when("period", {
      is: (period: { label: string; value: string } | undefined) => period?.value === "custom",
      then: (schema) => schema.required("Start date is required for custom period"),
      otherwise: (schema) => schema.optional(),
    }),
    end_date: yup.string().when("period", {
      is: (period: { label: string; value: string } | undefined) => period?.value === "custom",
      then: (schema) => schema.required("End date is required for custom period"),
      otherwise: (schema) => schema.optional(),
    }),
  })
})

const onSubmit = (values: FormValues) => {
  const payload: IExportPayload = {
    export_fields: values.export_fields,
    period: values.period.value,
    activity: "all", // Always set to "all"
    start_date: values.start_date,
    end_date: values.end_date,
  }

  console.log("Submitting export payload:", payload)
  exportVendors(
    { id: props.eventId, payload },
    {
      onSuccess: () => {
        toast.success("Registered vendors CSV sent to mail!")
        emit("close")
      },
      onError: displayError,
    },
  )
}
</script>
