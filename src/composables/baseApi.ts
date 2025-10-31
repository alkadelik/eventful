import { formatError } from "@/utils/error-handler"
import { useAuthStore } from "@modules/auth/store"
import { useQuery } from "@tanstack/vue-query"
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { toast } from "./useToast"
import { toValue, MaybeRefOrGetter } from "vue"
import { isV2Api } from "@/utils/others"

const isLocalhost =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"

const localApiURL = isV2Api ? "https://bpi.leyyow.com/api/v2" : "https://legacy-staging.leyyow.com"

const apiUrl = import.meta.env.VITE_API_URL as string

const baseURL = isLocalhost ? localApiURL : apiUrl.includes("legacy") ? apiUrl : apiUrl + "/api/v2"

const baseApi = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
})

baseApi.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

const refreshToken = async (): Promise<string> => {
  const { refreshToken, setTokens } = useAuthStore()
  const response = await baseApi.post(
    isV2Api ? "/token/refresh/" : "/auth/refresh/",
    isV2Api ? { refresh: refreshToken } : { refreshToken },
    { baseURL: isV2Api ? apiUrl : undefined },
  )
  const { access, refresh } = isV2Api
    ? response.data.data
    : (response.data as { access: string; refresh: string })
  setTokens({ access, refresh })
  return access
}

baseApi.interceptors.response.use(
  // If the request is successful, just return the response
  (response) => response,
  // If the request fails, handle the error
  async (error: AxiosError) => {
    // Add a custom property to the config type to track retries
    interface CustomRequestConfig extends InternalAxiosRequestConfig {
      _retry?: boolean
    }
    const originalRequest = error.config as CustomRequestConfig

    const errorMsg = formatError(error)

    // Check if the error is a 401 and we haven't already retried this request
    if (
      error.response?.status === 401 &&
      errorMsg.includes("token not valid") &&
      !originalRequest._retry
    ) {
      console.log("Access token expired. Attempting to refresh...")
      // Mark this request as retried to prevent infinite loops
      originalRequest._retry = true

      try {
        const newAccessToken = await refreshToken()
        // Update the header with the new token and retry the request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return baseApi(originalRequest)
      } catch (refreshError) {
        // If refresh fails, perform a logout or redirect
        toast.error("Session expired. Please log in again.")
        useAuthStore().logout()
        // redirect to login page with the current path as redirect query
        const redirectPath = window.location.pathname + window.location.search
        window.location.href = `/login?redirect=${encodeURIComponent(redirectPath)}`
        return Promise.reject(refreshError as Error)
      }
    }

    // For all other errors, just return the error
    return Promise.reject(error)
  },
)

export type TQueryArg = {
  url: string
  params?: MaybeRefOrGetter<Record<string, string | number | boolean> | undefined>
  enabled?: boolean
  key: string
  selectData?: boolean
  refetchOnMount?: true | false | "always"
}
export const useApiQuery = <T>({
  url,
  params,
  enabled,
  key,
  selectData,
  refetchOnMount,
}: TQueryArg) => {
  return useQuery<T>({
    queryKey: [key, params],
    queryFn: async () => {
      // Use toValue to handle both reactive and non-reactive values
      const paramValue = toValue(params)
      const { data } = await baseApi.get<T>(url, paramValue ? { params: paramValue } : {})
      return data
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount,
    enabled,
    select: selectData
      ? (response: T) => {
          if (response && typeof response === "object" && "data" in response) {
            return (response as Record<string, unknown>).data as T
          }
          return response
        }
      : undefined,
  })
}

export type TApiPromise<T> = Promise<AxiosResponse<T>>

export default baseApi
