<template>
  <MainLayout>
    <v-row class="pb-2 pt-1">
      <v-col>
        <mediaplan-filters
            v-model:search="filters.search"
            v-model:status="filters.status"
            v-model:country="countryFilter"
            v-model:sort-by="sortBy"
            v-model:sort-order="sortOrder"
            @create-mediaplan="openCreateMediaplanDialog"
        />
      </v-col>
    </v-row>

    <mediaplan-list
        :filters="filters"
        :sort-by="sortBy"
        :sort-order="sortOrder"
        :page="currentPage"
        :per-page="perPage"
        @update:page="currentPage = $event"
        @update:total-pages="totalPages = $event"
        @update:total-items="totalItems = $event"
    />
    
    <!-- Dialogs -->
    <CreateMediaplanDialog 
      v-model="showCreateMediaplanDialog"
      @created="handleMediaplanCreated"
      @project-created="handleProjectCreated"
    />
    
    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </MainLayout>
</template>

<script setup lang="ts">
import {ref, reactive, watch} from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import MediaplanFilters from '@/components/overview/MediaplanFilters.vue';
import MediaplanList from '@/components/overview/MediaplanList.vue';
import CreateMediaplanDialog from '@/components/overview/CreateMediaplanDialog.vue';
import {MediaplanFilter} from '@/types/mediaplan';
import { useMediaplanStore } from '@/stores/mediaplanStore';

// Store
const mediaplanStore = useMediaplanStore();

// State for filters and sorting
const filters = reactive<MediaplanFilter>({
  search: '',
  status: ''
});

const countryFilter = ref('');
const sortBy = ref('updated_at');
const sortOrder = ref<'asc' | 'desc'>('desc');

// Pagination state
const currentPage = ref(0); // 0-based pagination as per API
const perPage = ref(25);
const totalPages = ref(0);
const totalItems = ref(0);

// Dialog control
const showCreateMediaplanDialog = ref(false);

// Snackbar
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
});

// Watch for country filter changes and update filters
watch(countryFilter, (newCountry) => {
  // Add country-specific logic here if needed
  // For example, you might want to update the filters.search
});

// Methods
const openCreateMediaplanDialog = () => {
  showCreateMediaplanDialog.value = true;
};

const handleMediaplanCreated = (mediaplanId: string) => {
  console.log('Mediaplan created with ID:', mediaplanId);
  // Note: We don't close the dialog here because we want to proceed to project creation
};

const handleProjectCreated = (projectId: string) => {
  console.log('Project created with ID:', projectId);
  showSuccess('Project created successfully');
  
  // Refresh the list of mediaplans
  mediaplanStore.fetchMediaplans();
};

const showSuccess = (message: string) => {
  snackbar.color = 'success';
  snackbar.text = message;
  snackbar.show = true;
};
</script>