// src/views/ProjectDetail.vue

<script setup lang="ts">
// ... (Imports bleiben gleich: MainLayout, MediaplanBreadcrumb, CampaignListView, Stores, Typen, etc.)
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import CampaignListView from '@/components/project/CampaignListView.vue';
import { useMediaplanStore } from '@/stores/mediaplanStore';
import { useProjectStore } from '@/stores/projectStore';
import { useCampaignStore } from '@/stores/campaignStore';
import type { Project } from '@/types/project';
import type { Campaign } from '@/types/campaign';
import MediaplanBreadcrumb from "@/components/mediaplan/MediaplanBreadcrumb.vue";

// --- Props & Route ---
const props = defineProps<{
  mediaplanId?: string;
  projectId?: string;
}>();

const route = useRoute();
const router = useRouter();
const currentMediaplanId = ref(props.mediaplanId || route.params.mediaplanId as string);
const currentProjectId = ref(props.projectId || route.params.projectId as string);

// --- Stores ---
const mediaplanStore = useMediaplanStore();
const projectStore = useProjectStore();
const campaignStore = useCampaignStore();

// --- Computed Properties from Stores ---
const parentMediaplan = computed(() => mediaplanStore.selectedMediaplan);
const isLoadingMediaplan = computed(() => mediaplanStore.isLoading);
const project = computed(() => projectStore.selectedProject);
const isLoadingProject = computed(() => projectStore.isLoading);
const errorProject = computed(() => projectStore.error);
const campaigns = computed(() => campaignStore.campaigns);
const totalCampaigns = computed(() => campaignStore.totalItems);
const isLoadingCampaigns = computed(() => campaignStore.isLoading);
const errorCampaigns = computed(() => campaignStore.error);
const campaignCurrentPage = computed(() => campaignStore.currentPage);
const campaignItemsPerPage = computed(() => campaignStore.perPage);

// --- Snackbar ---
const snackbar = reactive({ show: false, text: '', color: 'success' });

// --- Methods ---
const handleCampaignOptionsUpdate = (options: { page: number; itemsPerPage: number; sortBy?: any[]; sortDesc?: boolean[] }) => {
  // ... (Logik bleibt gleich)
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

const openCreateCampaignDialog = () => {
  console.log('Trigger create campaign for Project ID:', currentProjectId.value);
  // ... (Navigation/Dialog Logik)
};

const showSnackbar = (text: string, color: 'success' | 'error' | 'info' = 'success') => {
  snackbar.text = text;
  snackbar.color = color;
  snackbar.show = true;
};

// --- Lifecycle Hooks ---
onMounted(() => {
  // ... (Logik bleibt gleich)
  if (!currentMediaplanId.value || !currentProjectId.value) {
    console.error('Mediaplan ID or Project ID is missing');
    projectStore.error = "Missing IDs for Project Detail";
    return;
  }
  projectStore.fetchProject(currentMediaplanId.value, currentProjectId.value);
  campaignStore.fetchCampaigns(currentMediaplanId.value, currentProjectId.value);
  if (!parentMediaplan.value || parentMediaplan.value._id !== currentMediaplanId.value) {
    mediaplanStore.fetchMediaplan(currentMediaplanId.value);
  }
});

// --- Watchers ---
// ... (Logik bleibt gleich)
watch(() => [route.params.mediaplanId, route.params.projectId], ([newMpId, newPId]) => {
  const mpId = newMpId as string;
  const pId = newPId as string;
  if (mpId && pId && (mpId !== currentMediaplanId.value || pId !== currentProjectId.value)) {
    currentMediaplanId.value = mpId;
    currentProjectId.value = pId;
    projectStore.fetchProject(mpId, pId);
    campaignStore.fetchCampaigns(mpId, pId);
    if (!parentMediaplan.value || parentMediaplan.value._id !== mpId) { mediaplanStore.fetchMediaplan(mpId); }
  }
});
watch(errorProject, (newError) => { if(newError) showSnackbar(`Error loading project: ${newError}`, 'error'); });
watch(errorCampaigns, (newError) => { if(newError) showSnackbar(`Error loading campaigns: ${newError}`, 'error'); });

</script>

<template>
  <MainLayout>
    <div class="project-detail">
      <v-alert v-if="errorProject" type="error" density="compact" class="mb-4" closable>
        Error loading project details: {{ errorProject }}
      </v-alert>

      <div v-if="isLoadingProject && !project" class="text-center my-10">
        <v-progress-circular indeterminate color="primary" size="40"></v-progress-circular>
        <p class="mt-2 text-disabled">Loading Project...</p>
      </div>

      <template v-if="!isLoadingProject && project">
        <v-row class="mb-2" align="center">
          <v-col class="d-flex align-center">
            <MediaplanBreadcrumb
                :mediaplan="parentMediaplan"
                :project="project"
            />
          </v-col>
          <v-col class="text-right">
            <v-btn prepend-icon="mdi-plus" @click="openCreateCampaignDialog">Add Campaign</v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card variant="tonal">
              <v-card-title class="pb-1">Project: {{ project.abbreviation }}</v-card-title>
              <v-card-subtitle class="pb-2">
                {{ project.descriptive_vars?.projectname }}
              </v-card-subtitle>
              <v-card-text>
                <v-chip size="small" class="mr-2" label>
                  <v-icon start icon="mdi-flag"></v-icon> {{ project.descriptive_vars?.country }}
                </v-chip>
                <v-chip size="small" class="mr-2" label>
                  <v-icon start icon="mdi-tag-outline"></v-icon> {{ project.default_vars?.campaigntype }}
                </v-chip>
                <v-chip size="small" class="mr-2" label>
                  <v-icon start icon="mdi-account-outline"></v-icon> {{ project.owner }}
                </v-chip>
                <v-chip v-if="project.duration" size="small" label>
                  <v-icon start icon="mdi-calendar-range"></v-icon>
                  {{ project.duration.formatted || formatDateRange(project.duration.start_date, project.duration.end_date) }}
                </v-chip>
                <p v-if="project.detail" class="text-caption mt-2">{{ project.detail }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <CampaignListView
            class="mt-4"
            :campaigns="campaigns"
            :total-campaigns="totalCampaigns"
            :is-loading="isLoadingCampaigns"
            :current-page="campaignCurrentPage"
            :items-per-page="campaignItemsPerPage"
            @update:options="handleCampaignOptionsUpdate"
            @add-campaign="openCreateCampaignDialog"
        />

        <v-alert v-if="errorCampaigns" type="error" density="compact" class="mt-4" closable>
          Failed to load campaigns: {{ errorCampaigns }}
        </v-alert>

      </template>
      <template v-else-if="!isLoadingProject && !project && errorProject">
        <div class="text-center my-10 text-disabled">
          <v-icon size="x-large" class="mb-2">mdi-alert-circle-outline</v-icon>
          <p>Could not load Project data.</p>
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

<style scoped>
.project-detail {
  padding-bottom: 20px;
}
</style>