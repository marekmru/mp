<template>
  <v-row no-gutters class="align-center" :class="pb">
    <v-col :class="pb">
      <div class="text-caption text-medium-emphasis mb-1">
        {{ label }}<span v-if="required">*</span>
      </div>
      <slot></slot>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">

const props = defineProps({
  /** Label text for the form element (e.g. "Country") */
  label: {
    type: String,
    required: true
  },
  /** If true, shows a required asterisk after the label */
  required: {
    type: Boolean,
    default: false
  },
  /** Padding-bottom utility class, e.g. 'pb-0', 'pb-3' */
  pb: {
    type: String,
    default: 'pb-0'
  }
});
</script>

<style scoped>
/* Inherits Vuetify theming; .text-error will color the asterisk */
</style>
