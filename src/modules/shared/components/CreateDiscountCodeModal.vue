<script setup lang="ts">
import AppButton from "@components/AppButton.vue"
import FormField from "@components/form/FormField.vue"
import Icon from "@components/Icon.vue"
import Modal from "@components/Modal.vue"
import { ref, computed, watch } from "vue"
import { useForm } from "vee-validate"
import { useCreateDiscountCode, useUpdateDiscountCode } from "../api"
import type { DiscountCodePayload, TDiscountCode, TEvent } from "../types"
import { toast } from "@/composables/useToast"
import { displayError } from "@/utils/error-handler"
import { formatCurrency } from "@/utils/format-currency"
import * as yup from "yup"
import { isV2Api } from "@/utils/others"

const emit = defineEmits<{ (e: "close"): void; (e: "refresh"): void }>()
const props = defineProps<{
  open: boolean
  code?: TDiscountCode
  event: TEvent
  isEditMode?: boolean
}>()

const { mutate: createDiscountCode, isPending: isCreating } = useCreateDiscountCode()
const { mutate: updateDiscountCode, isPending: isUpdating } = useUpdateDiscountCode()

const isLoading = computed(() => isCreating.value || isUpdating.value)
const modalTitle = computed(() =>
  props.isEditMode ? "Edit Discount Code" : "Create Discount Code",
)

// Store initial values for comparison
const initialValues = ref<Partial<DiscountCodePayload>>({})

// Get initial values for the form
const getInitialValues = (): Partial<DiscountCodePayload> => {
  if (props.isEditMode && props.code) {
    const values: DiscountCodePayload = {
      event: props.event.id,
      code: props.code.code,
      amount: props.code.amount,
      max_uses: props.code.max_uses,
      expires_at: props.code.expires_at,
    }
    initialValues.value = { ...values }
    return values
  }
  initialValues.value = {}
  return {}
}

// Helper function to get only changed values
const getChangedValues = (
  currentData: Partial<DiscountCodePayload>,
): Partial<DiscountCodePayload> => {
  if (!props.isEditMode || !props.code) {
    // For create mode, return all values
    return {
      code: currentData.code!,
      amount: currentData.amount!,
      max_uses: currentData.max_uses!,
      expires_at: currentData.expires_at!,
    }
  }

  // For edit mode, only include changed fields
  const changes: Partial<DiscountCodePayload> = {}

  if (currentData.code !== initialValues.value.code) {
    changes.code = currentData.code
  }
  if (currentData.amount !== initialValues.value.amount) {
    changes.amount = currentData.amount
  }
  if (currentData.max_uses !== initialValues.value.max_uses) {
    changes.max_uses = currentData.max_uses
  }
  if (currentData.expires_at !== initialValues.value.expires_at) {
    changes.expires_at = currentData.expires_at
  }

  return changes
}

// Initialize VeeValidate form
const { handleSubmit, resetForm, meta } = useForm({
  validationSchema: yup.object({
    code: yup.string().required("Code is required").matches(/^\S+$/, "No spaces allowed"),
    amount: yup
      .number()
      .typeError("Discount must be a number")
      .positive("Discount must be positive")
      .max(
        Number(props.event.event_fee || props.event.participant_fee),
        `Discount cannot exceed participation fee - ${formatCurrency(props.event.event_fee || props.event.participant_fee)}`,
      )
      .required("Discount value is required"),
    max_uses: yup
      .number()
      .typeError("Maximum usage must be a number")
      .positive("Maximum usage must be positive")
      .integer("Maximum usage must be an integer")
      .nullable()
      .transform((value, originalValue) => (originalValue === "" ? null : value)),
    expires_at: yup
      .date()
      .nullable()
      .transform((value, originalValue) => (originalValue === "" ? null : value)),
  }),
  initialValues: getInitialValues(),
})

const onSubmit = handleSubmit((data) => {
  const payload = {
    ...getChangedValues(data),
    amount: data.amount,
    event: props.event.id,
    per_user_limit: 1,
  }

  const onSuccessError = {
    onSuccess: () => {
      toast.success(`Discount code ${props.isEditMode ? "updated" : "created"} successfully`)
      emit("refresh")
      emit("close")
    },
    onError: displayError,
  }

  if (props.isEditMode && props.code) {
    // Only send update if there are actual changes
    if (Object.keys(payload).length === 0) {
      toast.success("No changes to update")
      emit("close")
      return
    }

    updateDiscountCode({ id: props.code.id, body: payload }, onSuccessError)
  } else {
    const finalPayload = isV2Api
      ? {
          code: payload.code,
          discount_type: "flat_rate",
          discount_value: payload.amount,
          valid_from: new Date().toISOString().slice(0, 10),
          valid_until:
            payload.expires_at || new Date(props.event.end_date).toISOString().slice(0, 10),
          usage_limit: payload.max_uses || null,
          events: [props.event.uid],
        }
      : payload
    createDiscountCode(finalPayload as DiscountCodePayload, onSuccessError)
  }
})

// Watch for prop changes to reset form when switching between create/edit
watch(
  () => [props.open, props.isEditMode, props.code],
  ([open]) => {
    if (open && props.isEditMode) {
      const newInitialValues = getInitialValues()
      resetForm({ values: newInitialValues })
    }
  },
  { immediate: true },
)
</script>

<template>
  <Modal :open="open" @close="emit('close')" :title="modalTitle" max-width="2xl">
    <form class="space-y-6" @submit.prevent="onSubmit">
      <div>
        <span class="flex size-10 items-center justify-center rounded-lg bg-gray-200 p-2">
          <Icon name="discount" size="32" />
        </span>
        <h3 class="mt-1 text-sm font-medium">
          Discount codes let merchants pay less when registering for your event.
        </h3>
      </div>

      <FormField name="code" required hint="Unique code (no spaces). Example: SUMMER50" />

      <FormField
        name="amount"
        label="Discount Value"
        type="number"
        required
        placeholder="e.g. N5,000"
        :hint="`The participation fee is: ${formatCurrency(event.event_fee || event.participant_fee)}`"
      />

      <FormField
        name="max_uses"
        label="Maximum No. of Code Use (optional)"
        type="number"
        hint="Leave empty to not add a cap on the code usage"
      />

      <FormField name="expires_at" label="Expiry Date (optional)" type="date" />
    </form>

    <template #footer>
      <AppButton
        class="w-full"
        :label="isEditMode ? 'Save Changes' : 'Create Code'"
        size="lg"
        :inactive="!meta.valid"
        :loading="isLoading"
        @click="onSubmit"
      />
    </template>
  </Modal>
</template>
