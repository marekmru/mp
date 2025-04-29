<template>
  <MainLayout>
    <div class="campaign-detail">
      <v-alert v-if="error" type="error" density="compact" class="mb-4" closable>
        {{ error }}
      </v-alert>

      <div v-if="isLoading && !campaign" class="text-center my-10">
        <v-progress-circular indeterminate color="primary" size="40"/>
        <p class="mt-2 text-disabled">Loading Campaign Data...</p>
      </div>

      <template v-if="campaign">
        <MediaplanTopSection
            :mediaplan="parentMediaplan"
            :project="parentProject"
            :campaign="campaign"
            :search="searchTerm" :is-loading="isLoading"
            :current-view="'planning'"
            @update:search="updateSearchTerm"
            # @update:current-view=""
        />

        <v-card class="mt-4" flat>
          <v-card-title>Campaign Details</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4"><v-list-item density="compact"><v-list-item-subtitle>Campaign Name</v-list-item-subtitle><v-list-item-title>{{ campaign.campaignname }}</v-list-item-title></v-list-item></v-col>
              <v-col cols="12" sm="6" md="4"><v-list-item density="compact"><v-list-item-subtitle>Campaign Type</v-list-item-subtitle><v-list-item-title>{{ campaign.campaigntype }}</v-list-item-title></v-list-item></v-col>
              <v-col cols="12" sm="6" md="4"><v-list-item density="compact"><v-list-item-subtitle>Language</v-list-item-subtitle><v-list-item-title>{{ campaign.language }}</v-list-item-title></v-list-item></v-col>
              <v-col cols="12" sm="6" md="4"><v-list-item density="compact"><v-list-item-subtitle>Product</v-list-item-subtitle><v-list-item-title>{{ campaign.product }}</v-list-item-title></v-list-item></v-col>
              <v-col cols="12" sm="6" md="4"><v-list-item density="compact"><v-list-item-subtitle>Subsegment</v-list-item-subtitle><v-list-item-title>{{ campaign.subsegment }}</v-list-item-title></v-list-item></v-col>
              <v-col cols="12" sm="6" md="4"><v-list-item density="compact"><v-list-item-subtitle>Type</v-list-item-subtitle><v-list-item-title>{{ campaign.type }}</v-list-item-title></v-list-item></v-col>
              <v-col cols="12"><v-list-item density="compact"><v-list-item-subtitle>Details</v-list-item-subtitle><v-list-item-title>{{ campaign.campaigndetail || '-' }}</v-list-item-title></v-list-item></v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <LineitemTable
            class="mt-5"
            :lineitems="lineitems"
            :is-loading="isLoadingLineitems"
            # @add-lineitem="openAddLineitemDialog"
            # @view-lineitem="handleViewLineitem"
        />

      </template>

      <template v-else-if="!isLoading && !campaign && error">
        <div class="text-center my-10 text-disabled">
          <v-icon size="x-large" class="mb-2">mdi-alert-circle-outline</v-icon>
          <p>Could not load Campaign data.</p>
          <p class="text-caption">{{ error }}</p>
          <v-btn color="primary" @click="goBack">Go Back</v-btn>
        </div>
      </template>

      <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn icon @click="snackbar.show = false"><v-icon>mdi-close</v-icon></v-btn>
        </template>
      </v-snackbar>

    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Komponenten
import MainLayout from '@/layouts/MainLayout.vue';
import MediaplanTopSection from "@/components/common/MediaplanTopSection.vue";
import LineitemTable from '@/components/campaign/LineitemTable.vue'; // Spezifische Tabelle
// Stores
import { useCampaignStore } from '@/stores/campaignStore';
import { useLineitemStore } from '@/stores/lineitemStore';
import { useProjectStore } from '@/stores/projectStore';
import { useMediaplanStore } from '@/stores/mediaplanStore';
// Types
import type { Campaign } from '@/types/campaign';
import type { LineItem } from '@/types/lineitem';
import type { Project } from '@/types/project';
import type { Mediaplan } from '@/types/mediaplan';

// Props & Route
const props = defineProps<{
  mediaplanId?: string;
  projectId?: string;
  campaignId?: string;
}>()
const route = useRoute();
const router = useRouter();

