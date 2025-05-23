<template>
  <div class="date-range-picker">
    <!-- Single input field that triggers the dialog -->
    <v-text-field
        v-model="displayValue"
        :label="label"
        :placeholder="placeholder"
        :rules="rules"
        :hint="hint"
        :disabled="disabled"
        readonly
        @click="openDialog"
        append-inner-icon="mdi-calendar-month-outline"
        v-bind="$attrs"
    >
    </v-text-field>

    <!-- Date Picker Dialog -->
    <v-dialog v-model="showDialog" width="auto" max-width="420px">
      <v-card class="date-picker-dialog">
        <!-- Dialog Title -->
        <v-card-title class="d-flex align-center pb-0">
          <span class="text-subtitle-1">{{ dialogTitle }}</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <!-- Display Selected Dates -->
        <v-card-text class="pt-2 pb-0">
          <div v-if="selectedDates.length >= 2" class="selected-dates">
            <span class="text-subtitle-1">Selected Range:</span>
            {{ formatSelectedDatePreview(selectedDates[0]) }} -
            {{ formatSelectedDatePreview(selectedDates[selectedDates.length - 1]) }}
          </div>
          <div v-else class="selected-dates">
            <strong>No date range selected</strong>
          </div>
        </v-card-text>

        <!-- Date Picker Component -->
        <v-date-picker
            v-model="selectedDates"
            :min="minDate"
            :max="maxDate"
            multiple="range"
            elevation="0"
            color="primary"
            width="100%"
            hide-header
            show-adjacent-months
        >
        </v-date-picker>

        <!-- Dialog Actions -->
        <v-card-actions class="pt-0 pb-4 px-6">
          <v-btn
              size="large"
              variant="outlined"
              color="grey-darken-1"
              @click="clearSelection"
          >
            Clear selection
          </v-btn>
          <v-btn
              size="large"
              color="primary"
              variant="flat"
              @click="setDates"
              :disabled="!canSetDates"
          >
            Set dates
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue';
import {formatDate} from '@/helpers/dateUtils';
import WithFormDefaults from "@/components/common/dialog/WithFormDefaults.vue";

// Define props with TypeScript interface
interface Props {
  modelValue: [string, string] | null; // [startDate, endDate] as a tuple or null
  label?: string;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  dialogTitle?: string;
  dateFormat?: string;
  minDate?: string;
  maxDate?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Date range',
  placeholder: 'Select a date range',
  hint: '',
  disabled: false,
  required: false,
  dialogTitle: 'Choose a date range',
  dateFormat: 'DD.MM.YYYY',
  minDate: undefined,
  maxDate: undefined,
  density: 'default',
  variant: 'outlined'
});

// Define emits with TypeScript
const emit = defineEmits<{
  (e: 'update:modelValue', value: [string, string] | null): void;
}>();

// State
const showDialog = ref(false);
const selectedDates = ref<string[]>([]);
const displayValue = ref('');

// Computed properties
const canSetDates = computed(() => {
  return selectedDates.value.length >= 2;
});

// Rules for validation
const rules = computed(() => {
  const rules = [];
  if (props.required) {
    rules.push((v: string) => !!v || `${props.label} is required`);
  }
  return rules;
});

// Format date for the dialog preview
const formatSelectedDatePreview = (dateStr: string): string => {
  return formatDate(dateStr, props.dateFormat);
};

// Methods
const openDialog = () => {
  if (props.disabled) return;

  // Initialize selected dates based on current values
  selectedDates.value = [];
  if (props.modelValue) {
    selectedDates.value = [...props.modelValue];
  }

  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const clearSelection = () => {
  selectedDates.value = [];
  displayValue.value = '';
  emit('update:modelValue', null);
  closeDialog();
};

const setDates = () => {
  if (selectedDates.value.length >= 2) {
    // Sort the dates to ensure start is before end
    const sortedDates = [...selectedDates.value].sort();
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];

    emit('update:modelValue', [startDate, endDate]);
    closeDialog();
  }
};

// Update display value when model value changes
const updateDisplayValue = () => {
  if (!props.modelValue || props.modelValue.length !== 2) {
    displayValue.value = '';
    return;
  }

  const [start, end] = props.modelValue;

  if (start && end) {
    const startFormatted = formatDate(start, props.dateFormat);
    const endFormatted = formatDate(end, props.dateFormat);
    displayValue.value = `${startFormatted} - ${endFormatted}`;
  } else {
    displayValue.value = '';
  }
};

// Watch for model value changes
watch(() => props.modelValue, () => {
  updateDisplayValue();
}, {immediate: true});

// Watch for selected dates changes
watch(() => selectedDates.value, (newVal) => {
  if (newVal.length >= 2) {
    // Update the preview in the input field even before confirming
    const sortedDates = [...newVal].sort();
    const startPreview = formatDate(sortedDates[0], props.dateFormat);
    const endPreview = formatDate(sortedDates[sortedDates.length - 1], props.dateFormat);
    displayValue.value = `${startPreview} - ${endPreview}`;
  }
});
</script>

<style scoped>
.date-picker-dialog {
  overflow: hidden;
}

.weekday-header {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  background-color: white;
}
</style>