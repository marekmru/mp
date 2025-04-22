<template>
  <v-dialog v-model="dialog" persistent max-width="550px">
    <v-card class="px-6 pa-4">
      <DialogHeader
          :title="dialogTitle"
          :show-back-button="true"
          :show-close-button="true"
          margin-bottom="4"
          @back="cancelDialog"
          @close="cancelDialog"
      />

      <v-card-text class="pa-0 mb-4">
        <v-row class="align-center mb-3 pl-2">
          <v-img :src="getBrandLogo(brand)" class="mr-2" width="40" max-width="40"></v-img>
          <span class="text-h6 font-weight-regular">{{ brandName }} / {{ mediaplanName || 'Mediaplan' }}</span>
        </v-row>
      </v-card-text>

      <v-divider class="mb-5"></v-divider>

      <v-form ref="form" @submit.prevent="submitForm" v-model="isFormValid" validate-on="input"
              :disabled="isSubmitting">
        <WithFormDefaults>
          <v-card-text class="pa-0">
            <v-row>
              <v-col cols="12">
                <h6 class="text-h6 font-weight-regular mb-3">{{ sectionTitle }}</h6>
              </v-col>
            </v-row>

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
                    :loading="!projectStore.countries.length"
                    placeholder="Select Country"
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
                    :disabled="!selectedCountry || availableLanguages.length === 0"
                    :rules="[v => !!v || 'Language is required']"
                    placeholder="Select Language"
                />
                <div v-if="selectedCountry" class="text-caption text-medium-emphasis mt-1">* Depends on Country</div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">Start Date *</div>
                <v-text-field
                    type="date"
                    v-model="projectStartDate"
                    :rules="[v => !!v || 'Start date is required']"
                    placeholder="YYYY-MM-DD"
                />
              </v-col>
              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">End Date *</div>
                <v-text-field
                    type="date"
                    v-model="projectEndDate"
                    :rules="[v => !!v || 'End date is required', v => !projectStartDate || v >= projectStartDate || 'End date must be after start date']"
                    placeholder="YYYY-MM-DD"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <div class="text-caption text-medium-emphasis">PO Number</div>
                <v-text-field
                    v-model="projectPoNumber"
                    placeholder="Enter PO Number (Optional)"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <div class="text-caption text-medium-emphasis">Builder *</div>
                <v-select
                    v-model="selectedBuilder"
                    :items="builders"
                    item-title="name"
                    item-value="code"
                    :rules="[v => !!v || 'Builder is required']"
                    placeholder="Select Builder"
                    :loading="!projectStore.builders?.length"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <div class="text-caption text-medium-emphasis">Campaign type *</div>
                <v-select
                    v-model="selectedCampaignType"
                    :items="campaignTypes"
                    item-title="name"
                    item-value="code"
                    :rules="[v => !!v || 'Campaign type is required']"
                    placeholder="Select Campaign Type"
                    :loading="!projectStore.campaignTypes?.length"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <div class="text-caption text-medium-emphasis">Phase *</div>
                <v-select
                    v-model="selectedPhase"
                    :items="phases"
                    item-title="name"
                    item-value="code"
                    :rules="[v => !!v || 'Phase is required']"
                    placeholder="Select Phase"
                    :loading="!projectStore.phases?.length"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <div class="text-caption text-medium-emphasis">Goal *</div>
                <v-select
                    v-model="selectedGoal"
                    :items="goals"
                    item-title="name"
                    item-value="code"
                    :rules="[v => !!v || 'Goal is required']"
                    placeholder="Select Goal"
                    :loading="!projectStore.goals?.length"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <div class="text-caption text-medium-emphasis">Budget *</div>
                <v-text-field
                    v-model.number="projectBudget"
                    type="number"
                    prefix="$"
                    placeholder="Enter planned budget"
                    :rules="[v => v !== null && v !== undefined && v >= 0 || 'Budget is required and must be positive']"
                />
              </v-col>
            </v-row>

          </v-card-text>
        </WithFormDefaults>

        <DialogFooter
            class="px-4 mt-5"
            cancel-text="Cancel"
            :confirm-text="submitButtonText"
            :loading="isSubmitting"
            :disabled="!formIsReady || isSubmitting"
            :submit-button="true"
            @cancel="cancelDialog"
            @confirm="submitForm"/>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, watch, nextTick, PropType} from 'vue';
