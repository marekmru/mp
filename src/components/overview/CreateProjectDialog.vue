<template>
  <v-dialog v-model="dialog" persistent max-width="450px">
    <v-card class="px-6 pa-4">
      <DialogHeader
          :title="isEdit ? 'Edit Project' : 'Create New Project'"
          :show-back-button="true"
          :show-close-button="true"
          margin-bottom="4"
          @back="cancelDialog"
          @close="cancelDialog"
      />

      <v-form ref="form" @submit.prevent="submitForm" v-model="isFormValid" validate-on="input">
        <WithFormDefaults>
          <v-card-text class="pa-0">
            <!-- If create mode, show Mediaplan summary -->
            <template v-if="!isEdit && mediaplanName">
              <v-row class="align-center mb-3 pl-2">
                <v-img :src="getBrandLogo(brand)" class="mr-2" width="40" max-width="40" dense></v-img>
                <span class="text-h6 font-weight-regular">{{ brandName }}</span>
              </v-row>
              <!-- Name, PO, Duration same as create -->
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
              <v-divider class="mt-4 mb-5"></v-divider>
            </template>

            <!-- Section Title -->
            <v-row>
              <v-col cols="12">
                <h6 class="text-h6 font-weight-regular">
                  {{ isEdit ? 'Update Project' : 'Add First Project' }}
                </h6>
              </v-col>
            </v-row>

            <!-- Form Fields (common) -->
            <v-row no-gutters class="pb-3 align-center">
              <v-col cols="3" class="text-body-2 text-medium-emphasis">Abbreviation *</v-col>
              <v-col cols="9">
                <v-text-field
                    v-model="abbreviation"
                    :rules="[v => !!v || 'Abbreviation is required']"
                    dense
                />
              </v-col>
            </v-row>
            <v-row no-gutters class="pb-3 align-center">
              <v-col cols="3" class="text-body-2 text-medium-emphasis">Detail</v-col>
              <v-col cols="9">
                <v-textarea v-model="detail" auto-grow dense />
              </v-col>
            </v-row>

            <!-- Country & Language -->
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
                    dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">Language *</div>
                <v-select
                    v-model="selectedLanguage"
                    :items="availableLanguages"
                    item-title="name"
                    item-value="code"
                    :disabled="!selectedCountry"
                    :rules="[v => !!v || 'Language is required']"
                    dense
                />
              </v-col>
            </v-row>

            <!-- Builder & Campaign Type -->
            <v-row>
              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">Builder *</div>
                <v-select
                    v-model="selectedBuilder"
                    :items="builders"
                    item-title="name"
                    item-value="code"
                    :rules="[v => !!v || 'Builder is required']"
                    dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">Campaign type *</div>
                <v-select
                    v-model="selectedCampaignType"
                    :items="campaignTypes"
                    item-title="name"
                    item-value="code"
                    :rules="[v => !!v || 'Campaign type is required']"
                    dense
                />
              </v-col>
            </v-row>

            <!-- Phase & Goal -->
            <v-row>
              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">Phase *</div>
                <v-select
                    v-model="selectedPhase"
                    :items="phases"
                    item-title="name"
                    item-value="code"
                    :rules="[v => !!v || 'Phase is required']"
                    dense
                />
              </v-col>
              <v-col cols="12" md="6">
                <div class="text-caption text-medium-emphasis">Goal *</div>
                <v-select
                    v-model="selectedGoal"
                    :items="goals"
                    item-title="name"
                    item-value="code"
                    :rules="[v => !!v || 'Goal is required']"
                    dense
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
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import DialogHeader from '@/components/common/dialog/DialogHeader.vue';
import DialogFooter from '@/components/common/dialog/DialogFooter.vue';
import WithFormDefaults from '@/components/common/dialog/WithFormDefaults.vue';
import CountryFlag from '@/components/common/CountryFlag.vue';
import { getBrandLogo } from '@/helpers/brandUtils';
import { formatDate } from '@/helpers/dateUtils';
import { showSuccess, showError, showWarning } from '@/helpers/notificationUtils';
import { useProjectStore } from '@/stores/projectStore';
import type { Project, ProjectCountry, ProjectLanguage, ProjectCampaignType, ProjectPhase, ProjectGoal } from '@/types/project';

