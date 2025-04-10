<template>
  <MainLayout>
    <div class="mediaplan-detail">
      <!-- Breadcrumb and Header in one line -->
      <v-row class="mb-0">
        <v-col cols="5" class="d-flex align-center">
          <MediaplanBreadcrumb
              :mediaplan-name="mediaplan?.name || 'Mediaplan Details'"
              :mediaplan="mediaplan"
          />
        </v-col>
        <v-col cols="7">
          <MediaplanHeader
              :plan-budget="mediaplan?.budget?.total || 0"
              :used-percentage="calculatePercentage(mediaplan?.budget?.used, mediaplan?.budget?.total)"
              :search="search"
              @update:search="updateSearch"
          />
        </v-col>
      </v-row>
      
      <!-- View Toggle below -->
      <v-row class="mb-4">
        <v-col cols="12" sm="4" md="3">
          <MediaplanViewToggle
              v-model="currentView"
          />
        </v-col>
      </v-row>

      <!-- Main Content View -->
      <div class="main-content">
        <!-- Planning View -->
        <MediaplanPlanningView 
            v-if="currentView === 'planning'"
            :projects="projects"
            :total-projects="totalProjects"
            :is-loading="isLoadingProjects"
            @add-project="openCreateProjectDialog"
        />

        <!-- Budget View -->
        <MediaplanBudgetView v-else />
      </div>



      <!-- Snackbar for notifications -->
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
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import MediaplanBreadcrumb from '@/components/mediaplan/MediaplanBreadcrumb.vue';
import MediaplanViewToggle from '@/components/mediaplan/MediaplanViewToggle.vue';
import MediaplanHeader from '@/components/mediaplan/MediaplanHeader.vue';
import MediaplanPlanningView from '@/components/mediaplan/MediaplanPlanningView.vue';
import MediaplanBudgetView from '@/components/mediaplan/MediaplanBudgetView.vue';

import { mockProjects } from '@/mocks/mediaplanProjects';
import type { Mediaplan } from '@/types/mediaplan';
import type { Project } from '@/types/project';
import { getBrandLogo } from '@/helpers/brandUtils';

// Props
const props = defineProps<{
  id?: string; // Accept the id from the router
}>();

// Router setup
const route = useRoute();
const router = useRouter();
const mediaplanId = ref(props.id || route.params.id as string);

// State - Mediaplan
const mediaplan = ref<Mediaplan | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);

// State - Projects
const projects = ref<Project[]>([]);
const totalProjects = ref<number>(0);
const isLoadingProjects = ref<boolean>(true);
const projectError = ref<string | null>(null);



// UI controls
const currentView = ref<string>('planning'); // 'planning' or 'budget'
const search = ref<string>('');

// Snackbar
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
});

// Methods
const fetchMediaplan = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // In a real app, this would be an API call like:
    // const response = await MediaplanService.getMediaplan(mediaplanId.value);
    // mediaplan.value = response;

    // For now, we'll mock the response
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    // Mock data based on API schema
    mediaplan.value = {
      _id: mediaplanId.value,
      name: 'MINI Mediaplan Name',
      status: 'draft',
      start_date: '2025-01-15T00:00:00Z',
      end_date: '2025-04-15T00:00:00Z',
      brand: {
        _id: 'brand-123',
        name: 'MINI',
        logo: '/img/brands/MINI.svg'
      },
      budget: {
        total: 1500000,
        used: 450000,
        available: 1050000
      },
      po_numbers: [
        { _id: 'po-123', name: 'PO12345', value: 750000 },
        { _id: 'po-124', name: 'PO67890', value: 750000 }
      ],
      created_by: {
        _id: 'user-123',
        name: 'John Doe'
      },
      created_at: '2024-10-01T10:30:00Z',
      updated_at: '2024-10-15T14:45:00Z'
    };
  } catch (err) {
    console.error('Error fetching mediaplan:', err);
    error.value = err instanceof Error ? err.message : 'Failed to load mediaplan details';
  } finally {
    isLoading.value = false;
  }
};

const fetchProjects = async () => {
  isLoadingProjects.value = true;
  projectError.value = null;

  try {
    // In a real app, this would be an API call like:
    // const response = await ProjectService.getProjectsForMediaplan(mediaplanId.value);

    // For now, we'll use our mock data
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network delay

    // Use mock data
    projects.value = mockProjects;
    totalProjects.value = mockProjects.length;
  } catch (err) {
    console.error('Error fetching projects:', err);
    projectError.value = err instanceof Error ? err.message : 'Failed to load projects';
  } finally {
    isLoadingProjects.value = false;
  }
};

const openCreateProjectDialog = () => {
  // In a real app, you would open a dialog or navigate to a create project page
  router.push(`/mediaplans/${mediaplanId.value}/projects/create`);
};



const calculatePercentage = (used: number = 0, total: number = 0): number => {
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
};

const showSnackbar = (text: string, color: 'success' | 'error' | 'info' = 'success') => {
  snackbar.text = text;
  snackbar.color = color;
  snackbar.show = true;
};



// UI control methods
const updateSearch = (value: string) => {
  search.value = value;
};

// Lifecycle hooks
onMounted(() => {
  if (!mediaplanId.value) {
    error.value = 'No mediaplan ID provided';
    isLoading.value = false;
    return;
  }

  fetchMediaplan();
  fetchProjects();
});
</script>

<style scoped>
.mediaplan-detail {
  min-height: calc(100vh - 64px); /* Adjust for the navbar height */
}

.main-content {
  min-height: 60vh;
}
</style>