// Keep other necessary imports: useRouter, useProjectStore, types, utils etc.
// Make sure these paths are correct for your project structure
import DialogFooter from "@/components/common/dialog/DialogFooter.vue";
import DialogHeader from "@/components/common/dialog/DialogHeader.vue";
import {useProjectStore} from '@/stores/projectStore';
import type {
  ProjectCountry,
  ProjectLanguage,
  ProjectCampaignType,
  ProjectPhase,
  ProjectGoal,
  ProjectBuilder
} from '@/types/project'; // Assume ProjectBuilder type exists
// Assuming you have a more specific type for the detailed project data:
// import type { ProjectDetails } from '@/types/project';
import CountryFlag from '@/components/common/CountryFlag.vue'; // Ensure this component exists
import {getBrandLogo} from '@/helpers/brandUtils'; // Ensure this helper exists
import {showSuccess, showError, showWarning} from '@/helpers/notificationUtils'; // Ensure this helper exists
import WithFormDefaults from "@/components/common/dialog/WithFormDefaults.vue"; // Ensure this component exists
import {formatDate} from "@/helpers/dateUtils.ts"; // Ensure this helper exists and handles null/undefined

// Props
interface CreateProjectDialogProps {
  modelValue: boolean
  mediaplanId: string
  projectId?: string
  mediaplanName?: string
  poNumbers?: { _id: string; name: string; value: number }[]
  startDate?: string
  endDate?: string
  brand?: { _id: string; name: string }
  mode: 'create-mediaplan' | 'edit-project' | 'create-project'
  // just use `any | null` here—no `as PropType<…>` inside the generic
  projectData?: any | null
}

// now this parses cleanly
const props = defineProps<CreateProjectDialogProps>()

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void; // For v-model on dialog
  (e: 'created', projectId: string): void; // After successful creation
  (e: 'updated', projectId: string): void; // After successful update
}>();

// References
const form = ref<any>(null); // Type for VForm instance if available (e.g., import { VForm } from 'vuetify/components')
const projectStore = useProjectStore();
const isFormValid = ref(false);
const isSubmitting = ref(false); // For Create/Update API call

// --- Form Field Refs ---
const selectedCountry = ref<ProjectCountry | null>(null);
const selectedLanguage = ref<string | null>(null);
const projectStartDate = ref<string | null>(null); // YYYY-MM-DD format
const projectEndDate = ref<string | null>(null);   // YYYY-MM-DD format
const projectPoNumber = ref<string | null>(null);
const selectedBuilder = ref<string | null>(null); // Use code/ID
const selectedCampaignType = ref<string | null>(null); // Use code/ID
const selectedPhase = ref<string | null>(null); // Use code/ID
const selectedGoal = ref<string | null>(null); // Use code/ID
const projectBudget = ref<number | null>(null);

// --- Computed properties for mode checking ---
const isProjectEdit = computed(() => props.mode === 'edit-project');
const isProjectCreate = computed(() => props.mode === 'create-project' || props.mode === 'create-mediaplan');
const isFirstProjectMode = computed(() => props.mode === 'create-mediaplan');

// --- Computed properties for UI elements ---
const dialogTitle = computed(() => {
  if (isProjectEdit.value) return 'Edit Project';
  if (isFirstProjectMode.value) return 'Add First Project';
  return 'Create New Project';
});

