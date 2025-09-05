<template>
  <div class="text-core-800">
    <SectionHeader
      title="Create Your Organiser Account"
      subtitle="Quickly get started to create and manage your events."
      class="mb-6 md:mb-10"
    />

    <AppForm :schema="validationSchema" @submit="onSubmit" v-slot="{ meta }" class="space-y-6">
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField name="first_name" label="First Name" placeholder="e.g. John" required />
        <FormField name="last_name" label="Last Name" placeholder="e.g. Doe" required />
      </div>

      <FormField
        name="company_name"
        label="Company/Trade Name"
        placeholder="e.g. Acme Corp"
        required
      />

      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField name="email" label="Email Address" placeholder="example@gmail.com" required />

        <FormField
          name="phone"
          label="Phone Number"
          prefix="+234"
          placeholder="8012345678"
          required
        />
      </div>

      <div>
        <FormField
          name="password"
          label="Password"
          type="password"
          placeholder="Enter password"
          required
          @update:model-value="currentPassword = $event"
        />
        <PasswordStrength v-if="currentPassword" :model-value="currentPassword" />
      </div>

      <FormField
        type="password"
        label="Confirm Password"
        placeholder="Re-enter password"
        name="confirm_password"
        required
      />

      <p class="text-core-600 text-center text-base">
        By creating account, you agree to our
        <a
          href="https://leyyow.notion.site/Refund-policy-162f3934f3148085a337fc0d3cbffb99?pvs=4"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary-600"
        >
          Terms of Service
        </a>
        and
        <a
          href="https://leyyow.notion.site/Refund-policy-162f3934f3148085a337fc0d3cbffb99?pvs=4"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary-600"
        >
          Privacy Policy
        </a>
      </p>

      <AppButton
        type="submit"
        :loading="isPending"
        label="Create Account"
        class="w-full"
        :class="{ 'cursor-not-allowed opacity-50': !meta.valid }"
      />
    </AppForm>

    <div class="mt-5 pb-4">
      <p class="text-core-600 text-center text-base font-normal">
        Already have an account?
        <RouterLink
          to="/login"
          class="text-primary-600 font-semibold transition-colors duration-200 hover:underline"
        >
          Sign in
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import PasswordStrength from "@components/form/PasswordStrength.vue"
import * as yup from "yup"
import { passwordSchema } from "@/utils/validationSchemas"
import { useRegister } from "../api"
import { displayError } from "@/utils/error-handler"
// import { useAuthStore } from "../store"
import { TSignupPayload } from "../types"
import { toast } from "@/composables/useToast"
import AppForm from "@components/form/AppForm.vue"
import FormField from "@components/form/FormField.vue"
import SectionHeader from "@components/SectionHeader.vue"
import AppButton from "@components/AppButton.vue"

const { mutate: signupFn, isPending } = useRegister()
// const authStore = useAuthStore()
const router = useRouter()

const validationSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Enter a valid email address").required("Email is required"),
  company_name: yup.string().required("Company/Trade name is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .min(10, "Enter a valid NGN phone number")
    .max(11, "Enter a valid NGN phone number"),
  password: passwordSchema,
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
})

const currentPassword = ref("")

const onSubmit = (values: TSignupPayload) => {
  signupFn(
    {
      ...values,
      phone: "+234" + (values.phone?.startsWith("0") ? values.phone?.slice(1) : values.phone),
      is_organizer: true,
    },
    {
      onSuccess: (res) => {
        console.log("res", res.data)
        // const { token, ...user } = res.data?.data || {}

        // ==== SIGNUP SUCCESS response is missing important data ====
        // authStore.setTokens(token)
        // authStore.setAuthUser({ ...user, account_id: user.id })
        // toast.success("Please check your email for verification", { title: "Account Created" })
        // router.push({ path: "/confirm-email", query: { email: values.email } })

        // ==== TEMPORARY WORKAROUND ====
        toast.success("Account created! Please login to continue")
        router.push("/login")
        // ==== TEMPORARY WORKAROUND ====
      },
      onError: displayError,
    },
  )
}
</script>
