<template>
  <div class="position-relative card-wrapper">
    <v-card
        class="h-100 pa-3 mediaplan-card"
        elevation="3"
        :data-mediaplan-id="mediaplan._id"
        @click="handleCardClick"
    >
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
          <v-icon size="x-small" color="primary" icon="mdi-pencil-outline" class="mr-3"/>

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
            <span class="date-range-text text-grey">{{
                formatDateRange(mediaplan.start_date, mediaplan.end_date)
              }}</span>
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

        <!-- Options menu -->
        <mediaplan-options-menu
            :mediaplan-id="mediaplan._id"
            @action="handleMenuAction"
        />

        <!-- Navigation button -->
        <v-btn
            variant="flat"
            color="primary"
            :to="{ name: 'MediaplanDetail', params: { mediaplanId: mediaplan._id }}"
        >
          Show Mediaplan
        </v-btn>
        <br>

      </v-card-actions>
    </v-card>
  </div>
</template>


<script setup lang="ts">
import {ref} from 'vue';
import {Mediaplan} from '@/types/mediaplan';
import {getMediaplanStatusColor, getMediaplanStatusLabel} from '@/constants/mediaplanStatuses';
import MediaplanOptionsMenu from "@/components/overview/MediaplanOptionsMenu.vue";
import {useRouter} from 'vue-router';
import {formatDateRange} from '@/helpers/dateUtils';
import {formatCurrency} from '@/helpers/currencyUtils';
import {getBrandLogo} from '@/helpers/brandUtils';

// Store mediaplan prop in a variable to access it throughout the component
const props = defineProps<{
  mediaplan: Mediaplan;
}>();

const emit = defineEmits<{
  (e: 'view', mediaplanId: string): void;
  (e: 'edit', mediaplanId: string): void;
  (e: 'add-po', mediaplanId: string): void;
  (e: 'export', mediaplanId: string): void;
  (e: 'duplicate', mediaplanId: string): void;
  (e: 'archive', mediaplanId: string): void;
  (e: 'delete', mediaplanId: string): void;
}>();

const router = useRouter();

// Handle card click for navigation
const handleCardClick = (event: MouseEvent) => {
  // Don't navigate if clicking on buttons or menu items
  if ((event.target as HTMLElement).closest('.v-card__actions')) {
    return;
  }

  // Navigate to detail page
  router.push({name: 'MediaplanDetail', params: {mediaplanId: props.mediaplan._id}});
};

const handleMenuAction = (action: string, mediaplanId: string) => {
  switch (action) {
    case 'view':
      router.push({name: 'MediaplanDetail', params: {mediaplanId: id}});
      break;
    case 'edit':
      router.push({name: 'MediaplanEdit', params: {mediaplanId: id}});
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

.mediaplan-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.mediaplan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Override cursor for buttons and menu */
.v-menu__content,
.v-card__actions .v-btn {
  cursor: default;
}
</style>