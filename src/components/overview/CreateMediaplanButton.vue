<template>
  <div>
    <v-btn
        color="black"
        class="text-white px-4"
        prepend-icon="mdi-plus"
        @click="showDialog"
    >
      Mediaplan
    </v-btn>

    <create-mediaplan-dialog
        v-model="dialogVisible"
        @created="handleMediaplanCreated"
        @project-created="handleProjectCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CreateMediaplanDialog from './CreateMediaplanDialog.vue';
import { useRouter } from 'vue-router';
import { useMediaplanStore } from '@/stores/mediaplanStore';

const router = useRouter();
const mediaplanStore = useMediaplanStore();
const dialogVisible = ref(false);

const showDialog = () => {
  dialogVisible.value = true;
};

const handleMediaplanCreated = (mediaplanId: string) => {
  // Store the mediaplan ID but don't close the dialog yet
  // as the project creation will follow
  console.log('Mediaplan created with ID:', mediaplanId);
};

const handleProjectCreated = (projectId: string) => {
  console.log('Project created with ID:', projectId);
  
  // Refresh the mediaplans list
  mediaplanStore.fetchMediaplans();
  
  // Emit event to notify parent component
  emit('project-created', projectId);
};

const emit = defineEmits<{
  (e: 'mediaplan-created'): void;
  (e: 'project-created', projectId: string): void;
}>();
</script>