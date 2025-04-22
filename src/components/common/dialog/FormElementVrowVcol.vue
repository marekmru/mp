<template>
  <v-row>
    <v-col cols="12" :class="pb">
      <slot></slot>
    </v-col>
  </v-row>
</template>

<script setup>
import { defineProps } from 'vue';

// Define the 'pb' prop
defineProps({
  pb: {
    type: String,
    default: 'pb-0' // Default value as requested
  }
});
</script>
