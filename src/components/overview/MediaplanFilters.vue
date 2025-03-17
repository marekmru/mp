<template>
  <div class="d-flex align-center">
    <!-- Brand Selector Dropdown -->
    <div class="d-flex align-center mr-2">
      <v-select
          v-model="selectedBrandId"
          :items="brands"
          item-title="name"
          item-value="_id"
          label="MINI Mediaplans"
          variant="solo"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-chevron-down"
          @update:model-value="updateBrand"
      >
        <template v-slot:item="{ item, props }">
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <v-img
                  v-if="item.raw.name === 'BMW'"
                  :src="'/img/BMW.svg'"
                  max-width="35"
                  height="35"
                  contain
                  class="mr-3"
              />
              <v-img
                  v-else-if="item.raw.name === 'MINI'"
                  :src="'/img/MINI.svg'"
                  max-width="76"
                  height="35"
                  contain
                  class="mr-3"
              />
            </template>
            <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
          </v-list-item>
        </template>
      </v-select>
    </div>

    <!-- Sort by Dropdown -->
    <div class="d-flex align-center mr-2">


      </v-list-item>
      <v-list-item @click="setSorting('created_at', 'desc')">
        <template v-slot:prepend>
          <v-icon>mdi-arrow-up</v-icon>
        </template>
        <v-list-item-title>Creation Date Descending</v-list-item-title>
      </v-list-item>
      <v-list-item @click="setSorting('end_date', 'asc')">
        <template v-slot:prepend>
          <v-icon>mdi-arrow-down</v-icon>
        </template>
        <v-list-item-title>End Date</v-list-item-title>
      </v-list-item>
      <v-list-item @click="setSorting('end_date', 'desc')">
        <template v-slot:prepend>
          <v-icon>mdi-arrow-up</v-icon>
        </template>
        <v-list-item-title>End Date</v-list-item-title>
      </v-list-item>
      <v-list-item @click="setSorting('budget.total', 'desc')">
        <template v-slot:prepend>
          <v-icon>mdi-arrow-up</v-icon>
        </template>
        <v-list-item-title>Budget Highest First</v-list-item-title>
      </v-list-item>
      <v-list-item @click="setSorting('budget.total', 'asc')">
        <template v-slot:prepend>
          <v-icon>mdi-arrow-down</v-icon>
        </template>
        <v-list-item-title>Budget Lowest First</v-list-item-title>
      </v-list-item>
      </v-list>
      </v-card>
      </v-menu>
    </div>

    <!-- Country Filter -->
    <div class="d-flex align-center mr-2">
      <v-autocomplete
          v-model="selectedCountries"
          :items="countries"
          item-title="value"
          item-value="abbreviation"
          label="Country"
          variant="solo"
          density="compact"
          hide-details
          multiple
          chips
          closable-chips
          prepend-inner-icon="mdi-filter"
          @update:model-value="updateCountryFilter"
      ></v-autocomplete>
    </div>

    <!-- Filter By Options -->
    <div class="d-flex align-center mr-2">
      <v-select
          v-model="filterType"
          :items="filterOptions"
          label="Filter by"
          variant="solo"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-filter"
          @update:model-value="updateFilterType"
      ></v-select>
    </div>

    <!-- Search input -->
    <div class="d-flex align-center flex-grow-1 mr-2">
      <v-text-field
          v-model="searchQuery"
          placeholder="Search..."
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          density="compact"
          hide-details
          flat
          single-line
          @update:model-value="debouncedSearch"
          clearable
      ></v-text-field>
    </div>

    <!-- Create Media Plan Button -->
    <v-btn
        color="black"
        class="text-white px-4"
        prepend-icon="mdi-plus"
        @click="$emit('create-mediaplan')"
    >
      Media Plan
    </v-btn>
  </div>

  <!-- Active Filters Display -->
  <div v-if="hasAnyFilter" class="mt-2">
    <v-sheet class="pa-2 rounded" color="grey-lighten-4">
      <div class="d-flex align-center flex-wrap">
        <div class="text-body-2 mr-4">Active filters:</div>

        <v-chip
            v-if="searchQuery"
            size="small"
            class="mr-2 mb-1"
            closable
            @click:close="clearSearch"
        >
          Search: {{ searchQuery }}
        </v-chip>

        <v-chip
            v-if="selectedBrandId"
            size="small"
            class="mr-2 mb-1"
            closable
            @click:close="clearBrand"
        >
          Brand: {{ selectedBrandName }}
        </v-chip>

        <v-chip
            v-if="selectedStatus"
            size="small"
            class="mr-2 mb-1"
            closable
            @click:close="clearStatus"
        >
          Status: {{ selectedStatus }}
        </v-chip>

        <v-chip
            v-if="selectedCountries.length > 0"
            size="small"
            class="mr-2 mb-1"
            closable
            @click:close="clearCountries"
        >
          Countries: {{ selectedCountries.length }}
        </v-chip>

        <v-chip
            v-if="createdByMe"
            size="small"
            class="mr-2 mb-1"
            closable
            @click:close="clearCreatedByMe"
        >
          Created by me
        </v-chip>

        <v-chip
            v-if="approvalRequested"
            size="small"
            class="mr-2 mb-1"
            closable
            @click:close="clearApprovalRequested"
        >
          Approval requested
        </v-chip>

        <v-chip
            v-if="currentlyRunning"
            size="small"
            class="mr-2 mb-1"
            closable
            @click:close="clearCurrentlyRunning"
        >
          Currently running
        </v-chip>

        <v-btn
            v-if="hasAnyFilter"
            size="small"
            variant="text"
            color="primary"
            @click="clearAllFilters"
        >
          Clear all filters
        </v-btn>
      </div>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import customFetch from '@/helpers/customFetch';
