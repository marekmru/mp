<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <v-card>
      <DialogHeader
        title="Create new PO"
        :show-back-button="false"
        @close="close"
      />
      
      <v-card-text>
        <v-form ref="form" @submit.prevent="submitForm" class="mt-2">
          <v-row>
            <!-- Left column -->
            <v-col cols="12" md="6">
              <div class="text-subtitle-1 mb-2">Client Information</div>
              
              <v-text-field
                v-model="formData.clientDepartment"
                label="Client Department"
                placeholder="Please enter department"
                variant="outlined"
                class="mb-4"
              />
              
              <v-select
                v-model="formData.brand"
                :items="brands"
                item-title="name"
                item-value="_id"
                label="Brand*"
                placeholder="Select a Brand"
                :rules="[v => !!v || 'Brand is required']"
                variant="outlined"
                class="mb-4"
              />
              
              <v-text-field
                v-model="formData.clientName"
                label="Client Name"
                placeholder="Please enter name & last name"
                variant="outlined"
                class="mb-4"
              />
              
              <v-select
                v-model="formData.market"
                :items="markets"
                item-title="name"
                item-value="_id"
                label="Market*"
                placeholder="Select a Market"
                :rules="[v => !!v || 'Market is required']"
                variant="outlined"
                class="mb-4"
              />
              
              <v-textarea
                v-model="formData.purpose"
                label="Purpose"
                placeholder="Please enter a description"
                variant="outlined"
                rows="4"
                counter="250"
                :rules="[v => !v || v.length <= 250 || 'Maximum 250 characters']"
                class="mb-4"
              />
            </v-col>
            
            <!-- Right column -->
            <v-col cols="12" md="6">
              <div class="text-subtitle-1 mb-2">PO Details</div>
              
              <v-text-field
                v-model="formData.poNumber"
                label="PO Number*"
                placeholder="Please enter the PO Number"
                :rules="[v => !!v || 'PO Number is required']"
                variant="outlined"
                class="mb-4"
              />
              
              <div class="d-flex">
                <v-text-field
                  v-model="formData.budget"
                  label="Budget*"
                  placeholder="Please enter a budget"
                  type="number"
                  :rules="[
                    v => !!v || 'Budget is required',
                    v => v > 0 || 'Budget must be greater than 0'
                  ]"
                  variant="outlined"
                  class="flex-grow-1 mb-4 mr-2"
                />
                
                <v-select
                  v-model="formData.currency"
                  :items="currencies"
                  label="Currency"
                  variant="outlined"
                  class="flex-grow-0 mb-4"
                  style="width: 100px"
                />
              </div>
              
              <div class="d-flex gap-2">
                <v-col>
                  <v-text-field
                    v-model="formData.validFrom"
                    label="Valid from*"
                    placeholder="DD.MM.YYYY"
                    :rules="[v => !!v || 'Date is required']"
                    variant="outlined"
                    readonly
                    class="mb-4"
                    @click="dateFromMenu = true"
                  >
                    <template v-slot:append>
                      <v-icon @click="dateFromMenu = true">mdi-calendar</v-icon>
                    </template>
                  </v-text-field>
                  <v-date-picker
                    v-model="formData.validFrom"
                    v-if="dateFromMenu"
                    @click:save="dateFromMenu = false"
                    @click:cancel="dateFromMenu = false"
                  ></v-date-picker>
                </v-col>
                
                <v-col>
                  <v-text-field
                    v-model="formData.validTo"
                    label="Valid to*"
                    placeholder="DD.MM.YYYY"
                    :rules="[v => !!v || 'Date is required']"
                    variant="outlined"
                    readonly
                    class="mb-4"
                    @click="dateToMenu = true"
                  >
                    <template v-slot:append>
                      <v-icon @click="dateToMenu = true">mdi-calendar</v-icon>
                    </template>
                  </v-text-field>
                  <v-date-picker
                    v-model="formData.validTo"
                    v-if="dateToMenu"
                    @click:save="dateToMenu = false"
                    @click:cancel="dateToMenu = false"
                  ></v-date-picker>
                </v-col>
              </div>
              
              <v-text-field
                v-model="formData.contractorDepartment"
                label="Contractor Department"
                placeholder="Please enter department"
                variant="outlined"
                class="mb-4"
              />
              
              <v-text-field
                v-model="formData.contractorName"
                label="Contractor Name"
                placeholder="Please enter name & last name"
                variant="outlined"
                class="mb-4"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      
      <v-card-actions class="pa-6 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-lighten-1"
          variant="flat"
          min-width="120"
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          min-width="120"
          :loading="isSubmitting"
          @click="submitForm"
        >
          Create PO
        </v-btn>
      </v-card-actions>
    </v-card>
    
    <!-- Success/Error Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import DialogHeader from "@/components/common/dialog/DialogHeader.vue";
import { useCreateMediaplanStore } from '@/stores/createMediaplanStore';
import type { Brand, PONumber } from '@/types/mediaplan';

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

// Date picker menus
const dateFromMenu = ref(false);
const dateToMenu = ref(false);

// Loading state
const isSubmitting = ref(false);

// Brands from store
const brands = computed(() => createMediaplanStore.brands);

const markets = ref([
  { _id: 'de', name: 'Germany' },
  { _id: 'us', name: 'United States' },
  { _id: 'uk', name: 'United Kingdom' },
  { _id: 'fr', name: 'France' },
  { _id: 'it', name: 'Italy' },
  { _id: 'es', name: 'Spain' },
  { _id: 'pl', name: 'Poland' },
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
  validFrom: '',
  validTo: '',
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
  
  const { valid } = await form.value.validate();
  if (!valid) return;
  
  isSubmitting.value = true;
  
  try {
    // Create the PO through the store
    const newPO = await createMediaplanStore.createPO({
      name: formData.poNumber,
      value: Number(formData.budget),
      // We could also pass the additional metadata for a complete PO record
      metadata: {
        clientDepartment: formData.clientDepartment,
        brand: formData.brand,
        clientName: formData.clientName,
        market: formData.market,
        purpose: formData.purpose,
        currency: formData.currency,
        validFrom: formData.validFrom,
        validTo: formData.validTo,
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

const close = () => {
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
  
  formData.validFrom = today.toISOString().split('T')[0];
  formData.validTo = nextYear.toISOString().split('T')[0];
  
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