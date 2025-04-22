<template>
  <v-card-actions class="pt-8 px-0 d-flex justify-end">
    <v-btn
        size="large"
        min-width="120"
        variant="outlined"
        @click="$emit('cancel')"
        class="mr-2"
        :disabled="cancelDisabled"
    >
      {{ cancelText }}
    </v-btn>
    <v-btn
        min-width="120"
        size="large"
        color="primary"
        :type="submitButton ? 'submit' : 'button'"
        variant="flat"
        :loading="loading"
        :disabled="disabled"
        @click="submitButton ? null : $emit('confirm')"
    >
      {{ confirmText }}
    </v-btn>
  </v-card-actions>
</template>

<script setup lang="ts">
interface Props {
  /**
   * Text for cancel button
   * @default "Cancel"
   */
  cancelText?: string;

  /**
   * Text for confirm button
   * @default "Next Step"
   */
  confirmText?: string;

  /**
   * Whether confirm button is in loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Whether confirm button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether cancel button is disabled
   * @default false
   */
  cancelDisabled?: boolean;

  /**
   * Whether confirm button should be a submit button
   * @default true
   */
  submitButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  cancelText: "Cancel",
  confirmText: "Next Step",
  loading: false,
  disabled: false,
  cancelDisabled: false,
  submitButton: true
});

defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm'): void;
}>();
</script>