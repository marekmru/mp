<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import CountryFlag from '@/components/common/CountryFlag.vue'; // Pfad prüfen
import { getBrandLogo } from "@/helpers/brandUtils"; // Pfad prüfen
import type { Project } from '@/types/project'; // Pfad prüfen

// --- Props ---
interface Props {
  projects: Project[];        // Projektliste vom Store
  totalProjects: number;      // Gesamtzahl für Paginierung
  isLoading: boolean;         // Ladezustand vom Store
  currentPage: number;        // Aktuelle Seite (0-basiert) vom Store
  itemsPerPage: number;       // Items pro Seite vom Store
}

const props = withDefaults(defineProps<Props>(), {
  projects: () => [],
  totalProjects: 0,
  isLoading: false,
  currentPage: 0,
  itemsPerPage: 10 // Sollte mit projectStore Standard übereinstimmen
});

// --- Emits ---
const emit = defineEmits<{
  (e: 'addProject'): void; // Event zum Hinzufügen eines Projekts
  // Event, das Optionen-Änderungen an MediaplanDetail meldet
  (e: 'update:options', options: { page: number; itemsPerPage: number; sortBy?: any[]; sortDesc?: boolean[] }): void;
}>();

// --- Lokale Refs für v-data-table-server Models ---
// Diese spiegeln die Props und ermöglichen v-model Bindung.
// Die Tabelle erwartet page als 1-basiert.
const pageModel = computed({
  get: () => props.currentPage + 1, // Konvertiere 0-basiert zu 1-basiert
  set: (value) => {
    // Direkte Aktualisierung hier vermeiden, stattdessen Event auslösen
    // Das Event wird im `onOptionsUpdate` behandelt
  }
});

const itemsPerPageModel = computed({
  get: () => props.itemsPerPage,
  set: (value) => {
    // Direkte Aktualisierung hier vermeiden, stattdessen Event auslösen
    // Das Event wird im `onOptionsUpdate` behandelt
  }
});


// --- Tabellen-Header ---
const headers = [
  { title: '', key: 'edit', sortable: false, width: '50px' },
  { title: 'Name', key: 'abbreviation', sortable: true, align: 'start' }, // Sortierung ggf. serverseitig implementieren
  { title: 'Country', key: 'descriptive_vars.country', sortable: true }, // Sortierung für verschachtelte Felder serverseitig nötig
  { title: 'Duration', key: 'duration.formatted', sortable: false }, // Nach formatiertem String nicht gut sortierbar
  { title: 'Detail', key: 'detail', sortable: true },
  { title: 'Campaign Type', key: 'default_vars.campaigntype', sortable: true },
  { title: 'Subsegment', key: 'default_vars.subsegment', sortable: true },
  { title: 'Locked', key: 'is_locked', sortable: true, align: 'center' }, // Nach Boolean sortierbar
  { title: 'Actions', key: 'actions', sortable: false, align: 'center', width: '50px' }
];

// --- Methoden ---

// Wird von v-data-table-server ausgelöst, wenn sich Optionen ändern
const onOptionsUpdate = (options: { page: number; itemsPerPage: number; sortBy?: any[]; sortDesc?: boolean[] }) => {
  // Leite die Optionen an die Parent-Komponente (MediaplanDetail) weiter
  emit('update:options', options);
};

// Methode für den "Add Project" Button
const addProject = () => {
  emit('addProject');
};

</script>

