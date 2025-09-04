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
    mutationFn: (body: TLoginPayload): TApiPromise<ILoginResponse["data"]> =>
      baseApi.post("/account/auth/organizer/login/", body),
  })
}

/** Register api request  */
export function useRegister() {
  return useMutation({
    mutationFn: (body: TSignupPayload): TApiPromise<ISignupResponse> =>
      baseApi.post("/account/signup/legacy/", body),
  })
}

/** Triggers an email with reset token   */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (body: { email: string }) =>
      baseApi.post("/account/organizer-forgot-password/", body),
  })
}

/** Reset password api request  */
export function useResetPassword() {
  return useMutation({
    mutationFn: (body: TResetPasswordPayload) => baseApi.post(`/account/og-reset-password/`, body),
  })
}

/** Verify email api request  */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (body: { email: string; otp: string }) =>
      baseApi.post("/account/verify-email/", body),
  })
}

/** Resend verification code api request  */
export function useResendVerificationCode() {
  return useMutation({
    mutationFn: (email: string) => baseApi.post("/account/resend-verification/", { email }),
  })
}

/** Fetch supported banks */
export function useGetSupportedBanks() {
  return useApiQuery({ url: "/inventory/banks/supported-banks/", key: "supportedBanks" })
}

/** resolve a bank account */
export function useResolveBankAccount() {
  return useMutation({
    mutationFn: (body: { account_number: string; bank_code: string }) =>
      baseApi.post("/inventory/banks/resolve-account/", body),
  })
}

/** create a bank account */
export function useAddBankAccount() {
  return useMutation({
    mutationFn: (body: { account_number: string; bank_name: string }) =>
      baseApi.post("/inventory/organizer-bank-details/", body),
  })
}
