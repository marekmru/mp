<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card class="pa-6">
      <v-card-title class="text-h5 mb-4">Create new Mediaplan</v-card-title>

      <v-form ref="form" @submit.prevent="submitForm">
        <!-- Brand Selection -->
        <v-select v-model="formData.brand._id" :items="brands" item-title="name" item-value="_id" label="Brand Output"
          placeholder="Please Select a brand" :rules="[v => !!v || 'Brand is required']" variant="outlined"
          class="mb-0" />

        <!-- Type Selection (PO Based or Draft) -->
        <div class="d-flex mb-2">
          <v-radio-group v-model="mediaplanType" inline class="mt-0">
            <v-radio value="po" label="PO Based" />
            <v-radio value="draft" label="Draft" />
          </v-radio-group>
        </div>

        <!-- Mediaplan Name -->
        <v-text-field v-model="formData.name" label="Individual Name" placeholder="please type in an individual title"
          :rules="[v => !!v || 'Name is required']" variant="outlined" class="mb-4" />

        <!-- PO Selection - Only visible if PO Based selected -->
        <v-row v-if="mediaplanType === 'po'" class="mb-4">
          <v-select v-model="selectedPOs" :items="poNumbers" item-title="name" item-value="_id"
            label="Select existing PO" placeholder="Select POs"
            :rules="[v => mediaplanType !== 'po' || (v && v.length > 0) || 'At least one PO is required']"
            variant="outlined" multiple chips closable-chips class="flex-grow-1 mr-2" />
          <v-btn color="primary" variant="outlined" @click="openCreatePODialog" class="mt-0" style="height: 56px;">
            Create PO
          </v-btn>
        </v-row>

        <!-- Creator Name -->
        <v-text-field v-model="creatorName" label="Creator" placeholder="Your name"
          :rules="[v => !!v || 'Creator name is required']" variant="outlined" class="mb-4" disabled />

        <!-- Department -->
        <v-text-field v-model="department" label="Department" placeholder="Department name" variant="outlined"
          class="mb-4" />

        <!-- Date Range -->
        <div class="d-flex gap-4">
          <!-- Start Date -->
          <v-text-field v-model="startDateFormatted" label="Start date" placeholder="DD.MM.YYYY"
            :rules="[v => !!v || 'Start date is required', validateDateFormat]" variant="outlined" class="mb-4"
            @click="showStartDatePicker = true" readonly>
            <template v-slot:append>
              <v-icon @click="showStartDatePicker = true">mdi-calendar</v-icon>
            </template>
          </v-text-field>

          <v-dialog v-model="showStartDatePicker" width="auto">
            <v-date-picker v-model="formData.start_date" @update:model-value="handleStartDateSelected"></v-date-picker>
          </v-dialog>

          <!-- End Date -->
          <v-text-field v-model="endDateFormatted" label="End date" placeholder="DD.MM.YYYY"
            :rules="[v => !!v || 'End date is required', validateDateFormat, validateEndDate]" variant="outlined"
            class="mb-4" @click="showEndDatePicker = true" readonly>
            <template v-slot:append>
              <v-icon @click="showEndDatePicker = true">mdi-calendar</v-icon>
            </template>
          </v-text-field>

          <v-dialog v-model="showEndDatePicker" width="auto">
            <v-date-picker v-model="formData.end_date" @update:model-value="handleEndDateSelected"></v-date-picker>
          </v-dialog>
        </div>

        <!-- Action Buttons -->
        <v-card-actions class="pt-4 d-flex justify-end">
          <v-btn variant="outlined" @click="cancelDialog" class="mr-2">
            Cancel
          </v-btn>
          <v-btn color="primary" type="submit" variant="flat" :loading="isSubmitting" :disabled="!form?.isValid">
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
          <v-text-field v-model="newPO.name" label="PO Number" placeholder="Enter PO number"
            :rules="[v => !!v || 'PO number is required']" variant="outlined" class="mb-4" />

          <v-text-field v-model="newPO.value" label="PO Value" placeholder="Enter value" type="number" :rules="[
            v => !!v || 'PO value is required',
            v => v > 0 || 'Value must be greater than 0'
          ]" variant="outlined" class="mb-4" suffix="EUR" />

          <v-card-actions class="pt-3 d-flex justify-end">
            <v-btn variant="outlined" @click="closeCreatePODialog" class="mr-2">
              Cancel
            </v-btn>
            <v-btn color="primary" type="submit" variant="flat" :loading="isSubmittingPO">
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
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCreateMediaplanStore } from '@/stores/createMediaplanStore';
import customFetch from '@/helpers/customFetch';
import type { MediaplanCreate, Brand, PONumber } from '@/types/mediaplan';

// Props
const props = defineProps<{
  modelValue: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'created', mediaplanId: string): void;
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
const creatorName = ref('');
const isSubmitting = ref(false);
const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);
const startDateFormatted = ref('');
const endDateFormatted = ref('');

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

// Validations
const validateDateFormat = (value: string) => {
  const regex = /^\d{2}\.\d{2}\.\d{4}$/;
  return regex.test(value) || 'Date format should be DD.MM.YYYY';
};

const validateEndDate = (value: string) => {
  if (!value || !formData.start_date) return true;

  const startDate = new Date(formData.start_date);
  const endDate = new Date(formData.end_date);

  return endDate >= startDate || 'End date must be after start date';
};

// Date handling functions
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};

const handleStartDateSelected = () => {
  startDateFormatted.value = formatDate(formData.start_date);
  showStartDatePicker.value = false;
};

const handleEndDateSelected = () => {
  endDateFormatted.value = formatDate(formData.end_date);
  showEndDatePicker.value = false;
};

// Methods
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
  const { valid } = await form.value.validate();

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

    // Convert date format if needed
    // Ensure dates are in ISO format for API
    if (formData.start_date && !formData.start_date.includes('T')) {
      const [day, month, year] = startDateFormatted.value.split('.');
      const startDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
      formData.start_date = startDate.toISOString();
    }

    if (formData.end_date && !formData.end_date.includes('T')) {
      const [day, month, year] = endDateFormatted.value.split('.');
      const endDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
      formData.end_date = endDate.toISOString();
    }

    // For demo purposes, log the payload
    console.log('Creating mediaplan with data:', formData);

    // In real application, uncomment this to send to API:
    /*
    const response = await customFetch('/mediaplans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    emit('created', response._id);
    */

    // For demo, simulate successful creation
    setTimeout(() => {
      showSuccess('Mediaplan created successfully');

      // Close dialog after success
      setTimeout(() => {
        dialog.value = false;
        emit('created', 'mock-mediaplan-id');
      }, 1000);
    }, 500);

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
  resetPOForm();
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

  const { valid } = await poForm.value.validate();
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

const resetForm = () => {
  formData.name = '';
  formData.brand._id = '';
  formData.start_date = '';
  formData.end_date = '';
  startDateFormatted.value = '';
  endDateFormatted.value = '';
  selectedPOs.value = [];
  department.value = '';
  mediaplanType.value = 'po';

  if (form.value) {
    form.value.reset();
  }
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