import { Brand, Source } from '@/types/mediaplan';

// Define props and emits
const props = defineProps({
  search: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  sortBy: {
    type: String,
    default: 'updated_at'
  },
  sortOrder: {
    type: String as () => 'asc' | 'desc',
    default: 'desc'
  }
});

const emit = defineEmits([
  'update:search',
  'update:status',
  'update:country',
  'update:sort-by',
  'update:sort-order',
  'create-mediaplan'
]);

// Local state for sources
const brands = ref<Brand[]>([]);
const countries = ref<Source[]>([]);
const subsegments = ref<Source[]>([]);
const products = ref<Source[]>([]);
const campaigntypes = ref<Source[]>([]);
const languages = ref<Source[]>([]);

// Local filter state
const searchQuery = ref(props.search);
const selectedBrandId = ref<string>('');
const selectedBrandName = ref<string>('');
const selectedCountries = ref<string[]>([]);
const selectAllCountries = ref(false);
const createdByMe = ref(false);
const approvalRequested = ref(false);
const currentlyRunning = ref(false);
const selectedStatus = ref(props.status);

// Select state
const selectedSort = ref('updated_at:desc');
const filterType = ref('');

// Options for select components
const sortOptions = [
  { text: 'Last updated first', value: 'updated_at:desc' },
  { text: 'Earliest Start Date first', value: 'start_date:asc' },
  { text: 'Start Date Descending', value: 'start_date:desc' },
  { text: 'Creation Date Ascending', value: 'created_at:asc' },
  { text: 'Creation Date Descending', value: 'created_at:desc' },
  { text: 'End Date Ascending', value: 'end_date:asc' },
  { text: 'End Date Descending', value: 'end_date:desc' },
  { text: 'Budget Highest First', value: 'budget.total:desc' },
  { text: 'Budget Lowest First', value: 'budget.total:asc' }
];

const filterOptions = [
  { text: 'All', value: '' },
  { text: 'Created by me', value: 'created_by_me' },
  { text: 'Approval requested', value: 'approval_requested' },
  { text: 'Currently running', value: 'currently_running' }
];

// Computed properties
const hasActiveFilters = computed(() => {
  return createdByMe.value || approvalRequested.value || currentlyRunning.value || selectedStatus.value;
});

const hasAnyFilter = computed(() => {
  return (
      searchQuery.value ||
      selectedBrandId.value ||
      selectedCountries.length > 0 ||
      createdByMe.value ||
      approvalRequested.value ||
      currentlyRunning.value ||
      selectedStatus.value
  );
});

