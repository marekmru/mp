<template>
  <v-snackbar
    v-model="notification.show"
    :color="notification.type"
    :timeout="notification.timeout"
    class="notification-snackbar"
  >
    <div class="d-flex align-center">
      <v-icon :icon="getIconForType(notification.type)" class="mr-3" />
      <span>{{ notification.text }}</span>
    </div>
    <template v-slot:actions v-if="notification.closable">
      <v-btn
        icon
        variant="text"
        @click="closeNotification"
        size="small"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { notification, closeNotification, NotificationType } from '@/helpers/notificationUtils';

/**
 * Gets the appropriate icon for the notification type
 * @param type Notification type
 * @returns Material Design Icon name
 */
const getIconForType = (type: NotificationType): string => {
  switch (type) {
    case NotificationType.SUCCESS:
      return 'mdi-check-circle';
    case NotificationType.ERROR:
      return 'mdi-alert-circle';
    case NotificationType.WARNING:
      return 'mdi-alert';
    case NotificationType.INFO:
    default:
      return 'mdi-information';
  }
};
</script>

<style scoped>
.notification-snackbar {
  z-index: 9999;
}
</style>
