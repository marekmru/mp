<template>
  <MainLayout>
    <div class="mediaplan-detail">
      <v-alert v-if="errorMediaplan" type="error" density="compact" class="mb-4" closable>
        {{ errorMediaplan }}
      </v-alert>

      <div v-if="isLoadingMediaplan && !mediaplan" class="text-center my-10">
        <v-progress-circular indeterminate color="primary" size="40"></v-progress-circular>
        <p class="mt-2 text-disabled">Loading Mediaplan...</p>
      </div>

      <template v-if="!isLoadingMediaplan && mediaplan">
        <v-row class="mb-0">
          <v-col cols="12" md="5" class="d-flex align-center">
            <MediaplanBreadcrumb
                :mediaplan="mediaplan"
                :project="null"
            />
          </v-col>
          <v-col cols="12" md="7">
            <MediaplanHeader
                :plan-budget="mediaplan.budget?.total || 0"
                :used-percentage="calculatePercentage(mediaplan.budget?.used, mediaplan.budget?.total)"
                :search="search"
                @update:search="updateSearch"
            />
          </v-col>
        </v-row>

        <v-row class="mb-4">
          <v-col cols="12" sm="auto">
            <MediaplanViewToggle
                v-model="currentView"
            />
          </v-col>
        </v-row>

        <div class="main-content">
          <MediaplanPlanningView
              v-if="currentView === 'planning'"
              :projects="projects"
              :total-projects="totalProjects"
              :is-loading="isLoadingProjects"
              :current-page="projectCurrentPage"
              :items-per-page="projectItemsPerPage"
              :mediaplan-id="mediaplanId"
              @update:options="handleProjectOptionsUpdate"
              @add-project="openCreateProjectDialog"
          />

          <MediaplanBudgetView v-else :mediaplan="mediaplan"/>

          <v-alert v-if="projectError && currentView === 'planning'" type="error" density="compact" class="mt-4"
                   closable>
            Failed to load projects: {{ projectError }}
          </v-alert>
        </div>
      </template>
      <template v-else-if="!isLoadingMediaplan && !mediaplan && errorMediaplan">
        <div class="text-center my-10 text-disabled">
          <v-icon size="x-large" class="mb-2">mdi-alert-circle-outline</v-icon>
          <p>Could not load Mediaplan data.</p>
        </div>
      </template>

      <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn icon @click="snackbar.show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">


import {ref, computed, onMounted, reactive, watch} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue'; // Pfad prüfen
import MediaplanBreadcrumb from '@/components/mediaplan/MediaplanBreadcrumb.vue'; // Pfad prüfen
import MediaplanViewToggle from '@/components/mediaplan/MediaplanViewToggle.vue'; // Pfad prüfen
import MediaplanHeader from '@/components/mediaplan/MediaplanHeader.vue'; // Pfad prüfen
import MediaplanPlanningView from '@/components/mediaplan/MediaplanPlanningView.vue'; // Pfad prüfen
import MediaplanBudgetView from '@/components/mediaplan/MediaplanBudgetView.vue'; // Pfad prüfen
import {useMediaplanStore} from '@/stores/mediaplanStore'; // Pfad prüfen
import {useProjectStore} from '@/stores/projectStore'; // Pfad prüfen
import type {Mediaplan} from '@/types/mediaplan'; // Pfad prüfen
import type {Project} from '@/types/project'; // Pfad prüfen
// Importiere den Helper direkt, wenn er nicht global ist
import {calculatePercentage} from '@/helpers/currencyUtils'; // Pfad prüfen

// --- Props & Route ---
const props = defineProps<{
  id?: string; // Accept the id from the router
}>();

const route = useRoute();
const router = useRouter();
// Verwende die ID aus der Route als primäre Quelle
const mediaplanId = ref(props.id || route.params.id as string); // Diese Variable hält die ID

// --- Stores ---
const mediaplanStore = useMediaplanStore();
const projectStore = useProjectStore();

// --- Computed Properties from Stores ---
// Mediaplan Details (Annahme: Store hat 'selectedMediaplan' und 'isLoading')
const mediaplan = computed(() => mediaplanStore.selectedMediaplan);
const isLoadingMediaplan = computed(() => mediaplanStore.isLoading); // Nutzt generisches isLoading oder ein spezifisches
const errorMediaplan = computed(() => mediaplanStore.error);

// Projects (Verwendet States aus dem projectStore)
const projects = computed(() => projectStore.projects);
const totalProjects = computed(() => projectStore.totalItems);
const isLoadingProjects = computed(() => projectStore.isLoading);
const projectError = computed(() => projectStore.error);
const projectCurrentPage = computed(() => projectStore.currentPage); // 0-basiert
const projectItemsPerPage = computed(() => projectStore.perPage);
const projectTotalPages = computed(() => projectStore.totalPages); // Wird für die Paginierungsinfo benötigt

