<template>
  <span :class="`fi fi-${country.toLowerCase()}`" :style="flagStyle"></span>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import 'flag-icons/css/flag-icons.min.css';

const props = defineProps<{
  country: string;
  size?: string;
}>();

const flagStyle = computed(() => {
  return {
    fontSize: props.size || '1rem',
    lineHeight: 1,
    verticalAlign: 'middle',
    display: 'inline-block'
  };
});
</script>

<style scoped>


span[class^="fi"] {

}

</style>