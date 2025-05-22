<template>
  <div class="filter-container">
    <div class="filter-item">
      <v-select
          v-model="localBrandId"
          :items="brandsFromStore"
          item-title="value"
          item-value="abbreviation"
          label="Brand"
          variant="underlined"
          return-object
          hide-details
          prepend-inner-icon="mdi-filter"
          :disabled="props.loading || sourcesStore.isLoading"
          :loading="sourcesStore.isLoading && !brandsFromStore.length"/>
    </div>
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

    <div class="filter-item">
      <v-autocomplete
          v-model="localCountries"
          :items="countriesFromStore" item-title="value" item-value="abbreviation" label="Country Selection"
          variant="underlined"
          hide-details
          multiple
          chips
          closable-chips
          prepend-inner-icon="mdi-filter"
          :disabled="props.loading || sourcesStore.isLoading"
          :loading="sourcesStore.isLoading && !countriesFromStore.length"/>
    </div>

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

    <div class="filter-item create-button">
      <create-mediaplan-button :disabled="props.loading"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import type {MediaplanFilter, Brand, Source} from '@/types';
import CreateMediaplanButton from "@/components/overview/CreateMediaplanButton.vue";
import {useSourcesStore} from '@/stores/sourcesStore';

const sourcesStore = useSourcesStore();

const props = defineProps<{
  filters: MediaplanFilter;
  loading: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}>();

const emit = defineEmits<{
  (e: 'update:filter', payload: { key: keyof MediaplanFilter; value: unknown }): void;
  (e: 'update:sort', payload: { sortBy: string; sortOrder: 'asc' | 'desc' }): void;
}>();

const sortOptions = [
  {text: 'Last updated first', value: 'updated_at:desc'},
  {text: 'Earliest Start Date first', value: 'start_date:asc'},
  {text: 'Budget Lowest First', value: 'budget.total:asc'}
];
const filterOptions = [
  {text: 'All', value: ''},
  {text: 'Created by me', value: 'created_by_me'},
  {text: 'For Approval', value: 'for_approval'}
];

const localSearch = computed({
  get: () => props.filters.search || '',
  set: v => emit('update:filter', {key: 'search', value: v})
});
const localBrandId = computed({
  get: () => props.filters.brand_id || null,
  set: v => emit('update:filter', {key: 'brand_id', value: v})
});
const localStatus = computed({
  get: () => props.filters.status || '',
  set: v => emit('update:filter', {key: 'status', value: v})
});
const localCountries = computed<string[]>({
  get: () => props.filters.country ? (props.filters.country as string).split(',') : [],
  set: arr => emit('update:filter', {key: 'country', value: arr.join(',')})
});
const localSort = computed({
  get: () => `${props.sortBy}:${props.sortOrder}`,
  set: v => {
    const [by, order] = v.split(':') as [string, 'asc' | 'desc'];
    emit('update:sort', {sortBy: by, sortOrder: order});
  }
});

const brandsFromStore = computed((): Brand[] => {
  return (sourcesStore.getSourceList('brand') as Brand[] | undefined) || [];
});

const countriesFromStore = computed((): Source[] => {
  return (sourcesStore.getSourceList('country') as Source[] | undefined) || [];
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

.search-field {
  flex-grow: 1;
  min-width: 200px;
  max-width: 280px;
}

.create-button {
  margin-left: auto;
  min-width: auto;
}

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