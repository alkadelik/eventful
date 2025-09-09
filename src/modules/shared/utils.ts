import { TEvent } from "./types"

export const getEventStatus = (event: TEvent): "upcoming" | "ongoing" | "ended" => {
  const now = new Date()
  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)

  if (now < startDate) return "upcoming"

  if (now >= startDate && now <= endDate) return "ongoing"

  return "ended"
}
