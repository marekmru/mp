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
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CreateMediaplanDialog from './CreateMediaplanDialog.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const dialogVisible = ref(false);

const showDialog = () => {
  dialogVisible.value = true;
};

const handleMediaplanCreated = (mediaplanId: string) => {
  // Navigate to the newly created mediaplan or refresh the list
  // For now, we'll just log it
  console.log('Mediaplan created with ID:', mediaplanId);

  // You could redirect to the mediaplan detail page:
  // router.push(`/mediaplans/${mediaplanId}`);

  // Or just emit an event to refresh the list
  emit('mediaplan-created');
};

const emit = defineEmits<{
  (e: 'mediaplan-created'): void;
}>();
</script>