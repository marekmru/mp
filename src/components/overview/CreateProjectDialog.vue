<template>
  <v-dialog v-model="dialog" persistent max-width="550px">
    <v-card class="px-1 pb-6 pt-4">
      <!-- Keep the original DialogHeader component -->
      <DialogHeader
          class="px-2"
          title="Create new Mediaplan"
          :show-back-button="true"
          :show-close-button="true"
          @back="cancelDialog"
          @close="cancelDialog"
      />

      <v-form ref="form" @submit.prevent="submitForm" v-model="isFormValid" validate-on="input">
        <v-card-text class="py-2">
          <!-- Brand Logo and Name -->
          <v-row class="mb-0">
            <v-col cols="12">
              <v-row align="center" no-gutters>
                <v-col cols="auto" class="mr-2 pr-0">
                  <v-img
                      :src="getBrandLogo(brand)"
                      width="100"
                      height="40"
                      contain
                  ></v-img>
                </v-col>
                <v-col>
                  <span class="text-h6 font-weight-regular">{{ brandName }}</span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <!-- Mediaplan Details (Read-only) -->
          <v-row>
            <v-col cols="12">
              <!-- Name -->
              <v-row no-gutters class="py-1 align-center">
                <v-col cols="3" class="text-body-2 text-medium-emphasis">
                  Name:
                </v-col>
                <v-col class="text-body-2 text-right">
                  {{ mediaplanName || '-_______-_______-Testname' }}
                </v-col>
              </v-row>

              <!-- PO Numbers -->
              <v-row no-gutters class="py-1 align-center">
                <v-col cols="3" class="text-body-2 text-medium-emphasis">
                  PO:
                </v-col>
                <v-col class="text-body-2 text-right">
                  {{ poNumbersDisplay }}
                </v-col>
              </v-row>

              <!-- Duration -->
              <v-row no-gutters class="py-1 align-center">
                <v-col cols="3" class="text-body-2 text-medium-emphasis">
                  Duration:
                </v-col>
                <v-col class="text-body-2 text-right">
                  Start: {{ formatDate(startDateValue) }}<br>
                  End: {{ formatDate(endDateValue) }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-divider class="mt-0 mb-3"></v-divider>
            </v-col>
          </v-row>

          <v-row class="mb-0" no-gutters>
            <h6 class="text-h6 font-weight-regular">Add first project</h6>
          </v-row>

          <!-- Country and Language Selection -->
          <v-row>
            <v-col cols="12" md="6" class="pb-0">
              <v-sheet class="mb-1">
                <div class="text-caption text-medium-emphasis mb-1">Country *</div>
              </v-sheet>
              <v-select
                  v-model="selectedCountry"
                  :items="countries"
                  item-title="name"
                  item-value="code"
                  :rules="[v => !!v || 'Country is required']"
                  variant="outlined"
                  density="comfortable"
                  return-object
                  hide-details
                  class="rounded-lg"
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
            </v-col>

            <v-col cols="12" md="6" class="pb-0">
              <v-sheet class="mb-1">
                <div class="text-caption text-medium-emphasis mb-1">Language *</div>
              </v-sheet>
              <v-select
                  v-model="selectedLanguage"
                  :items="availableLanguages"
                  item-title="name"
                  item-value="code"
                  variant="outlined"
                  density="comfortable"
                  :disabled="!selectedCountry"
                  :rules="[v => !!v || 'Language is required']"
                  hide-details
                  class="rounded-lg"
              />
              <div class="text-caption text-medium-emphasis mt-1">* Depends on Country</div>
            </v-col>
          </v-row>

          <!-- Builder -->
          <v-row>
            <v-col cols="12">
              <v-sheet class="mb-1">
                <div class="text-caption text-medium-emphasis mb-1">Builder *</div>
              </v-sheet>
              <v-select
                  v-model="selectedBuilder"
                  :items="builders"
                  item-title="name"
                  item-value="code"
                  :rules="[v => !!v || 'Builder is required']"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="rounded-lg"
              />
            </v-col>
          </v-row>

          <!-- Campaign Type -->
          <v-row>
            <v-col cols="12">
              <v-sheet class="mb-1">
                <div class="text-caption text-medium-emphasis mb-1">Campaign type *</div>
              </v-sheet>
              <v-select
                  v-model="selectedCampaignType"
                  :items="campaignTypes"
                  item-title="name"
                  item-value="code"
                  :rules="[v => !!v || 'Campaign type is required']"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="rounded-lg"
              >
                <template v-slot:selection="{ item }">
                  <v-chip
                      size="small"
                      :color="getCampaignTypeColor(item.raw.code)"
                      class="text-capitalize"
                  >
                    {{ item.raw.name }}
                  </v-chip>
                </template>
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-icon :color="getCampaignTypeColor(item.raw.code)"
                              :icon="getCampaignTypeIcon(item.raw.code)"></v-icon>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
          </v-row>

          <!-- Phase -->
          <v-row>
            <v-col cols="12">
              <v-sheet class="mb-1">
                <div class="text-caption text-medium-emphasis mb-1">Phase *</div>
              </v-sheet>
              <v-select
                  v-model="selectedPhase"
                  :items="phases"
                  item-title="name"
                  item-value="code"
                  :rules="[v => !!v || 'Phase is required']"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="rounded-lg"
              />
            </v-col>
          </v-row>

          <!-- Goal -->
          <v-row class="mb-0">
            <v-col cols="12">
              <v-sheet class="mb-1">
                <div class="text-caption text-medium-emphasis mb-1">Goal *</div>
              </v-sheet>
              <v-select
                  v-model="selectedGoal"
                  :items="goals"
                  item-title="name"
                  item-value="code"
                  :rules="[v => !!v || 'Goal is required']"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="rounded-lg"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Keep the original DialogFooter component -->
        <DialogFooter
            class="px-4"
            cancel-text="Cancel"
            confirm-text="Save"
            :loading="isSubmitting"
            :disabled="!formIsReady"
            :submit-button="true"
            @cancel="cancelDialog"
        />
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted, watch} from 'vue';
import {useRouter} from 'vue-router';
import DialogFooter from "@/components/common/dialog/DialogFooter.vue";
import DialogHeader from "@/components/common/dialog/DialogHeader.vue";
import {useProjectStore} from '@/stores/projectStore';
import type {ProjectCountry, ProjectLanguage, ProjectCampaignType, ProjectPhase, ProjectGoal} from '@/types/project';
import CountryFlag from '@/components/common/CountryFlag.vue';
import {formatDate} from '@/helpers/dateUtils';
import {formatCurrency} from '@/helpers/currencyUtils';
import {getBrandLogo} from '@/helpers/brandUtils';
import {getCampaignTypeColor, getCampaignTypeIcon} from '@/helpers/campaignTypeUtils';
import {showSuccess, showError, showWarning} from '@/helpers/notificationUtils';

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
  {code: 'Consideration', name: 'Consideration'},
  {code: 'Product Launch', name: 'Product Launch'},
  {code: 'Seasonal', name: 'Seasonal'},
  {code: 'Promotion', name: 'Promotion'}
]);

