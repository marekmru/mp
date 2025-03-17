<template>
  <TopBar/>

  <v-main>
    <v-container fluid class="max-width-container">
      <slot/>
    </v-container>
  </v-main>
</template>

<script setup>
import TopBar from "@/components/TopBar.vue";
</script>

<style scoped>
.max-width-container {
  max-width: 1440px;
}
</style>