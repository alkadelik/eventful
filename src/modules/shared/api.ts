import baseApi, { useApiQuery } from "@/composables/baseApi"
import type { MaybeRefOrGetter } from "vue"
import {
  DiscountCodePayload,
  EventDashboardStats,
  EventPayload,
  TDiscountCode,
  TEvent,
  TEventResponse,
} from "./types"
import { useMutation } from "@tanstack/vue-query"
import { isV2Api } from "@/utils/others"

/** Fetch user profile */
export function useGetProfile() {
  return useApiQuery({
    url: isV2Api ? "/accounts/profile" : "/account/user/basic-info/",
    key: "userProfile",
  })
}

/** Fetch organizer events */
export function useGetOrganizerEvents(
  params?: MaybeRefOrGetter<Record<string, string | number | boolean> | undefined>,
) {
  return useApiQuery<TEventResponse>({
    url: isV2Api ? "/eventful/organizer/events/" : "/inventory/organizer/events/",
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
    url: isV2Api ? "/eventful/events/" : "/inventory/organizer/public-events/",
    params,
    key: "organizerEventsPublic",
    // selectData: true,
  })
}

/** Fetch organizer events */
export function useGetOrganizerEventStats() {
  return useApiQuery<EventDashboardStats>({
    url: isV2Api
      ? "/eventful/organizer/events/statistics/"
      : "/inventory/organizer/events/statistics/",
    key: "eventStats",
    selectData: isV2Api,
  })
}

/** create an event */
export function useCreateEvent() {
  return useMutation({
    mutationFn: (body: EventPayload | FormData) => {
      if (body instanceof FormData) {
        return baseApi.post(
          isV2Api ? "/eventful/organizer/events/" : "/inventory/organizer/events/",
          body,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        )
      }
      return baseApi.post(
        isV2Api ? "/eventful/organizer/events/" : "/inventory/organizer/events/",
        body,
      )
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
      return baseApi.patch(
        isV2Api ? `/eventful/organizer/events/${id}/` : `/inventory/organizer/events/${id}/`,
        body,
      )
    },
  })
}

/** Fetch organizer event details by ID */
export function useGetOrganizerEventDetails(id: string) {
  return useApiQuery<TEvent>({
    url: isV2Api
      ? `/eventful/organizer/events/${id}/details/`
      : `/inventory/organizer/events/${id}/details/`,
    key: `eventDetails_${id}`,
    refetchOnMount: "always",
    selectData: isV2Api,
  })
}

/** Fetch public organizer event details by ID */
export function useGetPublicOrganizerEventById(id: string) {
  return useApiQuery<TEvent>({
    url: isV2Api ? `/eventful/events/${id}/` : `/inventory/public/events/${id}/`,
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
    mutationFn: (body: DiscountCodePayload) =>
      baseApi.post(isV2Api ? "/eventful/discounts/" : "/inventory/organizer/discount-codes/", body),
  })
}

/** update a discount code */
export function useUpdateDiscountCode() {
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: Partial<DiscountCodePayload> }) =>
      baseApi.patch(
        isV2Api ? `/eventful/discounts/${id}/` : `/inventory/organizer/discount-codes/${id}/`,
        body,
      ),
  })
}

/** Fetch discount codes for an event */
export function useGetOrganizerEventDiscountCodes(eventId: string, enabled = true) {
  return useApiQuery<TDiscountCode[]>({
    url: isV2Api
      ? `/eventful/discounts/?event=${eventId}`
      : `/inventory/organizer/discount-codes/event/${eventId}/`,
    key: `eventDiscountCodes_${eventId}`,
    enabled,
    selectData: true,
  })
}

/** deactivate a discount code */
export function useDeactivateDiscountCode() {
  return useMutation({
    mutationFn: (id: number | string) =>
      baseApi.post(
        isV2Api
          ? `/eventful/discounts/${id}/toggle_active/`
          : `/inventory/organizer/organizer/code-activation/`,
        isV2Api ? {} : { code: id },
      ),
  })
}

/** delete a discount code */
export function useDeleteDiscountCode() {
  return useMutation({
    mutationFn: (id: number | string) =>
      baseApi.delete(
        isV2Api ? `/eventful/discounts/${id}/` : `/inventory/organizer/code-activation/${id}/`,
      ),
  })
}