// Props
const props = defineProps<{
  modelValue: boolean;
  mode: 'create' | 'edit';
  mediaplanId?: string;
  mediaplanName?: string;
  poNumbers?: { name: string }[];
  startDate?: string;
  endDate?: string;
  brand?: { name: string };
  project?: Project;
}>();

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'created', projectId: string): void;
  (e: 'updated', project: Project): void;
}>();

const isEdit = computed(() => props.mode === 'edit');
const dialog = computed({ get: () => props.modelValue, set: v => emit('update:modelValue', v) });

// Form state
const form = ref();
const isFormValid = ref(false);
const isSubmitting = ref(false);

// Fields
const abbreviation = ref('');
const detail = ref('');
const selectedCountry = ref<ProjectCountry | null>(null);
const selectedLanguage = ref<string | null>(null);
const selectedBuilder = ref<string | null>(null);
const selectedCampaignType = ref<string | null>(null);
const selectedPhase = ref<string | null>(null);
const selectedGoal = ref<string | null>(null);

// Lookup data
const projectStore = useProjectStore();
const countries = ref<ProjectCountry[]>([]);
const languageOptions = ref<ProjectLanguage[]>([]);
const builders = ref<ProjectLanguage[]>([]);
const campaignTypes = ref<ProjectCampaignType[]>([]);
const phases = ref<ProjectPhase[]>([]);
const goals = ref<ProjectGoal[]>([]);

const availableLanguages = computed(() => { /* same logic as before */ });

const formIsReady = computed(() => {
  return isFormValid.value && !isSubmitting.value && abbreviation.value && selectedCountry.value && selectedLanguage.value && selectedBuilder.value && selectedCampaignType.value && selectedPhase.value && selectedGoal.value;
});

// Initialization
onMounted(async () => {
  await projectStore.fetchProjectOptions();
  countries.value = projectStore.countries;
  languageOptions.value = projectStore.languages;
  builders.value = projectStore.builders;
  campaignTypes.value = projectStore.campaignTypes;
  phases.value = projectStore.phases;
  goals.value = projectStore.goals;

  if (isEdit.value && props.project) {
    const p = props.project;
    abbreviation.value = p.abbreviation;
    detail.value = p.detail;
    selectedCountry.value = countries.value.find(c => c.code === p.descriptive_vars.country) || null;
    selectedLanguage.value = p.default_vars.language;
    selectedBuilder.value = p.default_vars.subsegment;
    selectedCampaignType.value = p.default_vars.campaigntype;
    selectedPhase.value = p.default_vars.phase;
    selectedGoal.value = p.default_vars.goal;
  }
});

watch(selectedCountry, nc => {/* reset language logic */});

async function validateForm() {
  if (!form.value) return false;
  return (await form.value.validate()).valid;
}

async function submitForm() {
  if (!(await validateForm())) { showWarning('Please fill in all required fields'); return; }
  isSubmitting.value = true;
  try {
    const payload: any = {
      abbreviation: abbreviation.value,
      detail: detail.value,
      descriptive_vars: { country: selectedCountry.value?.code },
      default_vars: {
        language: selectedLanguage.value,
        subsegment: selectedBuilder.value,
        campaigntype: selectedCampaignType.value,
        phase: selectedPhase.value,
        goal: selectedGoal.value
      }
    };
    if (isEdit.value && props.project && props.mediaplanId) {
      const updated = await projectStore.updateProject(props.mediaplanId, props.project._id, payload);
      showSuccess('Project updated successfully');
      emit('updated', updated);
    } else if (!isEdit.value && props.mediaplanId) {
      const res = await projectStore.createProject(props.mediaplanId, payload);
      showSuccess('Project created successfully');
      emit('created', res._id);
    }
    dialog.value = false;
  } catch (e) {
    showError('An error occurred');
  } finally {
    isSubmitting.value = false;
  }
}

function cancelDialog() {
  if (isSubmitting.value) { showWarning('Please wait while saving'); return; }
  dialog.value = false;
}

// Helpers for display
const brandName = computed(() => props.brand?.name || '');
const poNumbersDisplay = computed(() => props.poNumbers?.map(po => po.name).join(', ') || 'None');
const startDateValue = computed(() => props.startDate || '');
const endDateValue = computed(() => props.endDate || '');
</script>

<style scoped>
/* Keine Layout-Änderungen */
</style>
