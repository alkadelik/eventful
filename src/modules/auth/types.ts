export interface IUser {
  id: number
  account_id: number
  avatar_url?: string | null
  first_name: string
  last_name: string
  email: string
  email_confirmed?: boolean
  is_email_verified?: boolean
  phone?: string | null
  company_name?: string | null
  has_payment_account?: boolean
}

export interface IAuthTokens {
  access: string
  refresh: string
}

export type TLoginPayload = { email: string; password: string }

export interface ILoginResponse {
  data: IUser & IAuthTokens
}

export interface ISignupResponse {
  data: IUser & IAuthTokens
}

export type TSignupPayload = {
  first_name: string
  last_name: string
  email: string
  password: string
  confirm_password: string
  company_name?: string
  phone?: string
  is_organizer: boolean
}

export type TResetPasswordPayload = {
  new_password: string
  confirm_password: string
  otp: string
}
