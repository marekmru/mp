<template>
  <v-dialog :model-value="modelValue" @update:model-value="handleClose" persistent max-width="550px">
    <v-card class="px-6 pa-4">
      <DialogHeader
          title="Create new Mediaplan"
          :show-back-button="true"
          :show-close-button="true"
          margin-bottom="4"
          @back="cancelDialog"
          @close="cancelDialog"
      />

      <v-card-text class="pa-0 mb-4">
        <v-row class="align-center mb-3 pl-2">
          <v-img :src="getBrandLogo(brand)" class="mr-2" width="40" max-width="40"></v-img>
          <span class="text-h6 font-weight-regular">{{ brandName }} </span>
        </v-row>
      </v-card-text>
      <v-card-text class="pa-0">
        <v-row no-gutters class="pb-3 align-center">
          <v-col cols="3" class="text-body-2 text-medium-emphasis">Name:</v-col>
          <v-col class="text-body-2 text-right">{{ mediaplanName || '-' }}</v-col>
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
      </v-card-text>
      <v-divider class="mt-4 mb-5"></v-divider>

      <v-form ref="form" @submit.prevent="submitForm" v-model="isFormValid" validate-on="input"
              :disabled="isSubmitting">
        <WithFormDefaults>
          <v-card-text class="pa-0">

            <v-row>
              <v-col cols="12">
                <h6 class="text-h6 font-weight-regular mb-0">Add first project</h6>
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
                      <country-flag :country="item.code" class="mr-2"/>
                      {{ item.code }} - {{ item.name }}
                    </div>
                  </template>
                  <template v-slot:item="{ item, props }">
                    <v-list-item v-bind="props" :title="`${item.code} - ${item.name}`">
                      <template v-slot:prepend>
                        <country-flag :country="item.code" class="mr-2"/>
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

          </v-card-text>
        </WithFormDefaults>

        <DialogFooter
            class="px-4 mt-5"
            cancel-text="Cancel"
            confirm-text="Create Project"
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
// Script content remains the same as the previous correct version
import {ref, computed, onMounted, watch, nextTick} from 'vue';
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
} from '@/types/project';
import CountryFlag from '@/components/common/CountryFlag.vue';
import {getBrandLogo} from '@/helpers/brandUtils';
import {showSuccess, showError, showWarning} from '@/helpers/notificationUtils';
import WithFormDefaults from "@/components/common/dialog/WithFormDefaults.vue";
import {formatDate} from "@/helpers/dateUtils.ts";

interface CreateFirstProjectDialogProps {
  modelValue: boolean
  mediaplanId: string
  mediaplanName?: string
  poNumbers?: { _id: string; name: string; value: number }[]
  startDate?: string | Date | null
  endDate?: string | Date | null
  brand?: { _id: string; name: string }
}

const props = defineProps<CreateFirstProjectDialogProps>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'created', projectId: string): void;
}>();

const form = ref<any>(null);
const projectStore = useProjectStore();
const isFormValid = ref(false);
const isSubmitting = ref(false);

const selectedCountry = ref<ProjectCountry | null>(null);
const selectedLanguage = ref<string | null>(null);
const selectedBuilder = ref<string | null>(null);
const selectedCampaignType = ref<string | null>(null);
const selectedPhase = ref<string | null>(null);
const selectedGoal = ref<string | null>(null);

const brandName = computed(() => props.brand?.name || 'Brand');
const poNumbersDisplay = computed(() => {
  if (!props.poNumbers || props.poNumbers.length === 0) return '-';
  return props.poNumbers.map(po => po.name).join(', ');
});
const startDateValue = computed(() => props.startDate || null);
const endDateValue = computed(() => props.endDate || null);

const countries = computed(() => projectStore.countries || []);
const languageOptions = computed(() => projectStore.languages || []);
const builders = computed(() => projectStore.builders?.map(b => ({code: b.id, name: b.name})) || []);
const campaignTypes = computed(() => projectStore.campaignTypes?.map(t => ({code: t.id, name: t.name})) || []);
const phases = computed(() => projectStore.phases?.map(p => ({code: p.id, name: p.name})) || []);
const goals = computed(() => projectStore.goals?.map(g => ({code: g.id, name: g.name})) || []);

