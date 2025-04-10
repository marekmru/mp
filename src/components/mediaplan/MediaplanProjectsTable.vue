<template>
  <div class="projects-table-container mt-4">
    <v-card class="projects-table" variant="flat">
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="headers"
        :items="projects"
        :items-length="totalProjects"
        :loading="isLoading"
        item-value="_id"
        hover
        class="elevation-0 projects-data-table"
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
            <v-avatar size="32" class="mr-2 grey lighten-4">
              <v-img :src="getBrandLogo(item.raw.descriptive_vars?.brand)"></v-img>
            </v-avatar>
            <span>{{ item.raw.abbreviation }}</span>
          </div>
          <div v-else>N/A</div>
        </template>

        <!-- Country column with flag -->
        <template v-slot:item.country="{ item }">
          <div class="d-flex align-center" v-if="item.raw && item.raw.descriptive_vars?.country">
            <v-avatar size="24" class="mr-2">
              <v-img :src="getCountryFlag(item.raw.descriptive_vars.country)"></v-img>
            </v-avatar>
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

        <!-- Footer with add project button -->
        <template v-slot:bottom>
          <div class="d-flex align-center pa-4">
            <v-btn
              prepend-icon="mdi-plus"
              variant="text"
              color="primary"
              @click="$emit('addProject')"
            >
              Add Project
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// Define props
interface Props {
  projects: any[];
  totalProjects: number;
  isLoading: boolean;
  itemsPerPageProp?: number;
  pageProp?: number;
}

// Define emits
const emit = defineEmits(['update:page', 'update:itemsPerPage', 'addProject']);

// Receive props with defaults
const props = withDefaults(defineProps<Props>(), {
  projects: () => [],
  totalProjects: 0,
  isLoading: false,
  itemsPerPageProp: 10,
  pageProp: 1
});

// Local state
const page = ref(props.pageProp);
const itemsPerPage = ref(props.itemsPerPageProp);

// Table headers
const headers = [
  { title: '', key: 'edit', sortable: false, width: '50px' },
  { title: 'Name', key: 'abbreviation', sortable: true, align: 'start' },
  { title: 'Country', key: 'country', sortable: true },
  { title: 'Duration', key: 'duration', sortable: true },
  { title: 'Detail', key: 'detail', sortable: true },
  { title: 'Campaign Type', key: 'campaignType', sortable: true },
  { title: 'Sub-Segment', key: 'subsegment', sortable: true },
  { title: '', key: 'lockStatus', sortable: false, width: '50px' },
  { title: '', key: 'actions', sortable: false, width: '50px' }
];

// Watch for pagination changes
watch([page, itemsPerPage], ([newPage, newItemsPerPage]) => {
  if (newPage !== props.pageProp) {
    emit('update:page', newPage);
  }

  if (newItemsPerPage !== props.itemsPerPageProp) {
    emit('update:itemsPerPage', newItemsPerPage);
  }
});

// Method to handle datatable option updates (sorting, etc)
const onOptionsUpdate = (options: any) => {
  // Update pagination
  page.value = options.page;
  itemsPerPage.value = options.itemsPerPage;
};

// Helper methods
const getBrandLogo = (brand: string): string => {
  const brands: Record<string, string> = {
    'MINI': '/brands/mini.png',
    'BMW': '/brands/bmw.png'
  };

  return brands[brand] || '/brands/default.png';
};

const getCountryFlag = (countryCode: string): string => {
  return `/flags/${countryCode.toLowerCase()}.svg`;
};

const getCountryName = (countryCode: string): string => {
  const countries: Record<string, string> = {
    'DE': 'Germany',
    'FR': 'France',
    'IT': 'Italy',
    'ES': 'Spain',
    'UK': 'United Kingdom',
    'US': 'United States'
  };

  return countries[countryCode] || countryCode;
};
</script>

<style scoped>
.projects-table-container {
  border-radius: 8px;
  overflow: hidden;
}

.projects-data-table :deep(th) {
  background-color: #333333 !important;
  color: white !important;
  font-weight: 500;
}

.projects-data-table :deep(.v-data-table__td) {
  padding: 0 16px;
  height: 50px;
}
</style>