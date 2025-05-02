<template>
  <!-- Top breadcrumb row -->
  <v-row class="mb-0">
    <v-col cols="12" md="5" class="d-flex align-center pt-0 pb-0">
      <MediaplanBreadcrumb :mediaplan="mediaplan" :project="project"/>
    </v-col>
  </v-row>

  <!-- Main control bar -->
  <v-row class="mb-7" no-gutters align="center">
    <!-- Left side: Builder type & view toggle -->
    <v-col class="d-flex align-center">
      <MediaplanViewToggle
          v-model="internalView"
          class="ml-4"
      />
      <MediaplanBuilderTypeSwitch
          :builder-type="selectedBuilderType"
          @update:builderType="selectedBuilderType = $event"
      />
    </v-col>

    <!-- Right side: Header with budget and search -->
    <v-col class="d-flex justify-end pr-0">
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
import MediaplanBuilderTypeSwitch from '@/components/common/MediaplanBuilderTypeSwitch.vue'

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
  builderType: 'sea' | 'social' | 'display' | '2layer'
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:current-view', value: 'planning' | 'budget'): void
  (e: 'update:builderType', value: 'sea' | 'social' | 'display' | '2layer'): void
}>()

const {mediaplan, project, campaign, search, isLoading, currentView, builderType} = toRefs(props)

// Sync the internal view toggle with prop
const internalView = computed<'planning' | 'budget'>({
  get: () => currentView.value,
  set: val => emit('update:current-view', val),
})

// Sync builder type selection
const selectedBuilderType = computed<'sea' | 'social' | 'display' | '2layer'>({
  get: () => builderType.value,
  set: val => emit('update:builderType', val),
})

// Determine breadcrumb level
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