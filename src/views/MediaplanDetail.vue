<template>
  <MainLayout>
    <div class="mediaplan-detail">
      <v-alert v-if="errorMediaplan" type="error" density="compact" class="mb-4" closable>
        {{ errorMediaplan }}
      </v-alert>

      <div v-if="isLoadingMediaplan && !mediaplan" class="text-center my-10">
        <v-progress-circular indeterminate color="primary" size="40"/>
        <p class="mt-2 text-disabled">Loading Mediaplan...</p>
      </div>

      <template v-if="!isLoadingMediaplan && mediaplan">
        <MediaplanTopSection
            :mediaplan="mediaplan"
            :project="null"
            :search="search"
            :is-loading="isLoadingMediaplan"
            :current-view="currentView"
            :builder-type="'display'"
            @update:search="updateSearch"
            @update:current-view="val => currentView = val"
        />

        <div class="main-content">
          <MediaplanPlanningView
              v-if="currentView === 'planning'"
              type="multi"
              :projects="projects"
              :total-projects="totalProjects"
              :is-loading="isLoadingProjects"
              :current-page="projectCurrentPage"
              :items-per-page="projectItemsPerPage"
              :mediaplan-id="mediaplanIdRef"
              @update:options="handleProjectOptionsUpdate"
              @add-project="openCreateProjectDialog"
          />

          <MediaplanBudgetView v-else :mediaplan="mediaplan"/>

          <v-alert
              v-if="projectError && currentView === 'planning'"
              type="error"
              density="compact"
              class="mt-4"
              closable
          >
            Failed to load projects: {{ projectError }}
          </v-alert>
        </div>
      </template>

      <template v-else-if="!isLoadingMediaplan && !mediaplan && errorMediaplan">
        <div class="text-center my-10 text-disabled">
          <v-icon size="x-large" class="mb-2">mdi-alert-circle-outline</v-icon>
          <p>Could not load Mediaplan data.</p>
        </div>
      </template>

      <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn icon @click="snackbar.show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, reactive, watch} from 'vue'
import {useRoute} from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'
import MediaplanPlanningView from '@/components/mediaplan/MediaplanPlanningViewDatatable.vue'
import MediaplanBudgetView from '@/components/mediaplan/MediaplanBudgetView.vue'
import {useMediaplanStore} from '@/stores/mediaplanStore'
import {useProjectStore} from '@/stores/projectStore'
import type {Mediaplan} from '@/types/mediaplan'
import type {Project} from '@/types/project'
import MediaplanTopSection from "@/components/common/MediaplanTopSection.vue";

// --- Props & Route ---
const props = defineProps<{ mediaplanId?: string }>()
const route = useRoute()
const mediaplanIdRef = ref(props.mediaplanId || (route.params.id as string))

// --- Stores ---
const mediaplanStore = useMediaplanStore()
const projectStore = useProjectStore()

// --- Computed Properties ---
const mediaplan = computed<Mediaplan | null>(() => mediaplanStore.selectedMediaplan)
const isLoadingMediaplan = computed(() => mediaplanStore.isLoading)
const errorMediaplan = computed(() => mediaplanStore.error)

const projects = computed<Project[]>(() => projectStore.projects)
const totalProjects = computed(() => projectStore.totalItems)
const isLoadingProjects = computed(() => projectStore.isLoading)
const projectError = computed(() => projectStore.error)
const projectCurrentPage = computed(() => projectStore.currentPage)
const projectItemsPerPage = computed(() => projectStore.perPage)

// --- UI State ---
const currentView = ref<'planning' | 'budget'>('planning')
const search = ref('')

// --- Snackbar ---
const snackbar = reactive({show: false, text: '', color: 'success'})

// --- Methods ---
const handleProjectOptionsUpdate = (options: {
  page: number
  itemsPerPage: number
  sortBy?: any[]
  sortDesc?: boolean[]
}) => {
  const newPage = options.page - 1
  if (newPage !== projectCurrentPage.value) {
    projectStore.currentPage = newPage
    projectStore.fetchProjects(mediaplanIdRef.value)
  }
  if (options.itemsPerPage !== projectItemsPerPage.value) {
    projectStore.perPage = options.itemsPerPage
    projectStore.currentPage = 0
    projectStore.fetchProjects(mediaplanIdRef.value)
  }
}

const openCreateProjectDialog = () => {
  console.log('Trigger create project for Mediaplan ID:', mediaplanIdRef.value)
  // router.push or dialog logic here
}

const updateSearch = (val: string) => {
  search.value = val
  // ggf. Filter-Logik hier
}

const showSnackbar = (text: string, color: 'success' | 'error' | 'info' = 'success') => {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}

// --- Lifecycle ---
onMounted(() => {
  if (!mediaplanIdRef.value) {
    mediaplanStore.error = 'No mediaplan ID provided'
    return
  }
  mediaplanStore.fetchMediaplan(mediaplanIdRef.value)
  projectStore.fetchProjects(mediaplanIdRef.value)
})

// --- Watchers ---
watch(() => route.params.id, (newId) => {
  if (typeof newId === 'string' && newId !== mediaplanIdRef.value) {
    mediaplanIdRef.value = newId
    mediaplanStore.fetchMediaplan(newId)
    projectStore.fetchProjects(newId)
  }
})

watch(errorMediaplan, (err) => err && showSnackbar(`Error loading mediaplan: ${err}`, 'error'))
watch(projectError, (err) => err && showSnackbar(`Error loading projects: ${err}`, 'error'))
</script>

<style scoped>
.mediaplan-detail {
  min-height: calc(100vh - 64px);
}

.main-content {
  min-height: 60vh;
}
</style>