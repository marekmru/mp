<script setup lang="ts">
import {ref, computed, onMounted, reactive, watch} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import MediaplanBreadcrumb from '@/components/mediaplan/MediaplanBreadcrumb.vue';
// import ProjectToolbar from '@/components/project/ProjectToolbar.vue';
import MediaplanHeader from '@/components/mediaplan/MediaplanHeader.vue';
import MediaplanViewToggle from '@/components/mediaplan/MediaplanViewToggle.vue';
import CampaignListView from '@/components/project/CampaignListView.vue';
import MediaplanBudgetView from '@/components/mediaplan/MediaplanBudgetView.vue';
import {useMediaplanStore} from '@/stores/mediaplanStore';
import {useProjectStore} from '@/stores/projectStore';
import {useCampaignStore} from '@/stores/campaignStore';
import type {Project} from '@/types/project';
import {formatDateRange} from '@/helpers/dateUtils';
import {calculatePercentage} from '@/helpers/currencyUtils';
import MediaplanTopSection from "@/components/common/MediaplanTopSection.vue";
import ProjectDetailTable from "@/components/project/ProjectDetailTable.vue";
import MediaplanPlanningViewDatatable from "@/components/mediaplan/MediaplanPlanningViewDatatable.vue"; // Pfad prüfen

// --- Props & Route ---
const props = defineProps<{ mediaplanId?: string; projectId?: string; }>();
const route = useRoute();
const router = useRouter();
const currentMediaplanId = ref(props.mediaplanId || route.params.mediaplanId as string);
const currentProjectId = ref(props.projectId || route.params.projectId as string);

// --- Stores ---
const mediaplanStore = useMediaplanStore();
const projectStore = useProjectStore();
const campaignStore = useCampaignStore();

// --- Computed Properties ---
const parentMediaplan = computed(() => mediaplanStore.selectedMediaplan);
const project = computed(() => {
  return projectStore.selectedProject ? [projectStore.selectedProject] : []
});
const isLoadingProject = computed(() => projectStore.isLoading);
const errorProject = computed(() => projectStore.error);
const campaigns = computed(() => campaignStore.campaigns);
const totalCampaigns = computed(() => campaignStore.totalItems);
const isLoadingCampaigns = computed(() => campaignStore.isLoading);
const errorCampaigns = computed(() => campaignStore.error);
const campaignCurrentPage = computed(() => campaignStore.currentPage);
const campaignItemsPerPage = computed(() => campaignStore.perPage);

// --- UI State ---
// currentView wird jetzt für den MediaplanViewToggle benötigt
const currentView = ref<string>('planning'); // 'planning' or 'budget'
const search = ref<string>('');

// --- Snackbar ---
const snackbar = reactive({show: false, text: '', color: 'success'});

// --- Methods ---
const handleCampaignOptionsUpdate = (options: { /* ... */ page: number; itemsPerPage: number; }) => {
  const newZeroBasedPage = options.page - 1;
  let needsReload = false;
  if (newZeroBasedPage !== campaignCurrentPage.value) {
    campaignStore.currentPage = newZeroBasedPage;
    needsReload = true;
  }
  if (options.itemsPerPage !== campaignItemsPerPage.value) {
    campaignStore.perPage = options.itemsPerPage;
    if (campaignStore.currentPage !== 0) campaignStore.currentPage = 0;
    needsReload = true;
  }
  if (needsReload && currentMediaplanId.value && currentProjectId.value) {
    campaignStore.fetchCampaigns(currentMediaplanId.value, currentProjectId.value);
  }
};

const openCreateCampaignDialog = () => { /* ... */
  console.log('Trigger create campaign');
};
const showSnackbar = (text: string, color: 'success' | 'error' | 'info' = 'success') => { /* ... */
  snackbar.text = text;
  snackbar.color = color;
  snackbar.show = true;
};

// Handler für das @update:search Event von MediaplanHeader
const updateSearchHandler = (value: string | null) => {
  search.value = value || '';
  // Hier Logik zum Filtern der Kampagnen basierend auf 'search.value' hinzufügen, falls gewünscht
  // z.B. campaignStore.setFilter('search', search.value); campaignStore.fetchCampaigns(...)
};


