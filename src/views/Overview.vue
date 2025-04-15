
<template>
  <MainLayout>
    <v-row class="pb-6 pt-1">
      <v-col>
        <mediaplan-filters
            :initial-filters="filters"
            :sources="sources"
            :loading="isLoading"
            :current-sort-by="sortBy"
            :current-sort-order="sortOrder"
            @update:filter="handleFilterUpdate"
            @update:sort="handleSortUpdate"
            @clear="handleClearFilters"
            @create-mediaplan="openCreateMediaplanDialog"
        />
      </v-col>
    </v-row>

    <mediaplan-list
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
import {ref, computed, watch, onMounted, reactive} from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import MediaplanFilters from '@/components/overview/MediaplanFilters.vue'; // Pfad prüfen
import MediaplanList from '@/components/overview/MediaplanList.vue'; // Pfad prüfen
import CreateMediaplanDialog from '@/components/overview/CreateMediaplanDialog.vue'; // Pfad prüfen
import { useMediaplanStore } from '@/stores/mediaplanStore';
import type { MediaplanFilter } from '@/types'; // Pfad prüfen

// --- Store ---
const mediaplanStore = useMediaplanStore();

// --- Computed properties directly from store ---
const filters = computed(() => mediaplanStore.filters);
const sortBy = computed(() => mediaplanStore.sortBy);
const sortOrder = computed(() => mediaplanStore.sortOrder);
const currentPage = computed(() => mediaplanStore.currentPage); // 0-basiert vom Store
const perPage = computed(() => mediaplanStore.perPage);
const totalPages = computed(() => mediaplanStore.totalPages);
const totalItems = computed(() => mediaplanStore.totalItems);
const mediaplans = computed(() => mediaplanStore.mediaplans);
const isLoading = computed(() => mediaplanStore.isLoading);
const sources = computed(() => mediaplanStore.sources); // Für Filter-Optionen
console.log('--- Environment Test ---');
console.log('Mode:', import.meta.env.MODE); // Should be 'development'
console.log('Test Variable:', import.meta.env.VITE_API_BASE_CORE4);
console.log('Dev Only Var:', import.meta.env.VITE_API_BASE_MEDIAPLAN);
console.log('All Env:', JSON.stringify(import.meta.env, null, 2)); // See everything Vite exposes
console.log('--- End Environment Test ---');
// --- Dialog control ---
const showCreateMediaplanDialog = ref(false);

// --- Snackbar ---
// Behalte lokale Snackbar-Logik bei oder integriere ein globales System
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
});

// --- Event Handlers ---

// Handler für Filter-Änderungen von MediaplanFilters
// WICHTIG: MediaplanFilters muss @update:filter(key, value) und @clear emittieren
const handleFilterUpdate = (key: keyof MediaplanFilter, value: any) => {
  // setFilter aktualisiert den Store-Filter, setzt Seite auf 0 und lädt neu
  mediaplanStore.setFilter(key, value);
};

const handleClearFilters = () => {
  // clearFilters setzt Store-Filter zurück, Seite auf 0 und lädt neu
  mediaplanStore.clearFilters();
};

// Handler für Sortier-Änderungen von MediaplanFilters (oder MediaplanList)
// WICHTIG: Die Komponente muss die Sortierungsinformation passend emittieren
const handleSortUpdate = (payload: { sortBy: string, sortOrder: 'asc' | 'desc' }) => {
  if (payload.sortBy !== sortBy.value || payload.sortOrder !== sortOrder.value) {
    // setSorting aktualisiert Store und lädt neu
    mediaplanStore.setSorting(payload.sortBy, payload.sortOrder);
  }
};

// Handler für Seiten-Änderungen von MediaplanList (oder PaginationControls)
const handlePageUpdate = (newPage: number) => {
  // Das Event von v-pagination ist oft 1-basiert, Store ist 0-basiert
  const newZeroBasedPage = newPage - 1;
  if (newZeroBasedPage !== currentPage.value) {
    // setPage aktualisiert Store und lädt neu
    mediaplanStore.setPage(newZeroBasedPage);
  }
};

// Handler für 'Items per Page'-Änderungen (falls benötigt)
const handleItemsPerPageUpdate = (newPerPage: number) => {
  if (newPerPage !== perPage.value) {
    mediaplanStore.perPage = newPerPage; // Direkte Zuweisung (oder Aktion, falls Validierung nötig)
    mediaplanStore.setPage(0); // Auf erste Seite zurücksetzen und neu laden
  }
};

const openCreateMediaplanDialog = () => {
  showCreateMediaplanDialog.value = true;
};

const handleMediaplanCreated = (mediaplanId: string) => {
  console.log('Mediaplan created with ID:', mediaplanId);
  // Schließe Dialog ggf. hier oder warte auf Projekterstellung
};

const handleProjectCreated = (projectId: string) => {
  console.log('Project created with ID:', projectId);
  showSuccess('Project created successfully');
  showCreateMediaplanDialog.value = false; // Dialog schließen
  // Store fetch wird implizit getriggert, wenn eine neue Ressource relevant wird,
  // oder explizit, falls nötig (obwohl fetchMediaplans hier evtl. nicht direkt hilft)
  // mediaplanStore.fetchMediaplans(); // Sicherstellen, dass die Liste aktualisiert wird
};

const showSuccess = (message: string) => {
  snackbar.color = 'success';
  snackbar.text = message;
  snackbar.show = true;
};

// --- Initial Load ---
onMounted(() => {
  // Lädt Filter-Quellen und die erste Seite Mediapläne über den Store
  mediaplanStore.init();
});

</script>
