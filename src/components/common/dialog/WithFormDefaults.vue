<template>
  <v-defaults-provider :defaults="defaults">
    <slot />
  </v-defaults-provider>
</template>

<script setup lang="ts">
const defaults = {
  VTextField: {
    variant: 'outlined',
    density: 'comfortable',
  },
  VSelect: {
    variant: 'outlined',
    density: 'comfortable',
  },
  VDatePicker: {
    variant: 'outlined',
    density: 'comfortable',
  },
  VRadioGroup: {
    density: 'comfortable',
    hideDetails: true
  },
  VBtn: {
  },
  VDialog: {
    maxWidth: 450
  }
};
</script>