const phases = ref([
  {code: 'Consideration', name: 'Consideration'},
  {code: 'Planning', name: 'Planning'},
  {code: 'Execution', name: 'Execution'}
]);

const goals = ref([
  {code: 'Configurator', name: 'Configurator'},
  {code: 'Consideration', name: 'Consideration'},
  {code: 'Conversion', name: 'Conversion'},
  {code: 'Brand Recognition', name: 'Brand Recognition'},
  {code: 'Lead Generation', name: 'Lead Generation'},
  {code: 'Sales', name: 'Sales'}
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

  // Format to match the Figma design (comma-separated list of PO numbers)
  return props.poNumbers.map(po => po.name).join(', ');
});

// Validate the form
const validateForm = async (): Promise<boolean> => {
  if (!form.value) return false;

  const {valid} = await form.value.validate();
  return valid;
};

const submitForm = async () => {
  // Validate the form first
  const isValid = await validateForm();
  if (!isValid) {
    showWarning('Please fill in all required fields');
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

      showSuccess(`Project "${props.mediaplanName}" created successfully`);

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
      showError('Failed to create project. Please check your connection and try again.', {timeout: 8000});
    }
  } catch (error) {
    console.error('Error in form submission:', error);
    showError('An unexpected error occurred.');
  } finally {
    isSubmitting.value = false;
  }
};

const cancelDialog = () => {
  if (isSubmitting.value) {
    showWarning('Please wait while the form is submitting...');
    return;
  }

  dialog.value = false;
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

<style scoped>
/*.rounded-lg {
  border-radius: 8px;
}

!* Remove the double border when selections are made *!
:deep(.v-field.v-field--variant-outlined .v-field__outline) {
  --v-field-border-opacity: 1;
  --v-field-border-width: 1px;
}

!* Ensure select fields match Figma design *!
:deep(.v-field--variant-outlined) {
  border: 1px solid rgba(0, 0, 0, 0.23);
  background-color: white;
}*/
</style>