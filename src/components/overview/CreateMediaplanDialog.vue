<template>
  <v-dialog v-model="dialog" persistent max-width="450px">
    <v-card class="px-6 pa-4">
      <DialogHeader
          title="Create new Mediaplan"
          :show-back-button="false"
          margin-bottom="4"
          @close="cancelDialog"
      />
      <v-form ref="form" @submit.prevent="submitForm">
        <WithFormDefaults>
          <v-card-text class="pa-0">
            <FormElementVrowVcol label="Brand Output" required>
              <v-select
                  id="brand-select"
                  v-model="formData.brand"
                  :items="brands"
                  item-title="value"
                  item-value="abbreviation"
                  placeholder="Please Select a brand"
                  :rules="[v => !!v || 'Brand is required']"
                  return-object
                  :loading="isLoadingSources"
              >
                <template v-slot:selection="{ item }">
                  <template v-if="formData.brand">
                    <v-avatar
                        size="24"
                        class="mr-2 grey lighten-4"
                        :image="getBrandLogo(item.raw)"
                    />
                    {{ formData.brand.value }}
                  </template>
                </template>

                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props" :title="item.raw.value">
                    <template v-slot:prepend>
                      <v-avatar
                          size="32"
                          class="mr-2 grey lighten-4"
                          :image="getBrandLogo(item.raw)"
                      />
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </FormElementVrowVcol>

            <FormElementVrowVcol pb="pb-3" label="Mediaplan Type" required>
              <v-radio-group v-model="mediaplanType" inline>
                <v-radio value="po" label="PO Based"/>
                <v-radio value="draft" label="Draft"/>
              </v-radio-group>
            </FormElementVrowVcol>

            <FormElementVrowVcol label="Individual Name">
              <v-text-field
                  id="mediaplan-name"
                  v-model="formData.name"
                  placeholder="please type in an individual title"
                  :rules="[v => !!v || 'Name is required']"
              />
            </FormElementVrowVcol>

            <FormElementVrowVcol label="Select existing PO" required>
              <v-row no-gutters>
                <v-col class="mr-2">
                  <v-select
                      id="po-select"
                      v-model="selectedPOs"
                      :items="poNumbersFromStore"
                      item-title="name"
                      item-value="_id"
                      placeholder="Select POs"
                      :rules="[v => mediaplanType !== 'po' || (v && v.length > 0) || 'At least one PO is required']"
                      multiple
                      chips
                      closable-chips
                      :loading="createMediaplanStore.isLoading"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-btn
                      color="primary"
                      size="large"
                      style="height: 48px;"
                      variant="outlined"
                      @click="openCreatePODialog"
                      :disabled="createMediaplanStore.isLoading"
                  >
                    Create PO
                  </v-btn>
                </v-col>
              </v-row>
            </FormElementVrowVcol>

            <FormElementVrowVcol label="Creator" required>
              <v-text-field
                  id="creator-name"
                  v-model="creatorName"
                  placeholder="Your name"
                  :rules="[v => !!v || 'Creator name is required']"
                  readonly
                  disabled
              />
            </FormElementVrowVcol>

            <FormElementVrowVcol label="Department">
              <v-text-field
                  id="department"
                  v-model="department"
                  placeholder="Department name"
              />
            </FormElementVrowVcol>

            <FormElementVrowVcol label="Start date - End date" required>
              <DateRangePicker
                  id="date-range"
                  v-model="dateRange"
                  placeholder="Select start and end dates"
                  :rules="[v => !!v || 'Date range is required']"
                  :required="true"
                  dialog-title="Choose a date range"
                  @update:model-value="handleDateRangeChange"
              />
            </FormElementVrowVcol>
            <pre>{{ formData }}</pre>
          </v-card-text>
        </WithFormDefaults>

        <DialogFooter
            cancel-text="Cancel"
            confirm-text="Next Step"
            :loading="isSubmitting"
            :disabled="!form?.isValid || isLoadingSources"
            :submit-button="true"
            @cancel="cancelDialog"
        />
      </v-form>
    </v-card>
  </v-dialog>

  <CreatePoDialog
      v-model="createPODialogVisible"
      :initial-brand-id="formData.brand?._id"
      @created="handlePoCreated"
  />

  <CreateFirstProjectDialog
      mode="create-mediaplan"
      v-if="showProjectDialog"
      v-model="showProjectDialog"
      :mediaplan-id="createdMediaplanId"
      :mediaplan-name="formData.name"
      :po-numbers="formData.po_numbers"
      :start-date="formData.start_date"
      :end-date="formData.end_date"
      :brand="formData.brand ? { _id: formData.brand._id, name: formData.brand.name } : undefined"
      @created="handleProjectCreated"
  />
</template>

<script setup lang="ts">
import {ref, computed, onMounted, watch, nextTick, reactive} from 'vue';
import {useAuthStore} from '@/stores/auth';
import {useCreateMediaplanStore} from '@/stores/createMediaplanStore';
import {useSourcesStore} from '@/stores/sourcesStore'; // Import useSourcesStore
import DialogFooter from "@/components/common/dialog/DialogFooter.vue";
import DialogHeader from "@/components/common/dialog/DialogHeader.vue";
import DateRangePicker from './DateRangePicker.vue';
import CreateFirstProjectDialog from '@/components/overview/CreateFirstProjectDialog.vue';
import CreatePoDialog from '@/components/overview/CreatePoDialog.vue';
import type {MediaplanCreate, Brand, PONumber} from '@/types/mediaplan';
import {showSuccess, showError, showWarning} from '@/helpers/notificationUtils';
import WithFormDefaults from "@/components/common/dialog/WithFormDefaults.vue";
import FormElementVrowVcol from "@/components/common/dialog/FormElementVrowVcol.vue";
import {getBrandLogo} from "@/helpers/brandUtils.ts";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'created', mediaplanId: string): void;
  (e: 'project-created', projectId: string): void;
}>();

