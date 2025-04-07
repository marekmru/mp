<template>
  <v-app>
    <router-view/>
    
    <!-- Global notification component -->
    <notification-snackbar />
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth';
import { onMounted } from "vue";
import NotificationSnackbar from '@/components/common/NotificationSnackbar.vue';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.fetchProfile();
});
</script>