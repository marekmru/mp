<!-- File: src/components/overview/MediaplanFilters.vue -->
<template>
  <!-- Main filters row -->
  <div class="filter-container">
    <!-- Brand dropdown -->
    <div class="filter-item">
      <v-select
          v-model="localBrandId"
          :items="props.sources.brands"
          item-title="name"
          item-value="_id"
          label="Brand"
          variant="underlined"
          hide-details
          prepend-inner-icon="mdi-filter"
          :disabled="props.loading"
      />
    </div>

    <!-- Sort dropdown -->
    <div class="filter-item">
      <v-select
          v-model="localSort"
          :items="sortOptions"
          item-title="text"
          item-value="value"
          label="Sort by"
          variant="underlined"
          hide-details
          prepend-inner-icon="mdi-sort"
          :disabled="props.loading"
      />
    </div>

    <!-- Countries dropdown -->
    <div class="filter-item">
      <v-autocomplete
          v-model="localCountries"
          :items="props.sources.countries"
          item-title="value"
          item-value="abbreviation"
          label="Country Selection"
          variant="underlined"
          hide-details
          multiple
          chips
          closable-chips
          prepend-inner-icon="mdi-filter"
          :disabled="props.loading"
      />
    </div>

    <!-- Filter type dropdown -->
    <div class="filter-item">
      <v-select
          v-model="localStatus"
          :items="filterOptions"
          item-title="text"
          item-value="value"
          label="Filter by"
          variant="underlined"
          hide-details
          prepend-inner-icon="mdi-filter"
          :disabled="props.loading"
      />
    </div>

    <!-- Search field -->
    <div class="filter-item search-field">
      <v-text-field
          v-model="localSearch"
          placeholder="Search..."
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          hide-details
          flat
          single-line
          clearable
          :disabled="props.loading"
      />
    </div>

    <!-- Create button -->
    <div class="filter-item create-button">
      <create-mediaplan-button :disabled="props.loading" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MediaplanFilter, FilterSources } from '@/types';
import CreateMediaplanButton from "@/components/overview/CreateMediaplanButton.vue";

// Props
const props = defineProps<{
  filters: MediaplanFilter;
  sources: FilterSources;
  loading: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}>();

// Emits
const emit = defineEmits<{
  (e: 'update:filter', payload: { key: keyof MediaplanFilter; value: unknown }): void;
  (e: 'update:sort',   payload: { sortBy: string; sortOrder: 'asc'|'desc' }): void;
}>();

// Sort & filter options
const sortOptions = [
  { text: 'Last updated first', value: 'updated_at:desc' },
  { text: 'Earliest Start Date first', value: 'start_date:asc' },
  { text: 'Start Date Descending', value: 'start_date:desc' },
  { text: 'Creation Date Ascending', value: 'created_at:asc' },
  { text: 'Creation Date Descending', value: 'created_at:desc' },
  { text: 'End Date Ascending', value: 'end_date:asc' },
  { text: 'End Date Descending', value: 'end_date:desc' },
  { text: 'Budget Highest First', value: 'budget.total:desc' },
  { text: 'Budget Lowest First', value: 'budget.total:asc' }
];
const filterOptions = [
  { text: 'All', value: '' },
  { text: 'Created by me', value: 'created_by_me' },
  { text: 'Approval requested', value: 'approval_requested' },
  { text: 'Currently running', value: 'currently_running' },
  { text: 'Active', value: 'active' },
  { text: 'Inactive', value: 'inactive' },
  { text: 'Draft', value: 'draft' },
  { text: 'Archived', value: 'archived' },
  { text: 'For Approval', value: 'for_approval' }
];

// Computed bridges for v-model
const localSearch = computed({
  get: () => props.filters.search || '',
  set: v => emit('update:filter', { key: 'search', value: v })
});
const localBrandId = computed({
  get: () => props.filters.brand_id || null,
  set: v => emit('update:filter', { key: 'brand_id', value: v })
});
const localStatus = computed({
  get: () => props.filters.status || '',
  set: v => emit('update:filter', { key: 'status', value: v })
});
const localCountries = computed<string[]>({
  get: () => props.filters.country ? (props.filters.country as string).split(',') : [],
  set: arr => emit('update:filter', { key: 'country', value: arr.join(',') })
});
const localSort = computed({
  get: () => `${props.sortBy}:${props.sortOrder}`,
  set: v => {
    const [by, order] = v.split(':') as [string, 'asc'|'desc'];
    emit('update:sort', { sortBy: by, sortOrder: order });
  }
});
</script>

<style scoped>
.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  width: 100%;
}
.filter-item {
  min-width: 180px;
}
/* Search field grows to fill available space */
.search-field {
  flex-grow: 1;
  min-width: 200px;
  max-width: 280px;
}
/* Create button stays on the right */
.create-button {
  margin-left: auto;
  min-width: auto;
}
/* Media queries for smaller screens */
@media (max-width: 1200px) {
  .filter-item {
    min-width: 160px;
  }
}
@media (max-width: 960px) {
  .filter-container {
    grid-template-columns: 1fr 1fr;
  }
  .filter-item {
    min-width: 140px;
  }
  .search-field {
    flex-basis: 100%;
    order: 5;
  }
  .create-button {
    margin-left: 0;
    flex-basis: 100%;
    order: 6;
    display: flex;
    justify-content: flex-end;
  }
}
@media (max-width: 600px) {
  .filter-item {
    flex-basis: 100%;
  }
}
</style>