<template>
  <div>
    <!-- Mediaplan Creation Dialog -->
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card class="pa-6">
        <v-card-title class="text-h5 mb-4 px-0">Create new Mediaplan</v-card-title>

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

          <!-- Action Buttons -->
          <v-card-actions class="pt-4 d-flex justify-end">
            <v-btn size="large" variant="outlined" @click="cancelDialog" class="mr-2">
              Cancel
            </v-btn>
            <v-btn
                size="large"
                color="primary"
                type="submit"
                variant="flat"
                :loading="isSubmitting"
                :disabled="!form?.isValid"
            >
              Next Step
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>

      <!-- Create PO Dialog -->
      <v-dialog v-model="createPODialogVisible" max-width="500px">
        <v-card class="pa-6">
          <v-card-title class="text-h5 mb-4">Create New PO</v-card-title>

          <v-form ref="poForm" @submit.prevent="submitPOForm">
            <v-text-field
                v-model="newPO.name"
                label="PO Number"
                placeholder="Enter PO number"
                :rules="[v => !!v || 'PO number is required']"
                variant="outlined"
                class="mb-4"
            />

            <v-text-field
                v-model="newPO.value"
                label="PO Value"
                placeholder="Enter value"
                type="number"
                :rules="[
                v => !!v || 'PO value is required',
                v => v > 0 || 'Value must be greater than 0'
              ]"
                variant="outlined"
                class="mb-4"
                suffix="EUR"
            />

            <v-card-actions class="pt-3 d-flex justify-end">
              <v-btn size="large" variant="outlined" @click="closeCreatePODialog" class="mr-2">
                Cancel
              </v-btn>
              <v-btn size="large" color="primary" type="submit" variant="flat" :loading="isSubmittingPO">
                Create
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>

      <!-- Success/Error Snackbar -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
        {{ snackbar.text }}
      </v-snackbar>
    </v-dialog>

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
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted, watch, nextTick} from 'vue';
import {useAuthStore} from '@/stores/auth';
import {useCreateMediaplanStore} from '@/stores/createMediaplanStore';
import DateRangePicker from './DateRangePicker.vue';
import CreateProjectDialog from '@/components/overview/CreateProjectDialog.vue';
import type {MediaplanCreate, Brand, PONumber} from '@/types/mediaplan';
import customFetch from '@/helpers/customFetch';

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
const poForm = ref();
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
const isSubmittingPO = ref(false);
const newPO = reactive<{ name: string; value: number | null }>({
  name: '',
  value: null
});

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

const closeCreatePODialog = () => {
  createPODialogVisible.value = false;
};

const resetPOForm = () => {
  newPO.name = '';
  newPO.value = null;
  if (poForm.value) {
    poForm.value.reset();
  }
};

const submitPOForm = async () => {
  if (!poForm.value) return;

  const {valid} = await poForm.value.validate();
  if (!valid) return;

  isSubmittingPO.value = true;

  try {
    // Generate a unique ID for the new PO
    const newPOId = `po-${Date.now()}`;

    // Create the new PO object
    const poObject: PONumber = {
      _id: newPOId,
      name: newPO.name,
      value: Number(newPO.value) || 0
    };

    // In a real application, you would send this to your API
    // await customFetch('/po-numbers', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(poObject),
    // });

    // For demo, add the new PO to the local list
    createMediaplanStore.poNumbers.push(poObject);

    // Select the newly created PO
    selectedPOs.value = [...selectedPOs.value, newPOId];

    showSuccess('PO created successfully');
    closeCreatePODialog();
  } catch (error) {
    console.error('Error creating PO:', error);
    showError('Failed to create PO');
  } finally {
    isSubmittingPO.value = false;
  }
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
  console.log(authStore.user)
  // Set creator name from auth store if available
  if (authStore.user) {
    creatorName.value = authStore.user.name || 'Current User';
  } else {
    console.log('else')
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