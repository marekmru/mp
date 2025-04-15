<template>
  <v-dialog v-model="dialog" persistent max-width="450px">
    <v-card class="px-6 pa-4">
      <DialogHeader
          title="Create new Mediaplan"
          :show-back-button="true"
          :show-close-button="true"
          margin-bottom="4"
          @back="cancelDialog"
          @close="cancelDialog"
      />

      <v-form ref="form" @submit.prevent="submitForm" v-model="isFormValid" validate-on="input">
        <WithFormDefaults>
          <v-card-text class="pa-0">
            <!-- Brand Logo and Name -->
            <v-row class="align-center mb-3 pl-2">
              <v-img :src="getBrandLogo(brand)" class="mr-2" width="40" max-width="40"></v-img>
              <span class="text-h6 font-weight-regular">{{ brandName }}</span>
            </v-row>

            <v-row no-gutters class="pb-3 align-center">
              <v-col cols="3" class="text-body-2 text-medium-emphasis">Name:</v-col>
              <v-col class="text-body-2 text-right">{{ mediaplanName || '-_______-_______-Testname' }}</v-col>
            </v-row>
            <v-row no-gutters class="pb-3 align-center">
              <v-col cols="3" class="text-body-2 text-medium-emphasis">PO:</v-col>
              <v-col class="text-body-2 text-right">{{ poNumbersDisplay }}</v-col>
            </v-row>
            <v-row no-gutters class="pb-0 align-start">
              <v-col cols="3" class="text-body-2 text-medium-emphasis">Duration:</v-col>
              <v-col class="text-body-2 text-right">
                Start: {{ formatDate(startDateValue) }}<br>
                End: {{ formatDate(endDateValue) }}
              </v-col>
            </v-row>

            <v-divider class="mt-4 mb-5"></v-divider>

            <!-- Section Title -->
            <v-row>
              <v-col cols="12">
                <h6 class="text-h6 font-weight-regular">Add first project</h6>
              </v-col>
            </v-row>

            <!-- Country and Language -->
            <v-row>
              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">Country *</div>
                <v-select
                    v-model="selectedCountry"
                    :items="countries"
                    item-title="name"
                    item-value="code"
                    :rules="[v => !!v || 'Country is required']"
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
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis mb-0">Language *</div>
                <v-select
                    v-model="selectedLanguage"
                    :items="availableLanguages"
                    item-title="name"
                    item-value="code"
                    :disabled="!selectedCountry"
                    :rules="[v => !!v || 'Language is required']"
                />
                <div class="text-caption text-medium-emphasis mt-1">* Depends on Country</div>
              </v-col>
            </v-row>

            <!-- Builder -->
            <v-row>
              <v-col cols="12">
                <div class="text-caption text-medium-emphasis mb-0">Builder *</div>
                <v-select
                    v-model="selectedBuilder"
                    :items="builders"
                    item-title="name"
                    item-value="code"
                    :rules="[v => !!v || 'Builder is required']"
                />
              </v-col>
            </v-row>

            <!-- Campaign Type -->
            <v-row>
              <v-col cols="12">
                <div class="text-caption text-medium-emphasis mb-0">Campaign type *</div>
                <v-select
                    v-model="selectedCampaignType"
                    :items="campaignTypes"
                    item-title="name"
                    item-value="code"
                    :rules="[v => !!v || 'Campaign type is required']"
                />
              </v-col>
            </v-row>

            <!-- Phase -->
            <v-row>
              <v-col cols="12">
                <div class="text-caption text-medium-emphasis mb-0">Phase *</div>
                <v-select
                    v-model="selectedPhase"
                    :items="phases"
                    item-title="name"
                    item-value="code"
                    :rules="[v => !!v || 'Phase is required']"
                />
              </v-col>
            </v-row>

            <!-- Goal -->
            <v-row>
              <v-col cols="12">
                <div class="text-caption text-medium-emphasis mb-0">Goal *</div>
                <v-select
                    v-model="selectedGoal"
                    :items="goals"
                    item-title="name"
                    item-value="code"
                    :rules="[v => !!v || 'Goal is required']"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </WithFormDefaults>

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
// Inline utility function to format dates in German format (DD.MM.YYYY)
import {formatCurrency} from '@/helpers/currencyUtils';
import {getBrandLogo} from '@/helpers/brandUtils';
import {getCampaignTypeColor, getCampaignTypeIcon} from '@/helpers/campaignTypeUtils';
import {showSuccess, showError, showWarning} from '@/helpers/notificationUtils';
import WithFormDefaults from "@/components/common/dialog/WithFormDefaults.vue";

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
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

</style>