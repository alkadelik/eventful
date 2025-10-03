<script setup lang="ts">
import ConfirmationModal from "@components/ConfirmationModal.vue"
import { TDiscountCode } from "../types"
import { startCase } from "@/utils/format-strings"
import DiscountCodeCard from "./DiscountCodeCard.vue"
import { useDeleteDiscountCode, useUpdateDiscountCode } from "../api"
import { displayError } from "@/utils/error-handler"
import { toast } from "@/composables/useToast"
import { computed } from "vue"

const props = defineProps<{ open: boolean; item: TDiscountCode; action: "delete" | "deactivate" }>()

const emit = defineEmits<{ close: []; refresh: [] }>()

const computedAction = computed(() => {
  if (props.action === "deactivate") {
    return props.item.is_active ? "deactivate" : "activate"
  }
  return props.action
})

// const { mutate: deactivateCode, isPending } = useDeactivateDiscountCode()
const { mutate: updateCode, isPending: isUpdating } = useUpdateDiscountCode()
const { mutate: deleteCode, isPending: isDeleting } = useDeleteDiscountCode()

const handleConfirm = () => {
  const onSuccessError = {
    onSuccess: () => {
      toast.success(
        `Discount code ${props.action === "delete" ? "deleted" : "status updated"} successfully.`,
      )
      emit("refresh")
      emit("close")
    },
    onError: displayError,
  }

  if (props.action === "deactivate") {
    // deactivateCode(props.item.id, onSuccessError)
    const body: Partial<TDiscountCode> = {
      amount: props.item.amount,
      is_active: !props.item.is_active,
    }
    updateCode({ id: props.item.id, body }, onSuccessError)
  } else {
    deleteCode(props.item.id, onSuccessError)
  }
}
</script>

<template>
  <ConfirmationModal
    :open="open"
    @close="emit('close')"
    :variant="computedAction === 'delete' ? 'error' : item.is_active ? 'warning' : 'success'"
    :title="`${startCase(computedAction === 'deactivate' ? (item.is_active ? 'Deactivate' : 'Activate') : computedAction)} Discount Code`"
    :subtitle="`This code will ${computedAction === 'delete' ? 'no longer be usable' : 'temporarily be unusable'} by anyone.`"
    :loading="isUpdating || isDeleting"
    :info-message="
      computedAction === 'delete' ? '' : `You can always reactivate the code when you come back.`
    "
    :action-label="startCase(action)"
    @confirm="handleConfirm"
  >
    <template #content>
      <DiscountCodeCard :item="item" :show-actions="false" />
    </template>
  </ConfirmationModal>
</template>