const sectionTitle = computed(() => {
  if (isProjectEdit.value) return 'Edit Project Details';
  if (isFirstProjectMode.value) return 'Add First Project'; // Or just 'Project Details'
  return 'Project Details';
});

const submitButtonText = computed(() => {
  return isProjectEdit.value ? 'Save Changes' : 'Create Project';
});

// --- Computed properties for data display ---
const brandName = computed(() => props.brand?.name || 'Brand');

// --- Dropdown Data (Populated from store) ---
// Ensure projectStore correctly provides these reactive properties
const countries = computed(() => projectStore.countries || []);
const languageOptions = computed(() => projectStore.languages || []);
const builders = computed(() => projectStore.builders?.map(b => ({code: b.id, name: b.name})) || []); // Adjust structure as needed
const campaignTypes = computed(() => projectStore.campaignTypes?.map(t => ({code: t.id, name: t.name})) || []); // Adjust structure as needed
const phases = computed(() => projectStore.phases?.map(p => ({code: p.id, name: p.name})) || []); // Adjust structure as needed
const goals = computed(() => projectStore.goals?.map(g => ({code: g.id, name: g.name})) || []); // Adjust structure as needed

// --- Computed for form validation state ---
const formIsReady = computed(() => {
  // Check basic Vuetify form validity AND ensure all required fields have values
  return isFormValid.value &&
      !!selectedCountry.value &&
      !!selectedLanguage.value &&
      !!projectStartDate.value &&
      !!projectEndDate.value &&
      !!selectedBuilder.value &&
      !!selectedCampaignType.value &&
      !!selectedPhase.value &&
      !!selectedGoal.value &&
      projectBudget.value !== null && projectBudget.value >= 0;
  // PO Number is optional based on current setup
});

// --- Dialog state ---
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) cancelDialog(); // Ensure cleanup happens if closed externally
    // Only emit update if the value is changing (standard v-model practice)
    if (value !== props.modelValue) {
      emit('update:modelValue', value);
    }
  }
});

// --- Language Filtering Logic ---
const availableLanguages = computed(() => {
  if (!selectedCountry.value) return [];
  // Assuming store provides languages with associated country codes
  // Adjust 'country_codes' based on your actual language data structure
  return languageOptions.value.filter((lang: any) =>
      lang.country_codes?.includes(selectedCountry.value!.code) // Use '!' as it's checked above
  );
});

// --- Helper Functions ---
const validateForm = async (): Promise<boolean> => {
  if (!form.value) return false;
  const {valid} = await form.value.validate();
  // Also manually check fields if Vuetify validation isn't sufficient
  return valid && formIsReady.value;
};

const resetFormFields = () => {
  selectedCountry.value = null;
  selectedLanguage.value = null;
  projectStartDate.value = null;
  projectEndDate.value = null;
  projectPoNumber.value = null;
  selectedBuilder.value = null;
  selectedCampaignType.value = null;
  selectedPhase.value = null;
  selectedGoal.value = null;
  projectBudget.value = null;
  nextTick(() => {
    form.value?.resetValidation(); // Reset validation state
  });
};
// MODIFIED: Add checks for array existence before iteration

