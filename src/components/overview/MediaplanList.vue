<template>
  <v-row class="justify-center">
    <v-col
        v-for="mediaplan in mediaplans"
        :key="mediaplan._id"
        cols="12" sm="6" md="4" lg="3"
        class="mb-4 mediaplan-col"
    >
      <mediaplan-card
          :mediaplan="mediaplan"
          @view="viewMediaplan"
      />
    </v-col>
  </v-row>

  <div v-if="loading" class="d-flex justify-center align-center my-4">
    <v-progress-circular indeterminate color="primary"/>
  </div>

  <div v-if="!loading && mediaplans.length === 0" class="text-center my-6">
    <v-icon icon="mdi-alert-circle-outline" size="large" color="grey" class="mb-2"/>
    <div class="text-h6 text-grey">No mediaplans found</div>
    <div class="text-body-2 text-grey">Try adjusting your filters or create a new mediaplan</div>
  </div>

  <!-- Pagination Controls -->
  <pagination-controls
      v-if="!loading && totalPages > 1"
      v-model="currentPage"
      :length="totalPages"
      :disabled="loading"
      :items-per-page-value="perPage"
      @update:items-per-page="handleItemsPerPageChange"
  />

  <!-- Total Items Display -->
  <div v-if="!loading && mediaplans.length > 0" class="text-center text-caption text-medium-emphasis mt-2">
    Showing {{ paginationInfo }}
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, computed} from 'vue';
import {Mediaplan} from '@/types/mediaplan';
import MediaplanCard from '@/components/overview/MediaplanCard.vue';
import PaginationControls from '@/components/common/PaginationControls.vue';
// import customFetch from '@/customFetch'; // Commented out until API is ready
import {mockFetchMediaplans} from '@/mocks/mediaplans'; // Import mock data service

interface Props {
  filters?: {
    search?: string;
    status?: string;
    startDateBefore?: string;
    startDateAfter?: string;
    brandId?: string;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => ({}),
  sortBy: 'updated_at',
  sortOrder: 'desc',
  page: 0,
  perPage: 10
});

const emit = defineEmits<{
  (e: 'update:page', page: number): void;
  (e: 'update:per-page', perPage: number): void;
  (e: 'update:total-pages', totalPages: number): void;
  (e: 'update:total-items', totalItems: number): void;
}>();

const mediaplans = ref<Mediaplan[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const totalPages = ref(0);
const totalItems = ref(0);

// Use internal current page state that syncs with props.page
const currentPage = computed({
  get: () => props.page,
  set: (value: number) => {
    emit('update:page', value);
  }
});

// Compute pagination info text for display
const paginationInfo = computed(() => {
  const startItem = (props.page * props.perPage) + 1;
  const endItem = Math.min(startItem + props.perPage - 1, totalItems.value);
  return `${startItem}-${endItem} of ${totalItems.value} mediaplans`;
});

// Use internal per-page state that syncs with props.perPage
const perPage = computed({
  get: () => props.perPage,
  set: (value: number) => {
    emit('update:per-page', value);
  }
});

const fetchMediaplans = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Comment out the actual API call
    /*
    // Construct query parameters
    const params = new URLSearchParams();
    params.append('page', props.page.toString());
    params.append('per_page', props.perPage.toString());
    params.append('sort', props.sortBy);
    params.append('order', props.sortOrder);

    if (props.filters) {
      const filterStr = JSON.stringify(props.filters);
      params.append('filter', filterStr);
    }

    const data = await customFetch(`/mediaplans?${params.toString()}`);
    */

    // Use mock data service instead
    const data = await mockFetchMediaplans(
        props.page,
        props.perPage,
        props.filters,
        props.sortBy,
        props.sortOrder
    );

    mediaplans.value = data.items;
    totalPages.value = data.total_pages;
    totalItems.value = data.total_items;

    // Emit events for pagination
    emit('update:total-pages', data.total_pages);
    emit('update:total-items', data.total_items);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('Error fetching mediaplans:', err);
  } finally {
    loading.value = false;
  }
};

const viewMediaplan = (mediaplanId: string) => {
  window.location.href = `/mediaplans/${mediaplanId}`;
};

const handleItemsPerPageChange = (value: number) => {
  perPage.value = value;
  currentPage.value = 0; // Reset to first page when changing items per page
};

watch(() => [props.page, props.perPage, props.sortBy, props.sortOrder, props.filters],
    () => {
      fetchMediaplans();
    },
    {deep: true}
);

onMounted(() => {
  fetchMediaplans();
});
</script>

<style scoped>
.mediaplan-col {
  min-width: 350px;
  max-width: 420px;
}
</style>