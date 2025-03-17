<template>
  <MainLayout>
    <v-row class="pb-3 pt-1">
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
  </MainLayout>
</template>

<script setup lang="ts">
import {ref, reactive, watch} from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import MediaplanFilters from '@/components/overview/MediaplanFilters.vue';
import MediaplanList from '@/components/overview/MediaplanList.vue';
import {MediaplanFilter} from '@/types/mediaplan';

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

// Watch for country filter changes and update filters
watch(countryFilter, (newCountry) => {
  // Add country-specific logic here if needed
  // For example, you might want to update the filters.search
});

const openCreateMediaplanDialog = () => {
  // Add your logic to open a dialog or navigate to create page
};
</script>