const populateFormFields = (data: any) => {
  if (!data) {
    console.warn("populateFormFields called with null data.");
    resetFormFields(); // Ensure form is clear if no data provided
    return;
  }
  console.log("Populating form with prop data:", data);

  // --- CHECK if countries are loaded before using .find ---
  if (Array.isArray(countries.value) && countries.value.length > 0) { // Ensure it's an array and maybe not empty
    selectedCountry.value = countries.value.find((c: ProjectCountry) => c.code === data.country_code) || null;
  } else {
    console.warn("Countries array not ready in store when populateFormFields ran. Cannot set country.");
    selectedCountry.value = null; // Explicitly set to null if countries aren't ready
    // Optionally: you could add logic here to re-run this part once countries ARE loaded
  }

  // Set simple values - adjust property names based on actual API response/prop structure
  projectStartDate.value = data.start_date ? formatDate(data.start_date, 'YYYY-MM-DD') : null;
  projectEndDate.value = data.end_date ? formatDate(data.end_date, 'YYYY-MM-DD') : null;
  projectPoNumber.value = data.po_number || null;
  selectedBuilder.value = data.builder_code || null; // Ensure prop name matches
  selectedCampaignType.value = data.campaign_type_code || null; // Ensure prop name matches
  selectedPhase.value = data.phase_code || null; // Ensure prop name matches
  selectedGoal.value = data.goal_code || null; // Ensure prop name matches
  projectBudget.value = data.budget ?? null; // Use nullish coalescing

  // Set language *after* country is set and availableLanguages might have updated
  nextTick(() => {
    // --- CHECK if availableLanguages is ready before using .some ---
    if (Array.isArray(availableLanguages.value)) { // No need to check length here usually
      const langExists = availableLanguages.value.some((l: any) => l.code === data.language_code);
      selectedLanguage.value = langExists ? data.language_code : null;
      if (!langExists && data.language_code && selectedCountry.value) {
        console.warn(`Language code '${data.language_code}' from prop data is not available for selected country '${selectedCountry.value.code}'. Resetting language.`);
      }
    } else {
      console.warn("Available languages array not ready when populateFormFields nextTick ran. Cannot set language.");
      selectedLanguage.value = null; // Explicitly set to null
      // Optionally: add logic to re-run this part once languages ARE loaded
    }
    // Optional: Re-validate after population if needed
    // nextTick(() => form.value?.validate());
  });
};

// --- Main Actions ---

// submitForm: Uses local form refs to build payload for create/update
const submitForm = async () => {
  const isValid = await validateForm();
  if (!isValid) {
    showWarning('Please fill in all required fields correctly.');
    // Optionally find first invalid field and focus it
    return;
  }

  isSubmitting.value = true;
  try {
    // Prepare payload - use the form refs
    const payload = {
      country_code: selectedCountry.value?.code,
      language_code: selectedLanguage.value,
      start_date: projectStartDate.value, // Ensure API expects YYYY-MM-DD
      end_date: projectEndDate.value,     // Ensure API expects YYYY-MM-DD
      po_number: projectPoNumber.value || '', // Send empty string or null based on API needs
      builder_code: selectedBuilder.value,
      campaign_type_code: selectedCampaignType.value,
      phase_code: selectedPhase.value,
      goal_code: selectedGoal.value,
      budget: projectBudget.value,
      // Add any other required fields (e.g., mediaplanId if needed in payload)
    };
    console.log("Submitting Payload:", payload);

    if (isProjectEdit.value) {
      // --- UPDATE LOGIC ---
      if (!props.projectId) { // Still need projectId for the update API endpoint
        showError("Cannot update: Project ID is missing.");
        isSubmitting.value = false;
        return;
      }
      console.log(`Calling update for project ID: ${props.projectId}`);
      // *** Replace with actual API call using projectStore ***
      await projectStore.updateProject(props.projectId, payload); // Ensure store method exists and handles errors
      // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
      showSuccess(`Project updated successfully`);
      emit('updated', props.projectId); // Emit event with ID

    } else {
      // --- CREATE LOGIC ---
      console.log(`Calling create for mediaplan ID: ${props.mediaplanId}`);
      // *** Replace with actual API call using projectStore ***
      // Pass mediaplanId if needed by the API/store method
      const newProject = await projectStore.createProject(props.mediaplanId, payload); // Ensure store method exists and returns new project/ID
      // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
      // const mockResponse = { _id: `proj_${Date.now()}` }; // Simulate response with ID
      // const newProjectId = newProject?._id || mockResponse._id; // Get ID from actual response

      showSuccess(`Project created successfully`);
      emit('created', newProject._id); // Emit event with the new ID from response
    }

    emit('update:modelValue', false); // Close dialog on success

  } catch (error: any) {
    console.error(`Error ${isProjectEdit.value ? 'updating' : 'creating'} project:`, error);
    // Try to get a meaningful error message from the API response
    const message = error?.response?.data?.message || error?.message || `Failed to ${isProjectEdit.value ? 'update' : 'create'} project.`;
    showError(message);
  } finally {
    isSubmitting.value = false;
  }
};

