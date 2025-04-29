<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Campaign } from '@/types/campaign';
import { useRouter } from 'vue-router';
import { campaignHeaders } from "@/constants/campaign"; // Pfad prüfen!
import { formatDate } from '@/helpers/dateUtils';
import type { VDataTableServer } from 'vuetify/components/VDataTable';

type ReadonlyHeaders = VDataTableServer['$props']['headers'];

// --- Props ---
interface Props {
  campaigns: Campaign[];
  totalCampaigns: number;
  isLoading: boolean;
  currentPage: number; // 0-basiert
  itemsPerPage: number;
  type?: 'multi' | 'single';
  modelValue?: string[];
  // *** NEU: Mediaplan ID wird für den Link benötigt ***
  mediaplanId: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'multi',
  modelValue: () => []
});

// --- Emits (unverändert) ---
const emit = defineEmits<{
  (e: 'addCampaign'): void;
  (e: 'update:options', options: { page: number; itemsPerPage: number; sortBy?: any[]; sortDesc?: boolean[] }): void;
  (e: 'editCampaign', campaign: Campaign): void;
  (e: 'deleteCampaign', campaign: Campaign): void;
  (e: 'update:modelValue', selectedIds: string[]): void;
}>();

// --- Router (unverändert) ---
const router = useRouter();

// --- Tabelle Models & Header (unverändert) ---
const pageModel = computed({ /* ... */ });
const itemsPerPageModel = computed({ /* ... */ });
const selectedCampaigns = computed({ /* ... */ });
const headers = ref(campaignHeaders);

// --- Methoden (unverändert) ---
const onOptionsUpdate = (options: any) => { /* ... */ };
const triggerAddCampaign = () => { emit('addCampaign'); };
const editCampaign = (item: Campaign) => { emit('editCampaign', item); };
const deleteCampaign = (item: Campaign) => { emit('deleteCampaign', item); };

// --- UI Steuerung (unverändert) ---
const showCheckboxes = computed(() => props.type === 'multi');
const hideFooter = computed(() => props.type === 'single');
const itemsPerPageOptions = computed(() => props.type === 'single' ? [] : [15, 30, 50, 100]);
const showAddButtonInFooter = computed(() => props.type === 'multi');

// *** NEU: Funktion zum Erstellen des Detail-Links ***
const getCampaignDetailRoute = (campaign: Campaign) => {
  if (!props.mediaplanId || !campaign.pid || !campaign._id) {
    console.warn('Missing IDs for campaign detail route', props.mediaplanId, campaign.pid, campaign._id);
    return {}; // Leeres Objekt, um Fehler zu vermeiden
  }
  return {
    name: 'CampaignDetail', // Name der Route aus src/router/index.ts
    params: {
      mediaplanId: props.mediaplanId,
      projectId: campaign.pid, // Projekt-ID aus der Kampagne
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
          :items="campaigns"
          :items-length="totalCampaigns"
          :loading="isLoading"
          :items-per-page-options="itemsPerPageOptions"
          :show-select="showCheckboxes"
          item-value="_id"
          hover
          class="campaigns-data-table"
          :hide-default-footer="hideFooter"
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
        <template v-slot:item.actions="{ item }"> </template>
        <template v-slot:loading> </template>
        <template v-slot:no-data> </template>
        <template v-if="!hideFooter" v-slot:bottom> </template>

      </v-data-table-server>
    </v-card>
  </div>
</template>

<style scoped>
/* Stile wie zuvor */
.v-table.campaigns-data-table .v-table__wrapper > table > thead > tr > th { white-space: nowrap; }
/* Optional: Stil für den Link anpassen */
.campaigns-data-table .router-link:hover {
  text-decoration: underline !important;
}
</style>