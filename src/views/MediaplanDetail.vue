<template>
  <div class="mediaplan-detail-view">
    <v-container>
      <!-- Breadcrumb -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-breadcrumbs :items="breadcrumbs">
            <template v-slot:divider>
              <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
          </v-breadcrumbs>
        </v-col>
      </v-row>
      
      <!-- Mediaplan Header -->
      <v-row>
        <v-col cols="12">
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
              <div class="d-flex align-center">
                <div class="text-h5">{{ mediaplan?.name || 'Mediaplan Details' }}</div>
                <v-chip
                  :color="getMediaplanStatusColor(mediaplan?.status)"
                  class="ml-4"
                  size="small"
                  variant="elevated"
                >
                  {{ getMediaplanStatusLabel(mediaplan?.status) }}
                </v-chip>
              </div>
              
              <v-btn 
                color="primary" 
                variant="flat" 
                prepend-icon="mdi-pencil"
                :to="`/mediaplans/${mediaplanId}/edit`"
              >
                Edit
              </v-btn>
            </v-card-title>
            
            <v-divider></v-divider>
            
            <v-card-text v-if="mediaplan" class="pa-6">
              <v-row>
                <v-col cols="12" md="4">
                  <div class="text-subtitle-2 text-grey-darken-1 mb-1">Brand</div>
                  <div class="d-flex align-center">
                    <v-avatar size="32" color="grey-lighten-3" class="mr-2">
                      <v-img v-if="hasBrandLogo(mediaplan.brand)" :src="getBrandLogo(mediaplan.brand)"></v-img>
                      <span v-else>{{ getBrandInitials(mediaplan.brand) }}</span>
                    </v-avatar>
                    <span class="font-weight-medium">{{ mediaplan.brand.name }}</span>
                  </div>
                </v-col>
                
                <v-col cols="12" md="4">
                  <div class="text-subtitle-2 text-grey-darken-1 mb-1">Campaign Period</div>
                  <div class="font-weight-medium">{{ formatDateRange(mediaplan.start_date, mediaplan.end_date) }}</div>
                </v-col>
                
                <v-col cols="12" md="4">
                  <div class="text-subtitle-2 text-grey-darken-1 mb-1">Budget</div>
                  <div class="d-flex align-center justify-space-between mb-1">
                    <span class="font-weight-medium">{{ formatCurrency(mediaplan.budget.used) }} / {{ formatCurrency(mediaplan.budget.total) }}</span>
                    <span class="text-body-2">{{ calculatePercentage(mediaplan.budget.used, mediaplan.budget.total) }}%</span>
                  </div>
                  <v-progress-linear 
                    :model-value="calculatePercentage(mediaplan.budget.used, mediaplan.budget.total)" 
                    height="8" 
                    :color="getBudgetStatusColor(mediaplan.budget)" 
                    rounded
                    bg-color="grey-lighten-3"
                  ></v-progress-linear>
                </v-col>
              </v-row>
              
              <v-row class="mt-6">
                <v-col cols="12" md="4">
                  <div class="text-subtitle-2 text-grey-darken-1 mb-1">PO Numbers</div>
                  <div v-if="mediaplan.po_numbers && mediaplan.po_numbers.length > 0">
                    <v-chip
                      v-for="po in mediaplan.po_numbers"
                      :key="po._id"
                      class="mr-2 mb-2"
                      variant="outlined"
                      size="small"
                    >
                      {{ po.name }}: {{ formatCurrency(po.value) }}
                    </v-chip>
                  </div>
                  <div v-else class="text-body-2 text-grey">No PO numbers added</div>
                </v-col>
                
                <v-col cols="12" md="4">
                  <div class="text-subtitle-2 text-grey-darken-1 mb-1">Created By</div>
                  <div class="font-weight-medium">{{ mediaplan.created_by?.name || 'Unknown' }}</div>
                </v-col>
                
                <v-col cols="12" md="4">
                  <div class="text-subtitle-2 text-grey-darken-1 mb-1">Last Updated</div>
                  <div class="font-weight-medium">{{ formatDate(mediaplan.updated_at) }}</div>
                </v-col>
              </v-row>
            </v-card-text>
            
            <div v-if="isLoading" class="d-flex justify-center align-center my-6">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            
            <div v-if="error" class="error-container mx-6 my-4 pa-4">
              <v-alert type="error" title="Error Loading Mediaplan">
                {{ error }}
              </v-alert>
            </div>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Projects Section -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center py-4 px-6">
              <div class="text-h6">Projects</div>
              <v-btn 
                color="primary" 
                prepend-icon="mdi-plus" 
                @click="openCreateProjectDialog"
              >
                Add Project
              </v-btn>
            </v-card-title>
            
            <v-divider></v-divider>
            
            <div v-if="isLoadingProjects" class="d-flex justify-center align-center my-6">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            
            <div v-else-if="projectError" class="error-container mx-6 my-4 pa-4">
              <v-alert type="error" title="Error Loading Projects">
                {{ projectError }}
              </v-alert>
            </div>
            
            <v-data-table-server
              v-else
              v-model:items-per-page="itemsPerPage"
              v-model:page="page"
              :headers="projectHeaders"
              :items="projects"
              :items-length="totalProjects"
              :loading="isLoadingProjects"
              class="elevation-0"
            >
              <!-- Country column with flag -->
              <template v-slot:item.country="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="24" class="mr-2">
                    <v-img :src="`/flags/${item.raw.country.code.toLowerCase()}.svg`"></v-img>
                  </v-avatar>
                  <span>{{ item.raw.country.name }} ({{ item.raw.country.code }})</span>
                </div>
              </template>
              
              <!-- Campaign Type column -->
              <template v-slot:item.campaignType="{ item }">
                <v-chip
                  size="small"
                  :color="getCampaignTypeColor(item.raw.campaignType)"
                  class="text-capitalize"
                >
                  {{ item.raw.campaignType }}
                </v-chip>
              </template>
              
              <!-- Created date column -->
              <template v-slot:item.createdAt="{ item }">
                {{ formatDate(item.raw.createdAt) }}
              </template>
              
              <!-- Actions column -->
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon
                  variant="text"
                  density="comfortable"
                  :to="`/mediaplans/${mediaplanId}/projects/${item.raw._id}`"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  density="comfortable"
                  :to="`/mediaplans/${mediaplanId}/projects/${item.raw._id}/edit`"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  density="comfortable"
                  color="error"
                  @click="confirmDeleteProject(item.raw)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              
              <!-- Empty state -->
              <template v-slot:no-data>
                <div class="d-flex flex-column align-center justify-center pa-6">
                  <v-icon icon="mdi-folder-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                  <div class="text-h6 text-grey-darken-1">No Projects Found</div>
                  <div class="text-body-2 text-grey mb-4">This mediaplan doesn't have any projects yet.</div>
                  <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateProjectDialog">
                    Add First Project
                  </v-btn>
                </div>
              </template>
            </v-data-table-server>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Delete Project Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="500">
        <v-card>
          <v-card-title class="text-h5 pa-6">
            Confirm Delete
          </v-card-title>
          <v-card-text class="pa-6 pt-0">
            Are you sure you want to delete the project <strong>{{ projectToDelete?.name }}</strong>? 
            This action cannot be undone.
          </v-card-text>
          <v-card-actions class="pa-6 pt-0">
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
            <v-btn 
              color="error" 
              variant="flat"
              :loading="isDeletingProject"
              @click="deleteProject"
            >
              Delete Project
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getMediaplanStatusColor, getMediaplanStatusLabel } from '@/constants/mediaplanStatuses';
import { getCampaignTypeColor } from '@/helpers/campaignTypeUtils';
import { formatDate, formatDateRange } from '@/helpers/dateUtils';
import { formatCurrency, calculatePercentage, getBudgetStatusColor } from '@/helpers/currencyUtils';
import { getBrandLogo, getBrandInitials, hasBrandLogo } from '@/helpers/brandUtils';
import type { Mediaplan } from '@/types/mediaplan';
import type { Project } from '@/types/project';

