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

      <v-form ref="form" @submit.prevent="submitForm" v-model="isFormValid" validate-on="input" :disabled="isSubmitting">
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
            @confirm="submitForm" />
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
// Keep other necessary imports: useRouter, useProjectStore, types, utils etc.
import DialogFooter from "@/components/common/dialog/DialogFooter.vue";
import DialogHeader from "@/components/common/dialog/DialogHeader.vue";
import { useProjectStore } from '@/stores/projectStore';
import type { ProjectCountry, ProjectLanguage, ProjectCampaignType, ProjectPhase, ProjectGoal, ProjectBuilder } from '@/types/project'; // Assume ProjectBuilder type exists
import CountryFlag from '@/components/common/CountryFlag.vue'; // Ensure this component exists
import { getBrandLogo } from '@/helpers/brandUtils'; // Ensure this helper exists
import { showSuccess, showError, showWarning } from '@/helpers/notificationUtils'; // Ensure this helper exists
import WithFormDefaults from "@/components/common/dialog/WithFormDefaults.vue"; // Ensure this component exists
import { formatDate } from "@/helpers/dateUtils.ts"; // Ensure this helper exists and handles null/undefined

// Props
const props = defineProps<{
  modelValue: boolean; // Controls dialog visibility
  mediaplanId: string; // Parent mediaplan ID (for creation)
  projectId?: string; // ID of the project being edited (kept for potential context, but update uses projectData._id)
  // Mediaplan context props (display only)
  mediaplanName?: string;
  brand?: { _id: string; name: string }; // Example type
  // Mode prop is crucial
  mode: 'create-mediaplan' | 'edit-project' | 'create-project';

  // Expect project data to be passed in when editing
  projectData?: Record<string, any> | null; // Contains the full project data including _id for edit mode
}>();

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void; // For v-model on dialog
  (e: 'created', projectId: string): void; // After successful creation
  (e: 'updated', projectId: string): void; // After successful update
}>();

// References
const form = ref<any>(null); // Type for VForm instance if available
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
// const isProjectCreate = computed(() => props.mode === 'create-project' || props.mode === 'create-mediaplan'); // Keep if needed elsewhere
// const isFirstProjectMode = computed(() => props.mode === 'create-mediaplan'); // Keep if needed elsewhere

// --- Computed properties for UI elements ---
const dialogTitle = computed(() => {
  if (isProjectEdit.value) return 'Edit Project';
  // Simplified based on user feedback about watcher complexity
  if (props.mode === 'create-mediaplan') return 'Add First Project';
  return 'Create New Project';
});

const sectionTitle = computed(() => {
  if (isProjectEdit.value) return 'Edit Project Details';
  if (props.mode === 'create-mediaplan') return 'Add First Project'; // Or just 'Project Details'
  return 'Project Details';
});

const submitButtonText = computed(() => {
  return isProjectEdit.value ? 'Save Changes' : 'Create Project';
});

// --- Computed properties for data display ---
const brandName = computed(() => props.brand?.name || 'Brand');

// --- Dropdown Data (Populated from store) ---
const countries = computed(() => projectStore.countries || []);
const languageOptions = computed(() => projectStore.languages || []);
const builders = computed(() => projectStore.builders?.map(b => ({ code: b.id, name: b.name })) || []); // Adjust structure as needed
const campaignTypes = computed(() => projectStore.campaignTypes?.map(t => ({ code: t.id, name: t.name })) || []); // Adjust structure as needed
const phases = computed(() => projectStore.phases?.map(p => ({ code: p.id, name: p.name })) || []); // Adjust structure as needed
const goals = computed(() => projectStore.goals?.map(g => ({ code: g.id, name: g.name })) || []); // Adjust structure as needed

// --- Computed for form validation state ---
const formIsReady = computed(() => {
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
});

// --- Dialog state ---
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) cancelDialog(); // Ensure cleanup happens if closed externally
    if (value !== props.modelValue) {
      emit('update:modelValue', value);
    }
  }
});

// --- Language Filtering Logic ---
const availableLanguages = computed(() => {
  if (!selectedCountry.value) return [];
  return languageOptions.value.filter((lang: any) =>
      lang.country_codes?.includes(selectedCountry.value!.code) // Use '!' as it's checked above
  );
});

// --- Helper Functions ---
const validateForm = async (): Promise<boolean> => {
  if (!form.value) return false;
  const { valid } = await form.value.validate();
  return valid && formIsReady.value;
};

// Robust resetFormFields (includes try-catch and checks)
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
    try {
      if (form.value && typeof form.value.resetValidation === 'function') {
        form.value.resetValidation();
      }
    } catch (e) {
      console.error("Error calling form.resetValidation inside nextTick (safe to ignore during teardown):", e);
    }
  });
};

