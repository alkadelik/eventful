export type TEvent = {
  id: number
  event_name: string
  event_slug: string
  start_date: string
  end_date: string
  participant_fee: number
  description: string
  location: string
  capacity: string
  is_free: boolean
  eventInstructions?: string
  termsAndConditions?: string
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
  participant_fee: number
}