// Props and route
const route = useRoute();
const router = useRouter();
const mediaplanId = ref(route.params.id as string);

// State - Mediaplan
const mediaplan = ref<Mediaplan | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);

// State - Projects
const projects = ref<Project[]>([]);
const totalProjects = ref<number>(0);
const isLoadingProjects = ref<boolean>(true);
const projectError = ref<string | null>(null);
const page = ref<number>(1);
const itemsPerPage = ref<number>(10);

// Delete project dialog
const deleteDialog = ref<boolean>(false);
const projectToDelete = ref<Project | null>(null);
const isDeletingProject = ref<boolean>(false);

// Create Computed Values
const breadcrumbs = computed(() => [
  {
    title: 'Dashboard',
    disabled: false,
    href: '/',
  },
  {
    title: 'Mediaplans',
    disabled: false,
    href: '/mediaplans',
  },
  {
    title: mediaplan.value ? mediaplan.value.name : 'Mediaplan Details',
    disabled: true,
  },
]);

// Project Table Headers
const projectHeaders = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Country', key: 'country', sortable: true },
  { title: 'Language', key: 'language', sortable: true },
  { title: 'Campaign Type', key: 'campaignType', sortable: true },
  { title: 'Phase', key: 'phase', sortable: true },
  { title: 'Goal', key: 'goal', sortable: true },
  { title: 'Created At', key: 'createdAt', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
];

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
      name: 'BMW New Car Launch 2025',
      status: 'draft',
      start_date: '2025-01-15T00:00:00Z',
      end_date: '2025-04-15T00:00:00Z',
      brand: {
        _id: 'brand-123',
        name: 'BMW',
        logo: '/brands/bmw.png'
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
    // const response = await ProjectService.getProjectsForMediaplan(mediaplanId.value, page.value, itemsPerPage.value);
    
    // For now, we'll mock the response
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network delay
    
    // Mock data
    const mockProjects: Project[] = [
      {
        _id: 'project-1',
        name: 'NC-ALWAYS-ON-2025',
        mediaplanId: mediaplanId.value,
        country: { code: 'DE', name: 'Germany' },
        language: 'DEU',
        campaignType: 'Always On',
        phase: 'Awareness',
        goal: 'Brand Recognition',
        createdAt: '2024-10-02T09:15:00Z',
        updatedAt: '2024-10-02T09:15:00Z'
      },
      {
        _id: 'project-2',
        name: 'NC-PRODUCT-LAUNCH-2025',
        mediaplanId: mediaplanId.value,
        country: { code: 'FR', name: 'France' },
        language: 'FRA',
        campaignType: 'Product Launch',
        phase: 'Consideration',
        goal: 'Lead Generation',
        createdAt: '2024-10-03T11:30:00Z',
        updatedAt: '2024-10-05T14:45:00Z'
      },
      {
        _id: 'project-3',
        name: 'NC-SUMMER-CAMPAIGN-2025',
        mediaplanId: mediaplanId.value,
        country: { code: 'IT', name: 'Italy' },
        language: 'ITA',
        campaignType: 'Seasonal',
        phase: 'Decision',
        goal: 'Sales',
        createdAt: '2024-10-04T15:20:00Z',
        updatedAt: '2024-10-04T15:20:00Z'
      },
      {
        _id: 'project-4',
        name: 'NC-WINTER-CAMPAIGN-2025',
        mediaplanId: mediaplanId.value,
        country: { code: 'ES', name: 'Spain' },
        language: 'ESP',
        campaignType: 'Seasonal',
        phase: 'Awareness',
        goal: 'Brand Recognition',
        createdAt: '2024-10-05T10:45:00Z',
        updatedAt: '2024-10-06T09:30:00Z'
      },
      {
        _id: 'project-5',
        name: 'NC-SPECIAL-OFFER-2025',
        mediaplanId: mediaplanId.value,
        country: { code: 'UK', name: 'United Kingdom' },
        language: 'ENG',
        campaignType: 'Promotion',
        phase: 'Conversion',
        goal: 'Sales',
        createdAt: '2024-10-06T13:15:00Z',
        updatedAt: '2024-10-08T11:10:00Z'
      }
    ];
    
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

const confirmDeleteProject = (project: Project) => {
  projectToDelete.value = project;
  deleteDialog.value = true;
};

const deleteProject = async () => {
  if (!projectToDelete.value) return;
  
  isDeletingProject.value = true;
  
  try {
    // In a real app, this would be an API call
    // await ProjectService.deleteProject(mediaplanId.value, projectToDelete.value._id);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Remove project from array
    projects.value = projects.value.filter(p => p._id !== projectToDelete.value?._id);
    totalProjects.value--;
    
    // Close dialog
    deleteDialog.value = false;
    projectToDelete.value = null;
  } catch (err) {
    console.error('Error deleting project:', err);
    // Show error - in a real app, you'd show a toast or notification
  } finally {
    isDeletingProject.value = false;
  }
};

// Watch for pagination changes
watch([page, itemsPerPage], () => {
  fetchProjects();
});

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
.error-container {
  border-radius: 4px;
  background-color: rgba(var(--v-theme-error), 0.1);
}
</style>