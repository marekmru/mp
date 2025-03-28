<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card class="pa-6">
      <v-card-title class="px-0 mb-6">
        <div class="d-flex align-center w-100">
          <v-icon class="mr-2" size="small" @click="cancelDialog">mdi-arrow-left</v-icon>
          <span class="text-h5">Create Media Plan</span>
          <v-spacer></v-spacer>
          <v-icon size="small" @click="cancelDialog">mdi-close</v-icon>
        </div>
      </v-card-title>

      <v-form ref="form" @submit.prevent="submitForm" v-model="isFormValid">        <!-- Brand Logo and Name -->
        <v-row no-gutters align="center" class="mb-3">
          <v-col cols="auto">
            <v-img
                src="/img/BMW.svg"
                width="100"
                height="40"
            ></v-img>
          </v-col>
          <v-col cols="auto">
            <span class="text-subtitle-1 font-weight-medium">{{ brandName }}</span>
          </v-col>
        </v-row>

        <!-- Mediaplan Details (Read-only) -->
        <div class="mb-4">
          <!-- Name -->
          <div class="d-flex py-2">
            <div class="text-body-2 text-medium-emphasis" style="width: 100px;">Name:</div>
            <div class="ml-2 text-body-2 text-right" style="flex: 1;">{{ mediaplanName || 'Not specified' }}</div>
          </div>

          <!-- PO Numbers -->
          <div class="d-flex py-2">
            <div class="text-body-2 text-medium-emphasis" style="width: 100px;">PO:</div>
            <div class="ml-2 text-body-2 text-right" style="flex: 1;">{{ poNumbersDisplay }}</div>
          </div>

          <!-- Duration -->
          <div class="d-flex py-2 mb-4">
            <div class="text-body-2 text-medium-emphasis" style="width: 100px;">Duration:</div>
            <div class="ml-2 text-body-2 text-right" style="flex: 1;">
              Start: {{ formatDate(startDateValue) }}
              End: {{ formatDate(endDateValue) }}
            </div>
          </div>
        </div>

        <div class="solid-border-b mb-4"></div>

        <div class="text-subtitle-1 font-weight-medium mb-4">Add first project</div>

        <!-- Country Selection with Flag -->
        <div class="d-flex mb-4">
          <div class="w-50 pr-2">
            <label class="text-caption text-medium-emphasis mb-1 d-block">Country</label>
            <v-select
                v-model="selectedCountry"
                :items="countries"
                item-title="name"
                item-value="code"
                :rules="[v => !!v || 'Country is required']"
                variant="outlined"
                density="compact"
                class="flex-grow-1"
                hide-details
                return-object
            >
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <country-flag :country="item.raw.code" class="mr-2"/>
                  {{ item.raw.code }} - {{ item.raw.name }}
                </div>
              </template>
              <template v-slot:item="{ item, props }">
                <v-list-item v-bind="props" :title="`${item.raw.code} - ${item.raw.name}`">
                  <template v-slot:prepend>
                    <country-flag :country="item.raw.code" class="mr-2"/>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </div>

          <!-- Language Selection - Modified to move asterisk text below the dropdown -->
          <div class="w-50 pl-2">
            <label class="text-caption text-medium-emphasis mb-1 d-block">Language</label>
            <v-select
                v-model="selectedLanguage"
                :items="availableLanguages"
                item-title="name"
                item-value="code"
                variant="outlined"
                density="compact"
                hide-details
                :disabled="!selectedCountry"
            />
            <!-- Moved asterisk text below the dropdown -->
            <div class="text-caption text-medium-emphasis mt-1">* Depends on Country</div>
          </div>
        </div>

        <!-- Builder -->
        <div class="mb-4">
          <label class="text-caption text-medium-emphasis mb-1 d-block">Builder *</label>
          <v-select
              v-model="selectedBuilder"
              :items="builders"
              item-title="name"
              item-value="code"
              :rules="[v => !!v || 'Builder is required']"
              variant="outlined"
              density="compact"
              hide-details
          />
        </div>

        <!-- Campaign Type -->
        <div class="mb-4">
          <label class="text-caption text-medium-emphasis mb-1 d-block">Campaign type *</label>
          <v-select
              v-model="selectedCampaignType"
              :items="campaignTypes"
              item-title="name"
              item-value="code"
              :rules="[v => !!v || 'Campaign type is required']"
              variant="outlined"
              density="compact"
              hide-details
          />
        </div>

        <!-- Phase -->
        <div class="mb-4">
          <label class="text-caption text-medium-emphasis mb-1 d-block">Phase *</label>
          <v-select
              v-model="selectedPhase"
              :items="phases"
              item-title="name"
              item-value="code"
              :rules="[v => !!v || 'Phase is required']"
              variant="outlined"
              density="compact"
              hide-details
          />
        </div>

        <!-- Goal -->
        <div class="mb-4">
          <label class="text-caption text-medium-emphasis mb-1 d-block">Goal *</label>
          <v-select
              v-model="selectedGoal"
              :items="goals"
              item-title="name"
              item-value="code"
              :rules="[v => !!v || 'Goal is required']"
              variant="outlined"
              density="compact"
              hide-details
          />
        </div>

        <!-- Action Buttons -->
        <div class="d-flex justify-space-between mt-6">
          <v-btn
              min-width="120"
              variant="outlined"
              @click="cancelDialog"
          >
            Cancel
          </v-btn>
          <v-btn
              min-width="120"
              color="primary"
              type="submit"
              :loading="isSubmitting"
              :disabled="!isFormValid"
          >
            Save
          </v-btn>
        </div>
      </v-form>
    </v-card>

    <!-- Success/Error Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-dialog>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted, watch} from 'vue';
