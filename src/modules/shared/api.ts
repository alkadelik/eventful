import baseApi, { useApiQuery } from "@/composables/baseApi"
import type { MaybeRefOrGetter } from "vue"
import {
  DiscountCodePayload,
  EventDashboardStats,
  EventPayload,
  TDiscountCode,
  TDiscountCodeResponse,
  TEvent,
  TEventResponse,
} from "./types"
import { useMutation } from "@tanstack/vue-query"

/** Fetch user profile */
export function useGetProfile() {
  return useApiQuery({
    url: "/accounts/profile",
    key: "userProfile",
    selectData: true,
  })
}

/** Fetch organizer events */
export function useGetOrganizerEvents(
  params?: MaybeRefOrGetter<Record<string, string | number | boolean> | undefined>,
) {
  return useApiQuery<TEventResponse>({
    url: "/eventful/organizer/events/",
    params,
    key: "organizerEvents",
    selectData: true,
  })
}

/** Fetch organizer events - public */
export function useGetOrganizerEventsPublic(
  params?: MaybeRefOrGetter<Record<string, string | number | boolean> | undefined>,
) {
  return useApiQuery<TEventResponse>({
    url: "/eventful/events/",
    params,
    key: "organizerEventsPublic",
    selectData: true,
  })
}

/** Fetch organizer events */
export function useGetOrganizerEventStats() {
  return useApiQuery<EventDashboardStats>({
    url: "/eventful/organizer/events/statistics/",
    key: "eventStats",
    selectData: true,
  })
}

/** create an event */
export function useCreateEvent() {
  return useMutation({
    mutationFn: (body: EventPayload | FormData) => {
      return baseApi.post(
        "/eventful/organizer/events/",
        body,
        body instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {},
      )
    },
  })
}

/** edit an event */
export function useUpdateEvent() {
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<EventPayload> | FormData }) => {
      return baseApi.patch(
        `/eventful/organizer/events/${id}/`,
        body,
        body instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {},
      )
    },
  })
}

/** Fetch organizer event details by ID */
export function useGetOrganizerEventDetails(id: string) {
  return useApiQuery<TEvent>({
    url: `/eventful/organizer/events/${id}/details/`,
    key: `eventDetails_${id}`,
    refetchOnMount: "always",
    selectData: true,
  })
}

/** Fetch public organizer event details by ID */
export function useGetPublicOrganizerEventById(id: string) {
  return useApiQuery<TEvent>({
    url: `/eventful/events/${id}/`,
    key: `publicEventById_${id}`,
    selectData: true,
    refetchOnMount: "always",
  })
}

/** Export registered vendors api request */
export function useExportRegVendors() {
  return useMutation({
    mutationFn: (id: string) => baseApi.get(`/organizer/events/${id}/download_emails/`),
  })
}

/** create a discount code */
export function useCreateDiscountCode() {
  return useMutation({
    mutationFn: (body: DiscountCodePayload) => baseApi.post("/eventful/discounts/", body),
  })
}

/** update a discount code */
export function useUpdateDiscountCode() {
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: Partial<DiscountCodePayload> }) =>
      baseApi.patch(`/eventful/discounts/${id}/`, body),
  })
}

/** Fetch discount codes for an event */
export function useGetOrganizerEventDiscountCodes(eventId: string, enabled = true) {
  // V2 returns paginated discount codes, legacy returns plain array
  return useApiQuery<TDiscountCodeResponse | TDiscountCode[]>({
    url: `/eventful/discounts/?event=${eventId}`,
    key: `eventDiscountCodes_${eventId}`,
    enabled,
    selectData: true,
  })
}

/** deactivate a discount code */
export function useDeactivateDiscountCode() {
  return useMutation({
    mutationFn: (id: number | string) =>
      baseApi.post(`/eventful/discounts/${id}/toggle_active/`, {}),
  })
}

/** delete a discount code */
export function useDeleteDiscountCode() {
  return useMutation({
    mutationFn: (id: number | string) => baseApi.delete(`/eventful/discounts/${id}/`),
  })
}
