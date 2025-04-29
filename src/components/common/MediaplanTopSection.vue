<template>
  <!-- Wrapper with native tooltip showing the current level on hover -->
  <v-row class="mb-0">
    <v-col cols="12" md="5" class="d-flex align-center pt-0 pb-0">
      <MediaplanBreadcrumb :mediaplan="mediaplan" :project="project"/>
    </v-col>

  </v-row>

  <v-row class="mb-7" no-gutters>
    <v-col>
      <MediaplanViewToggle v-model="internalView"/>
    </v-col>
    <v-col class="d-flex pr-0">
      <v-spacer></v-spacer>
      <MediaplanHeader
          :plan-budget="mediaplan?.budget?.total || 0"
          :used-percentage="calculatePercentage(mediaplan?.budget?.used, mediaplan?.budget?.total)"
          :search="search"
          @update:search="val => emit('update:search', val)"
          :is-loading="isLoading"
      />
    </v-col>
  </v-row>

</template>

<script setup lang="ts">
import {toRefs, computed} from 'vue'
import MediaplanBreadcrumb from '@/components/mediaplan/MediaplanBreadcrumb.vue'
import MediaplanHeader from '@/components/mediaplan/MediaplanHeader.vue'
import MediaplanViewToggle from '@/components/mediaplan/MediaplanViewToggle.vue'
import type {Mediaplan} from '@/types/mediaplan'
import type {Project} from '@/types/project'
import type {Campaign} from '@/types/campaign'

const props = defineProps<{
  mediaplan: Mediaplan | null
  project: Project | null
  campaign?: Campaign | null
  search: string
  isLoading: boolean
  currentView: 'planning' | 'budget'
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:current-view', value: 'planning' | 'budget'): void
}>()

const {mediaplan, project, campaign, search, isLoading, currentView} = toRefs(props)

// Internal binding for the view toggle
const internalView = computed<'planning' | 'budget'>({
  get: () => currentView.value,
  set: val => emit('update:current-view', val),
})

// Determine which level we’re in
const levelDisplay = computed(() => {
  if (campaign?.value) return 'Campaign'
  if (project.value) return 'Project'
  return 'Mediaplan'
})

function calculatePercentage(used: number | undefined, total: number | undefined): number {
  if (!used || !total) return 0
  return (used / total) * 100
}
</script>

<style scoped>
/* Optional: eigene Styles hier hinzufügen */
</style>