<template>
  <div class="planning-view-container mt-4">
    <v-card class="projects-table elevation-0" variant="flat">
      <v-theme-provider theme="dark">
        <v-data-table-server
            v-model:items-per-page="itemsPerPageModel"
            v-model:page="pageModel"
            :headers="headers"
            :items="projects"
            :items-length="totalProjects"
            :loading="isLoading"
            item-value="_id"
            hover
            class="projects-data-table"
            @update:options="onOptionsUpdate"
        >
          <template v-slot:item.edit="{ item }">
            <v-btn icon density="comfortable" variant="text" color="grey">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>

          <template v-slot:item.abbreviation="{ item }">
            <div class="d-flex align-center" v-if="item.abbreviation">
              <v-avatar size="32" class="mr-2 grey lighten-4"
                        :image="getBrandLogo(item.descriptive_vars?.brand)"></v-avatar>
              <span>{{ item.abbreviation }}</span>
            </div>
            <div v-else>N/A</div>
          </template>

          <template v-slot:item.descriptive_vars.country="{ item }">
            <div class="d-flex align-center" v-if="item.descriptive_vars?.country">
              <CountryFlag size="1rem" :country="item.descriptive_vars.country" class="mr-2"/>
              <span>{{ item.descriptive_vars.country }}</span>
            </div>
            <div v-else>N/A</div>
          </template>

          <template v-slot:item.duration.formatted="{ item }">
            <div class="d-flex align-center" v-if="item.duration?.formatted">
              <v-icon size="small" class="mr-2">mdi-calendar-range</v-icon>
              <span>{{ item.duration.formatted }}</span>
            </div>
            <div v-else>N/A</div>
          </template>

          <template v-slot:item.detail="{ item }">
            <span class="d-inline-block text-truncate" style="max-width: 150px;">{{ item.detail || 'N/A' }}</span>
            <v-tooltip v-if="item.detail && item.detail.length > 30" activator="parent" location="top" max-width="300px">{{ item.detail }}</v-tooltip>
          </template>

          <template v-slot:item.default_vars.campaigntype="{ item }">
            {{ item.default_vars?.campaigntype || 'N/A' }}
          </template>

          <template v-slot:item.default_vars.subsegment="{ item }">
            {{ item.default_vars?.subsegment || 'N/A' }}
          </template>

          <template v-slot:item.is_locked="{ item }">
            <v-icon v-if="item.is_locked != null" :color="item.is_locked ? 'orange' : 'grey-lighten-1'">
              {{ item.is_locked ? 'mdi-lock' : 'mdi-lock-open-variant' }}
            </v-icon>
            <v-tooltip activator="parent" location="top">{{ item.is_locked ? 'Locked' : 'Unlocked' }}</v-tooltip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn icon variant="text" density="comfortable">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <template v-slot:loading>
            <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
          </template>

          <template v-slot:no-data>
            <div class="text-center pa-4">
              <p>No projects found for this mediaplan.</p>
            </div>
          </template>


          <template v-slot:bottom>
            <div class="d-flex align-center pa-4 bg-grey-lighten-2">
              <v-btn
                  prepend-icon="mdi-plus"
                  class="black-text-button"
                  variant="text"
                  color="black"
                  @click="addProject"
                  :disabled="isLoading"
              >
                Add Project
              </v-btn>
            </div>
          </template>
        </v-data-table-server>
      </v-theme-provider>
    </v-card>
  </div>

</template>

<style scoped>
.planning-view-container {
  overflow: hidden;
}

/* Dark Theme Anpassungen für Tabelle */
.projects-data-table :deep(thead th) { /* Gezielt auf Header-Zellen */
  background-color: #4D4D4D !important;
  color: white !important;
  font-weight: 500;
}

.projects-data-table :deep(tbody tr) { /* Gezielt auf Body-Zeilen */
  background-color: #4D4D4D !important;
  color: white !important;
  border-bottom: 4px solid #FFFFFF !important; /* Weißer Rand zwischen Zeilen */
}
.projects-data-table :deep(tbody tr:hover) { /* Hover-Effekt */
  background-color: #5A5A5A !important;
}

.projects-data-table :deep(td) { /* Allgemeine Zellenstile */
  color: white !important;
  height: 60px; /* Feste Höhe beibehalten */
  vertical-align: middle;
}

/* Icons und Avatare anpassen */
.projects-data-table :deep(.v-icon),
.projects-data-table :deep(.v-avatar) {
  color: white !important;
  background-color: transparent !important; /* Sicherstellen, dass Avatare keinen eigenen Hintergrund haben */
}
.projects-data-table :deep(.v-avatar.grey) { /* Spezifischer Fallback-Avatar */
  background-color: #757575 !important; /* Dunkleres Grau */
}

/* Knöpfe in der Tabelle */
.projects-data-table :deep(.v-btn) {
  color: white !important;
}

/* "Add Project" Button im Footer */
.black-text-button {
  color: black !important;
}
.black-text-button :deep(.v-btn__content),
.black-text-button :deep(.v-btn__prepend) .v-icon { /* Icon auch anpassen */
  color: black !important;
}

/* Veraltete Stile entfernen oder anpassen */
/* .projects-data-table :deep(.v-data-table__tr:not(:last-child)) { border-bottom: none !important; } */ /* Nicht mehr nötig durch border an tr */
</style>