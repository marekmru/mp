<!-- File: src/views/Overview.vue -->
<template>
  <MainLayout>
    <v-row class="pb-6 pt-1">
      <v-col>
        <MediaplanFilters
            :filters="filters"
            :loading="isLoading"
            :sort-by="sortBy"
            :sort-order="sortOrder"
            @update:filter="handleFilterUpdate"
            @update:sort="handleSortUpdate"
        />
      </v-col>
    </v-row>

    <MediaplanList
        :mediaplans="mediaplans"
        :is-loading="isLoading"
        :total-pages="totalPages"
        :total-items="totalItems"
        :current-page="currentPage"
        :items-per-page="perPage"
        @update:page="handlePageUpdate"
        @update:items-per-page="handleItemsPerPageUpdate"
    />

    <CreateMediaplanDialog
        v-model="showCreateMediaplanDialog"
        @created="handleMediaplanCreated"
        @project-created="handleProjectCreated"
    />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, reactive } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import MediaplanFilters from '@/components/overview/MediaplanFilters.vue';
import MediaplanList from '@/components/overview/MediaplanList.vue';
import CreateMediaplanDialog from '@/components/overview/CreateMediaplanDialog.vue';
import { useMediaplanStore } from '@/stores/mediaplanStore';
import type { MediaplanFilter } from '@/types';

// --- Store ---
const store = useMediaplanStore();

// --- Computed from store ---
const filters     = computed(() => store.filters);
const sortBy      = computed(() => store.sortBy);
const sortOrder   = computed(() => store.sortOrder);
const currentPage = computed(() => store.currentPage);
const perPage     = computed(() => store.perPage);
const totalPages  = computed(() => store.totalPages);
const totalItems  = computed(() => store.totalItems);
const mediaplans  = computed(() => store.mediaplans);
const isLoading   = computed(() => store.isLoading);

// --- Dialog control ---
const showCreateMediaplanDialog = ref(false);

// --- Snackbar ---
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
});

// --- Event Handlers ---
function handleFilterUpdate(key: keyof MediaplanFilter, value: any) {
  store.setFilter(key, value);
}

function handleSortUpdate(payload: { sortBy: string; sortOrder: 'asc' | 'desc' }) {
  if (payload.sortBy !== sortBy.value || payload.sortOrder !== sortOrder.value) {
    store.setSorting(payload.sortBy, payload.sortOrder);
  }
}

function handlePageUpdate(newPage: number) {
  // v-pagination is 1-based; our store is 0-based
  const zeroPage = newPage - 1;
  if (zeroPage !== currentPage.value) {
    store.setPage(zeroPage);
  }
}

function handleItemsPerPageUpdate(newPerPage: number) {
  if (newPerPage !== perPage.value) {
    store.perPage = newPerPage;
    store.setPage(0);
  }
}

function handleMediaplanCreated(id: string) {
  console.log('Mediaplan created:', id);
}

function handleProjectCreated(id: string) {
  snackbar.color = 'success';
  snackbar.text = 'Project created successfully';
  snackbar.show = true;
  showCreateMediaplanDialog.value = false;
}

// --- Init ---
onMounted(() => {
  store.init();
});
</script>