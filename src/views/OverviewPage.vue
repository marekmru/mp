<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h4 d-flex justify-space-between align-center">
            <div>Media Plans</div>
            <v-btn 
              color="primary" 
              @click="openCreateMediaplanDialog"
              prepend-icon="mdi-plus"
            >
              New Mediaplan
            </v-btn>
          </v-card-title>
          
          <v-card-text>
            <!-- Content would go here - perhaps a table of existing mediaplans -->
            <v-table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Status</th>
                  <th>Dates</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="mediaplans.length === 0">
                  <td colspan="5" class="text-center pa-5">
                    No mediaplans found. Create your first mediaplan to get started.
                  </td>
                </tr>
                <tr v-for="plan in mediaplans" :key="plan._id">
                  <td>{{ plan.name }}</td>
                  <td>{{ plan.brand.name }}</td>
                  <td>
                    <v-chip
                      size="small"
                      :color="getStatusColor(plan.status)"
                    >
                      {{ formatStatus(plan.status) }}
                    </v-chip>
                  </td>
                  <td>
                    {{ formatDate(plan.start_date) }} - {{ formatDate(plan.end_date) }}
                  </td>
                  <td>
                    <v-btn icon variant="text" size="small" @click="viewMediaplan(plan._id)">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                    <v-btn icon variant="text" size="small" @click="editMediaplan(plan._id)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
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
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { useMediaplanStore } from '@/stores/mediaplanStore';
import CreateMediaplanDialog from '@/components/overview/CreateMediaplanDialog.vue';
import type { Mediaplan } from '@/types/mediaplan';

// Router
const router = useRouter();

// Store
const mediaplanStore = useMediaplanStore();

// Reactive state
const showCreateMediaplanDialog = ref(false);
const mediaplans = ref<Mediaplan[]>([]);

// Snackbar
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
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
  fetchMediaplans();
  
  // In a real app, you might navigate to the mediaplan detail page
  // router.push(`/mediaplans/${mediaplanId}`);
};

const viewMediaplan = (id: string) => {
  router.push(`/mediaplans/${id}`);
};

const editMediaplan = (id: string) => {
  router.push(`/mediaplans/${id}/edit`);
};

const fetchMediaplans = async () => {
  await mediaplanStore.fetchMediaplans();
  mediaplans.value = mediaplanStore.mediaplans;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'dd.MM.yyyy');
  } catch (e) {
    return dateString;
  }
};

const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'in_planning':
      return 'blue';
    case 'draft':
      return 'grey';
    case 'for_approval':
      return 'orange';
    default:
      return 'grey';
  }
};

const showSuccess = (message: string) => {
  snackbar.color = 'success';
  snackbar.text = message;
  snackbar.show = true;
};

const showError = (message: string) => {
  snackbar.color = 'error';
  snackbar.text = message;
  snackbar.show = true;
};

// Lifecycle hooks
onMounted(async () => {
  await fetchMediaplans();
});
</script>