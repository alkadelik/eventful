export interface IUser {
  avatar_url?: string | null
  first_name: string
  last_name: string
  email?: string
  is_email_verified: boolean
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
    is_email_verified: boolean
  }
}

export type TSignupPayload = {
  first_name: string
  last_name: string
  email: string
  password: string
  confirm_password: string
}

export type TResetPasswordPayload = {
  new_password: string
  confirm_password: string
  otp: string
}
