<template>
  <!-- Main filters row that becomes more flexible on small screens -->
  <div class="filter-container">
    <!-- Brand dropdown -->
    <div class="filter-item">
      <v-select
          v-model="selectedBrandId"
          :items="brands"
          item-title="name"
          item-value="_id"
          label="Brand"
          variant="underlined"
          hide-details
          prepend-inner-icon="mdi-filter"
          @update:model-value="updateBrand"
      ></v-select>
    </div>

    <!-- Sort dropdown -->
    <div class="filter-item">
      <v-select
          v-model="selectedSort"
          :items="sortOptions"
          item-title="text"
          item-value="value"
          label="Sort by"
          variant="underlined"
          hide-details
          prepend-inner-icon="mdi-sort"
          @update:model-value="handleSortChange"
      ></v-select>
    </div>

    <!-- Countries dropdown -->
    <div class="filter-item">
      <v-autocomplete
          v-model="selectedCountries"
          :items="countries"
          item-title="value"
          item-value="abbreviation"
          label="Country Selection"
          variant="underlined"
          hide-details
          multiple
          chips
          closable-chips
          prepend-inner-icon="mdi-filter"
          @update:model-value="updateCountryFilter"
      ></v-autocomplete>
    </div>

    <!-- Filter type dropdown -->
    <div class="filter-item">
      <v-select
          v-model="filterType"
          :items="filterOptions"
          item-title="text"
          item-value="value"
          label="Filter by"
          variant="underlined"
          hide-details
          prepend-inner-icon="mdi-filter"
          @update:model-value="updateFilterType"
      ></v-select>
    </div>

    <!-- Search field - will grow to fill available space -->
    <div class="filter-item search-field">
      <v-text-field
          v-model="searchQuery"
          placeholder="Search..."
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          hide-details
          flat
          single-line
          @update:model-value="debouncedSearch"
          clearable
      ></v-text-field>
    </div>

    <!-- Create button - will stay right aligned -->
    <div class="filter-item create-button">
      <create-mediaplan-button />
    </div>
  </div>

  <!-- Active filters display -->
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
            v-if="filterType === 'approval_requested'"
            size="small"
            class="mr-2 mb-1"
            closable
            @click:close="clearApprovalRequested"
        >
          Approval requested
        </v-chip>

        <v-chip
            v-if="filterType === 'currently_running'"
            size="small"
            class="mr-2 mb-1"
            closable
            @click:close="clearCurrentlyRunning"
        >
          Currently running
        </v-chip>

        <v-chip
            v-if="filterType !== '' && filterType !== 'created_by_me' && filterType !== 'approval_requested' && filterType !== 'currently_running'"
            size="small"
            class="mr-2 mb-1"
            closable
            @click:close="() => {filterType = ''; emit('update:status', '');}"
        >
          Status: {{ filterOptions.find(option => option.value === filterType)?.text }}
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
            v-if="filterType === 'created_by_me'"
            size="small"
            class="mr-2 mb-1"
            closable
            @click:close="clearCreatedByMe"
        >
          Created by me
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
import {ref, computed, onMounted, watch} from 'vue';
import customFetch from '@/helpers/customFetch';
import {Brand, Source} from '@/types/mediaplan';
import CreateMediaplanButton from "@/components/overview/CreateMediaplanButton.vue";

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
  },
  brand: {
    type: String,
    default: null
  }
});

