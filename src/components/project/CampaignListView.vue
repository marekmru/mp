<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Campaign } from '@/types/campaigns'; // Corrected path
import { useRouter } from 'vue-router';
import { campaignHeaders } from "@/constants/campaign";
import { formatDate } from '@/helpers/dateUtils';
import type { VDataTableServer } from 'vuetify/components/VDataTable';

type ReadonlyHeaders = VDataTableServer['$props']['headers'];
type Options = VDataTableServer['$props']['options']; // Type for options

// --- Props (Restored original props) ---
interface Props {
  campaigns: Campaign[];
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
  set: (value) => { emit('update:modelValue', value); }
});

const headers = ref(campaignHeaders);

// --- Methoden ---
const onOptionsUpdate = (options: Options) => {
  emit('update:options', options);
};

const triggerAddCampaign = () => { emit('addCampaign'); };
const editCampaign = (item: Campaign) => { emit('editCampaign', item); };
const deleteCampaign = (item: Campaign) => { emit('deleteCampaign', item); };

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
          :headers="headers"
          :items="props.campaigns"
          :items-length="props.totalCampaigns"
          :loading="props.isLoading"
          :items-per-page-options="itemsPerPageOptions"
          item-value="_id"
          hover
          class="campaigns-data-table elevation-0" :hide-default-footer="hideFooter"
          @update:options="onOptionsUpdate"
      >
        <template v-slot:item.campaignname="{ item }">
          <router-link
              :to="getCampaignDetailRoute(item)"
              class="text-decoration-none text-primary font-weight-medium"
              @click.stop >
            {{ item.campaignname }}
          </router-link>
        </template>
        <template v-slot:item.created_at="{ item }"> {{ formatDate(item.created_at) }}</template>
        <template v-slot:item.updated_at="{ item }"> {{ item.updated_at ? formatDate(item.updated_at) : '-' }} </template>
        <template v-slot:item.campaigndetail="{ item }">
          <span class="d-inline-block text-truncate" style="max-width: 200px;"> {{ item.campaigndetail || '-' }} </span>
          <v-tooltip v-if="item.campaigndetail && item.campaigndetail.length > 30" activator="parent" location="top" max-width="300px"> {{ item.campaigndetail }} </v-tooltip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click.stop="editCampaign(item)">mdi-pencil</v-icon>
          <v-icon small @click.stop="deleteCampaign(item)">mdi-delete</v-icon>
        </template>

        <template v-slot:loading> <v-skeleton-loader type="table-row@5"></v-skeleton-loader> </template>
        <template v-slot:no-data> <div class="text-center pa-4">No campaigns found.</div> </template>

        <template v-slot:bottom v-if="props.type === 'multi'">
          <div class="d-flex align-center pa-4 bg-grey-lighten-2"> <v-btn
              prepend-icon="mdi-plus"
              variant="text"         color="black"          @click="triggerAddCampaign"
              :disabled="props.isLoading"
              class="black-text-button" >
            Add Campaign
          </v-btn>
            <v-spacer></v-spacer> </div>
        </template>
      </v-data-table-server>
    </v-card>
  </div>
</template>

<style scoped>
/* Stile wie zuvor */
.v-table.campaigns-data-table .v-table__wrapper > table > thead > tr > th { white-space: nowrap; }
.campaigns-data-table .router-link:hover {
  text-decoration: underline !important;
}
.v-skeleton-loader { background-color: transparent !important; }

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