import {useRouter} from 'vue-router';
import {format} from 'date-fns';
import {useProjectStore} from '@/stores/projectStore';
import type {ProjectCountry, ProjectLanguage, ProjectCampaignType, ProjectPhase, ProjectGoal} from '@/types/project';
import customFetch from '@/helpers/customFetch';
import CountryFlag from '@/components/common/CountryFlag.vue';

// Props
const props = defineProps<{
  modelValue: boolean;
  mediaplanId: string;
  mediaplanName?: string;
  poNumbers?: { _id: string; name: string; value: number }[];
  startDate?: string;
  endDate?: string;
  brand?: { _id: string; name: string };
  isFirstProject?: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'created', projectId: string): void;
}>();

// References
const form = ref();
const router = useRouter();
const projectStore = useProjectStore();
const isFormValid = ref(false);
const isSubmitting = ref(false);

// Selected form values
const selectedCountry = ref<ProjectCountry | null>({
  code: 'AT',
  name: 'Austria'
});

const selectedLanguage = ref('DEU');
const selectedBuilder = ref('SEA');
const selectedCampaignType = ref('Always On');
const selectedPhase = ref('Consideration');
const selectedGoal = ref('Configurator');

// Dialog state
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Default brand name
const brandName = computed(() => props.brand?.name || 'Mini');

// Convert date props to properly handle string or undefined
const startDateValue = computed(() => props.startDate || '');
const endDateValue = computed(() => props.endDate || '');

// Dropdown data
const countries = ref<ProjectCountry[]>([
  {code: 'AT', name: 'Austria'},
  {code: 'DE', name: 'Germany'},
  {code: 'PL', name: 'Poland'},
  {code: 'US', name: 'United States'}
]);

const languageOptions = ref<ProjectLanguage[]>([
  {code: 'DEU', name: 'German'},
  {code: 'ENG', name: 'English'},
  {code: 'POL', name: 'Polish'}
]);

const builders = ref([
  {code: 'SEA', name: 'SEA'},
  {code: 'OT', name: 'Other'},
  {code: 'NC', name: 'New Cars'}
]);

const campaignTypes = ref([
  {code: 'Always On', name: 'Always On'},
  {code: 'Awareness', name: 'Awareness'},
  {code: 'Consideration', name: 'Consideration'}
]);

const phases = ref([
  {code: 'Consideration', name: 'Consideration'},
  {code: 'Planning', name: 'Planning'},
  {code: 'Execution', name: 'Execution'}
]);

const goals = ref([
  {code: 'Configurator', name: 'Configurator'},
  {code: 'Consideration', name: 'Consideration'},
  {code: 'Conversion', name: 'Conversion'}
]);

// Available languages based on selected country
const availableLanguages = computed(() => {
  if (!selectedCountry.value) return [];

  // Based on the mockup, we're showing DEU for AT
  switch (selectedCountry.value.code) {
    case 'DE':
    case 'AT':
      return languageOptions.value.filter(l => ['DEU'].includes(l.code));
    case 'PL':
      return languageOptions.value.filter(l => ['POL'].includes(l.code));
    case 'US':
      return languageOptions.value.filter(l => ['ENG'].includes(l.code));
    default:
      return languageOptions.value;
  }
});

