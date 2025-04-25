<script setup lang="ts">
import {ref, computed} from 'vue';
import type {Campaign} from '@/types/campaign';
import {useRouter} from 'vue-router';
import {campaignHeaders} from "@/constants/campaign.ts";

// --- Props ---
interface Props {
  campaigns: Campaign[];
  totalCampaigns: number;
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
}

const props = withDefaults(defineProps<Props>(), { /* ... defaults ... */});

// --- Emits ---
const emit = defineEmits<{
  (e: 'addCampaign'): void;
  (e: 'update:options', options: { page: number; itemsPerPage: number; sortBy?: any[]; sortDesc?: boolean[] }): void;
}>();

// --- Router ---
const router = useRouter();

// --- Tabelle Models & Header ---
const pageModel = computed({
  get: () => props.currentPage + 1, set: () => {
  }
});
const itemsPerPageModel = computed({
  get: () => props.itemsPerPage, set: () => {
  }
});

// --- Methoden ---
const onOptionsUpdate = (options: any) => {
  emit('update:options', options);
};
const triggerAddCampaign = () => {
  emit('addCampaign');
};
const editCampaign = (item: Campaign) => {
  console.log('Edit Campaign:', item._id);
};
const deleteCampaign = (item: Campaign) => {
  console.log('Delete Campaign:', item._id);
};

</script>

<template>
  <div class="campaign-list-container">
    <v-card class="campaigns-table elevation-1">
      <v-data-table-server
          v-model:items-per-page="itemsPerPageModel"
          v-model:page="pageModel"
          :headers="campaignHeaders"
          :items="campaigns"
          :items-length="totalCampaigns"
          :loading="isLoading"
          :items-per-page-options="[15, 30, 50, 100]"
          item-value="_id"
          hover
          class="campaigns-data-table"
          @update:options="onOptionsUpdate"
      >
        <template v-slot:item.edit="{ item }">
          <v-btn icon density="compact" variant="text" @click.stop="editCampaign(item)">
            <v-icon>mdi-pencil-outline</v-icon>
            <v-tooltip activator="parent" location="top">Edit Project</v-tooltip>
          </v-btn>
        </template>
        <template v-slot:item.campaignname="{ item }"> {{ item.campaignname }}</template>
        <template v-slot:item.created_at="{ item }">
          {{ item.created_at ? new Date(item.created_at).toLocaleDateString('de-DE') : '-' }}
        </template>
        <template v-slot:item.campaigndetail="{ item }">
          <span class="d-inline-block text-truncate" style="max-width: 200px;"> {{ item.campaigndetail || '-' }} </span>
          <v-tooltip v-if="item.campaigndetail && item.campaigndetail.length > 30" activator="parent" location="top"
                     max-width="300px"> {{ item.campaigndetail }}
          </v-tooltip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-menu>
            <template v-slot:activator="{ props: menuProps }">
              <v-btn icon="mdi-dots-vertical" variant="text" density="comfortable" v-bind="menuProps"></v-btn>
            </template>
            <v-list density="compact">
              <v-list-item @click.stop="editCampaign(item)">
                <template v-slot:prepend>
                  <v-icon size="small">mdi-pencil-outline</v-icon>
                </template>
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
              <v-list-item @click.stop="deleteCampaign(item)" class="text-error">
                <template v-slot:prepend>
                  <v-icon size="small">mdi-delete-outline</v-icon>
                </template>
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>
        <template v-slot:no-data>
          <div class="text-center pa-4 text-grey">
            <v-icon size="large" class="mb-2">mdi-bullhorn-off-outline</v-icon>
            <p>No campaigns found for this project.</p></div>
        </template>

        <template v-slot:bottom>
          <v-divider></v-divider>
          <div class="d-flex align-center pa-3">
            <v-btn prepend-icon="mdi-plus" variant="text" @click="triggerAddCampaign" :disabled="isLoading">
              Add Campaign
            </v-btn>
            <v-spacer></v-spacer>
            <span class="text-caption mr-4 text-disabled" v-if="totalCampaigns > 0 && !isLoading">
                  Total: {{ totalCampaigns }} Campaigns
               </span>
          </div>
        </template>
      </v-data-table-server>
    </v-card>
  </div>
</template>

<style scoped> /* ... */ </style>