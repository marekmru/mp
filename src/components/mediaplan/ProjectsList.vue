<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center py-4 px-6">
      <div class="text-h6">Projects</div>
      <v-btn 
        color="primary" 
        prepend-icon="mdi-plus" 
        @click="emit('createProject')"
      >
        Add Project
      </v-btn>
    </v-card-title>
    
    <v-divider></v-divider>
    
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
      :items-length="totalItems"
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
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
        <v-btn
          icon
          variant="text"
          density="comfortable"
          color="error"
          @click="emit('deleteProject', item.raw)"
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
          <v-btn color="primary" prepend-icon="mdi-plus" @click="emit('createProject')">
            Add First Project
          </v-btn>
        </div>
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
  totalItems: number;
  isLoading: boolean;
  error: string | null;
}

// Define emits
const emit = defineEmits<{
  (e: 'createProject'): void;
  (e: 'deleteProject', project: Project): void;
  (e: 'updatePage', page: number): void;
  (e: 'updateItemsPerPage', itemsPerPage: number): void;
}>();

//