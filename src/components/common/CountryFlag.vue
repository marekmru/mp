<template>
  <span :class="`fi fi-${country.toLowerCase()}`" :style="flagStyle"></span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import 'flag-icons/css/flag-icons.min.css';

const props = defineProps<{
  country: string;
  size?: string;
}>();

const flagStyle = computed(() => {
  return {
    fontSize: props.size || '1.5em',
    lineHeight: 1,
    verticalAlign: 'middle',
    display: 'inline-block'
  };
});
</script>

<style scoped>
/* Additional styling if needed */
</style>