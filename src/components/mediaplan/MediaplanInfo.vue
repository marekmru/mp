<template>
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
        prepend-icon="mdi-pencil-outline"
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
</template>

<script setup lang="ts">
import { formatDate, formatDateRange } from '@/helpers/dateUtils';
import { formatCurrency, calculatePercentage, getBudgetStatusColor } from '@/helpers/currencyUtils';
import { getBrandLogo, getBrandInitials, hasBrandLogo } from '@/helpers/brandUtils';
import { getMediaplanStatusColor, getMediaplanStatusLabel } from '@/constants/mediaplanStatuses';
import type { Mediaplan } from '@/types/mediaplan';

// Define props
interface Props {
  mediaplan: Mediaplan | null;
  mediaplanId: string;
  isLoading: boolean;
  error: string | null;
}

// Receive props
const props = defineProps<Props>();
</script>

<style scoped>
.error-container {
  border-radius: 4px;
  background-color: rgba(var(--v-theme-error), 0.1);
}
</style>