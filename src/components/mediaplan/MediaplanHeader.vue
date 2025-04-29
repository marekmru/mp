<template>
  <v-row align="center" justify="end" style="height: 57px;" class="mr-0">
    <div class="d-flex align-center border-b border-grey-lighten-2 mr-2 h-100">
      <div class="text-subtitle-1 text-grey-darken-1 mr-4">Plan Budget:</div>
      <div class="text-subtitle-1 text-grey-darken-1 mr-4">{{ formatCurrency(planBudget) }}</div>

      <div class="text-subtitle-1 text-grey-darken-1 mr-4">Used:</div>
      <v-progress-linear
          :model-value="usedPercentage"
          color="success"
          height="8"
          class="ml-2 mr-4"
          style="width: 100px"
      ></v-progress-linear>
      <span class="text-subtitle-1 text-grey-darken-1">{{ usedPercentage }}%</span>
    </div>

    <v-text-field
        max-width="120px"
        min-width="100px"
        v-model="search"
        placeholder="Search..."
        hide-details
        class="mr-2" append-inner-icon="mdi-magnify"
        @update:modelValue="$emit('update:search', $event)"
        bg-color="white"
    ></v-text-field>

    <v-btn icon="mdi-dots-horizontal" variant="plain">
    </v-btn>
  </v-row>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';

// Define props
interface Props {
  planBudget: number;
  usedPercentage: number;
  search: string;
}

// Define events
defineEmits([
  'update:search'
]);

// Receive props with defaults
const props = withDefaults(defineProps<Props>(), {
  planBudget: 0,
  usedPercentage: 0,
  search: ''
});

// Local state
const search = ref(props.search);

// Watch for prop changes
watch(() => props.search, (newValue) => {
  search.value = newValue;
});

// Format currency
const formatCurrency = (value: number): string => {
  // Empfehlung: 'de-DE' für korrekte Euro-Formatierung in Deutschland
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
</script>