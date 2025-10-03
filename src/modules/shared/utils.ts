import { TEvent } from "./types"

export const getEventStatus = (event: TEvent | null): "upcoming" | "ongoing" | "ended" => {
  if (!event) return "ended"

  const now = new Date()
  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)

  if (now < startDate) return "upcoming"

  if (now >= startDate && now <= endDate) return "ongoing"

  return "ended"
}

/** Check if discount code is expired */
export const checkCodeExpiry = (code: { expires_at: string | null }) => {
  if (!code.expires_at) return false
  const now = new Date()
  const expiryDate = new Date(code.expires_at)
  return now > expiryDate
}