// IDs
const mediaplanIdRef = ref(props.mediaplanId || (route.params.mediaplanId as string));
const projectIdRef = ref(props.projectId || (route.params.projectId as string));
const campaignIdRef = ref(props.campaignId || (route.params.campaignId as string));

// Stores
const campaignStore = useCampaignStore();
const lineitemStore = useLineitemStore();
const projectStore = useProjectStore();
const mediaplanStore = useMediaplanStore();

// State
const isLoading = ref(false);
const error = ref<string | null>(null);
const searchTerm = ref(''); // Wird von TopSection gesetzt, aber hier nicht direkt zum Filtern verwendet
// const canAddLineitems = ref(false); // Noch nicht implementiert

// Computed Properties
const campaign = computed<Campaign | null>(() => campaignStore.selectedCampaign);
const parentProject = computed<Project | null>(() => projectStore.selectedProject);
const parentMediaplan = computed<Mediaplan | null>(() => mediaplanStore.selectedMediaplan);
const lineitems = computed<LineItem[]>(() => lineitemStore.lineitems);
const isLoadingLineitems = computed(() => lineitemStore.isLoading);
// Kein Zugriff auf Line Item Paginierung/Sortierung hier, da v-data-table dies clientseitig macht

// Snackbar
const snackbar = reactive({ show: false, text: '', color: 'success' });

// --- Methoden ---
const showSnackbar = (text: string, color: 'success' | 'error' | 'info' = 'success') => {
  snackbar.text = text;
  snackbar.color = color;
  snackbar.show = true;
};

const loadData = async () => {
  if (!mediaplanIdRef.value || !projectIdRef.value || !campaignIdRef.value) {
    error.value = "Missing ID for loading campaign details.";
    showSnackbar(error.value, "error");
    return;
  }
  isLoading.value = true;
  error.value = null;
  try {
    await Promise.all([
      campaignStore.fetchCampaign(mediaplanIdRef.value, projectIdRef.value, campaignIdRef.value),
      projectStore.fetchProject(mediaplanIdRef.value, projectIdRef.value), // Kontext
      mediaplanStore.fetchMediaplan(mediaplanIdRef.value), // Kontext
      lineitemStore.fetchLineitems(mediaplanIdRef.value, projectIdRef.value, campaignIdRef.value) // Kinder
    ]);
    // canAddLineitems.value = checkApi(); // Wenn API für Add existiert

  } catch (err: any) {
    error.value = `Failed to load campaign data: ${err.message || err}`;
    showSnackbar(error.value, 'error');
    campaignStore.selectedCampaign = null;
    projectStore.selectedProject = null;
    mediaplanStore.selectedMediaplan = null;
  } finally {
    isLoading.value = false;
  }
};

const updateSearchTerm = (newSearchTerm: string) => {
  searchTerm.value = newSearchTerm;
  // Hier keine Aktion nötig, da die Tabelle clientseitig filtert (oder Suche ignoriert)
};

const openAddLineitemDialog = () => {
  console.log('Add Lineitem for Campaign:', campaignIdRef.value);
  showSnackbar("Adding line items is not supported by the API yet.", "info");
  // Logik zum Öffnen des Dialogs
};

const handleViewLineitem = (item: LineItem) => {
  console.log('View Lineitem (Event received):', item._id);
  showSnackbar("Viewing line item details is not supported by the API yet.", "info");
  // Logik zum Anzeigen der Details (z.B. in einem Dialog)
}

const goBack = () => {
  router.back();
}

// Lifecycle & Watchers
onMounted(() => {
  loadData();
});

watch(() => [route.params.mediaplanId, route.params.projectId, route.params.campaignId],
    ([newMpId, newPId, newCId], [oldMpId, oldPId, oldCId]) => {
      let needsReload = false;
      if (typeof newMpId === 'string' && newMpId !== oldMpId) { mediaplanIdRef.value = newMpId; needsReload = true; }
      if (typeof newPId === 'string' && newPId !== oldPId) { projectIdRef.value = newPId; needsReload = true; }
      if (typeof newCId === 'string' && newCId !== oldCId) { campaignIdRef.value = newCId; needsReload = true; }
      if (needsReload) { loadData(); }
    },
    { immediate: false }
);

watch(error, (err) => { if (err && !snackbar.show) { /* Fehler in loadData behandelt */ } });

</script>

<style scoped>
.campaign-detail {
  min-height: calc(100vh - 64px);
}
</style>