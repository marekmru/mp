
<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card class="pa-6">
      <DialogHeader
          title="Create Media Plan"
          :show-back-button="true"
          :show-close-button="true"
          margin-bottom="2"
          close-icon-color="primary"
          @back="cancelDialog"
          @close="cancelDialog"
      />

      <v-form ref="form" @submit.prevent="submitForm" v-model="isFormValid" validate-on="input">
        <!-- Brand Logo and Name -->
        <v-row no-gutters align="center" class="mb-3">
          <v-col cols="auto" class="mr-2">
            <v-img
                :src="getBrandLogo()"
                width="100"
                height="40"
                contain
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
            <div class="ml-2 text-body-2 text-right flex-grow-1">{{ mediaplanName || 'Not specified' }}</div>
          </div>

          <!-- PO Numbers -->
          <div class="d-flex py-2">
            <div class="text-body-2 text-medium-emphasis" style="width: 100px;">PO:</div>
            <div class="ml-2 text-body-2 text-right flex-grow-1">{{ poNumbersDisplay }}</div>
          </div>

          <!-- Duration -->
          <div class="d-flex py-2 mb-2">
            <div class="text-body-2 text-medium-emphasis" style="width: 100px;">Duration:</div>
            <div class="ml-2 text-body-2 text-right flex-grow-1">
              Start: {{ formatDate(startDateValue) }}<br>
              End: {{ formatDate(endDateValue) }}
            </div>
          </div>
        </div>

        <v-divider class="mb-4" color="secondary"></v-divider>

        <div class="text-h6 mb-4">Add first project</div>

        <!-- Country Selection with Flag -->
        <div class="d-flex mb-4">
          <div class="flex-1 pr-2" style="width: 50%">
            <label class="text-caption text-medium-emphasis mb-1 d-block">Country *</label>
            <v-select
                v-model="selectedCountry"
                :items="countries"
                item-title="name"
                item-value="code"
                :rules="[v => !!v || 'Country is required']"
                variant="outlined"
                density="compact"
                return-object
                error-messages=""
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

          <!-- Language Selection -->
          <div class="flex-1 pl-2" style="width: 50%">
            <label class="text-caption text-medium-emphasis mb-1 d-block">Language *</label>
            <v-select
                v-model="selectedLanguage"
                :items="availableLanguages"
                item-title="name"
                item-value="code"
                variant="outlined"
                density="compact"
                :disabled="!selectedCountry"
                :rules="[v => !!v || 'Language is required']"
                error-messages=""
            />
            <!-- Asterisk text below the dropdown -->
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
              error-messages=""
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
              error-messages=""
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
              error-messages=""
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
              error-messages=""
          />
        </div>

        <!-- Action Buttons -->
        <DialogFooter
            cancel-text="Cancel"
            confirm-text="Save"
            :loading="isSubmitting"
            :disabled="!formIsReady"
            :submit-button="true"
            @cancel="cancelDialog"
            class="mt-6"
        />
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
import DialogFooter from "@/components/common/dialog/DialogFooter.vue";
import DialogHeader from "@/components/common/dialog/DialogHeader.vue";
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

// Selected form values - all initialized to null/empty
const selectedCountry = ref<ProjectCountry | null>(null);
const selectedLanguage = ref<string | null>(null);
const selectedBuilder = ref<string | null>(null);
const selectedCampaignType = ref<string | null>(null);
const selectedPhase = ref<string | null>(null);
const selectedGoal = ref<string | null>(null);

// Computed for form validation state
const formIsReady = computed(() => {
  return isFormValid.value && !isSubmitting.value && 
    !!selectedCountry.value && 
    !!selectedLanguage.value && 
    !!selectedBuilder.value && 
    !!selectedCampaignType.value &&
    !!selectedPhase.value &&
    !!selectedGoal.value;
});

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

// Function to get the appropriate brand logo
const getBrandLogo = (): string => {
  if (props.brand?.name?.toLowerCase() === 'mini') {
    return '/img/MINI.svg';
  }
  return '/img/BMW.svg';
};

// Validate the form
const validateForm = async (): Promise<boolean> => {
  if (!form.value) return false;
  
  const { valid } = await form.value.validate();
  return valid;
};

const submitForm = async () => {
  // Validate the form first
  const isValid = await validateForm();
  if (!isValid) {
    showError('Please fill in all required fields');
    return;
  }

  isSubmitting.value = true;

  try {
    // Prepare the request payload based on API schema
    const payload = {
      abbreviation: props.mediaplanName || '',
      default_vars: {
        targeturls: null,
        subsegment: selectedBuilder.value || null,
        campaigntype: selectedCampaignType.value || null,
        language: selectedLanguage.value || null,
        campaigndetail: null,
        adtype: "Banner",
        dimension: "300x250"
      },
      descriptive_vars: {
        brand: props.brand?.name || 'MINI',
        country: selectedCountry.value?.code || '',
        bmwponumber: props.poNumbers?.length ? props.poNumbers[0].name : '',
        adobecampaignname: props.mediaplanName || '',
        subsegment: selectedBuilder.value || '',
        campaigntype: selectedCampaignType.value || '',
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
      // For demonstration purposes, simulate API call success
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockResponse = {_id: `project-${Date.now()}`};

      // In a real application, you'd use the actual API call
      /*
      const response = await customFetch(`/mediaplans/${props.mediaplanId}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      */

      showSuccess('Project created successfully');

      // Close dialog, emit created event, and navigate to the mediaplan detail view
      setTimeout(() => {
        // Close the dialog
        dialog.value = false;
        
        // Emit the created event
        emit('created', mockResponse._id);
        
        // Navigate to the mediaplan detail page
        router.push(`/mediaplans/${props.mediaplanId}`);
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
  } else {
    // Reset language when country is cleared
    selectedLanguage.value = null;
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
        name: phase.name
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
