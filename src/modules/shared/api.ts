import { useApiQuery } from "@/composables/baseApi"
import type { MaybeRefOrGetter } from "vue"

/** Fetch organizer events */
export function useGetOrganizerEvents(
  params?: MaybeRefOrGetter<Record<string, string | number | boolean> | undefined>,
) {
  return useApiQuery({ url: "/inventory/organizer/events/", params })
}

/** Fetch organizer events */
export function useGetOrganizerEventStats() {
  return useApiQuery({ url: "/inventory/organizer/events/" })
}
