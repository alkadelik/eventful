<template>
  <div>
    <Chip color="primary" size="md" label="Are you a Vendor?" class="!pr-1">
      <template #append>
        <a href="https://www.leyyow.com/auth/signin" target="_blank" rel="noopener">
          <Chip label="Sign In Here" color="warning" icon="arrow-right" class="flex-row-reverse" />
        </a>
      </template>
    </Chip>

    <SectionHeader
      title="Organiser Log In"
      subtitle="Good to see you again - pick up right where you left off"
      class="my-6 md:my-10"
    />

    <AppForm
      :schema="loginSchema"
      @submit="onSubmit"
      v-slot="{ meta }"
      class="space-y-6 md:space-y-8"
    >
      <FormField name="email" label="Email Address" placeholder="example@gmail.com" required />

      <FormField name="password" type="password" label="Password" placeholder="*****" required />

      <div class="flex items-center justify-between">
        <label class="text-core-600 flex cursor-pointer items-center gap-1.5 text-sm">
          <input v-model="rememberMe" type="checkbox" class="accent-primary-600 h-4 w-4" />
          Remember me
        </label>
        <RouterLink
          to="/forgot-password"
          class="text-primary-600 text-base font-medium transition-colors duration-200 hover:underline"
        >
          Forgot Password?
        </RouterLink>
      </div>

      <AppButton
        type="submit"
        :loading="isPending"
        label="Log In"
        class="w-full"
        :class="{ 'cursor-not-allowed opacity-50': !meta.valid }"
      />
    </AppForm>

    <div class="mt-5 pb-4">
      <p class="text-core-600 text-center font-normal">
        I don't have an account?
        <RouterLink
          to="/signup"
          class="text-primary-600 font-semibold transition-colors duration-200 hover:underline"
        >
          Sign Up
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { useLogin } from "../api"
import * as yup from "yup"
import { displayError } from "@/utils/error-handler"
import { useAuthStore } from "../store"
import { ILoginResponse, TLoginPayload } from "../types"
import { toast } from "@/composables/useToast"
import AppForm from "@components/form/AppForm.vue"
import FormField from "@components/form/FormField.vue"
import SectionHeader from "@components/SectionHeader.vue"
import { ref } from "vue"
import AppButton from "@components/AppButton.vue"
import Chip from "@components/Chip.vue"
import { isV2Api } from "@/utils/others"

const authStore = useAuthStore()
const router = useRouter()
const rememberMe = ref(true)
const { mutate: loginFn, isPending } = useLogin()

const loginSchema = yup.object({
  email: yup.string().email("Enter a valid email address").required("Email is required"),
  password: yup.string().required("Password is required"),
})

const onSubmit = (values: TLoginPayload) => {
  loginFn(values, {
    onSuccess: (res) => {
      const authData = (isV2Api ? res.data.data : res.data) as ILoginResponse["data"]
      const { access, refresh, ...user } = authData
      authStore.setTokens({ access, refresh })
      authStore.setAuthUser({
        ...user,
        email_confirmed: user.email_confirmed || user.is_email_verified,
        email: values.email,
        has_payment_account: true, /// TEMPORARY FIX
      })
      toast.success("Your login was successful!")
      // check for redirect query param
      const redirectPath = router.currentRoute.value.query.redirect as string
      router.push(redirectPath || "/dashboard")
    },
    onError: displayError,
  })
}
</script>
