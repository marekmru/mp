<template>
  <v-card class="h-100 pa-3" elevation="3">
    <v-card-item class="pb-8">
      <div class="d-flex align-center">
        <v-tooltip
            location="top"
            open-delay="300"
        >
          <template v-slot:activator="{ props }">
            <div
                class="text-h6 text-truncate mediaplan-title pr-1"
                v-bind="props"
            >
              {{ mediaplan.name }}
            </div>
          </template>
          <span>{{ mediaplan.name }}</span>
        </v-tooltip>
        <v-icon size="x-small" color="primary" icon="mdi-pencil" class="mr-3"/>

        <!-- Brand logo -->
        <v-img
            :src="getBrandLogo(mediaplan.brand)"
            max-width="40"
            contain
            class="ml-auto"
        />
      </div>

      <!-- Status and date range on same row -->
      <div class="d-flex align-center justify-space-between mt-2">
        <div class="d-flex align-center">
          <v-icon
              icon="mdi-circle"
              :color="getMediaplanStatusColor(mediaplan.status)"
              size="x-small"
              class="mr-1"
          />
          <span class="status-text text-grey">{{ getMediaplanStatusLabel(mediaplan.status) }}</span>
        </div>

        <div class="d-flex align-center">
          <v-icon size="small" icon="mdi-calendar-range" class="mr-1"/>
          <span class="date-range-text text-grey">{{ formatDateRange(mediaplan.start_date, mediaplan.end_date) }}</span>
        </div>
      </div>
    </v-card-item>

    <v-card-text>
      <!-- Creator row -->
      <div class="d-flex justify-space-between mb-3">
        <span class="text-subtitle-2">Creator</span>
        <span class="text-subtitle-2 font-weight-medium">{{ mediaplan.created_by?.name || 'N/A' }}</span>
      </div>

      <v-divider class="pt-1 pb-4"></v-divider>
      <!-- Total Budget row -->
      <div class="d-flex justify-space-between mb-3">
        <span class="text-subtitle-2">Total Budget</span>
        <div class="d-flex align-center">
          <v-icon size="x-small" icon="mdi-circle" color="green" class="mr-1"/>
          <span class="text-subtitle-2 font-weight-medium">{{ formatCurrency(mediaplan.budget?.total) }}</span>
        </div>
      </div>

      <v-divider class="pt-1 pb-4"></v-divider>
      <!-- Used Budget row -->
      <div class="d-flex justify-space-between mb-3">
        <span class="text-subtitle-2">Used Budget</span>
        <div class="d-flex align-center">
          <v-icon size="x-small" icon="mdi-circle" color="red" class="mr-1"/>
          <span class="text-subtitle-2 font-weight-medium">{{ formatCurrency(mediaplan.budget?.used) }}</span>
        </div>
      </div>

      <v-divider class="pt-1 pb-4"></v-divider>
      <!-- PO Numbers row -->
      <div class="d-flex justify-space-between" v-if="mediaplan.po_numbers && mediaplan.po_numbers.length > 0">
        <span class="text-subtitle-2">PO</span>
        <span class="text-subtitle-2 font-weight-medium text-truncate" style="max-width: 70%">
          {{ mediaplan.po_numbers.map(po => po.name).join(', ') }}
        </span>
      </div>
    </v-card-text>


    <v-card-actions>
      <!-- Action buttons -->
      <v-spacer/>

      <mediaplan-options-menu
          :mediaplan-id="mediaplan._id"
          @action="handleMenuAction"
      />

      <v-btn
          variant="flat"
          color="primary"
          @click="$emit('view', mediaplan._id)"
      >
        Show Mediaplan
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {Mediaplan} from '@/types/mediaplan';
import {getMediaplanStatusColor, getMediaplanStatusLabel} from '@/constants/mediaplanStatuses';
import MediaplanOptionsMenu from "@/components/overview/MediaplanOptionsMenu.vue";

defineProps<{
  mediaplan: Mediaplan;
}>();

defineEmits<{
  (e: 'view', id: string): void;
  (e: 'edit', id: string): void;
  (e: 'add-po', id: string): void;
  (e: 'export', id: string): void;
  (e: 'duplicate', id: string): void;
  (e: 'archive', id: string): void;
  (e: 'delete', id: string): void;
}>();

const handleMenuAction = (action: string, id: string) => {
  switch (action) {
    case 'view':
      emit('view', id);
      break;
    case 'edit':
      emit('edit', id);
      break;
    case 'addPo':
      emit('add-po', id);
      break;
    case 'export':
      emit('export', id);
      break;
    case 'duplicate':
      emit('duplicate', id);
      break;
    case 'archive':
      emit('archive', id);
      break;
    case 'delete':
      emit('delete', id);
      break;
  }
};

// Helper functions
const formatDateRange = (startDate: string, endDate: string): string => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return `${start.getDate().toString().padStart(2, '0')} ${start.toLocaleString('default', {month: 'short'})}. ${start.getFullYear()} - ${end.getDate().toString().padStart(2, '0')} ${end.toLocaleString('default', {month: 'short'})}. ${end.getFullYear()}`;
  } catch (e) {
    return 'Invalid date range';
  }
};

const formatCurrency = (amount?: number): string => {
  if (amount === undefined || amount === null) return 'N/A';
  return `+${amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} EUR`;
};

const getBrandLogo = (brand: { _id: string; name: string; } | undefined): string => {
  if (!brand) return '';
  return `/img/BMW.svg`;
  // In a real application, you might have a mapping of brands to logos
  // This is just a placeholder that returns a dynamic URL based on the brand ID
  // return `/img/${brand._id}.png`;
};
</script>

<style scoped>
.mediaplan-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.status-text, .date-range-text {
  font-size: 12px;
}
</style>