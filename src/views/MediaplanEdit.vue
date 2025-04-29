<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h4">
            Edit Mediaplan
          </v-card-title>
          <v-card-text>
            <p>Mediaplan ID: {{ mediaplanId }}</p>
            <p>This page would allow editing of the mediaplan details.</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="goBack">
              Back to Overview
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

// Props
const props = defineProps<{
  mediaplanId: string;
}>();

// Router
const router = useRouter();

// Methods
const goBack = () => {
  router.push('/');
};
</script>