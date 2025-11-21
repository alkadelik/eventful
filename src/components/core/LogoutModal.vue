<template>
  <ConfirmationModal
    :open="open"
    variant="error"
    title="Logout"
    subtitle="Are you sure you want to logout? Any unsaved work will be lost. Make sure you've saved your progress before continuing."
    header-icon="signout"
    action-label="Logout"
    info-message="You will need to login again to access your account."
    :loading="false"
    @close="emit('close')"
    @confirm="onLogout"
  />
</template>

<script setup lang="ts">
import ConfirmationModal from "@components/ConfirmationModal.vue"
import { useAuthStore } from "@modules/auth/store"

defineProps({ open: Boolean })
const emit = defineEmits(["close"])
const { logout } = useAuthStore()

const onLogout = () => {
  logout()
  emit("close")
}
</script>