// Fetch sources data on component mount
onMounted(async () => {
  try {
    // For development, we'll set up mock data similar to the screenshot
    brands.value = [
      { _id: 'bmw', name: 'BMW' },
      { _id: 'mini', name: 'MINI' }
    ];

    // Set mock countries based on the screenshot
    countries.value = [
      { abbreviation: 'AT', value: 'Austria', category: null },
      { abbreviation: 'BE', value: 'Belgium', category: null },
      { abbreviation: 'DE', value: 'Germany', category: null },
      { abbreviation: 'HU', value: 'Hungary', category: null },
      { abbreviation: 'JP', value: 'Japan', category: null },
      { abbreviation: 'KR', value: 'Korea', category: null },
      { abbreviation: 'NL', value: 'Netherlands', category: null },
      { abbreviation: 'ZA', value: 'South Africa', category: null }
    ];

    // In a real application, you would fetch this data from your API
    /*
    const response = await customFetch('/mediaplans/sources?type=overview');
    if (response && response.data) {
      if (response.data.subsegment) {
        subsegments.value = response.data.subsegment;
      }
      if (response.data.product) {
        products.value = response.data.product;
      }
      if (response.data.campaigntype) {
        campaigntypes.value = response.data.campaigntype;
      }
      if (response.data.language) {
        languages.value = response.data.language;
        countries.value = response.data.language;
      }
      // Brands would come from a different endpoint potentially
    }
    */
  } catch (error) {
    console.error('Error fetching filter sources:', error);
  }
});

// Watch for prop changes
watch(() => props.search, (newVal) => {
  searchQuery.value = newVal;
});

watch(() => props.status, (newVal) => {
  selectedStatus.value = newVal;
});

watch(() => props.country, (newVal) => {
  if (newVal) {
    selectedCountries.value = newVal.split(',');
  } else {
    selectedCountries.value = [];
  }
});

// Debounced search function
let searchTimeout: number | null = null;

function debouncedSearch() {
  if (searchTimeout) clearTimeout(searchTimeout);

  searchTimeout = window.setTimeout(() => {
    emit('update:search', searchQuery.value);
  }, 300);
}

// Methods
function updateBrand(brandId: string) {
  const brand = brands.value.find(b => b._id === brandId);
  if (brand) {
    selectedBrandName.value = brand.name;
  }
}

function handleSortChange(value: string) {
  const [field, order] = value.split(':');
  emit('update:sort-by', field);
  emit('update:sort-order', order as 'asc' | 'desc');
}

function updateFilterType(value: string) {
  // Reset all filter flags
  createdByMe.value = false;
  approvalRequested.value = false;
  currentlyRunning.value = false;

  // Set the selected filter
  if (value === 'created_by_me') {
    createdByMe.value = true;
  } else if (value === 'approval_requested') {
    approvalRequested.value = true;
  } else if (value === 'currently_running') {
    currentlyRunning.value = true;
  }

  updateSpecialFilters();
}

function toggleAllCountries() {
  if (selectAllCountries.value) {
    selectedCountries.value = [];
  }
  updateCountryFilter();
}

function updateCountryFilter() {
  // If all countries are selected or none are selected, emit an empty string
  if (selectedCountries.value.length === 0 ||
      selectedCountries.value.length === countries.value.length) {
    emit('update:country', '');
  } else {
    // Join selected countries with comma
    emit('update:country', selectedCountries.value.join(','));
  }
}

function updateSpecialFilters() {
  // This is a simplified implementation
  // In a real app, you might want to include these in a more complex filter object
  const status = getFilterStatus();
  emit('update:status', status);
}

function getFilterStatus(): string {
  if (approvalRequested.value) {
    return 'For Approval';
  } else if (currentlyRunning.value) {
    return 'Active';
  } else if (selectedStatus.value) {
    return selectedStatus.value;
  }
  return '';
}

// Clear filter methods
function clearSearch() {
  searchQuery.value = '';
  emit('update:search', '');
}

function clearBrand() {
  selectedBrandId.value = '';
  selectedBrandName.value = '';
}

function clearStatus() {
  selectedStatus.value = '';
  emit('update:status', '');
}

function clearCountries() {
  selectedCountries.value = [];
  emit('update:country', '');
}

function clearCreatedByMe() {
  createdByMe.value = false;
  updateSpecialFilters();
}

function clearApprovalRequested() {
  approvalRequested.value = false;
  updateSpecialFilters();
}

function clearCurrentlyRunning() {
  currentlyRunning.value = false;
  updateSpecialFilters();
}

function clearAllFilters() {
  clearSearch();
  clearBrand();
  clearStatus();
  clearCountries();
  clearCreatedByMe();
  clearApprovalRequested();
  clearCurrentlyRunning();
}
</script>

<style scoped>
.filter-card {
  border-radius: 4px;
}

/* Add bottom margin to the list items to improve spacing */
.v-list-item {
  margin-bottom: 4px;
}

/* Override Vuetify's default padding for filter cards */
.filter-card .v-card-title {
  padding: 16px;
}

.text-none {
  text-transform: none;
}
</style>