<script setup lang="ts">
import {computed, ref} from 'vue';
import type {Campaign} from '@/types/campaigns'; // Corrected path
import {useRouter} from 'vue-router';
import {campaignHeaders} from "@/constants/campaign";
import {formatDate} from '@/helpers/dateUtils';
import type {VDataTableServer} from 'vuetify/components/VDataTable';
import {getBrandLogo} from "@/helpers/brandUtils.ts";

type ReadonlyHeaders = VDataTableServer['$props']['headers'];
type Options = VDataTableServer['$props']['options']; // Type for options

// --- Props (Restored original props) ---
interface Props {
  items: Campaign[];
  totalCampaigns: number;
  isLoading: boolean;
  currentPage: number; // 0-basiert
  itemsPerPage: number;
  type?: 'multi' | 'single';
  modelValue?: string[]; // For selection checkboxes
  mediaplanId: string;   // Needed for links
}

const props = withDefaults(defineProps<Props>(), {
  type: 'multi',
  modelValue: () => []
});

// --- Emits (Original emits) ---
const emit = defineEmits<{
  (e: 'addCampaign'): void;
  (e: 'update:options', options: Options): void; // Event für Parent zum Aktualisieren
  (e: 'editCampaign', campaign: Campaign): void;
  (e: 'deleteCampaign', campaign: Campaign): void;
  (e: 'update:modelValue', selectedIds: string[]): void; // For selection
}>();

// --- Router (unverändert) ---
const router = useRouter();

// --- Tabelle Models & Header ---
const pageModel = computed({
  get: () => props.currentPage + 1,
  // SET: (Nicht implementiert wie gewünscht)
});

const itemsPerPageModel = computed({
  get: () => props.itemsPerPage,
  // SET: (Nicht implementiert wie gewünscht)
});

const selectedCampaigns = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
});

// --- Methoden ---
const onOptionsUpdate = (options: Options) => {
  emit('update:options', options);
};

const triggerAddCampaign = () => {
  emit('addCampaign');
};
const editCampaign = (item: Campaign) => {
  emit('editCampaign', item);
};
const deleteCampaign = (item: Campaign) => {
  emit('deleteCampaign', item);
};

// Add missing method stubs
const editProject = (item: Campaign) => {
  console.log('Edit project:', item);
  // TODO: Implement edit project logic
};

// --- UI Steuerung ---
const hideFooter = computed(() => props.type === 'single');
const itemsPerPageOptions = computed(() => props.type === 'single' ? [] : [15, 30, 50, 100]);

// --- Funktion zum Erstellen des Detail-Links (unverändert) ---
const getCampaignDetailRoute = (campaign: Campaign) => {
  if (!props.mediaplanId || !campaign.pid || !campaign._id) {
    console.warn('Missing IDs for campaign detail route', props.mediaplanId, campaign.pid, campaign._id);
    return {};
  }
  return {
    name: 'LineitemDetail', // Assuming this is the correct route name
    params: {
      mediaplanId: props.mediaplanId,
      projectId: campaign.pid,
      campaignId: campaign._id
    }
  };
};

</script>

<template>

  <div class="campaign-list-container">
    <v-card class="campaigns-table elevation-1">
      <v-data-table-server
          v-model="selectedCampaigns"
          v-model:items-per-page="itemsPerPageModel"
          v-model:page="pageModel"
          :headers="campaignHeaders"
          :items="props.items"
          :items-length="props.totalCampaigns"
          :loading="props.isLoading"
          :items-per-page-options="itemsPerPageOptions"
          item-value="_id"
          hover
          class="campaigns-data-table"
          :hide-default-footer="hideFooter"
          :hide-default-header="hideFooter"
          @update:options="onOptionsUpdate"
      >
        <template v-slot:item.campaignname="{ item }">
          <router-link
              :to="getCampaignDetailRoute(item)"
              v-if="item.campaignname && type==='multi'"
              class="name-link d-flex align-center"
              @click.stop>
            {{ item.campaignname }}
          </router-link>
          <div class="d-flex align-center" v-else-if="item.campaignname">
            <span>{{ item.campaignname }}</span>
          </div>
        </template>


        <template v-slot:item.actions="{ item }">
          <v-btn icon density="compact" size="small" variant="text" @click.stop="openEditProject(item)" class="mr-2">
            <v-icon>mdi-pencil-outline</v-icon>
            <v-tooltip activator="parent" location="top">Edit Campaign</v-tooltip>
          </v-btn>
          <v-menu>
            <template v-slot:activator="{ props: menuProps }">
              <v-btn icon="mdi-dots-vertical" variant="text" density="comfortable" v-bind="menuProps"></v-btn>
            </template>
            <v-list density="compact">
              <v-list-item @click.stop="() => console.log('Edit Campaign:', item._id)">
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
              <v-list-item @click.stop="() => console.log('Delete Campaign:', item._id)" class="text-error">
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
        </template>
        <template v-slot:no-data>
          <div class="text-center pa-4">No campaigns found.</div>
        </template>

        <template v-slot:bottom v-if="props.type === 'multi'">
          <div class="d-flex align-center pa-4 bg-grey-lighten-2">
            <v-btn
                prepend-icon="mdi-plus"
                variant="text" color="black" @click="triggerAddCampaign"
                :disabled="props.isLoading"
                class="black-text-button">
              Add Campaign
            </v-btn>
            <v-spacer></v-spacer>
          </div>
        </template>
      </v-data-table-server>
    </v-card>
  </div>
</template>

<style scoped>
.v-table.campaigns-data-table .v-table__wrapper > table > thead > tr > th {
  white-space: nowrap;
}

.campaigns-data-table .router-link:hover {
  text-decoration: underline !important;
}

.v-skeleton-loader {
  background-color: transparent !important;
}

/* Optional: Styling für den Text-Button im Footer, falls benötigt */
.black-text-button {
  /* color: black !important; */ /* Falls 'color="black"' nicht ausreicht */
  text-transform: none !important; /* Falls nötig */
}

/* Optional: Anpassung des Hintergrunds für den Footer-Slot */
.campaigns-data-table > .v-data-table__footer, /* Ziel den Standard-Footer, falls sichtbar */
.campaigns-data-table > div:has(> .bg-grey-lighten-2) { /* Ziel unseren benutzerdefinierten Slot */
  /* Ggf. gemeinsame Stile für den Footer-Bereich */
}
</style>