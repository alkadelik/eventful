import baseApi, { useApiQuery } from "@/composables/baseApi"
import type { MaybeRefOrGetter } from "vue"
import {
  DiscountCodePayload,
  EventDashboardStats,
  EventPayload,
  IExportPayload,
  TDiscountCode,
  TEvent,
  TEventResponse,
} from "./types"
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
    mutationFn: (body: EventPayload | FormData) => {
      if (body instanceof FormData) {
        return baseApi.post("/inventory/organizer/events/", body, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }
      return baseApi.post("/inventory/organizer/events/", body)
    },
  })
}

/** edit an event */
export function useUpdateEvent() {
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<EventPayload> | FormData }) => {
      if (body instanceof FormData) {
        return baseApi.patch(`/inventory/organizer/events/${id}/`, body, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }
      return baseApi.patch(`/inventory/organizer/events/${id}/`, body)
    },
  })
}

/** Fetch organizer event details by ID */
export function useGetOrganizerEventDetails(id: string) {
  return useApiQuery<TEvent>({
    url: `/inventory/organizer/events/${id}/details/`,
    key: `eventDetails_${id}`,
    refetchOnMount: "always",
  })
}

/** Fetch public organizer event details by ID */
export function useGetPublicOrganizerEventById(id: string) {
  return useApiQuery<TEvent>({
    url: `/inventory/public/events/${id}/`,
    key: `publicEventById_${id}`,
    selectData: true,
    refetchOnMount: "always",
  })
}

/** Fetch statistics of a particular event */
export function useGetSingleEventStatistics(id: string) {
  return useApiQuery<EventDashboardStats>({
    url: `/inventory/organizer/events/${id}/statistics/`,
    key: `eventSingleStats_${id}`,
    refetchOnMount: "always",
  })
}

/** Export registered vendors api request */
export function useExportRegVendors() {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IExportPayload }) =>
      baseApi.post(`/inventory/organizer/events/${id}/export/`, payload),
  })
}

/** create a discount code */
export function useCreateDiscountCode() {
  return useMutation({
    mutationFn: (body: DiscountCodePayload) =>
      baseApi.post("/inventory/organizer/discount-codes/", body),
  })
}

/** update a discount code */
export function useUpdateDiscountCode() {
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<DiscountCodePayload> }) =>
      baseApi.patch(`/inventory/organizer/discount-codes/${id}/`, body),
  })
}

/** Fetch discount codes for an event */
export function useGetOrganizerEventDiscountCodes(eventId: string, enabled = true) {
  return useApiQuery<TDiscountCode[]>({
    url: `/inventory/organizer/discount-codes/event/${eventId}/`,
    key: `eventDiscountCodes_${eventId}`,
    enabled,
    selectData: true,
  })
}

/** deactivate a discount code */
export function useDeactivateDiscountCode() {
  return useMutation({
    mutationFn: (id: number) =>
      baseApi.post(`/inventory/organizer/organizer/code-activation/`, { code: id }),
  })
}

/** delete a discount code */
export function useDeleteDiscountCode() {
  return useMutation({
    mutationFn: (id: number) => baseApi.delete(`/inventory/organizer/code-activation/${id}/`),
  })
}
