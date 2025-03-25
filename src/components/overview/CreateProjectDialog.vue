<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card class="pa-6">
      <v-card-title class="text-h5 mb-4 px-0">Add first project</v-card-title>

      <v-form ref="form" @submit.prevent="submitForm">
        <!-- Project Name (auto-filled from mediaplan name) -->
        <div class="mb-4">
          <div class="text-subtitle-1 font-weight-medium">Name:</div>
          <div>{{ formData.name }}</div>
        </div>
        
        <!-- PO Numbers (from mediaplan) -->
        <div class="mb-4">
          <div class="text-subtitle-1 font-weight-medium">PO:</div>
          <div>{{ poNumbersDisplay }}</div>
        </div>
        
        <!-- Duration (from mediaplan) -->
        <div class="mb-4">
          <div class="text-subtitle-1 font-weight-medium">Duration:</div>
          <div>
            Start: {{ formatDate(startDate) }} 
            End: {{ formatDate(endDate) }}
          </div>
        </div>
        
        <!-- Country Selection with Flag -->
        <div class="d-flex mb-4">
          <v-select
            v-model="formData.country"
            :items="countries"
            item-title="name"
            item-value="code"
            label="Country"
            :rules="[v => !!v || 'Country is required']"
            variant="outlined"
            class="flex-grow-1"
            return-object
          >
            <template v-slot:selection="{ item }">
              <div class="d-flex align-center">
                <img 
                  :src="`/flags/${item.raw.code.toLowerCase()}.svg`" 
                  alt="flag"
                  class="mr-2"
                  style="width: 24px; height: 16px"
                />
                {{ item.raw.name }}
              </div>
            </template>
            <template v-slot:item="{ item, props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <img 
                    :src="`/flags/${item.raw.code.toLowerCase()}.svg`" 
                    alt="flag"
                    class="mr-2"
                    style="width: 24px; height: 16px"
                  />
                </template>
                <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
        </div>
        
        <!-- Language Selection (dependent on country) -->
        <div class="mb-4">
          <v-select
            v-model="formData.language"
            :items="availableLanguages"
            item-title="name"
            item-value="code"
            label="Language*"
            :rules="[v => !!v || 'Language is required']"
            variant="outlined"
            :disabled="!formData.country"
            hint="* Depends on Country"
            persistent-hint
          />
        </div>
        
        <!-- Campaign Type -->
        <div class="mb-4">
          <v-select
            v-model="formData.campaignType"
            :items="campaignTypes"
            item-title="name"
            item-value="id"
            label="Campaign type*"
            :rules="[v => !!v || 'Campaign type is required']"
            variant="outlined"
          />
        </div>
        
        <!-- Phase -->
        <div class="mb-4">
          <v-select
            v-model="formData.phase"
            :items="phases"
            item-title="name"
            item-value="id"
            label="Phase*"
            :rules="[v => !!v || 'Phase is required']"
            variant="outlined"
          />
        </div>
        
        <!-- Goal -->
        <div class="mb-4">
          <v-select
            v-model="formData.goal"
            :items="goals"
            item-title="name"
            item-value="id"
            label="Goal*"
            :rules="[v => !!v || 'Goal is required']"
            variant="outlined"
          />
        </div>
        
        <!-- Action Buttons -->
        <v-card-actions class="pt-4 d-flex justify-end">
          <v-btn 
            size="large" 
            variant="outlined" 
            @click="cancelDialog" 
            class="mr-2"
          >
            Cancel
          </v-btn>
          <v-btn
            size="large"
            color="primary"
            type="submit"
            variant="flat"
            :loading="isSubmitting"
            :disabled="!isFormValid"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    
    <!-- Success/Error Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { useProjectStore } from '@/stores/projectStore';
import type { ProjectCreate, ProjectCountry, ProjectLanguage, ProjectCampaignType, ProjectPhase, ProjectGoal } from '@/types/project';

// Props
const props = defineProps<{
  modelValue: boolean;
  mediaplanId: string;
  mediaplanName: string;
  poNumbers: { _id: string; name: string; value: number }[];
  startDate: string;
  endDate: string;
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

// Reactive State
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const isSubmitting = ref(false);

// Dropdown options
const countries = ref<ProjectCountry[]>([
  { code: 'AT', name: 'Austria' },
  { code: 'DE', name: 'Germany' },
  { code: 'PL', name: 'Poland' },
  { code: 'US', name: 'United States' }
]);

const languages = ref<ProjectLanguage[]>([
  { code: 'DEU', name: 'German' },
  { code: 'ENG', name: 'English' },
  { code: 'POL', name: 'Polish' }
]);

const campaignTypes = ref<ProjectCampaignType[]>([
  { id: 'always-on', name: 'Always On' },
  { id: 'awareness', name: 'Awareness' },
  { id: 'consideration', name: 'Consideration' }
]);

const phases = ref<ProjectPhase[]>([
  { id: 'sea', name: 'SEA' },
  { id: 'planning', name: 'Planning' },
  { id: 'execution', name: 'Execution' }
]);

const goals = ref<ProjectGoal[]>([
  { id: 'consideration', name: 'Consideration' },
  { id: 'configurator', name: 'Configurator' },
  { id: 'conversion', name: 'Conversion' }
]);

// Form validation state
const isFormValid = computed(() => {
  return !!(
    formData.name &&
    formData.country &&
    formData.language &&
    formData.campaignType &&
    formData.phase &&
    formData.goal
  );
});

// Available languages based on selected country
const availableLanguages = computed(() => {
  if (!formData.country) return [];

  // In a real app, this would filter based on the country
  // For this example, we're returning all languages
  return languages.value;
});

// Snackbar for notifications
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success',
});

// Format PO numbers for display
const poNumbersDisplay = computed(() => {
  if (!props.poNumbers || props.poNumbers.length === 0) {
    return 'None';
  }
  return props.poNumbers.map(po => po.name).join(', ');
});

// Form data structure
const formData = reactive<ProjectCreate>({
  name: props.mediaplanName || '',
  mediaplanId: props.mediaplanId || '',
  country: null as unknown as ProjectCountry,
  language: '',
  campaignType: '',
  phase: '',
  goal: ''
});

// Methods
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'dd.MM.yyyy');
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
};

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  isSubmitting.value = true;

  try {
    // Call the project store to create the project
    const projectId = await projectStore.createProject(formData);
    
    showSuccess('Project created successfully');

    // Close dialog after success and navigate to the project view
    setTimeout(() => {
      dialog.value = false;
      emit('created', projectId);
      // Navigate to the mediaplan detail view with the project tab active
      router.push(`/mediaplans/${props.mediaplanId}?tab=projects`);
    }, 1000);

  } catch (error) {
    console.error('Error creating project:', error);
    showError('Failed to create project');
  } finally {
    isSubmitting.value = false;
  }
};

const cancelDialog = () => {
  dialog.value = false;
  // Navigate to the mediaplan detail view
  router.push(`/mediaplans/${props.mediaplanId}`);
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

// Initialize component
onMounted(async () => {
  // In a real application, fetch dropdown data from API
  await projectStore.fetchProjectOptions();
  
  // Update form data with props
  formData.name = props.mediaplanName;
  formData.mediaplanId = props.mediaplanId;
});

// Watch for changes in props
watch(() => props.mediaplanName, (newName) => {
  formData.name = newName;
});

watch(() => props.mediaplanId, (newId) => {
  formData.mediaplanId = newId;
});
</script>