<template>
  <v-dialog v-model="internalValue" max-width="500" persistent>
    <v-card>
      <v-toolbar color="error" density="comfortable" dark>
        <v-toolbar-title>Confirm Delete</v-toolbar-title>
      </v-toolbar>
      
      <v-card-text class="pa-6">
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="mb-4"
          closable
        >
          {{ error }}
        </v-alert>
        
        <p class="text-body-1">
          Are you sure you want to delete the project <strong>{{ project?.name }}</strong>?
        </p>
        <p class="text-body-2 mt-2 text-red">
          This action cannot be undone.
        </p>
      </v-card-text>
      
      <v-card-actions class="pa-6 pt-0">
        <v-spacer></v-spacer>
        <v-btn 
          variant="text" 
          @click="closeDialog"
          :disabled="isLoading"
        >
          Cancel
        </v-btn>
        <v-btn 
          color="error" 
          variant="flat"
          :loading="isLoading"
          @click="confirmDeletion"
        >
          Delete Project
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Project } from '@/types/project';

// Define props
interface Props {
  modelValue: boolean;
  project: Project | null;
  isLoading: boolean;
  error: string | null;
}

// Define emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

// Computed property for v-model binding
const internalValue = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

const closeDialog = () => {
  emit('cancel');
};

const confirmDeletion = () => {
  emit('confirm');
};

// Receive props with defaults
const props = withDefaults(defineProps<Props>(), {
  project: null,
  error: null
});
</script>