// --- Lifecycle Hooks ---
onMounted(() => {
  if (!currentMediaplanId.value || !currentProjectId.value) {
    console.error('Missing ID(s) for Project Detail view');
    errorProject.value = 'Missing Mediaplan or Project ID.'; // Set error directly or via store
    return;
  }
  projectStore.fetchProject(currentMediaplanId.value, currentProjectId.value);
  campaignStore.fetchCampaigns(currentMediaplanId.value, currentProjectId.value);
  // Lade den Parent-Mediaplan nur, wenn er noch nicht geladen ist oder ein anderer ist
  if (!parentMediaplan.value || parentMediaplan.value._id !== currentMediaplanId.value) {
    mediaplanStore.fetchMediaplan(currentMediaplanId.value);
  }
});

// --- Watchers ---
// Beobachte Routenänderungen, um Daten neu zu laden
watch(() => [route.params.mediaplanId, route.params.projectId], ([newMpId, newPId]) => {
  let needsReload = false;
  if (newMpId && typeof newMpId === 'string' && newMpId !== currentMediaplanId.value) {
    currentMediaplanId.value = newMpId;
    needsReload = true;
  }
  if (newPId && typeof newPId === 'string' && newPId !== currentProjectId.value) {
    currentProjectId.value = newPId;
    needsReload = true;
  }
  if (needsReload && currentMediaplanId.value && currentProjectId.value) {
    mediaplanStore.fetchMediaplan(currentMediaplanId.value);
    projectStore.fetchProject(currentMediaplanId.value, currentProjectId.value);
    campaignStore.fetchCampaigns(currentMediaplanId.value, currentProjectId.value);
  }
}, {deep: true});

watch(errorProject, (newError) => {
  if (newError) showSnackbar(`Error loading project: ${newError}`, 'error');
});
watch(errorCampaigns, (newError) => {
  if (newError) showSnackbar(`Error loading campaigns: ${newError}`, 'error');
});

// Optional: Watch search changes for immediate filtering
// watch(search, (newValue) => { ... });
</script>

<template>
  <MainLayout>
    <div class="project-detail">
      <v-alert v-if="errorProject && !isLoadingProject" type="error" density="compact" class="mb-4" closable>
        Error loading project details: {{ errorProject }}
      </v-alert>
      <div v-if="isLoadingProject && !project" class="text-center my-10">
        <v-progress-circular indeterminate color="primary" size="40"></v-progress-circular>
        <p class="mt-2 text-disabled">Loading Project...</p>
      </div>

      <template v-if="!isLoadingProject && project">
        <MediaplanTopSection
            :mediaplan="parentMediaplan"
            :project="project"
            :search="search"
            :is-loading="isLoadingProject || mediaplanStore.isLoading"
            :current-view="currentView"
            @update:search="updateSearchHandler"
            @update:current-view="val => currentView = val"
        >
          <template #campaign-type-select>
            <!-- TODO v-select - select campaigntyppe -->
          </template>
        </MediaplanTopSection>

        <!--        <ProjectDetailTable :project="project"
                                    class="pb-3"/>-->


        <MediaplanPlanningViewDatatable
            :projects="project"
            :is-loading="isLoadingProject"
            :mediaplan-id="route.params.mediaplanId"
            :current-page="0"
            :total-projects="1"
            :items-per-page="1"
            type="single"
            class="pb-3"
        />

        <template v-if="project">
          <div class="main-content">
            <CampaignListView
                v-if="currentView === 'planning'"
                :campaigns="campaigns"
                :total-campaigns="totalCampaigns"
                :is-loading="isLoadingCampaigns"
                :current-page="campaignCurrentPage"
                :items-per-page="campaignItemsPerPage"
                @update:options="handleCampaignOptionsUpdate"
                @add-campaign="openCreateCampaignDialog"
            />
            <MediaplanBudgetView
                v-else-if="currentView === 'budget' && parentMediaplan"
                :mediaplan="parentMediaplan"
            />
            <div v-else-if="currentView === 'budget' && !parentMediaplan">
              Loading budget data...
            </div>

            <v-alert v-if="errorCampaigns && currentView === 'planning'" type="error" density="compact" class="mt-4"
                     closable>
              Failed to load campaigns: {{ errorCampaigns }}
            </v-alert>
          </div>
        </template>
        <template v-else-if="!isLoadingProject && errorProject">
          <div class="text-center my-10 text-disabled">
            <v-icon size="x-large" class="mb-2">mdi-alert-circle-outline</v-icon>
            <p>Could not load Project data.</p>
          </div>
        </template>
      </template>

      <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn icon="mdi-close" @click="snackbar.show = false"></v-btn>
        </template>
      </v-snackbar>
    </div>
  </MainLayout>
</template>

<style scoped>
.project-detail {
  padding-bottom: 20px;
}

.main-content {
  min-height: 60vh;
}
</style>