const emit = defineEmits([
  'update:search',
  'update:status',
  'update:country',
  'update:sort-by',
  'update:sort-order',
  'update:brand'
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
const selectedBrandId = ref<string | null>(props.brand);
const selectedBrandName = ref<string>('');
const selectedCountries = ref<string[]>([]);
const selectAllCountries = ref(false);
const createdByMe = ref(false);
const approvalRequested = ref(false);
const currentlyRunning = ref(false);

// Select state
const selectedSort = ref('updated_at:desc');
const filterType = ref(props.status);

// Options for select components
const sortOptions = [
  {text: 'Last updated first', value: 'updated_at:desc'},
  {text: 'Earliest Start Date first', value: 'start_date:asc'},
  {text: 'Start Date Descending', value: 'start_date:desc'},
  {text: 'Creation Date Ascending', value: 'created_at:asc'},
  {text: 'Creation Date Descending', value: 'created_at:desc'},
  {text: 'End Date Ascending', value: 'end_date:asc'},
  {text: 'End Date Descending', value: 'end_date:desc'},
  {text: 'Budget Highest First', value: 'budget.total:desc'},
  {text: 'Budget Lowest First', value: 'budget.total:asc'}
];

const filterOptions = [
  {text: 'All', value: ''},
  {text: 'Created by me', value: 'created_by_me'},
  {text: 'Approval requested', value: 'approval_requested'},
  {text: 'Currently running', value: 'currently_running'},
  {text: 'Active', value: 'active'},
  {text: 'Inactive', value: 'inactive'},
  {text: 'Draft', value: 'draft'},
  {text: 'Archived', value: 'archived'},
  {text: 'For Approval', value: 'for_approval'}
];

// Computed properties
const hasAnyFilter = computed(() => {
  return (
      searchQuery.value ||
      selectedBrandId.value ||
      selectedCountries.length > 0 ||
      filterType.value !== ''
  );
});

// Fetch sources data on component mount
onMounted(async () => {
  try {
    brands.value = [
      {_id: 'bmw', name: 'BMW'},
      {_id: 'mini', name: 'MINI'}
    ];

    countries.value = [
      {abbreviation: 'AT', value: 'Austria', category: null},
      {abbreviation: 'BE', value: 'Belgium', category: null},
      {abbreviation: 'DE', value: 'Germany', category: null},
      {abbreviation: 'HU', value: 'Hungary', category: null},
      {abbreviation: 'JP', value: 'Japan', category: null},
      {abbreviation: 'KR', value: 'Korea', category: null},
      {abbreviation: 'NL', value: 'Netherlands', category: null},
      {abbreviation: 'ZA', value: 'South Africa', category: null}
    ];
    if (props.brand) {
      updateBrand(props.brand);
    }

  } catch (error) {
    console.error('Error fetching filter sources:', error);
  }
});

// Watch for prop changes
watch(() => props.search, (newVal) => {
  searchQuery.value = newVal;
});

watch(() => props.status, (newVal) => {
  filterType.value = newVal;
});

watch(() => props.country, (newVal) => {
  if (newVal) {
    const newCountries = newVal.split(',');
    selectedCountries.value = newCountries;
  } else {
    selectedCountries.value = [];
  }
});
watch(() => props.brand, (newVal) => {
  selectedBrandId.value = newVal;
  updateBrand(newVal);
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
  selectedBrandId.value = brandId;
  const brand = brands.value.find(b => b._id === brandId);
  selectedBrandName.value = brand ? brand.name : '';
  emit('update:brand', brandId);
}

function handleSortChange(value: string) {
  const [field, order] = value.split(':');
  emit('update:sort-by', field);
  emit('update:sort-order', order as 'asc' | 'desc');
}

function updateFilterType(value: string) {
  createdByMe.value = false;
  approvalRequested.value = false;
  currentlyRunning.value = false;

  if (value === 'created_by_me') {
    createdByMe.value = true;
  } else if (value === 'approval_requested') {
    approvalRequested.value = true;
  } else if (value === 'currently_running') {
    currentlyRunning.value = true;
  }

  emit('update:status', value);
}

function updateCountryFilter() {
  if (selectedCountries.value.length === countries.value.length || selectedCountries.value.length === 0) {
    emit('update:country', '');
  } else {
    emit('update:country', selectedCountries.value.join(','));
  }
}

// Clear filter methods
function clearSearch() {
  searchQuery.value = '';
  emit('update:search', '');
}

function clearBrand() {
  selectedBrandId.value = null;
  selectedBrandName.value = '';
  emit('update:brand', '');
}

function clearCountries() {
  selectedCountries.value = [];
  emit('update:country', '');
}

function clearCreatedByMe() {
  createdByMe.value = false;
  if (filterType.value === 'created_by_me') {
    emit('update:status', '');
  }
}

function clearApprovalRequested() {
  approvalRequested.value = false;
  if (filterType.value === 'approval_requested') {
    emit('update:status', '');
  }
}

function clearCurrentlyRunning() {
  currentlyRunning.value = false;
  if (filterType.value === 'currently_running') {
    emit('update:status', '');
  }
}

function clearAllFilters() {
  clearSearch();
  clearBrand();
  clearCountries();
  filterType.value = '';
  emit('update:status', '');
  createdByMe.value = false;
  approvalRequested.value = false;
  currentlyRunning.value = false;
}
</script>

<style scoped>
.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  width: 100%;
}

.filter-item {
  min-width: 180px;
}

/* Search field grows to fill available space */
.search-field {
  flex-grow: 1;
  min-width: 200px;
  max-width: 280px;
}

/* Create button stays on the right */
.create-button {
  margin-left: auto;
  min-width: auto;
}

/* Media queries for smaller screens */
@media (max-width: 1200px) {
  .filter-item {
    min-width: 160px;
  }
}

@media (max-width: 960px) {
  .filter-container {
    grid-template-columns: 1fr 1fr;
  }

  .filter-item {
    min-width: 140px;
  }

  .search-field {
    flex-basis: 100%;
    order: 5;
  }

  .create-button {
    margin-left: 0;
    flex-basis: 100%;
    order: 6;
    display: flex;
    justify-content: flex-end;
  }
}

@media (max-width: 600px) {
  .filter-item {
    flex-basis: 100%;
  }
}
</style>