<template>
  <div>
    <div class="bg-core-50 mb-4 flex size-10 items-center justify-center rounded-xl p-2">
      <Icon name="bank" size="28" />
    </div>

    <SectionHeader
      title="Add your bank details"
      subtitle="Add your account to receive registration fee from attendees."
      class="mb-6 md:mb-10"
    />

    <form @submit.prevent="onSubmit" class="space-y-6 md:space-y-8">
      <FormField
        name="account_number"
        label="Account Number"
        placeholder="e.g. 1234567890"
        required
      />

      <FormField
        name="bank_name"
        type="select"
        label="Bank Name"
        placeholder="Select your bank"
        required
        searchable
        :options="supportedBanks"
        :hint="
          isLoading ? 'Loading...' : isResolving ? 'Validating...' : accountName ? accountName : ''
        "
      />

      <AppButton
        type="submit"
        :loading="isPending"
        label="Save Bank Details"
        class="w-full"
        :class="{ 'cursor-not-allowed opacity-50': !meta.valid || !accountName || isResolving }"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { useAddBankAccount, useGetSupportedBanks, useResolveBankAccount } from "../api"
import * as yup from "yup"
import { toast } from "@/composables/useToast"
import FormField from "@components/form/FormField.vue"
import SectionHeader from "@components/SectionHeader.vue"
import { computed, ref, watch } from "vue"
import AppButton from "@components/AppButton.vue"
import Icon from "@components/Icon.vue"
import { useForm } from "vee-validate"
import { displayError } from "@/utils/error-handler"
import { onInvalidSubmit } from "@/utils/validations"
import { useAuthStore } from "../store"

const router = useRouter()
const { user, updateAuthUser } = useAuthStore()
const accountName = ref("")

const { data: banks, isPending: isLoading } = useGetSupportedBanks()
const { mutate: addBankAccount, isPending } = useAddBankAccount()
const { mutate: resolveAccount, isPending: isResolving } = useResolveBankAccount()

const supportedBanks = computed(() => {
  if (!banks.value) return []
  return (banks.value as { data: Array<{ name: string; code: string }> }).data.map((x) => ({
    label: x.name,
    value: x.code,
  }))
})

const { handleSubmit, meta, setErrors, setValues, values } = useForm<{
  account_number: string
  bank_name: { label: string; value: string }
  account_name: string
}>({
  validationSchema: yup.object({
    account_number: yup
      .string()
      .length(10, "Enter a valid account number")
      .required("Account number is required"),
    bank_name: yup.object().required("Bank name is required"),
    account_name: yup.string().required("Could not resolve account name"),
  }),
})

const validateAccountNumber = (account_number: string, bank_code: string) => {
  resolveAccount(
    { account_number, bank_code },
    {
      onSuccess: (res) => {
        const acct_name = res.data?.data?.account_name
        if (acct_name) {
          accountName.value = acct_name
          setValues({ account_name: acct_name })
        } else {
          accountName.value = ""
          setErrors({ account_number: "Could not resolve account name" })
        }
      },
    },
  )
}

watch(
  () => values,
  (newValue) => {
    if (newValue.bank_name && newValue.account_number?.length === 10) {
      validateAccountNumber(newValue.account_number, newValue.bank_name.value)
    } else {
      accountName.value = ""
    }
  },
  { deep: true },
)

const onSubmit = handleSubmit((values) => {
  const payload = {
    ...values,
    bank_name: values.bank_name.label,
    bank_code: values.bank_name.value,
    organizer: user?.account_id,
  }
  addBankAccount(payload, {
    onSuccess: () => {
      toast.success("Bank account added successfully")
      updateAuthUser({ has_payment_account: true })
      router.push("/dashboard")
    },
    onError: displayError,
  })
}, onInvalidSubmit)
</script>
