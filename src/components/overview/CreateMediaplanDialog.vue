<template>
  <div>
    <!-- Mediaplan Creation Dialog -->
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card class="pa-6">
        <DialogHeader
            title="Create new Mediaplan"
            :show-back-button="false"
            margin-bottom="4"
            @close="cancelDialog"
        />
        <v-form ref="form" @submit.prevent="submitForm">
          <!-- Brand Selection -->
          <v-select
              v-model="formData.brand._id"
              :items="brands"
              item-title="name"
              item-value="_id"
              label="Brand Output*"
              placeholder="Please Select a brand"
              :rules="[v => !!v || 'Brand is required']"
              variant="outlined"
              class="mb-0"
          />

          <!-- Type Selection (PO Based or Draft) -->
          <div class="d-flex mb-2">
            <v-radio-group v-model="mediaplanType" inline class="mt-0">
              <v-radio value="po" label="PO Based"/>
              <v-radio value="draft" label="Draft"/>
            </v-radio-group>
          </div>

          <!-- Mediaplan Name -->
          <v-text-field
              v-model="formData.name"
              label="Individual Name*"
              placeholder="please type in an individual title"
              :rules="[v => !!v || 'Name is required']"
              variant="outlined"
              class="mb-4"
          />

          <!-- PO Selection - Only visible if PO Based selected -->
          <v-row v-if="mediaplanType === 'po'" class="mb-4" no-gutters>
            <v-select
                v-model="selectedPOs"
                :items="poNumbers"
                item-title="name"
                item-value="_id"
                label="Select existing PO*"
                placeholder="Select POs"
                :rules="[v => mediaplanType !== 'po' || (v && v.length > 0) || 'At least one PO is required']"
                variant="outlined"
                multiple
                chips
                closable-chips
                class="flex-grow-1 mr-2"
            />
            <v-btn
                color="primary"
                variant="outlined"
                @click="openCreatePODialog"
                class="mt-0"
                style="height: 56px;"
            >
              Create PO
            </v-btn>
          </v-row>

          <template v-if="mediaplanType === 'po'">
            <!-- Creator Name -->
            <v-text-field
                v-model="creatorName"
                label="Creator*"
                placeholder="Your name"
                :rules="[v => !!v || 'Creator name is required']"
                variant="outlined"
                class="mb-4"
                readonly
                disabled
            />

            <!-- Department -->
            <v-text-field
                v-model="department"
                label="Department"
                placeholder="Department name"
                variant="outlined"
                class="mb-4"
            />
          </template>

          <!-- Date Range - Using the DateRangePicker component -->
          <DateRangePicker
              v-model="dateRange"
              label="Start date* - End date *"
              placeholder="Select start and end dates"
              :rules="[v => !!v || 'Date range is required']"
              :required="true"
              dialog-title="Choose a date range"
              class="mb-0"
              @update:model-value="handleDateRangeChange"
          />

          <DialogFooter
              cancel-text="Cancel"
              confirm-text="Next Step"
              :loading="isSubmitting"
              :disabled="!form?.isValid"
              :submit-button="true"
              @cancel="cancelDialog"
          />
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Create PO Dialog -->
    <CreatePoDialog
        v-model="createPODialogVisible"
        :initial-brand-id="formData.brand._id"
        @created="handlePoCreated"
    />

    <!-- Project Creation Dialog (shown after mediaplan creation) -->
    <CreateProjectDialog
        v-if="showProjectDialog"
        v-model="showProjectDialog"
        :mediaplan-id="createdMediaplanId"
        :mediaplan-name="formData.name"
        :po-numbers="formData.po_numbers"
        :start-date="formData.start_date"
        :end-date="formData.end_date"
        :brand="{ _id: formData.brand._id, name: selectedBrandName }"
        @created="handleProjectCreated"
    />

    <!-- Success/Error Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted, watch, nextTick} from 'vue';
import {useAuthStore} from '@/stores/auth';
import {useCreateMediaplanStore} from '@/stores/createMediaplanStore';
import DialogFooter from "@/components/common/dialog/DialogFooter.vue";
import DialogHeader from "@/components/common/dialog/DialogHeader.vue";
import DateRangePicker from './DateRangePicker.vue';
import CreateProjectDialog from '@/components/overview/CreateProjectDialog.vue';
import CreatePoDialog from '@/components/overview/CreatePoDialog.vue';
import type {MediaplanCreate, Brand, PONumber} from '@/types/mediaplan';

// Props
const props = defineProps<{
  modelValue: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'created', mediaplanId: string): void;
  (e: 'project-created', projectId: string): void;
}>();

// References
const form = ref();
const authStore = useAuthStore();
const createMediaplanStore = useCreateMediaplanStore();

