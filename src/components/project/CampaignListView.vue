<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Campaign } from '@/types/campaign'; // Pfad prüfen

// --- Props ---
interface Props {
  campaigns: Campaign[];        // Kampagnenliste vom Store
  totalCampaigns: number;     // Gesamtzahl für Paginierung
  isLoading: boolean;         // Ladezustand vom Store
  currentPage: number;        // Aktuelle Seite (0-basiert) vom Store
  itemsPerPage: number;       // Items pro Seite vom Store
}

const props = withDefaults(defineProps<Props>(), {
  campaigns: () => [],
  totalCampaigns: 0,
  isLoading: false,
  currentPage: 0,
  itemsPerPage: 15 // Standardwert synchron mit Store halten
});

// --- Emits ---
const emit = defineEmits<{
  (e: 'addCampaign'): void; // Event zum Hinzufügen einer Kampagne
  // Event, das Optionen-Änderungen an ProjectDetail meldet
  (e: 'update:options', options: { page: number; itemsPerPage: number; sortBy?: any[]; sortDesc?: boolean[] }): void;
}>();

// --- Lokale Refs für v-data-table-server Models ---
const pageModel = computed({
  get: () => props.currentPage + 1, // Konvertiere 0-basiert zu 1-basiert
  set: (value) => { } // Wird durch onOptionsUpdate gehandhabt
});

const itemsPerPageModel = computed({
  get: () => props.itemsPerPage,
  set: (value) => { } // Wird durch onOptionsUpdate gehandhabt
});


// --- Tabellen-Header ---
// Passe diese Header an die 'Campaign' Struktur und die gewünschte Ansicht an
// Basierend auf Schema und Screenshot (einige Spalten vom Screenshot könnten eher LineItems sein)
const headers = ref([
  { title: 'Campaign Name', key: 'campaignname', sortable: true }, // Sortierung serverseitig?
  { title: 'Type', key: 'type', sortable: true },
  { title: 'Subsegment', key: 'subsegment', sortable: true },
  { title: 'Product', key: 'product', sortable: true },
  { title: 'Language', key: 'language', sortable: true },
  { title: 'Campaign Type', key: 'campaigntype', sortable: true },
  { title: 'Detail', key: 'campaigndetail', sortable: false }, // Sortierung nach Detail oft nicht sinnvoll
  { title: 'Created', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' }
]);

// --- Methoden ---
const onOptionsUpdate = (options: { page: number; itemsPerPage: number; sortBy?: any[]; sortDesc?: boolean[] }) => {
  emit('update:options', options);
};

const addCampaign = () => {
  emit('addCampaign');
};

// Methode zum Navigieren zur Kampagnen-Detailseite (falls vorhanden)
// const viewCampaign = (campaignId: string) => { ... router.push(...) };

</script>

<template>
  <div class="campaign-list-container mt-4">
    <v-card class="campaigns-table elevation-0" variant="flat">
      <v-data-table-server
          v-model:items-per-page="itemsPerPageModel"
          v-model:page="pageModel"
          :headers="headers"
          :items="campaigns"
          :items-length="totalCampaigns"
          :loading="isLoading"
          item-value="_id"
          hover
          class="campaigns-data-table"
          @update:options="onOptionsUpdate"

      >
        <template v-slot:item.campaignname="{ item }">
          {{ item.campaignname }}
        </template>

        <template v-slot:item.created_at="{ item }">
          {{ new Date(item.created_at).toLocaleDateString() }} </template>

        <template v-slot:item.campaigndetail="{ item }">
              <span class="d-inline-block text-truncate" style="max-width: 200px;">
                  {{ item.campaigndetail || '-' }}
               </span>
          <v-tooltip v-if="item.campaigndetail && item.campaigndetail.length > 30" activator="parent" location="top" max-width="300px">
            {{ item.campaigndetail }}
          </v-tooltip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" density="comfortable" v-bind="props"></v-btn>
            </template>
            <v-list density="compact">
              <v-list-item @click="() => console.log('Edit Campaign:', item._id)">
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
              <v-list-item @click="() => console.log('Delete Campaign:', item._id)" class="text-error">
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>

        <template v-slot:no-data>
          <div class="text-center pa-4 text-disabled">
            <v-icon size="large" class="mb-2">mdi-database-off-outline</v-icon>
            <p>No campaigns found for this project.</p>
          </div>
        </template>

        <template v-slot:bottom>
          <div class="d-flex align-center pa-4 bg-grey-lighten-4">
            <v-btn
                prepend-icon="mdi-plus"
                variant="text"
                @click="addCampaign"
                :disabled="isLoading"
            >
              Add Campaign
            </v-btn>
            <v-spacer></v-spacer>
            <span class="text-caption mr-4" v-if="totalCampaigns > 0">
                    Total: {{ totalCampaigns }} Campaigns
                </span>
          </div>
        </template>
      </v-data-table-server>
    </v-card>
  </div>
</template>

<style scoped>
.campaign-list-container {
  /* Optional: container styles */
}
.campaigns-data-table {
  /* Optional: table styles */
}
.campaigns-data-table :deep(tbody tr:hover) {
  cursor: pointer; /* Wenn Zeilen klickbar sind */
}
.bg-grey-lighten-4 {
  background-color: #f5f5f5; /* Beispiel Hellgrau */
}
</style>