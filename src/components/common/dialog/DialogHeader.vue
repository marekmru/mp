<template>
  <v-card-title :class="['px-0', marginClass]">
    <div class="d-flex align-center w-100">
      <v-icon
          v-if="showBackButton"
          size="small"
          @click="$emit('back')"
          class="mr-2"
          :color="backIconColor"
      >
        mdi-arrow-left
      </v-icon>
      <span :class="titleClass">{{ title }}</span>
      <v-spacer></v-spacer>
      <v-icon
          v-if="showCloseButton"
          size="small"
          :color="closeIconColor"
          @click="$emit('close')"
      >
        mdi-close
      </v-icon>
    </div>
  </v-card-title>
</template>

<script setup lang="ts">
import {computed} from 'vue';

interface Props {
  /**
   * The title to display in the header
   */
  title: string;

  /**
   * Whether to show the back button
   * @default true
   */
  showBackButton?: boolean;

  /**
   * Whether to show the close button
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * The margin bottom to apply
   * @default 6
   */
  marginBottom?: number | string;

  /**
   * Color for the back icon
   * @default undefined
   */
  backIconColor?: string;

  /**
   * Color for the close icon
   * @default undefined
   */
  closeIconColor?: string;

  /**
   * CSS class for the title
   * @default 'text-h5'
   */
  titleClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: true,
  showCloseButton: true,
  marginBottom: 6,
  backIconColor: 'primary',
  closeIconColor: 'primary',
  titleClass: 'text-h6'
});

/**
 * Emitted when the back button is clicked
 */
/**
 * Emitted when the close button is clicked
 */
const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'close'): void;
}>();

// Computed property for dynamic margin class
const marginClass = computed(() => {
  return `mb-${props.marginBottom}`;
});
</script>