<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <v-card class="px-6 py-4">
      <DialogHeader
          title="Create new PO"
          :show-back-button="false"
          :show-close-button="true"
          close-icon-color="primary"
          @close="cancelDialog"
      />

      <v-form ref="form" @submit.prevent="submitForm" class="mt-2">
        <v-card-text class="pa-0">
          <v-row>
            <!-- Left column -->
            <v-col cols="12" md="6">
              <div class="mb-4">
                <label for="client-department" class="text-body-2 mb-1 d-block">Client Department</label>
                <v-text-field
                    id="client-department"
                    v-model="formData.clientDepartment"
                    placeholder="Enter the client's department name"
                    variant="outlined"
                    hide-details
                />
              </div>

              <div class="mb-4">
                <label for="brand-select" class="text-body-2 mb-1 d-block">Brand*</label>
                <v-select
                    id="brand-select"
                    v-model="formData.brand"
                    :items="brands"
                    item-title="name"
                    item-value="_id"
                    placeholder="Select the brand for this PO"
                    :rules="[v => !!v || 'Brand is required']"
                    variant="outlined"
                    hide-details
                />
              </div>

              <div class="mb-4">
                <label for="client-name" class="text-body-2 mb-1 d-block">Client Name</label>
                <v-text-field
                    id="client-name"
                    v-model="formData.clientName"
                    placeholder="Enter client's full name"
                    variant="outlined"
                    hide-details
                />
              </div>

              <div class="mb-4">
                <label for="market-select" class="text-body-2 mb-1 d-block">Market*</label>
                <v-select
                    id="market-select"
                    v-model="formData.market"
                    :items="markets"
                    item-title="name"
                    item-value="_id"
                    placeholder="Select target market region"
                    :rules="[v => !!v || 'Market is required']"
                    variant="outlined"
                    hide-details
                />
              </div>

              <div class="mb-4">
                <label for="purpose-text" class="text-body-2 mb-1 d-block">Purpose</label>
                <v-textarea
                    id="purpose-text"
                    v-model="formData.purpose"
                    placeholder="Describe the purpose of this purchase order"
                    variant="outlined"
                    rows="4"
                    counter="250"
                    :rules="[v => !v || v.length <= 250 || 'Maximum 250 characters']"
                    hide-details="auto"
                />
              </div>
            </v-col>

            <!-- Right column -->
            <v-col cols="12" md="6">
              <div class="mb-4">
                <label for="po-number" class="text-body-2 mb-1 d-block">PO Number*</label>
                <v-text-field
                    id="po-number"
                    v-model="formData.poNumber"
                    placeholder="Enter official purchase order number"
                    :rules="[v => !!v || 'PO Number is required']"
                    variant="outlined"
                    hide-details
                />
              </div>

              <div class="d-flex">
                <div class="flex-grow-1 mr-2">
                  <label for="budget" class="text-body-2 mb-1 d-block">Budget*</label>
                  <v-text-field
                      id="budget"
                      v-model="formData.budget"
                      placeholder="Enter budget amount"
                      type="number"
                      :rules="[
                        v => !!v || 'Budget is required',
                        v => v > 0 || 'Budget must be greater than 0'
                      ]"
                      variant="outlined"
                      class="mb-4"
                      hide-details
                  />
                </div>

                <div class="flex-grow-0" style="width: 100px">
                  <label for="currency" class="text-body-2 mb-1 d-block">Currency</label>
                  <v-select
                      id="currency"
                      v-model="formData.currency"
                      :items="currencies"
                      variant="outlined"
                      class="mb-4"
                      hide-details
                  />
                </div>
              </div>

              <div class="mb-4">
                <label for="validity-range" class="text-body-2 mb-1 d-block">Validity Period*</label>
                <DateRangePicker
                    id="validity-range"
                    v-model="dateRange"
                    label=""
                    placeholder="Select validity period"
                    required
                    :rules="[v => !!v || 'Validity period is required']"
                    variant="outlined"
                    dialog-title="Select PO Validity Period"
                    hide-details
                />
              </div>

              <div class="mb-4">
                <label for="contractor-department" class="text-body-2 mb-1 d-block">Contractor Department</label>
                <v-text-field
                    id="contractor-department"
                    v-model="formData.contractorDepartment"
                    placeholder="Enter contractor's department name"
                    variant="outlined"
                    hide-details
                />
              </div>

              <div class="mb-4">
                <label for="contractor-name" class="text-body-2 mb-1 d-block">Contractor Name</label>
                <v-text-field
                    id="contractor-name"
                    v-model="formData.contractorName"
                    placeholder="Enter contractor's full name"
                    variant="outlined"
                    hide-details
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <DialogFooter
            cancel-text="Cancel"
            confirm-text="Create PO"
            :loading="isSubmitting"
            :disabled="!form?.isValid"
            :submit-button="true"
            @cancel="cancelDialog"
        />
      </v-form>
    </v-card>

    <!-- Success/Error Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-dialog>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted, watch} from 'vue';