const formIsReady = computed(() => {
  return isFormValid.value &&
      !!selectedCountry.value &&
      !!selectedLanguage.value &&
      !!selectedBuilder.value &&
      !!selectedCampaignType.value &&
      !!selectedPhase.value &&
      !!selectedGoal.value;
});

const availableLanguages = computed(() => {
  if (!selectedCountry.value) return [];
  return languageOptions.value.filter((lang: any) =>
      lang.country_codes?.includes(selectedCountry.value!.code)
  );
});

const validateForm = async (): Promise<boolean> => {
  if (!form.value) return false;
  const {valid} = await form.value.validate();
  return valid && formIsReady.value;
};

const resetFormFields = () => {
  selectedCountry.value = null;
  selectedLanguage.value = null;
  selectedBuilder.value = null;
  selectedCampaignType.value = null;
  selectedPhase.value = null;
  selectedGoal.value = null;
  nextTick(() => {
    form.value?.resetValidation();
  });
};

const submitForm = async () => {
  const isValid = await validateForm();
  if (!isValid) {
    showWarning('Please fill in all required fields correctly.');
    return;
  }

  // Double-check that required refs have values before proceeding
  // formIsReady should cover this, but an extra check can be helpful.
  if (!selectedCountry.value || !selectedLanguage.value || !selectedPhase.value || !selectedCampaignType.value /* Add checks for other required fields if needed */) {
    showError("Critical project information is missing. Please check selections.");
    isSubmitting.value = false; // Ensure submission stops
    return;
  }

  isSubmitting.value = true;
  try {
    // --- Construct the single ProjectCreate object ---
    // NOTE: Determine how the project 'name' should be generated.
    // Using a combination of country/language as placeholder.
    // You might need a dedicated input or different logic.
    const projectCreateData: ProjectCreate = {
      mediaplanId: props.mediaplanId,
      name: `Project ${selectedCountry.value.code}-${selectedLanguage.value}`, // Placeholder name
      country: selectedCountry.value, // Pass the whole country object
      language: selectedLanguage.value, // Pass language code
      phase: selectedPhase.value, // Pass phase code
      campaignType: selectedCampaignType.value, // Pass campaign type code
      // Add goal, builder etc. IF the ProjectCreate type defines them
      // and if the store action uses them. Based on the store code provided,
      // builder/goal don't seem directly mapped in the payload construction.
      // goal: selectedGoal.value,
      // builder: selectedBuilder.value,
    };

    console.log("DEBUG: Submitting ProjectCreate object:", projectCreateData);

    // --- Call store action with the single object ---
    // The store action 'createProject' now receives the correctly structured object
    const newProjectResponse = await projectStore.createProject(projectCreateData);

    showSuccess(`Project created successfully`);
    // Assuming createProject returns the ID or relevant data
    // If it returns a mock ID like `project-${Date.now()}` as in the store code:
    const newProjectId = typeof newProjectResponse === 'string' ? newProjectResponse : newProjectResponse?._id || `unknown-${Date.now()}`;
    emit('created', newProjectId);

    emit('update:modelValue', false);

  } catch (error: any) {
    console.error(`Error creating first project:`, error);
    // Log the specific error from the store if possible
    const message = error?.response?.data?.message || error?.message || `Failed to create project.`;
    showError(message);
  } finally {
    isSubmitting.value = false;
  }
};
const handleClose = (value: boolean) => {
  if (!value) {
    cancelDialog();
  }
}

const cancelDialog = () => {
  if (isSubmitting.value) {
    showWarning('Please wait, submission is in progress.');
    return;
  }
  resetFormFields();
  emit('update:modelValue', false);
};

watch(() => props.modelValue, (isVisible) => {
  if (isVisible) {
    resetFormFields();
  }
});

watch(selectedCountry, (newCountry, oldCountry) => {
  if (newCountry !== oldCountry && oldCountry !== undefined) {
    selectedLanguage.value = null;
    nextTick(() => {
      if (availableLanguages.value.length === 1) {
        selectedLanguage.value = availableLanguages.value[0].code;
      }
    });
  }
});

onMounted(async () => {
  try {
    await projectStore.fetchProjectOptions();
    console.log("First Project Dialog options loaded on mount.");
  } catch (error) {
    console.error('Error fetching form options on mount:', error);
    showError('Failed to load required form options.');
  }
});

</script>

<style scoped>
.country-flag {
  width: 20px;
  height: auto;
  display: inline-block;
  vertical-align: middle;
}
</style>