// Reactive State
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const mediaplanType = ref('po'); // Default to PO Based
const selectedPOs = ref<string[]>([]); // Changed to array for multi-select
const department = ref('');
const creatorName = ref('Current User');
const isSubmitting = ref(false);
const dateRange = ref<[string, string] | null>(null);

// Project dialog state
const showProjectDialog = ref(false);
const createdMediaplanId = ref('');

// Create PO Dialog
const createPODialogVisible = ref(false);

// Use values from the store
const brands = computed(() => createMediaplanStore.brands);
const poNumbers = computed(() => createMediaplanStore.poNumbers);

const selectedBrandName = computed(() => {
  const selectedBrand = brands.value.find(brand => brand._id === formData.brand._id);
  return selectedBrand ? selectedBrand.name : '';
});

const snackbar = reactive({
  show: false,
  text: '',
  color: 'success',
});

// Form data structure
const formData = reactive<MediaplanCreate>({
  name: '',
  status: 'Draft', // Default status
  start_date: '',
  end_date: '',
  brand: {
    _id: '',
  },
  budget: {
    total: 0,
    used: 0,
    available: 0
  },
  po_numbers: []
});

// Methods
const handleDateRangeChange = (range: [string, string] | null) => {
  if (range) {
    formData.start_date = range[0];
    formData.end_date = range[1];
  } else {
    formData.start_date = '';
    formData.end_date = '';
  }
};

// Method to handle project creation completion
const handleProjectCreated = (projectId: string) => {
  // Close the project dialog
  showProjectDialog.value = false;

  // Emit the project created event
  emit('project-created', projectId);

  // Close the main dialog as well
  dialog.value = false;
};

// Method to handle PO creation
const handlePoCreated = (po: PONumber) => {
  // Add the newly created PO to the selected POs
  selectedPOs.value = [...selectedPOs.value, po._id];
  
  // Show success message
  showSuccess(`PO "${po.name}" created successfully and added to selection`);
};

const loadFormData = async () => {
  try {
    // Load data from the store
    if (brands.value.length === 0) {
      await createMediaplanStore.fetchBrands();
    }

    if (poNumbers.value.length === 0) {
      await createMediaplanStore.fetchPONumbers();
    }
  } catch (error) {
    console.error('Error loading form data:', error);
    showError('Failed to load form data');
  }
};

const submitForm = async () => {
  const {valid} = await form.value.validate();

  if (!valid) return;

  isSubmitting.value = true;

  try {
    // Add selected POs to the form data
    if (mediaplanType.value === 'po' && selectedPOs.value.length > 0) {
      const selectedPOObjects = poNumbers.value.filter(po => selectedPOs.value.includes(po._id));
      if (selectedPOObjects.length > 0) {
        formData.po_numbers = selectedPOObjects;
        // Calculate total budget from all selected POs
        formData.budget.total = selectedPOObjects.reduce((sum, po) => sum + po.value, 0);
      }
    }

    // Set status based on the type
    formData.status = mediaplanType.value === 'po' ? 'Draft' : 'Draft';

    // For demo purposes, log the payload
    console.log('Creating mediaplan with data:', formData);

    // In real application, send to API:
    try {
      // This would be the actual API call in production
      /*
      const response = await customFetch('/mediaplans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      createdMediaplanId.value = response._id;
      */

      // For demo, simulate successful API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Simulate a response with a mock ID
      createdMediaplanId.value = `mediaplan-${Date.now()}`;

      // Notify success
      showSuccess('Mediaplan created successfully');

      // Emit the created event
      emit('created', createdMediaplanId.value);

      // Important: Here we don't close the dialog, but instead show the project dialog
      showProjectDialog.value = true;

    } catch (apiError) {
      console.error('API error creating mediaplan:', apiError);
      showError('Failed to create mediaplan: API error');
      throw apiError;
    }

  } catch (error) {
    console.error('Error creating mediaplan:', error);
    showError('Failed to create mediaplan');
  } finally {
    isSubmitting.value = false;
  }
};

// PO Dialog methods
const openCreatePODialog = () => {
  createPODialogVisible.value = true;
};

const cancelDialog = () => {
  resetForm();
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

const resetForm = async () => {
  if (form.value) {
    form.value.reset();
  }
  await nextTick();

  formData.name = '';
  formData.brand._id = '';
  formData.start_date = '';
  formData.end_date = '';
  dateRange.value = null;
  selectedPOs.value = [];
  department.value = '';
  mediaplanType.value = 'po';
  showProjectDialog.value = false;
  createdMediaplanId.value = '';
};

// Lifecycle
onMounted(async () => {
  await loadFormData();
  // Set creator name from auth store if available
  if (authStore.user) {
    creatorName.value = authStore.user.name || 'Current User';
  } else {
    creatorName.value = 'Current User';
  }
});

// Watch for dialog changes to reset form
watch(dialog, (newValue) => {
  if (newValue === false) {
    resetForm();
  }
});
</script>