import DialogHeader from "@/components/common/dialog/DialogHeader.vue";
import {useCreateMediaplanStore} from '@/stores/createMediaplanStore';
import type {Brand, PONumber} from '@/types/mediaplan';
import DialogFooter from "@/components/common/dialog/DialogFooter.vue";
import DateRangePicker from "./DateRangePicker.vue";
// Props
const props = defineProps<{
  modelValue: boolean;
  initialBrandId?: string;
}>();

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'created', po: PONumber): void;
}>();

// References and computed values
const form = ref();
const createMediaplanStore = useCreateMediaplanStore();
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Date range for the DateRangePicker
const dateRange = ref<[string, string] | null>(null);

// Loading state
const isSubmitting = ref(false);

// Brands from store
const brands = computed(() => createMediaplanStore.brands);

const markets = ref([
  {_id: 'de', name: 'Germany'},
  {_id: 'us', name: 'United States'},
  {_id: 'uk', name: 'United Kingdom'},
  {_id: 'fr', name: 'France'},
  {_id: 'it', name: 'Italy'},
  {_id: 'es', name: 'Spain'},
  {_id: 'pl', name: 'Poland'},
]);

const currencies = ref(['EUR', 'USD', 'GBP', 'JPY', 'CHF', 'PLN']);

// Form data
const formData = reactive({
  clientDepartment: '',
  brand: props.initialBrandId || '',
  clientName: '',
  market: '',
  purpose: '',
  poNumber: '',
  budget: 0,
  currency: 'EUR',
  contractorDepartment: '',
  contractorName: ''
});

// Snackbar for feedback
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success',
});

// Methods
const submitForm = async () => {
  if (!form.value) return;

  const {valid} = await form.value.validate();
  if (!valid) return;

  isSubmitting.value = true;

  try {
    // Create the PO through the store
    const newPO = await createMediaplanStore.createPO({
      name: formData.poNumber,
      value: Number(formData.budget),
      // Pass the dateRange values to the API
      metadata: {
        clientDepartment: formData.clientDepartment,
        brand: formData.brand,
        clientName: formData.clientName,
        market: formData.market,
        purpose: formData.purpose,
        currency: formData.currency,
        validFrom: dateRange.value ? dateRange.value[0] : '',
        validTo: dateRange.value ? dateRange.value[1] : '',
        contractorDepartment: formData.contractorDepartment,
        contractorName: formData.contractorName
      }
    });

    // Show success message
    showSuccess('PO created successfully');

    // Emit the created event with the new PO
    emit('created', newPO);

    // Close the dialog
    setTimeout(() => {
      dialog.value = false;
    }, 500);
  } catch (error) {
    console.error('Error creating PO:', error);
    showError('Failed to create PO');
  } finally {
    isSubmitting.value = false;
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

// Lifecycle
onMounted(async () => {
  // Set default dates (today to 1 year from now)
  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);

  const todayStr = today.toISOString().split('T')[0];
  const nextYearStr = nextYear.toISOString().split('T')[0];

  // Set the default date range
  dateRange.value = [todayStr, nextYearStr];

  // Initialize with the brand from the prop if provided
  if (props.initialBrandId) {
    formData.brand = props.initialBrandId;
  }

  // Make sure brands are loaded
  if (brands.value.length === 0) {
    await createMediaplanStore.fetchBrands();
  }
});
</script>