// --- UI State ---
const currentView = ref<string>('planning'); // 'planning' or 'budget'
const search = ref<string>(''); // Such-State für MediaplanHeader (kann später auch an Project-Filterung gekoppelt werden)

// --- Snackbar ---
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
});

// --- Methods ---

// Handler für Optionen-Updates von MediaplanPlanningView (v-data-table-server)
// Diese Funktion wird aufgerufen, wenn Seite, Items pro Seite oder Sortierung sich ändern
const handleProjectOptionsUpdate = (options: {
  page: number;
  itemsPerPage: number;
  sortBy?: any[];
  sortDesc?: boolean[]
}) => {
  const newZeroBasedPage = options.page - 1; // Tabelle ist 1-basiert, Store 0-basiert

  // Paginierung aktualisieren, falls geändert
  if (newZeroBasedPage !== projectCurrentPage.value) {
    projectStore.currentPage = newZeroBasedPage; // Direkte Zuweisung oder Aktion
    projectStore.fetchProjects(mediaplanId.value); // Neu laden für die neue Seite
  }
  if (options.itemsPerPage !== projectItemsPerPage.value) {
    projectStore.perPage = options.itemsPerPage; // Direkte Zuweisung oder Aktion
    // Wenn Items pro Seite geändert werden, normalerweise zur ersten Seite zurückkehren
    if (projectStore.currentPage !== 0) {
      projectStore.currentPage = 0;
    }
    projectStore.fetchProjects(mediaplanId.value); // Neu laden mit neuer Seitengröße
  }

  // Optional: Sortierung aktualisieren, falls implementiert
  // if (options.sortBy && options.sortBy.length > 0) {
  //     const sortConfig = options.sortBy[0];
  //     if (sortConfig.key !== projectStore.sortBy || (sortConfig.order !== projectStore.sortOrder)) {
  //        // Annahme: projectStore hat setSorting(field, order) Aktion
  //        projectStore.setSorting(sortConfig.key, sortConfig.order);
  //     }
  // } else {
  //    // Ggf. Standard-Sortierung wiederherstellen
  // }
};


const openCreateProjectDialog = () => {
  // Navigation oder Dialog zum Erstellen eines Projekts
  console.log('Trigger create project for Mediaplan ID:', mediaplanId.value);
  // Beispiel Navigation:
  // router.push({ name: 'CreateProject', params: { mediaplanId: mediaplanId.value } });
  // Beispiel Dialog:
  // showCreateProjectDialog.value = true; // Benötigt ref und Dialog-Komponente im Template
};

// Wird von MediaplanHeader aufgerufen
const updateSearch = (value: string) => {
  search.value = value;
  // TODO: Hier könnte man die Projektliste filtern, wenn die Suche darauf angewendet werden soll
  // Entweder Client-seitig (projects.value filtern) oder Server-seitig (projectStore.setFilter('search', value))
};

const showSnackbar = (text: string, color: 'success' | 'error' | 'info' = 'success') => {
  snackbar.text = text;
  snackbar.color = color;
  snackbar.show = true;
};

// --- Lifecycle Hooks ---
onMounted(() => {
  if (!mediaplanId.value) {
    console.error('No mediaplan ID provided');
    mediaplanStore.error = 'No mediaplan ID provided'; // Setze Fehler im Store
    return;
  }
  // Lade Mediaplan-Details und Projekte über die Stores
  mediaplanStore.fetchMediaplan(mediaplanId.value);
  projectStore.fetchProjects(mediaplanId.value); // Lädt die erste Seite der Projekte
});

// --- Watchers ---
// Wenn sich die ID ändert (z.B. durch Navigation), Daten neu laden
watch(() => route.params.id, (newId) => {
  if (newId && typeof newId === 'string' && newId !== mediaplanId.value) {
    mediaplanId.value = newId;
    mediaplanStore.fetchMediaplan(newId);
    projectStore.fetchProjects(newId);
  }
});

// Fehlerbehandlung beobachten
watch(errorMediaplan, (newError) => {
  if (newError) showSnackbar(`Error loading mediaplan: ${newError}`, 'error');
});
watch(projectError, (newError) => {
  if (newError) showSnackbar(`Error loading projects: ${newError}`, 'error');
});

</script>

<style scoped>
.mediaplan-detail {
  min-height: calc(100vh - 64px); /* Adjust for the navbar height */
}

.main-content {
  min-height: 60vh;
}
</style>