// Populates form, includes defensive checks for store data readiness
const populateFormFields = (data: any) => {
  if (!data) {
    console.warn("populateFormFields called with null data.");
    resetFormFields();
    return;
  }
  console.log("Populating form with prop data:", data);

  // Check if countries are loaded before using .find
  if (Array.isArray(countries.value) && countries.value.length > 0) {
    selectedCountry.value = countries.value.find((c: ProjectCountry) => c.code === data.country_code) || null;
  } else {
    console.warn("Countries array not ready in store when populateFormFields ran. Cannot set country.");
    selectedCountry.value = null;
  }

  // Set simple values
  projectStartDate.value = data.start_date ? formatDate(data.start_date, 'YYYY-MM-DD') : null;
  projectEndDate.value = data.end_date ? formatDate(data.end_date, 'YYYY-MM-DD') : null;
  projectPoNumber.value = data.po_number || null;
  selectedBuilder.value = data.builder_code || null;
  selectedCampaignType.value = data.campaign_type_code || null;
  selectedPhase.value = data.phase_code || null;
  selectedGoal.value = data.goal_code || null;
  projectBudget.value = data.budget ?? null;

  // Set language *after* country is set
  nextTick(() => {
    // Check if availableLanguages is ready before using .some
    if (Array.isArray(availableLanguages.value)) {
      const langExists = availableLanguages.value.some((l: any) => l.code === data.language_code);
      selectedLanguage.value = langExists ? data.language_code : null;
      if (!langExists && data.language_code && selectedCountry.value) {
        console.warn(`Language code '${data.language_code}' not available for country '${selectedCountry.value.code}'.`);
      }
    } else {
      console.warn("Available languages array not ready. Cannot set language.");
      selectedLanguage.value = null;
    }
  });
};

// --- Main Actions ---

// MODIFIED: submitForm now uses projectData._id for updates
const submitForm = async () => {
  const isValid = await validateForm();
  if (!isValid) {
    showWarning('Please fill in all required fields correctly.');
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      country_code: selectedCountry.value?.code,
      language_code: selectedLanguage.value,
      start_date: projectStartDate.value,
      end_date: projectEndDate.value,
      po_number: projectPoNumber.value || '',
      builder_code: selectedBuilder.value,
      campaign_type_code: selectedCampaignType.value,
      phase_code: selectedPhase.value,
      goal_code: selectedGoal.value,
      budget: projectBudget.value,
    };
    console.log("Submitting Payload:", payload);

    if (isProjectEdit.value) {
      // --- UPDATE LOGIC ---
      // Use ID from projectData now
      const updateId = props.projectData?._id; // Get ID from the passed project data
      if (!updateId) {
        showError("Cannot update: Project data or ID is missing.");
        isSubmitting.value = false;
        return;
      }
      console.log(`Calling update for project ID: ${updateId}`);
      // *** Replace with actual API call using projectStore ***
      await projectStore.updateProject(updateId, payload); // Pass the ID from projectData
      showSuccess(`Project updated successfully`);
      emit('updated', updateId); // Emit event with the correct ID

    } else {
      // --- CREATE LOGIC --- (No changes needed here)
      console.log(`Calling create for mediaplan ID: ${props.mediaplanId}`);
      const newProject = await projectStore.createProject(props.mediaplanId, payload);
      showSuccess(`Project created successfully`);
      emit('created', newProject._id);
    }

    emit('update:modelValue', false); // Close dialog on success

  } catch (error: any) {
    console.error(`Error ${isProjectEdit.value ? 'updating' : 'creating'} project:`, error);
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
  resetFormFields(); // Use robust version
  emit('update:modelValue', false); // Close dialog
};

// --- Watchers ---

// Simplified Watcher: Watches only visibility to set initial state on opening.
watch(() => props.modelValue, (isVisible, wasVisible) => {
  try {
    if (isVisible && !wasVisible) { // Dialog is OPENING
      console.log("Watcher: Dialog opening.");
      if (props.mode === 'edit-project') {
        if (props.projectData) {
          console.log("Watcher: Edit mode - Populating form.");
          resetFormFields();
          populateFormFields(props.projectData); // Still needs internal checks for store data
        } else {
          console.warn("Watcher: Edit mode - projectData prop is missing on open. Clearing form.");
          resetFormFields();
        }
      } else { // Create modes
        console.log("Watcher: Create mode - Resetting form.");
        resetFormFields();
      }
    } else if (!isVisible && wasVisible) { // Dialog is CLOSING
      console.log("Watcher: Dialog closed. Resetting form.");
      resetFormFields(); // Use robust version
    }
  } catch(error) {
    console.error("Error occurred inside simplified modelValue watcher:", error);
  }
}); // No immediate/deep needed


// Watch selectedCountry to auto-set/reset language
watch(selectedCountry, (newCountry, oldCountry) => {
  try {
    if (newCountry !== oldCountry && oldCountry !== undefined) {
      selectedLanguage.value = null;
      nextTick(() => {
        if (availableLanguages.value?.length === 1) {
          selectedLanguage.value = availableLanguages.value[0].code;
        }
      });
    }
  } catch (error) {
    console.error("Error in selectedCountry watcher:", error);
  }
});

// --- Lifecycle Hooks ---
onMounted(async () => {
  // Fetch general dropdown options needed for the form
  try {
    await projectStore.fetchProjectOptions();
    console.log("Form options loaded on mount.");
  } catch (error) {
    console.error('Error fetching form options on mount:', error);
    showError('Failed to load required form options.');
  }
});

</script>

<style scoped>
/* Add any specific styles if needed */
.country-flag {
  width: 20px; /* Adjust as needed */
  height: auto;
  display: inline-block; /* Or flex align */
  vertical-align: middle;
}
</style>