<template>
  <div>
    <SectionHeader size="lg" :title="`Welcome, ${getFullName(user as TNameObj)}`" />

    <DataTable
      title="Recent Events"
      :data="EVENTS"
      :columns="EVENT_COLUMN"
      :loading="false"
      :show-pagination="false"
    >
      <template #cell:status="{ value }">
        <Chip
          showDot
          :label="String(value)"
          :color="value === 'Active' ? 'success' : 'error'"
          variant="outlined"
        />
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { getFullName, TNameObj } from "@/utils/format-strings"
import DataTable from "@components/DataTable.vue"
import SectionHeader from "@components/SectionHeader.vue"
import { useAuthStore } from "@modules/auth/store"
import { EVENT_COLUMN, EVENTS } from "../constants"

const { user } = useAuthStore()
</script>
