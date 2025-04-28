<template>
  <v-row no-gutters align="center" class="budget-progress-row">
    <v-col class="budget-progress-bar-col">
      <v-progress-linear
          :model-value="progressBarValue"
          :color="progressColor"
          rounded="pill"
          :bg-color="bgColor" height="6"
          bg-opacity=".8"
          style="min-width: 42px"
      ></v-progress-linear>
    </v-col>
    <v-col cols="auto" class="budget-progress-text-col pl-2">
      {{ formattedDisplayPercentage }}
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {formatPercentage, percentage} from "@/helpers/format.ts";

// --- Props ---

interface Props {
  usedBudget: number | null | undefined;
  totalBudget: number | null | undefined;
  color?: string; // Color for the active progress bar
  bgColor?: string; // New prop for the background color
}

// Definieren der Props mit Standardwerten
const props = withDefaults(defineProps<Props>(), {
  usedBudget: undefined,
  totalBudget: undefined,
  color: 'success',
  bgColor: 'white', // Default background color set to white
});

// --- Computed Properties ---

// Value for the progress bar (0-100)
const progressBarValue = computed<number>(() => {
  const usedNum = Number(props.usedBudget ?? 0);
  const totalNum = Number(props.totalBudget ?? 0);
  const rawPercent = percentage(usedNum, totalNum);
  if (isNaN(rawPercent)) {
    return 0;
  }
  return Math.min(100, Math.max(0, rawPercent));
});

// Formatted percentage string (e.g., "75,00 %")
const formattedDisplayPercentage = computed<string>(() => {
  const usedNum = Number(props.usedBudget ?? 0);
  const totalNum = Number(props.totalBudget ?? 0);
  return formatPercentage(usedNum, totalNum);
});

// Color for the active part of the progress bar
const progressColor = computed<string>(() => props.color);

// Background color for the progress bar track (directly from props)
// We don't strictly need a computed prop here as we use the prop directly
// in the template, but if needed for logic, it would be:
// const backgroundColor = computed<string>(() => props.bgColor);
// However, :bg-color="bgColor" in the template is sufficient.

</script>

<style scoped>
/* Styles remain unchanged */
.budget-progress-row {
  flex-wrap: nowrap;
  width: 100%;
}

.budget-progress-bar-col {
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
}

.budget-progress-text-col {
  flex-shrink: 0;
  white-space: nowrap;
}
</style>