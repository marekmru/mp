<template>
  <v-dialog v-model="dialog" persistent max-width="450px">
    <v-card class="px-6 pa-4">
      <DialogHeader
          title="Create new Mediaplan"
          :show-back-button="false"
          margin-bottom="4"
          @close="cancelDialog"
      />
      <v-form v-model="valid" ref="form" @submit.prevent="submitForm">
        <WithFormDefaults>
          <!--          <pre>{{ formData }}</pre>-->
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
                        :image="getBrandLogo(item.raw)"/>
                    {{ item.raw.value }}
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
              <v-radio-group v-model="formData.mediaplan_type" inline>
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
                      v-model="formData.po_numbers"
                      :items="poNumbersFromStore"
                      item-title="name"
                      item-value="_id"
                      placeholder="Select POs"
                      return-object
                      :rules="[v => (v && v.length > 0) || 'At least one PO is required']"
                      multiple
                      chips
                      closable-chips
                      :loading="poStore.isLoading"/>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                      color="primary"
                      size="large"
                      style="height: 48px;"
                      variant="outlined"
                      @click="openCreatePODialog"
                      :disabled="poStore.isLoading">
                    Create PO
                  </v-btn>
                </v-col>
              </v-row>
            </FormElementVrowVcol>

            <FormElementVrowVcol label="Creator" required>
              <v-text-field
                  id="creator-name"
                  :value="authStore.user?.name"
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
          </v-card-text>
        </WithFormDefaults>
        <DialogFooter
            cancel-text="Cancel"
            confirm-text="Next Step"
            :loading="isSubmitting"
            :disabled="!valid || isLoadingSources || poStore.isLoading"
            :submit-button="true"
            @cancel="cancelDialog"
        />
      </v-form>
    </v-card>
  </v-dialog>

  <CreatePoDialog
      v-model="createPODialogVisible"
      :initial-brand-id="formData.brand?.abbreviation" @created="handlePoCreated"
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
      :brand="formData.brand ? { _id: formData.brand.abbreviation, name: formData.brand.value } : undefined"
      @created="handleProjectCreated"
  />
</template>

<script setup lang="ts">
import {ref, computed, onMounted, watch, nextTick, reactive} from 'vue';
import {useAuthStore} from '@/stores/auth';
import {useCreateMediaplanStore} from '@/stores/createMediaplanStore';
import {useSourcesStore} from '@/stores/sourcesStore';
import {usePoNumberStore} from '@/stores/poNumberStore';
import DialogFooter from "@/components/common/dialog/DialogFooter.vue";
import DialogHeader from "@/components/common/dialog/DialogHeader.vue";
import DateRangePicker from './DateRangePicker.vue';
import CreateFirstProjectDialog from '@/components/overview/CreateFirstProjectDialog.vue';
import CreatePoDialog from '@/components/overview/CreatePoDialog.vue';
import type {MediaplanCreate, Brand as MediaplanBrandType, PONumber, Source, Mediaplan} from '@/types/mediaplan';
import {showSuccess, showError, showWarning} from '@/helpers/notificationUtils';
import WithFormDefaults from "@/components/common/dialog/WithFormDefaults.vue";
import FormElementVrowVcol from "@/components/common/dialog/FormElementVrowVcol.vue";
import {getBrandLogo} from "@/helpers/brandUtils.ts";

const valid = ref(null)

type ComponentBrandType = Source;

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'created', mediaplanId: string): void;
  (e: 'project-created', projectId: string): void;
}>();

const authStore = useAuthStore();
const createMediaplanStore = useCreateMediaplanStore();
const sourcesStore = useSourcesStore();
const poStore = usePoNumberStore();

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const department = ref('');

const isSubmitting = ref(false);
const dateRange = ref<[string, string] | null>(null);
const showProjectDialog = ref(false);
const createdMediaplanId = ref('');
const createPODialogVisible = ref(false);

const brands = ref<ComponentBrandType[]>([]);
const isLoadingSources = ref(false);

const poNumbersFromStore = computed(() => poStore.allPONumbers);

const formData = reactive<Mediaplan>({
  name: '',
  status: 'Draft', // Default status
  start_date: '',
  end_date: '',
  brand: null,     // Initialized to null
  po_numbers: [],
  mediaplan_type: '',
  created_by: authStore.user?.name || '',
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

const handlePoCreated = async (po: PONumber) => {
  selectedPOs.value = [...selectedPOs.value, po._id];
  showSuccess(`PO "${po.name}" created successfully and added to selection`);
};

const loadInitialData = async () => {
  isLoadingSources.value = true;

  try {
    let brandList = sourcesStore.getSourceList('brand') as ComponentBrandType[] | undefined;
    if (!brandList || brandList.length === 0) {
      const fetchSuccess = await sourcesStore.fetchSources('creation', 'mediaplan');
      if (fetchSuccess) {
        brandList = sourcesStore.getSourceList('brand') as ComponentBrandType[] | undefined;
      } else {
        showError(sourcesStore.error || 'Failed to fetch brand sources.');
      }
    }
    brands.value = brandList || [];
    isLoadingSources.value = false;

    if (poStore.allPONumbers.length === 0) {
      await poStore.fetchPONumbers();
    }

  } catch (error) {
    console.error('Error loading initial form data:', error);
    showError('Failed to load initial form data.');
    isLoadingSources.value = false;
  }
};

const submitForm = async () => {
  if (!form.value) return;
  const {valid} = await form.value.validate();
  if (!valid) return;

  isSubmitting.value = true;
  try {

    const finalPayloadForMediaplan: Mediaplan = {
      ...formData,
    };
    const createdMediaplan = await createMediaplanStore.createMediaplan(finalPayloadForMediaplan);
    createdMediaplanId.value = createdMediaplan._id;

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
  if (!formData.brand?.abbreviation) {
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
  formData.mediaplan_type = 'po';
  formData.created_by = authStore.user?.name || '';
  dateRange.value = null;
  department.value = '';
  showProjectDialog.value = false;
  createdMediaplanId.value = '';
};

onMounted(async () => {
  await loadInitialData();

  if (!authStore.user) {
    await authStore.fetchProfile();

  }

});

watch(dialog, (newValue) => {
  if (newValue) {
    if (brands.value.length === 0 || poStore.allPONumbers.length === 0) {
      loadInitialData();
    }
  } else {
    resetForm();
  }
});
</script>