export interface IUser {
  id?: number
  avatar_url?: string | null
  first_name: string
  last_name: string
  email?: string
  email_confirmed: boolean
  phone?: string | null
  company_name?: string | null
}

export interface IAuthTokens {
  accessToken: string
  refreshToken: string
}

export type TLoginPayload = { email: string; password: string }

export interface ILoginResponse {
  data: {
    access: string
    refresh: string
    avatar_url?: string | null
    first_name: string
    last_name: string
    email_confirmed: boolean
  }
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
