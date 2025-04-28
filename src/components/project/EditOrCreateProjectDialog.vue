<template>
  <v-dialog :model-value="modelValue" max-width="550px" persistent @update:model-value="close">
    <v-card class="pa-6">
      <DialogHeader
          :title="isEdit ? 'Edit Project Data' : 'Create New Project'"
          :show-close-button="true"
          @close="close"
          :show-back-button="false"
      />

      <v-form ref="form" @submit.prevent="onSubmit" v-model="isFormValid" validate-on="input">
        <WithFormDefaults>

          <!-- Country & Language -->
          <CountryLanguageSelector v-model="countryLanguage"/>

          <!-- Date Range -->
          <FormElementVrowVcol label="Start date - End date" required>
            <DateRangePicker
                id="date-range"
                v-model="dateRange"
                placeholder="Select start and end dates"
                :rules="[required]"
                dialog-title="Choose a date range"
                @update:model-value="handleDateRangeChange"
            />
          </FormElementVrowVcol>

          <FormElementVrowVcol label="PO Number">
            <v-text-field v-model="project.poNumber" placeholder="Optional PO Number"/>
          </FormElementVrowVcol>

          <FormElementVrowVcol label="Builder" required>
            <v-select
                v-model="project.builder"
                :items="builders"
                item-title="name"
                item-value="code"
                placeholder="Select Builder"
                :rules="[required]"
            />
          </FormElementVrowVcol>

          <FormElementVrowVcol label="Campaign Type" required>
            <v-select
                v-model="project.campaignType"
                :items="campaignTypes"
                item-title="name"
                item-value="code"
                placeholder="Select Campaign Type"
                :rules="[required]"
            />
          </FormElementVrowVcol>

          <FormElementVrowVcol label="Phase" required>
            <v-select
                v-model="project.phase"
                :items="phases"
                item-title="name"
                item-value="code"
                placeholder="Select Phase"
                :rules="[required]"
            />
          </FormElementVrowVcol>

          <FormElementVrowVcol label="Goal" required>
            <v-select
                v-model="project.goal"
                :items="goals"
                item-title="name"
                item-value="code"
                placeholder="Select Goal"
                :rules="[required]"
            />
          </FormElementVrowVcol>

          <FormElementVrowVcol label="Budget">
            <FormattedCurrencyInput
                v-model="project.budget"
                suffix="€"
                :decimal="'comma'"
                :allowDecimals="true"
                outlined
                density="compact"
                hide-details="auto"
            />
          </FormElementVrowVcol>

          <DialogFooter
              class="mt-5"
              cancel-text="Cancel"
              :confirm-text="isEdit ? 'Save' : 'Create'"
              :disabled="!isFormValid"
              @cancel="close"
              @confirm="onSubmit"
          />
        </WithFormDefaults>

      </v-form>
      <pre>{{project}}</pre>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import type {Project} from '@/types/project';
import type {ProjectCountry} from '@/types/project'; // already imported in your other dialog

import {useProjectStore} from '@/stores/projectStore';
import {showSuccess, showError} from '@/helpers/notificationUtils';
import FormElementVrowVcol from "@/components/common/dialog/FormElementVrowVcol.vue";
import DateRangePicker from "@/components/overview/DateRangePicker.vue";
import DialogHeader from "@/components/common/dialog/DialogHeader.vue";
import DialogFooter from "@/components/common/dialog/DialogFooter.vue";
import CountryLanguageSelector from "@/components/common/dialog/CountryLanguageSelector.vue";
import WithFormDefaults from "@/components/common/dialog/WithFormDefaults.vue";
import FormattedCurrencyInput from "@/components/common/FormattedCurrencyInput.vue";

const props = defineProps<{
  modelValue: boolean;
  isEdit?: boolean;
  initialData?: Project;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'saved', project: Project): void;
}>();

const form = ref<any>(null);
const isFormValid = ref(false);
const projectStore = useProjectStore();

const required = (v: any) => !!v || 'Required';

// Separate "shallow" editable model
const project = ref<Partial<Project>>({
  startDate: '',
  endDate: '',
  poNumber: '',
  builder: null,
  campaignType: null,
  phase: null,
  goal: null,
  budget: undefined
});

const countryLanguage = ref<{
  country: ProjectCountry | null;
  language: string | null;
}>({
  country: null,
  language: null
});

const dateRange = ref<[string, string] | null>(null);

const handleDateRangeChange = ([start, end]: [string, string]) => {
  project.value.startDate = start;
  project.value.endDate = end;
};

const close = () => emit('update:modelValue', false);
import { watch } from 'vue'

watch(
    () => props.initialData,
    (newData) => {
      if (props.isEdit && newData) {
        const startDate = newData.duration?.start_date ?? '';
        const endDate = newData.duration?.end_date ?? '';

        project.value = {
          startDate,
          endDate,
          poNumber: newData.descriptive_vars?.bmwponumber ?? '',
          builder: newData.builder ?? null,
          campaignType: newData.default_vars?.campaigntype ?? '',
          phase: newData.phase ?? '',
          goal: newData.goal ?? '',
          budget: newData.budget?.total ?? undefined,
        };

        dateRange.value = [startDate, endDate];

        countryLanguage.value = {
          country: newData.descriptive_vars?.country
              ? { name: newData.descriptive_vars.country, code: newData.descriptive_vars.country }
              : null,
          language: newData.default_vars?.language ?? ''
        };
      }
    },
    { immediate: true } // Trigger the watcher also on component mount
);
onMounted(async () => {
  await projectStore.fetchProjectOptions();
/*  console.log(props.initialData, 'props.initialData')
  if (!(props.isEdit && props.initialData)) {
    return;
  }
  project.value = {
    ...props.initialData,
    poNumber: props.initialData.descriptive_vars?.bmwponumber || '',
    budget: props.initialData.budget,
    startDate: props.initialData.duration?.start_date || '',
    endDate: props.initialData.duration?.end_date || ''
  };
  countryLanguage.value = {
    country: {
      name: props.initialData.descriptive_vars.country,
      code: props.initialData.descriptive_vars.country // fallback
    },
    language: props.initialData.default_vars.language
  };
  dateRange.value = [project.value.startDate, project.value.endDate];*/
});

const builders = computed(() => projectStore.builders);
const campaignTypes = computed(() => projectStore.campaignTypes);
const phases = computed(() => projectStore.phases);
const goals = computed(() => projectStore.goals);

const onSubmit = async () => {
  const isValid = await form.value.validate();
  if (!isValid) return;

  try {
    const payload: Partial<Project> = {
      ...project.value,
      duration: {
        start_date: project.value.startDate!,
        end_date: project.value.endDate!,
        formatted: '' // add formatted logic here if needed
      },
      descriptive_vars: {
        country: countryLanguage.value.country?.code || '',
        bmwponumber: project.value.poNumber || '',
        brand: '',
        adobecampaignname: '',
        campaigntype: '',
        projectname: '',
        subsegment: '',
        year: new Date().getFullYear()
      },
      default_vars: {
        language: countryLanguage.value.language || '',
        campaigntype: project.value.campaignType || '',
        subsegment: '',
        adtype: '',
        dimension: '',
        targeturls: null,
        campaigndetail: null
      }
    };

    const result = props.isEdit
        ? await projectStore.updateProject(payload)
        : await projectStore.createProject(payload);

    showSuccess(`Project ${props.isEdit ? 'updated' : 'created'} successfully`);
    emit('saved', result);
    close();
  } catch (err: any) {
    showError(err?.message || 'Operation failed');
  }
};
</script>