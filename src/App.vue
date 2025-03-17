<template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script setup lang="ts">
import {useAuthStore} from './stores/auth'
import {onMounted} from "vue";

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.fetchProfile()
})
</script>