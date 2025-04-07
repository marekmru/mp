// src/helpers/notificationUtils.ts

import { reactive } from 'vue';

/**
 * Notification types for consistent styling
 */
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * Interface for notification data
 */
export interface Notification {
  show: boolean;
  text: string;
  type: NotificationType;
  timeout?: number;
  closable?: boolean;
}

// Create a shared notification state
export const notification = reactive<Notification>({
  show: false,
  text: '',
  type: NotificationType.INFO,
  timeout: 5000,
  closable: true,
});

/**
 * Show a success notification
 * @param message The message to display
 * @param options Optional configuration
 */
export const showSuccess = (
  message: string,
  options: {
    timeout?: number;
    closable?: boolean;
  } = {}
): void => {
  notification.text = message;
  notification.type = NotificationType.SUCCESS;
  notification.timeout = options.timeout ?? 5000;
  notification.closable = options.closable ?? true;
  notification.show = true;
};

/**
 * Show an error notification
 * @param message The message to display
 * @param options Optional configuration
 */
export const showError = (
  message: string,
  options: {
    timeout?: number;
    closable?: boolean;
  } = {}
): void => {
  notification.text = message;
  notification.type = NotificationType.ERROR;
  notification.timeout = options.timeout ?? 8000; // Longer timeout for errors
  notification.closable = options.closable ?? true;
  notification.show = true;
};

/**
 * Show a warning notification
 * @param message The message to display
 * @param options Optional configuration
 */
export const showWarning = (
  message: string,
  options: {
    timeout?: number;
    closable?: boolean;
  } = {}
): void => {
  notification.text = message;
  notification.type = NotificationType.WARNING;
  notification.timeout = options.timeout ?? 6000;
  notification.closable = options.closable ?? true;
  notification.show = true;
};

/**
 * Show an info notification
 * @param message The message to display
 * @param options Optional configuration
 */
export const showInfo = (
  message: string,
  options: {
    timeout?: number;
    closable?: boolean;
  } = {}
): void => {
  notification.text = message;
  notification.type = NotificationType.INFO;
  notification.timeout = options.timeout ?? 5000;
  notification.closable = options.closable ?? true;
  notification.show = true;
};

/**
 * Close the current notification
 */
export const closeNotification = (): void => {
  notification.show = false;
};
