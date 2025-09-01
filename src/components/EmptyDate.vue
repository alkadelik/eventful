<template>
  <EmptyState
    icon="box"
    title="You don't have any event yet"
    description="Once you create an event, you'll see all your attendee stats, ticket sales, and engagement updates right here."
    action-label="Create Event"
    action-icon="add"
    action-variant="outlined"
    @action="$emit('createEvent')"
  />
</template>

<script setup lang="ts">
import EmptyState from "./EmptyState.vue"

/**
 * Events emitted by the EmptyDate component
 */
interface Emits {
  /** Emitted when the create event action is triggered */
  (e: "createEvent"): void
}

// Define emits
defineEmits<Emits>()
</script>
