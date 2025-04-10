<template>
  <div class="view-toggle-container">
    <v-btn-toggle
        v-model="selectedView"
        class="view-toggle"
        density="comfortable"
        @update:modelValue="$emit('update:modelValue', $event)"
    >
      <v-btn value="planning">Planning view</v-btn>
      <v-btn value="budget">Budget view</v-btn>
    </v-btn-toggle>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Define props
interface Props {
  modelValue: string
}

defineEmits(['update:modelValue'])
const props = defineProps<Props>()

const selectedView = ref(props.modelValue)

watch(
    () => props.modelValue,
    (newValue) => {
      selectedView.value = newValue
    },
    { immediate: true }
)
</script>

<style scoped>
.view-toggle .v-btn {
  background-color: white;
  color: black;
  border: 1px solid #ccc;
  border-radius: 0;
  font-weight: 500;
}

.view-toggle .v-btn.v-btn--active {
  background-color: black;
  color: white;
  border-color: black;
}
</style>