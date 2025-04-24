<script setup lang="ts">
import { computed } from 'vue'
import CountryFlag from '@/components/common/CountryFlag.vue'
import { getBrandLogo } from '@/helpers/brandUtils'
import type { Project } from '@/types/project'
import { projectHeaders } from '@/constants/project.ts'

const props = defineProps<{ project: Project }>()
const items = computed(() => props.project ? [props.project] : [])
</script>

<template>
  <v-card class="projects-table elevation-0" variant="flat">
    <v-theme-provider theme="dark">
      <v-data-table
          :headers="projectHeaders"
          :items="items"
          class="projects-data-table project-detail-table"
          hide-default-footer
          hide-default-header
          item-value="_id"
          density="compact"
      >
        <template #item.abbreviation="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" class="mr-2 grey lighten-4" :image="getBrandLogo(item.descriptive_vars?.brand)" />
            <span>{{ item.abbreviation }}</span>
          </div>
        </template>

        <template #item.descriptive_vars.country="{ item }">
          <div class="d-flex align-center" v-if="item.descriptive_vars?.country">
            <CountryFlag size="1rem" :country="item.descriptive_vars.country" class="mr-2" />
            <span>{{ item.descriptive_vars.country }}</span>
          </div>
        </template>

        <template #item.duration.formatted="{ item }">
          <div class="d-flex align-center" v-if="item.duration?.formatted">
            <v-icon size="small" class="mr-2">mdi-calendar-range</v-icon>
            <span>{{ item.duration.formatted }}</span>
          </div>
        </template>

        <template #item.detail="{ item }">
          <span class="d-inline-block text-truncate" style="max-width: 150px;">{{ item.detail || 'N/A' }}</span>
          <v-tooltip v-if="item.detail && item.detail.length > 30" activator="parent" location="top">
            {{ item.detail }}
          </v-tooltip>
        </template>

        <template #item.default_vars.campaigntype="{ item }">
          {{ item.default_vars?.campaigntype || 'N/A' }}
        </template>

        <template #item.default_vars.subsegment="{ item }">
          {{ item.default_vars?.subsegment || 'N/A' }}
        </template>

        <template #item.is_locked="{ item }">
          <v-icon :color="item.is_locked ? 'orange' : 'grey-lighten-1'">
            {{ item.is_locked ? 'mdi-lock' : 'mdi-lock-open-variant' }}
          </v-icon>
          <v-tooltip activator="parent" location="top">{{ item.is_locked ? 'Locked' : 'Unlocked' }}</v-tooltip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-menu>
            <template v-slot:activator="{ props: menuProps }">
              <v-btn icon="mdi-dots-vertical" variant="text" density="comfortable" v-bind="menuProps"></v-btn>
            </template>
            <v-list density="compact">
              <v-list-item @click.stop="editProject(item)">
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
              <v-list-item @click.stop="() => console.log('Delete Project:', item._id)" class="text-error">
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-theme-provider>
  </v-card>
</template>

<style scoped>
/* Increase vertical spacing in the row */
::v-deep(.project-detail-table .v-data-table__td) {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}
</style>