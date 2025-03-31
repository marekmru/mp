<template>
  <div class="mediaplan-detail-view">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="pa-6">
            <v-card-title class="text-h5 mb-4">Mediaplan Details</v-card-title>
            
            <v-card-text>
              <div v-if="isLoading" class="d-flex justify-center align-center my-6">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
              
              <div v-else-if="error" class="error-container pa-4 mb-4">
                <v-alert type="error" title="Error Loading Mediaplan">
                  {{ error }}
                </v-alert>
              </div>
              
              <div v-else>
                <pre>{{ JSON.stringify(mediaplan, null, 2) }}</pre>
              </div>
            </v-card-text>
            
            <v-card-actions>
              <v-btn color="primary" @click="goBack">
                Back to Media Plans
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Mediaplan } from '@/types/mediaplan';

// Router setup
const route = useRoute();
const router = useRouter();
const mediaplanId = ref<string>(route.params.id as string);

// State
const mediaplan = ref<Mediaplan | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);

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
      name: `Mediaplan ${mediaplanId.value.substring(0, 6)}`,
      status: 'Draft',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days in the future
      brand: {
        _id: 'brand-123',
        name: 'BMW'
      },
      budget: {
        total: 10000,
        used: 0,
        available: 10000
      },
      po_numbers: [
        { _id: 'po-123', name: 'PO12345', value: 10000 }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (err) {
    console.error('Error fetching mediaplan:', err);
    error.value = err instanceof Error ? err.message : 'Failed to load mediaplan details';
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  router.push('/mediaplans');
};

// Lifecycle hooks
onMounted(() => {
  if (!mediaplanId.value) {
    error.value = 'No mediaplan ID provided';
    isLoading.value = false;
    return;
  }
  
  fetchMediaplan();
});
</script>

<style scoped>
.error-container {
  border-radius: 4px;
  background-color: rgba(var(--v-theme-error), 0.1);
}
</style>
