export type TEvent = {
  id: number
  uid?: string
  event_name: string
  name?: string
  event_slug: string
  start_date: string
  end_date: string
  event_fee: number
  participant_fee?: number
  description: string
  location: string
  capacity: string
  revenue?: number
  eventInstructions?: string
  event_instructions?: string
  termsAndConditions?: string
  terms_and_conditions?: string
  registered_merchants?: TVendor[]
  registration_stats?: {
    total_registered: number
  }
  registration_count?: number
}

export type TEventResponse = {
  results: TEvent[]
  count: number
  next: string | null
  previous: string | null
}

export type TVendor = {
  id: number
  name: string
  email: string
  phone?: string
  code: string
  amount_paid: number
}

export type TDiscountCode = {
  id: number
  uid?: string
  code: string
  event: number
  amount: number
  discount_value?: number
  max_uses: number
  used_count?: number
  usage_limit?: number
  usage_count: number
  expires_at: string
  valid_from?: string
  valid_until?: string
  status: "active" | "inactive" | "expired"
  is_active: boolean
}

// Paginated response for discount codes (v2 API)
export type TDiscountCodeResponse = {
  results: TDiscountCode[]
  count: number
  next: string | null
  previous: string | null
}

export interface EventDashboardStats {
  events: {
    total: number
    active: number
    upcoming: number
    past: number
  }
  registrations: {
    total: number
    successful: number
    pending: number
    failed: number
  }
  revenue: {
    total: string
    total_orders: number
    total_customers: number
  }
}

export interface EventPayload {
  organizer: number | string
  event_name: string
  location: string
  description: string
  capacity: string
  start_date: string
  end_date: string
  event_fee: number
  eventInstructions?: string
  event_flier?: File
  terms_and_conditions?: File
}

export interface IExportPayload {
  export_fields: string[]
  period: string
  activity: string
  start_date?: string
  end_date?: string
}

export interface DiscountCodePayload {
  event: number
  code: string
  amount: number
  max_uses: number
  per_user_limit?: number
  expires_at?: string
}
