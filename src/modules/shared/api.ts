import baseApi, { useApiQuery } from "@/composables/baseApi"
import type { MaybeRefOrGetter } from "vue"
import { EventDashboardStats, EventPayload, TEvent, TEventResponse } from "./types"
import { useMutation } from "@tanstack/vue-query"

/** Fetch user profile */
export function useGetProfile() {
  return useApiQuery({ url: "/account/user/basic-info/", key: "userProfile" })
}

/** Fetch organizer events */
export function useGetOrganizerEvents(
  params?: MaybeRefOrGetter<Record<string, string | number | boolean> | undefined>,
) {
  return useApiQuery<TEventResponse>({
    url: "/inventory/organizer/events/",
    params,
    key: "organizerEvents",
    selectData: true,
  })
}

/** Fetch organizer events - public */
export function useGetOrganizerEventsPublic(
  params?: MaybeRefOrGetter<Record<string, string | number | boolean> | undefined>,
) {
  return useApiQuery<TEvent[]>({
    url: "/inventory/organizer/public-events/",
    params,
    key: "organizerEventsPublic",
    // selectData: true,
  })
}

/** Fetch organizer events */
export function useGetOrganizerEventStats() {
  return useApiQuery<EventDashboardStats>({
    url: "/inventory/organizer/events/statistics/",
    key: "eventStats",
  })
}

/** create an event */
export function useCreateEvent() {
  return useMutation({
    mutationFn: (body: EventPayload) => baseApi.post("/inventory/organizer/events/", body),
  })
}

/** edit an event */
export function useUpdateEvent() {
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<EventPayload> }) =>
      baseApi.patch(`/inventory/organizer/events/${id}/`, body),
  })
}

/** Fetch organizer event details by ID */
export function useGetOrganizerEventDetails(id: string) {
  return useApiQuery<TEvent>({
    url: `/inventory/organizer/events/${id}/details/`,
    key: "eventDetails",
  })
}

/** Fetch public organizer event details by ID */
export function useGetPublicOrganizerEventById(id: string) {
  return useApiQuery<TEvent>({
    url: `/inventory/public/events/${id}/`,
    key: "publicEventById",
    selectData: true,
  })
}

/** Fetch statistics of a particular event */
export function useGetSingleEventStatistics(id: string) {
  return useApiQuery<EventDashboardStats>({
    url: `/inventory/organizer/events/${id}/statistics/`,
    key: "eventSingleStats",
  })
}