const form = ref<any>();
const authStore = useAuthStore();
const createMediaplanStore = useCreateMediaplanStore();
const sourcesStore = useSourcesStore(); // Instantiate sourcesStore

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const mediaplanType = ref('po');
const selectedPOs = ref<string[]>([]);
const department = ref('');
const creatorName = ref('Current User');
const isSubmitting = ref(false);
const dateRange = ref<[string, string] | null>(null);
const showProjectDialog = ref(false);
const createdMediaplanId = ref('');
const createPODialogVisible = ref(false);

// Brands are now fetched and managed locally in the component via sourcesStore
const brands = ref<Brand[]>([]);
const isLoadingSources = ref(false); // Separate loading state for sources

const poNumbersFromStore = computed(() => createMediaplanStore.poNumbers);

const formData = reactive<MediaplanCreate>({
  name: '',
  status: 'Draft',
  start_date: '',
  end_date: '',
  brand: null as Brand | null,
  budget: {total: 0, used: 0, available: 0},
  po_numbers: []
});

const selectedBrandName = computed(() => { // This remains useful for display if needed elsewhere
  return formData.brand ? formData.brand.name : '';
});

const handleDateRangeChange = (range: [string, string] | null) => {
  if (range) {
    formData.start_date = range[0];
    formData.end_date = range[1];
  } else {
    formData.start_date = '';
    formData.end_date = '';
  }
};

const handleProjectCreated = (projectId: string) => {
  showProjectDialog.value = false;
  emit('project-created', projectId);
  dialog.value = false;
  showSuccess('Project created successfully');
};

const handlePoCreated = (po: PONumber) => {
  selectedPOs.value = [...selectedPOs.value, po._id];
  // Optionally, refresh PO numbers from store if the created PO is added there
  // await createMediaplanStore.fetchPONumbers();
  showSuccess(`PO "${po.name}" created successfully and added to selection`);
};

const loadInitialData = async () => {
  isLoadingSources.value = true;
  try {
    // Fetch Brands using sourcesStore
    let brandList = sourcesStore.getSourceList('brand') as Brand[] | undefined;
    if (!brandList || brandList.length === 0) {
      const fetchSuccess = await sourcesStore.fetchSources('creation', 'mediaplan'); //
      if (fetchSuccess) {
        brandList = sourcesStore.getSourceList('brand') as Brand[] | undefined; //
      } else {
        showError(sourcesStore.error || 'Failed to fetch brand sources.');
      }
    }
    brands.value = brandList || [];

    // Fetch PO Numbers using createMediaplanStore (if not already loaded)
    if (poNumbersFromStore.value.length === 0) {
      await createMediaplanStore.fetchPONumbers();
    }

  } catch (error) {
    console.error('Error loading form data:', error);
    showError('Failed to load initial form data.');
  } finally {
    isLoadingSources.value = false;
  }
};

const submitForm = async () => {
  if (!form.value) return;
  const {valid} = await form.value.validate();
  if (!valid) return;

  isSubmitting.value = true;
  try {
    if (mediaplanType.value === 'po' && selectedPOs.value.length > 0) {
      const selectedPOObjects = poNumbersFromStore.value.filter(po => selectedPOs.value.includes(po._id));
      if (selectedPOObjects.length > 0) {
        formData.po_numbers = selectedPOObjects;
        formData.budget.total = selectedPOObjects.reduce((sum, po) => sum + po.value, 0);
        formData.budget.available = formData.budget.total;
        formData.budget.used = 0;
      }
    } else {
      formData.po_numbers = [];
      formData.budget.total = 0;
      formData.budget.available = 0;
      formData.budget.used = 0;
    }
    formData.status = 'Draft'; // Or derive based on mediaplanType

    // Use the createMediaplan action from the store
    const createdMediaplan = await createMediaplanStore.createMediaplan(formData);
    createdMediaplanId.value = createdMediaplan._id; // Assuming API returns _id

    showSuccess('Mediaplan created successfully');
    emit('created', createdMediaplanId.value);
    showProjectDialog.value = true;

  } catch (error) {
    console.error('Error creating mediaplan:', error);
    showError('Failed to create mediaplan: ' + (error instanceof Error ? error.message : 'Unknown API error'));
  } finally {
    isSubmitting.value = false;
  }
};

const openCreatePODialog = () => {
  if (!formData.brand?._id) {
    showWarning('Please select a brand first');
    return;
  }
  createPODialogVisible.value = true;
};

const cancelDialog = () => {
  resetForm();
  dialog.value = false;
};

const resetForm = async () => {
  if (form.value) {
    form.value.resetValidation();
    form.value.reset();
  }
  await nextTick();
  formData.name = '';
  formData.brand = null;
  formData.start_date = '';
  formData.end_date = '';
  formData.budget = {total: 0, used: 0, available: 0};
  formData.po_numbers = [];
  dateRange.value = null;
  selectedPOs.value = [];
  department.value = '';
  mediaplanType.value = 'po';
  showProjectDialog.value = false;
  createdMediaplanId.value = '';
};

onMounted(async () => {
  await loadInitialData();
  if (authStore.user && authStore.user.name) {
    creatorName.value = authStore.user.name;
  } else {
    if (!authStore.user) {
      await authStore.fetchProfile(); //
      if (authStore.user && authStore.user.name) {
        creatorName.value = authStore.user.name;
      }
    }
  }
});

watch(dialog, (newValue) => {
  if (newValue === true) {
    // When dialog opens, ensure data is fresh or loaded
    // loadInitialData(); // Consider if this needs to be called every time or only once
  } else {
    resetForm();
  }
});
</script>