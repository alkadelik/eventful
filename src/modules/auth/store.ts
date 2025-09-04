import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { IUser, IAuthTokens } from "./types"

export const useAuthStore = defineStore(
  "auth",
  () => {
    // State
    const user = ref<IUser | null>(null)
    const accessToken = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)
    const isLoading = ref<boolean>(false)

    // Getters
    const isAuthenticated = computed(() => Boolean(accessToken.value) && Boolean(user.value))

    // Actions
    const setAuthUser = (userData: IUser) => {
      user.value = userData
    }

    const updateAuthUser = (userData: Partial<IUser>) => {
      if (user.value) {
        user.value = { ...user.value, ...userData }
      }
    }

    const setTokens = (tokens: IAuthTokens) => {
      accessToken.value = tokens.access
      refreshToken.value = tokens.refresh
    }

    const clearAuth = () => {
      user.value = null
      accessToken.value = null
      refreshToken.value = null
    }

    const setLoading = (loading: boolean) => {
      isLoading.value = loading
    }

    const logout = () => {
      clearAuth()
      window.location.href = "/login"
    }

    return {
      // State
      user,
      accessToken,
      refreshToken,
      isLoading,

      // Getters
      isAuthenticated,

      // Actions
      setAuthUser,
      updateAuthUser,
      setTokens,
      clearAuth,
      setLoading,
      logout,
    }
  },
  {
    persist: {
      storage: localStorage,
      paths: ["user", "accessToken", "refreshToken"], // only persist these
    },
  },
)
