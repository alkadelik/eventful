import baseApi, { TApiPromise, useApiQuery } from "@/composables/baseApi"
import { useMutation } from "@tanstack/vue-query"
import {
  ILoginResponse,
  ISignupResponse,
  TLoginPayload,
  TResetPasswordPayload,
  TSignupPayload,
} from "./types"
import { isV2Api } from "@/utils/others"

/** Login api request  */
export function useLogin() {
  return useMutation({
    mutationFn: (body: TLoginPayload): TApiPromise<ILoginResponse> =>
      baseApi.post(isV2Api ? "/accounts/auth/organizers/" : "/account/auth/organizer/login/", body),
  })
}

/** Register api request  */
export function useRegister() {
  return useMutation({
    mutationFn: (body: TSignupPayload): TApiPromise<ISignupResponse> =>
      baseApi.post(isV2Api ? "/accounts/signup/organizers/" : "/account/signup/legacy/", body),
  })
}

/** Triggers an email with reset token   */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (body: { email: string }) =>
      baseApi.post(
        isV2Api ? "/accounts/auth/password/request-token" : "/account/organizer-forgot-password/",
        body,
      ),
  })
}

/** Reset password api request  */
export function useResetPassword() {
  return useMutation({
    mutationFn: (body: TResetPasswordPayload) =>
      baseApi.post(
        isV2Api
          ? `/accounts/auth/password/${body.otp}/reset/`
          : "/account/organizer-reset-password/",
        isV2Api ? { password: body.new_password } : body,
      ),
  })
}

/** Verify email api request  */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (body: { email: string; otp: string }) =>
      baseApi.post(
        isV2Api ? "/accounts/verifications/email/" : "/account/verify-email/",
        isV2Api ? { token: body.otp } : body,
      ),
  })
}

/** Resend verification code api request  */
export function useResendVerificationCode() {
  return useMutation({
    mutationFn: (email: string) =>
      baseApi.post(
        isV2Api ? "/accounts/verification/resend-email-token/" : "/account/resend-verification/",
        { email },
      ),
  })
}

/** Fetch supported banks */
export function useGetSupportedBanks() {
  return useApiQuery({
    url: isV2Api ? "/billings/banks/" : "/inventory/banks/supported-banks/",
    key: "supportedBanks",
  })
}

/** resolve a bank account */
export function useResolveBankAccount() {
  return useMutation({
    mutationFn: (body: { account_number: string; bank_code: string }) =>
      baseApi.post(
        isV2Api ? "/billings/account-verification/verify/" : "/inventory/banks/resolve-account/",
        body,
      ),
  })
}

/** create a bank account */
export function useAddBankAccount() {
  return useMutation({
    mutationFn: (body: { account_number: string; bank_name: string }) =>
      baseApi.post(isV2Api ? "/billings/settlements/" : "/inventory/organizer-bank-details/", body),
  })
}
