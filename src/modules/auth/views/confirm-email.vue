<template>
  <div class="flex flex-col gap-8">
    <BackButton to="/login" label="Back to Login" icon="arrow-left-square" />

    <SectionHeader title="Confirm Your Email" class="mb-2">
      <template #subtitle>
        We have sent a six-digit code to {{ email }}
        <button type="button" class="text-primary-600 font-semibold underline underline-offset-4">
          Change email
        </button>
      </template>
    </SectionHeader>

    <OtpField v-model="otp" />

    <AppButton
      label="Verify & Continue"
      :loading="isPending"
      :disabled="otp.length !== 6"
      class="w-full"
      @click="onSubmit"
    />

    <p class="text-core-600 text-center text-sm">
      Didn't get the code?
      <button to="/forgot-password" class="btn btn-ghost text-primary-600 font-medium">
        Resend Code
      </button>
    </p>
  </div>
</template>

<script setup lang="ts">
import AppButton from "@components/AppButton.vue"
import BackButton from "@components/BackButton.vue"
import OtpField from "@components/form/OtpField.vue"
import SectionHeader from "@components/SectionHeader.vue"
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useVerifyEmail } from "../api"
import { toast } from "@/composables/useToast"
import { displayError } from "@/utils/error-handler"

const route = useRoute()
const router = useRouter()

const email = route.query.email as string
const otp = ref("")

const { mutate: verifyEmail, isPending } = useVerifyEmail()

const onSubmit = () => {
  verifyEmail(
    { email, otp: otp.value },
    {
      onSuccess: () => {
        toast.success("Email verified successfully")
        router.push("/dashboard")
      },
      onError: displayError,
    },
  )
}
</script>
