<template>
  <div class="d-flex justify-center align-center my-4">
    <v-pagination
        v-model="modelValue"
        :length="length"
        :disabled="disabled"
        :total-visible="totalVisible"
        rounded="circle"
        @update:model-value="updatePage"
    />

    <div v-if="showItemsPerPage" class="ml-4 d-flex align-center">
      <span class="text-caption mr-2">Items per page:</span>
      <v-select
          v-model="itemsPerPage"
          :items="itemsPerPageOptions"
          density="compact"
          variant="outlined"
          hide-details
          class="items-per-page-select"
          @update:model-value="updateItemsPerPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

interface Props {
  modelValue: number;
  length: number;
  disabled?: boolean;
  totalVisible?: number;
  showItemsPerPage?: boolean;
  itemsPerPageValue?: number;
  itemsPerPageOptions?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  totalVisible: 7,
  showItemsPerPage: true,
  itemsPerPageValue: 10,
  itemsPerPageOptions: () => [10, 25, 50, 100]
});

const emit = defineEmits<{
  (e: 'update:model-value', value: number): void;
  (e: 'update:items-per-page', value: number): void;
}>();

// Internal model value for v-pagination (needs to be 1-based)
const modelValue = computed({
  get: () => props.modelValue + 1, // Convert from 0-based to 1-based
  set: (value: number) => {
    emit('update:model-value', value - 1); // Convert from 1-based to 0-based
  }
});

// Items per page handling
const itemsPerPage = ref(props.itemsPerPageValue);

// When props change, update the local state
watch(() => props.itemsPerPageValue, (newValue) => {
  itemsPerPage.value = newValue;
});

const updatePage = (page: number) => {
  emit('update:model-value', page - 1); // Convert from 1-based to 0-based
};

const updateItemsPerPage = (value: number) => {
  itemsPerPage.value = value;
  emit('update:items-per-page', value);
};
</script>

<style scoped>
.items-per-page-select {
  width: 80px;
}
</style>