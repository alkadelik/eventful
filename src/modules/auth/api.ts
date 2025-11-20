import baseApi, { TApiPromise, useApiQuery } from "@/composables/baseApi"
import { useMutation } from "@tanstack/vue-query"
import {
  ILoginResponse,
  ISignupResponse,
  TLoginPayload,
  TResetPasswordPayload,
  TSignupPayload,
} from "./types"

/** Login api request  */
export function useLogin() {
  return useMutation({
    mutationFn: (body: TLoginPayload): TApiPromise<ILoginResponse> =>
      baseApi.post("/accounts/auth/organizers/", body),
  })
}

/** Register api request  */
export function useRegister() {
  return useMutation({
    mutationFn: (body: TSignupPayload): TApiPromise<ISignupResponse> =>
      baseApi.post("/accounts/signup/organizers/", body),
  })
}

/** Triggers an email with reset token   */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (body: { email: string }) =>
      baseApi.post("/accounts/auth/password/request-token", body),
  })
}

/** Reset password api request  */
export function useResetPassword() {
  return useMutation({
    mutationFn: (body: TResetPasswordPayload) =>
      baseApi.post(`/accounts/auth/password/${body.otp}/reset/`, { password: body.new_password }),
  })
}

/** Verify email api request  */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (body: { email: string; otp: string }) =>
      baseApi.post("/accounts/verifications/email/", { token: body.otp }),
  })
}

/** Resend verification code api request  */
export function useResendVerificationCode() {
  return useMutation({
    mutationFn: (email: string) =>
      baseApi.post("/accounts/verifications/resend-email-token/", { email }),
  })
}

/** Fetch supported banks */
export function useGetSupportedBanks() {
  return useApiQuery({ url: "/billings/banks/", key: "supportedBanks" })
}

/** resolve a bank account */
export function useResolveBankAccount() {
  return useMutation({
    mutationFn: (body: { account_number: string; bank_code: string }) =>
      baseApi.post("/billings/account-verification/verify/", body),
  })
}

/** create a bank account */
export function useAddBankAccount() {
  return useMutation({
    mutationFn: (body: { account_number: string; bank_name: string }) =>
      baseApi.post("/billings/settlements/", body),
  })
}
