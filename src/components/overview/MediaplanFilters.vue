<template>
  <v-row>
    <v-col cols="12" md="3">
      <v-menu v-model="brandMenuOpen" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
              variant="outlined"
              v-bind="props"
              class="w-100"
              prepend-icon="mdi-tag-outline"
              :color="selectedBrandId ? 'primary' : undefined"
          >
            {{ selectedBrandId ? selectedBrandName : 'Brand Selection' }}
          </v-btn>
        </template>
        <v-card min-width="300" class="pa-2">
          <v-card-title class="d-flex justify-space-between align-center">
            Brand Selection
            <v-btn icon size="small" @click="brandMenuOpen = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider class="mb-2"></v-divider>
          <v-list>
            <v-list-item
                v-for="brand in brands"
                :key="brand._id"
                :value="brand._id"
                @click="selectBrand(brand)"
            >
              <template v-slot:prepend>
                <v-avatar size="32" class="mr-3">
                  <v-img v-if="brand.logo" :src="brand.logo" :alt="brand.name">
                    <template v-slot:placeholder>
                      <v-icon>mdi-domain</v-icon>
                    </template>
                  </v-img>
                  <v-icon v-else>mdi-domain</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title>{{ brand.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-col>

    <v-col cols="12" md="3">
      <v-menu v-model="sortMenuOpen" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
              variant="outlined"
              v-bind="props"
              class="w-100"
              prepend-icon="mdi-sort"
          >
            Sort by
          </v-btn>
        </template>
        <v-card min-width="300" class="pa-2">
          <v-card-title class="d-flex justify-space-between align-center">
            Sort by
            <v-btn icon size="small" @click="sortMenuOpen = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider class="mb-2"></v-divider>
          <v-list>
            <v-list-item @click="setSorting('updated_at', 'desc')">
              <template v-slot:prepend>
                <v-icon>mdi-arrow-down</v-icon>
              </template>
              <v-list-item-title>Last updated first</v-list-item-title>
            </v-list-item>
            <v-list-item @click="setSorting('start_date', 'asc')">
              <template v-slot:prepend>
                <v-icon>mdi-arrow-down</v-icon>
              </template>
              <v-list-item-title>Earliest Start Date first</v-list-item-title>
            </v-list-item>
            <v-list-item @click="setSorting('start_date', 'desc')">
              <template v-slot:prepend>
                <v-icon>mdi-arrow-up</v-icon>
              </template>
              <v-list-item-title>Start Date Descending</v-list-item-title>
            </v-list-item>
            <v-list-item @click="setSorting('created_at', 'asc')">
              <template v-slot:prepend>
                <v-icon>mdi-arrow-down</v-icon>
              </template>
              <v-list-item-title>Creation Date Ascending</v-list-item-title>
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
              <v-list-item-title>End Date Ascending</v-list-item-title>
            </v-list-item>
            <v-list-item @click="setSorting('end_date', 'desc')">
              <template v-slot:prepend>
                <v-icon>mdi-arrow-up</v-icon>
              </template>
              <v-list-item-title>End Date Descending</v-list-item-title>
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
    </v-col>

    <v-col cols="12" md="3">
      <v-menu v-model="countryMenuOpen" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
              variant="outlined"
              v-bind="props"
              class="w-100"
              prepend-icon="mdi-earth"
              :color="selectedCountries.length > 0 ? 'primary' : undefined"
          >
            Country Selection
          </v-btn>
        </template>
        <v-card min-width="300" class="pa-2">
          <v-card-title class="d-flex justify-space-between align-center">
            Country Selection
            <v-btn icon size="small" @click="countryMenuOpen = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider class="mb-2"></v-divider>
          <v-list>
            <v-list-item>
              <v-checkbox
                  v-model="selectAllCountries"
                  label="Show all"
                  hide-details
                  @change="toggleAllCountries"
              ></v-checkbox>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item v-for="country in countries" :key="country.abbreviation">
              <v-checkbox
                  v-model="selectedCountries"
                  :value="country.abbreviation"
                  :label="country.value"
                  hide-details
                  @change="updateCountryFilter"
              ></v-checkbox>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-col>

    <v-col cols="12" md="3">
      <v-menu v-model="filterMenuOpen" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
              variant="outlined"
              v-bind="props"
              class="w-100"
              prepend-icon="mdi-filter-outline"
              :color="hasActiveFilters ? 'primary' : undefined"
          >
            Filter by
          </v-btn>
        </template>
        <v-card min-width="300" class="pa-2">
          <v-card-title class="d-flex justify-space-between align-center">
            Filter by
            <v-btn icon size="small" @click="filterMenuOpen = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider class="mb-2"></v-divider>
          <v-list>
            <v-list-item>
              <v-checkbox
                  v-model="createdByMe"
                  label="Created by me"
                  hide-details
                  @change="updateSpecialFilters"
              ></v-checkbox>
            </v-list-item>
            <v-list-item>
              <v-checkbox
                  v-model="approvalRequested"
                  label="Approval requested"
                  hide-details
                  @change="updateSpecialFilters"
              ></v-checkbox>
            </v-list-item>
            <v-list-item>
              <v-checkbox
                  v-model="currentlyRunning"
                  label="Currently running"
                  hide-details
                  @change="updateSpecialFilters"
              ></v-checkbox>
            </v-list-item>
            <v-divider class="my-2"></v-divider>
            <v-list-item>
              <v-select
                  v-model="selectedStatus"
                  :items="statusOptions"
                  label="Status"
                  variant="outlined"
                  density="compact"
                  hide-details
                  @update:model-value="updateStatusFilter"
              ></v-select>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-col>

    <v-col cols="12">
      <v-text-field
          v-model="searchQuery"
          label="Search..."
          prepend-inner-icon="mdi-magnify"
          single-line
          hide-details
          variant="outlined"
          density="compact"
          @update:model-value="debouncedSearch"
          clearable
      ></v-text-field>
    </v-col>

    <!-- Active filters display -->
    <v-col cols="12" v-if="hasAnyFilter">
      <v-sheet class="pa-2 rounded" color="grey-lighten-4">
        <div class="d-flex align-center">
          <div class="text-body-2 mr-4">Active filters:</div>
          <v-chip
              v-if="searchQuery"
              size="small"
              class="mr-2"
              closable
              @click:close="clearSearch"
          >
            Search: {{ searchQuery }}
          </v-chip>
          <v-chip
              v-if="selectedBrandId"
              size="small"
              class="mr-2"
              closable
              @click:close="clearBrand"
          >
            Brand: {{ selectedBrandName }}
          </v-chip>
          <v-chip
              v-if="selectedStatus"
              size="small"
              class="mr-2"
              closable
              @click:close="clearStatus"
          >
            Status: {{ selectedStatus }}
          </v-chip>
          <v-chip
              v-if="selectedCountries.length > 0"
              size="small"
              class="mr-2"
              closable
              @click:close="clearCountries"
          >
            Countries: {{ selectedCountries.length }}
          </v-chip>
          <v-chip
              v-if="createdByMe"
              size="small"
              class="mr-2"
              closable
              @click:close="clearCreatedByMe"
          >
            Created by me
          </v-chip>
          <v-chip
              v-if="approvalRequested"
              size="small"
              class="mr-2"
              closable
              @click:close="clearApprovalRequested"
          >
            Approval requested
          </v-chip>
          <v-chip
              v-if="currentlyRunning"
              size="small"
              class="mr-2"
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
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, watch} from 'vue';
import customFetch from '@/helpers/customFetch';
import {Brand, Source} from '@/types/mediaplan';

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
  'update:sort-order'
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

// Status options
const statusOptions = ['In Planning', 'Draft', 'For Approval', ''];

// Menu state
const brandMenuOpen = ref(false);
const sortMenuOpen = ref(false);
const countryMenuOpen = ref(false);
const filterMenuOpen = ref(false);

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
    const response = await customFetch('/mediaplans/sources?type=overview');

    // Map the response to our sources structure
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
        // Use languages as countries for this example
        countries.value = response.data.language;
      }

      // Mock brands data (adjust as needed based on your actual API)
      brands.value = [
        {_id: 'bmw', name: 'BMW', logo: '/brands/bmw-logo.png'},
        {_id: 'mini', name: 'Mini', logo: '/brands/mini-logo.png'}
      ];
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
function selectBrand(brand: Brand) {
  selectedBrandId.value = brand._id;
  selectedBrandName.value = brand.name;
  brandMenuOpen.value = false;

  // Update filter
  emit('update:status', selectedStatus.value);
}

function setSorting(field: string, order: 'asc' | 'desc') {
  emit('update:sort-by', field);
  emit('update:sort-order', order);
  sortMenuOpen.value = false;
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

function updateStatusFilter() {
  emit('update:status', selectedStatus.value);
}

function updateSpecialFilters() {
  // This is a simplified implementation
  // In a real app, you might want to include these in a more complex filter object
  // or handle them separately based on your API requirements
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
.w-100 {
  width: 100%;
}
</style>