// Format PO numbers for display
const poNumbersDisplay = computed(() => {
  if (!props.poNumbers || props.poNumbers.length === 0) {
    return 'None';
  }
  return props.poNumbers.map(po => po.name).join(', ');
});

// Snackbar for notifications
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success',
});

// Methods
const formatDate = (dateString: string): string => {
  if (!dateString) return 'Not specified';
  try {
    return format(new Date(dateString), 'dd.MM.yyyy');
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Invalid date';
  }
};

const submitForm = async () => {
  if (!form.value) return;

  const {valid} = await form.value.validate();
  if (!valid) return;

  isSubmitting.value = true;

  try {
    // Prepare the request payload based on API schema
    const payload = {
      abbreviation: props.mediaplanName || '',
      default_vars: {
        targeturls: null,
        subsegment: selectedBuilder.value,
        campaigntype: selectedCampaignType.value,
        language: selectedLanguage.value,
        campaigndetail: null,
        adtype: "Banner",
        dimension: "300x250"
      },
      descriptive_vars: {
        brand: props.brand?.name || 'MINI',
        country: selectedCountry.value?.code || 'AT',
        bmwponumber: props.poNumbers?.length ? props.poNumbers[0].name : '',
        adobecampaignname: props.mediaplanName || '',
        subsegment: selectedBuilder.value,
        campaigntype: selectedCampaignType.value,
        projectname: props.mediaplanName || '',
        year: new Date().getFullYear()
      },
      is_locked: false,
      labels: [],
      lock_state: 0,
      owner: "user123", // Would be the current user in a real app
      message: "OK",
      version: "v1"
    };

    try {
      // Call the API to create the project
      const url = `/mediaplans/${props.mediaplanId}/projects`;

      // For demonstration purposes, simulate API call success
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockResponse = {_id: `project-${Date.now()}`};

      // In a real application, you'd use the actual API call
      /*
      const response = await customFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      */

      showSuccess('Project created successfully');

      // Close dialog after success and emit the created event
      setTimeout(() => {
        dialog.value = false;
        emit('created', mockResponse._id);
        // Navigate to the mediaplan detail view with the project tab active
        router.push(`/mediaplans/${props.mediaplanId}?tab=projects`);
      }, 1000);
    } catch (error) {
      console.error('Error with API call:', error);
      showError(error instanceof Error ? error.message : 'Failed to create project');
    }
  } catch (error) {
    console.error('Error in form submission:', error);
    showError(error instanceof Error ? error.message : 'Failed to create project');
  } finally {
    isSubmitting.value = false;
  }
};

const cancelDialog = () => {
  dialog.value = false;
};

const showSuccess = (message: string) => {
  snackbar.color = 'success';
  snackbar.text = message;
  snackbar.show = true;
};

const showError = (message: string) => {
  snackbar.color = 'error';
  snackbar.text = message;
  snackbar.show = true;
};

// Watch for changes in the selected country
watch(selectedCountry, (newCountry) => {
  if (newCountry) {
    // Based on the mockup, set language based on country
    switch (newCountry.code) {
      case 'AT':
      case 'DE':
        selectedLanguage.value = 'DEU';
        break;
      case 'PL':
        selectedLanguage.value = 'POL';
        break;
      case 'US':
        selectedLanguage.value = 'ENG';
        break;
    }
  }
});

// Initialize component
onMounted(async () => {
  // In a real application, fetch dropdown data from API
  try {
    await projectStore.fetchProjectOptions();

    // If options are available in the store, use them
    if (projectStore.countries.length > 0) {
      countries.value = projectStore.countries;
    }

    if (projectStore.languages.length > 0) {
      languageOptions.value = projectStore.languages;
    }

    if (projectStore.campaignTypes.length > 0) {
      campaignTypes.value = projectStore.campaignTypes.map(type => ({
        code: type.id,
        name: type.name
      }));
    }

    if (projectStore.phases.length > 0) {
      phases.value = projectStore.phases.map(phase => ({
        code: phase.id,
      }));
    }

    if (projectStore.goals.length > 0) {
      goals.value = projectStore.goals.map(goal => ({
        code: goal.id,
        name: goal.name
      }));
    }
  } catch (error) {
    console.error('Error fetching form options:', error);
    showError('Failed to load form options');
  }
});
</script>

<style scoped>


.solid-border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  height: 1px;
}

.w-50 {
  width: 50%;
}
</style>