// cancelDialog: Reset fields and close
const cancelDialog = () => {
  if (isSubmitting.value) {
    showWarning('Please wait, submission is in progress.');
    return;
  }
  resetFormFields(); // Clear form on cancel
  emit('update:modelValue', false); // Close dialog
};

// --- Watchers ---

// MODIFIED: Watcher now populates form from props.projectData in edit mode when dialog opens or data changes
watch(() => [props.modelValue, props.mode, props.projectData], ([newVisible, newMode, newData], [oldVisible, oldMode, oldData]) => {
  if (newVisible) {
    // Dialog is opening or relevant props changed while open
    if (newMode === 'edit-project') {
      // Use JSON stringify for a simple deep comparison check if needed, or rely on Vue's reactivity
      // const dataChanged = JSON.stringify(newData) !== JSON.stringify(oldData);
      // If opening or data actually changed
      if (!oldVisible || newData !== oldData) {
        if (newData) {
          console.log("Watcher: Edit mode - Populating form from projectData prop.");
          resetFormFields(); // Reset before populating
          populateFormFields(newData);
        } else {
          console.warn("Watcher: Edit mode - projectData prop is missing or null. Clearing form.");
          resetFormFields(); // Ensure form is clear if no data
          // Consider showing a message if data was expected but not provided
        }
      }
    } else { // Create modes
      // If switching TO create mode, or opening in create mode ensure reset
      if (!oldVisible || newMode !== oldMode) {
        console.log("Watcher: Create mode - Resetting form.");
        resetFormFields();
      }
    }
  } else if (!newVisible && oldVisible) {
    // Dialog closing - ensure reset
    console.log("Watcher: Dialog closed. Resetting form.");
    resetFormFields();
  }
}, {immediate: true, deep: true}); // deep: true helps if projectData is complex and nested properties change

// Watch selectedCountry to auto-set/reset language
watch(selectedCountry, (newCountry, oldCountry) => {
  // Only reset if the country actually changes (not on initial load or re-population)
  if (newCountry !== oldCountry && oldCountry !== undefined) { // Add check for initial undefined->value
    selectedLanguage.value = null; // Reset language when country changes
    nextTick(() => { // Wait for availableLanguages to update
      // Optional: Auto-select language if only one is available
      if (availableLanguages.value.length === 1) {
        selectedLanguage.value = availableLanguages.value[0].code;
      }
    });
  }
});

// --- Lifecycle Hooks ---
onMounted(async () => {
  // Fetch general dropdown options needed for the form (Keep this)
  // Ensure the store action doesn't rely on props that might not be ready on mount
  try {
    // Use Promise.all for concurrent fetching if independent
    // Ensure fetchProjectOptions populates countries, languages, builders, etc. reactively
    await projectStore.fetchProjectOptions();
    console.log("Form options loaded on mount.");
  } catch (error) {
    console.error('Error fetching form options on mount:', error);
    showError('Failed to load required form options.');
    // Optionally close the dialog if options are critical and failed to load
    // emit('update:modelValue', false);
  }
});

</script>

<style scoped>
/* Add any specific styles if needed */
/* Example: Ensure country flag has controlled size */
.country-flag {
  width: 20px; /* Adjust as needed */
  height: auto;
  display: inline-block; /* Or flex align */
  vertical-align: middle;
}

/* Style for the overlay if you were to add one back for parent loading state */
/*
.v-overlay--contained {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.7); /* Example background
}
*/
</style>