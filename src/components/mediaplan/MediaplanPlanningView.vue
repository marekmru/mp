<template>
  <div class="planning-view-container mt-4">
    <v-card class="projects-table elevation-0" variant="flat">
      <v-theme-provider theme="dark">
        <pre>{{ projects}}</pre>
        <v-data-table-server
            v-model:items-per-page="itemsPerPage"
            v-model:page="page"
            :headers="headers"
            :items="projects"
            :items-length="totalProjects"
            :loading="isLoading"
            item-value="_id"
            hover
            class="projects-data-table"
            @update:options="onOptionsUpdate"
        >
          <!-- Edit button column -->
          <template v-slot:item.edit="{ item }">
            <v-btn icon density="comfortable" variant="text" color="grey">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>

          <!-- Name column with logo -->
          <template v-slot:item.abbreviation="{ item }">
            <div class="d-flex align-center" v-if="item.raw">
              <v-avatar size="32" class="mr-2 grey lighten-4"
                        :image="getBrandLogo(item.raw.descriptive_vars?.brand)"></v-avatar>
              <span>{{ item.raw.abbreviation }}</span>
            </div>
            <div v-else>N/A</div>
          </template>

          <!-- Country column with flag -->
          <template v-slot:item.country="{ item }">
            <div class="d-flex align-center" v-if="item.raw && item.raw.descriptive_vars?.country">
              <CountryFlag :country="item.raw.descriptive_vars.country" class="mr-2"/>
              <span>{{ getCountryName(item.raw.descriptive_vars.country) }}</span>
            </div>
            <div v-else>N/A</div>
          </template>

          <!-- Duration column with date range -->
          <template v-slot:item.duration="{ item }">
            <div class="d-flex align-center" v-if="item.raw && item.raw.duration?.formatted">
              <v-icon size="small" class="mr-2">mdi-calendar-range</v-icon>
              <span>{{ item.raw.duration.formatted }}</span>
            </div>
            <div v-else>N/A</div>
          </template>

          <!-- Detail column with long text -->
          <template v-slot:item.detail="{ item }">
            <span v-if="item.raw && item.raw.detail">{{ item.raw.detail }}</span>
            <span v-else>N/A</span>
          </template>

          <!-- Campaign Type column with chip -->
          <template v-slot:item.campaignType="{ item }">
            <v-chip
                v-if="item.raw && item.raw.default_vars?.campaigntype"
                size="small"
                class="text-capitalize"
                color="primary"
                variant="flat"
            >
              {{ item.raw.default_vars.campaigntype }}
            </v-chip>
            <span v-else>N/A</span>
          </template>

          <!-- Sub-Segment column with chip -->
          <template v-slot:item.subsegment="{ item }">
            <v-chip
                v-if="item.raw && item.raw.default_vars?.subsegment"
                size="small"
                class="text-capitalize"
                color="grey-lighten-1"
                variant="flat"
            >
              {{ item.raw.default_vars.subsegment }}
            </v-chip>
            <span v-else>N/A</span>
          </template>

          <!-- Lock Status column with icon -->
          <template v-slot:item.lockStatus="{ item }">
            <v-icon
                v-if="item.raw"
                :color="item.raw.is_locked ? 'warning' : 'grey-lighten-1'"
            >
              mdi-lock
            </v-icon>
            <span v-else>-</span>
          </template>

          <!-- Actions menu column -->
          <template v-slot:item.actions="{ item }">
            <v-btn icon variant="text" density="comfortable">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <template v-slot:bottom>
            <div class="d-flex align-center pa-4 bg-grey-lighten-2">
              <v-btn
                  prepend-icon="mdi-plus"
                  class="black-text-button"
                  variant="text"
                  color="black"
                  @click="addProject"
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

<script setup lang="ts">
import {ref, watch} from 'vue';
import CountryFlag from '@/components/common/CountryFlag.vue';

interface Props {
  projects: any[];
  totalProjects: number;
  isLoading: boolean;
}

const emit = defineEmits(['addProject']);

const props = withDefaults(defineProps<Props>(), {
  projects: () => [],
  totalProjects: 0,
  isLoading: false
});

const page = ref(1);
const itemsPerPage = ref(10);

const headers = [
  {title: '', key: 'edit', sortable: false, width: '50px'},
  {title: 'Name', key: 'abbreviation', sortable: true, align: 'start'},
  {title: 'Country', key: 'country', sortable: true},
  {title: 'Duration', key: 'duration', sortable: true},
  {title: 'Detail', key: 'detail', sortable: true},
  {title: 'Campaign type', key: 'campaignType', sortable: true},
  {title: 'Sub-segment', key: 'subsegment', sortable: true},
  {title: '', key: 'lockStatus', sortable: false, width: '50px'},
  {title: '', key: 'actions', sortable: false, width: '50px'}
];

watch([page, itemsPerPage], ([newPage, newItemsPerPage]) => {
  // You can add your pagination logic here if needed
});

const onOptionsUpdate = (options: any) => {
  page.value = options.page;
  itemsPerPage.value = options.itemsPerPage;
  // If you need to fetch data when options change, add that logic here
};

const updatePage = (newPage: number) => {
  page.value = newPage;
};

const updateItemsPerPage = (newItemsPerPage: number) => {
  itemsPerPage.value = newItemsPerPage;
};

const addProject = () => {
  emit('addProject');
};


</script>

<style scoped>
.planning-view-container {
  overflow: hidden;
}

.projects-data-table :deep(th) {
  background-color: #4D4D4D !important;
  color: white !important;
  font-weight: 500;
}

.projects-data-table :deep(.v-data-table__td) {
  background-color: #4D4D4D !important;
  color: white !important;
  height: 60px;
  padding: 0 16px;
  vertical-align: middle;
  border-radius: 0 !important;
  border-bottom: 4px solid #fff !important;
}

/* Add border under each table row */

.projects-data-table :deep(.v-btn.bg-grey-lighten-3) {
  box-shadow: none !important;
}

/* Replace existing border with our new border */
.projects-data-table :deep(.v-data-table__tr:not(:last-child)) {
  border-bottom: 4px solid red !important;
}

.projects-data-table :deep(.v-data-table__tr:hover) {
  background-color: #5A5A5A !important;
}

.projects-data-table :deep(.v-chip) {
  background-color: #666 !important;
  color: white !important;
  font-weight: 500;
  font-size: 0.75rem;
  text-transform: none;
}

.projects-data-table :deep(.v-avatar),
.projects-data-table :deep(.v-icon) {
  background-color: transparent !important;
}

.projects-data-table :deep(.v-btn) {
  color: white !important;
}

/* Style for pagination controls */
.projects-data-table :deep(.v-data-table-footer) {
  background-color: #4D4D4D !important;
  color: white !important;
}

.projects-data-table :deep(.v-data-table-footer .v-btn) {
  color: white !important;
}


/* Override for Add Project button to ensure black text */

.projects-data-table .black-text-button {
  color: black !important;
}
.black-text-button :deep(.v-btn__content),
.black-text-button :deep(.v-btn__prepend) {
  color: black !important;
}
</style>