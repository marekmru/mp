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
    hideDetails: true,
    class: 'rounded-lg'
  },
  VSelect: {
    variant: 'outlined',
    density: 'comfortable',
    hideDetails: true,
    class: 'rounded-lg'
  },
  VRadioGroup: {
    density: 'comfortable',
    hideDetails: true
  },
  VBtn: {
    class: 'rounded-lg'
  }
};
</script>