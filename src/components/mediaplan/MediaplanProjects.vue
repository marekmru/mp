<template>
  <v-card>
    <v-toolbar flat color="primary" density="comfortable">
      <v-toolbar-title>Projects</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn 
        variant="outlined" 
        prepend-icon="mdi-plus" 
        @click="$emit('createProject')"
        :disabled="isLoading"
        color="white"
      >
        Add Project
      </v-btn>
    </v-toolbar>
    
    <div v-if="isLoading" class="d-flex justify-center align-center my-6">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    
    <div v-else-if="error" class="error-container mx-6 my-4 pa-4">
      <v-alert type="error" title="Error Loading Projects">
        {{ error }}
      </v-alert>
    </div>
    
    <v-data-table-server
      v-else
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :headers="projectHeaders"
      :items="projects"
      :items-length="totalProjects"
      :loading="isLoading"
      class="elevation-0"
      @update:options="onOptionsUpdate"
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
        <v-tooltip text="View Details">
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              variant="text"
              density="comfortable"
              v-bind="props"
              :to="`/mediaplans/${mediaplanId}/projects/${item.raw._id}`"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        
        <v-tooltip text="Edit Project">
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              variant="text"
              density="comfortable"
              v-bind="props"
              :to="`/mediaplans/${mediaplanId}/projects/${item.raw._id}/edit`"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        
        <v-tooltip text="Delete Project">
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              variant="text"
              density="comfortable"
              color="error"
              v-bind="props"
              @click="$emit('deleteProject', item.raw)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
      
      <!-- Empty state -->
      <template v-slot:no-data>
        <v-sheet class="d-flex flex-column align-center justify-center pa-6" height="300">
          <v-icon icon="mdi-folder-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
          <div class="text-h6 text-grey-darken-1">No Projects Found</div>
          <div class="text-body-2 text-grey mb-4">This mediaplan doesn't have any projects yet.</div>
          <v-btn color="primary" prepend-icon="mdi-plus" @click="$emit('createProject')">
            Add First Project
          </v-btn>
        </v-sheet>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { formatDate } from '@/helpers/dateUtils';
import { getCampaignTypeColor } from '@/helpers/campaignTypeUtils';
import type { Project } from '@/types/project';

// Define props
interface Props {
  projects: Project[];
  mediaplanId: string;
  totalProjects: number;
  isLoading: boolean;
  error: string | null;
}

// Define emits
const emit = defineEmits<{
  (e: 'createProject'): void;
  (e: 'deleteProject', project: Project): void;
  (e: 'update:page', page: number): void;
  (e: 'update:itemsPerPage', itemsPerPage: number): void;
}>();

// Component state
const page = ref<number>(1);
const itemsPerPage = ref<number>(10);

// Watch for pagination changes
watch([page, itemsPerPage], () => {
  emit('update:page', page.value);
  emit('update:itemsPerPage', itemsPerPage.value);
});

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

// Method to handle datatable option updates (sorting, etc)
const onOptionsUpdate = (options: any) => {
  // You can add additional logic here for sorting if needed
  // For now, we just update pagination
  page.value = options.page;
  itemsPerPage.value = options.itemsPerPage;
};

// Receive props with defaults
const props = withDefaults(defineProps<Props>(), {
  projects: () => [],
  totalProjects: 0,
  error: null
});
</script>

<style scoped>
.error-container {
  border-radius: 4px;
  background-color: rgba(var(--v-theme-error), 0.1);
}
</style>