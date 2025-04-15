<template>
  <div v-if="isLoading && mediaplans.length === 0" class="d-flex justify-center align-center my-10">
    <v-progress-circular indeterminate color="primary" size="64"/>
  </div>
  <div v-else>
    <v-row v-if="mediaplans.length > 0" class="justify-center">
      <v-col
          v-for="mediaplan in mediaplans"
          :key="mediaplan._id"
          cols="12" sm="6" md="4" lg="3"
          class="mb-4 mediaplan-col d-flex"
      >
        <mediaplan-card
            :mediaplan="mediaplan"
            class="flex-grow-1"
            @view="viewMediaplan"
        />
      </v-col>
    </v-row>

    <div v-if="!isLoading && mediaplans.length === 0" class="text-center my-10 text-disabled">
      <v-icon size="x-large" class="mb-2">mdi-database-off-outline</v-icon>
      <p>No mediaplans found</p>
      <p class="text-caption">Try adjusting your filters.</p>
    </div>

    <pagination-controls
        v-if="!isLoading && totalPages > 1"
        v-model="paginationModel"
        :length="totalPages"
        :disabled="isLoading"
        :items-per-page-value="itemsPerPageModel"
        @update:items-per-page="itemsPerPageModel = $event"
    />

    <div v-if="!isLoading && totalItems > 0" class="text-center text-caption text-medium-emphasis mt-2">
      {{ paginationInfo }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue';
import {useRouter} from 'vue-router';
import type {Mediaplan} from '@/types/mediaplan'; // Pfad prüfen
import MediaplanCard from '@/components/overview/MediaplanCard.vue'; // Pfad prüfen
import PaginationControls from '@/components/common/PaginationControls.vue'; // Pfad prüfen

// --- Props ---
// Empfängt jetzt Daten und Zustand direkt von Overview.vue (aus dem Store)
interface Props {
  mediaplans: Mediaplan[];
  isLoading: boolean;
  totalPages: number;
  totalItems: number;
  currentPage: number; // 0-basiert
  itemsPerPage: number;
}

const props = defineProps<Props>();

// --- Emits ---
// Meldet nur noch Benutzerinteraktionen nach oben, die eine Änderung im Store erfordern
const emit = defineEmits<{
  (e: 'update:page', page: number): void; // Meldet gewünschte Seitenänderung (1-basiert von PaginationControls)
  (e: 'update:items-per-page', perPage: number): void; // Meldet gewünschte Items pro Seite Änderung
}>();

// --- Router ---
const router = useRouter();

// --- Computed Properties ---

// Aktuelle Seite für PaginationControls (oft 1-basiert)
const paginationModel = computed({
  get: () => props.currentPage + 1, // Konvertiere 0-basierte Prop zu 1-basierter Anzeige
  set: (value: number) => {
    // Wenn das v-model von PaginationControls sich ändert, wird das Event nach oben emittiert
    emit('update:page', value);
  }
});

// Aktuelle Items pro Seite für PaginationControls
const itemsPerPageModel = computed({
  get: () => props.itemsPerPage,
  set: (value: number) => {
    emit('update:items-per-page', value);
  }
});

// Info-Text für Paginierung
const paginationInfo = computed(() => {
  if (props.totalItems === 0) return '';
  const startItem = (props.currentPage * props.itemsPerPage) + 1;
  const endItem = Math.min(startItem + props.itemsPerPage - 1, props.totalItems);
  return `${startItem}-${endItem} of ${props.totalItems} mediaplans`;
});


// --- Methods ---
const viewMediaplan = (mediaplanId: string) => {
  router.push({name: 'MediaplanDetail', params: {id: mediaplanId}});
};

// --- Interne Logik ---
// Keine eigene Datenabfrage (fetchMediaplans) mehr
// Kein eigener Ladezustand, Fehlerstatus, etc. - kommt alles über Props

</script>


<style scoped>
.mediaplan-col {
  min-width: 300px; /* Etwas kleiner für bessere Anpassung */
  /* max-width: 420px; */ /* Max-Breite kann oft weggelassen werden, wenn cols gesetzt sind */
}

.d-flex {
  display: flex;
}

.flex-grow-1 {
  flex-grow: 1;
}
</style>