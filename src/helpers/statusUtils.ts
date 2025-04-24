// src/helpers/statusUtils.ts

/**
 * Maps mediaplan statuses to color names for consistent UI presentation
 * @param status Mediaplan status string
 * @returns Vuetify color name
 */
export const getMediaplanStatusColor = (status?: string): string => {
  if (!status) return 'grey';
  
  switch (status.toLowerCase()) {
    case 'draft':
      return 'info';
    case 'in_planning':
    case 'in planning':
      return 'warning';
    case 'for_approval':
    case 'for approval':
      return 'success';
    case 'approved':
      return 'success-darken-2';
    case 'rejected':
      return 'error';
    case 'cancelled':
      return 'grey';
    case 'completed':
      return 'purple';
    default:
      return 'grey';
  }
};

/**
 * Gets the display text for a mediaplan status (for normalization)
 * @param status Mediaplan status string
 * @returns Formatted display text
 */
export const getMediaplanStatusDisplayText = (status?: string): string => {
  if (!status) return '';
  
  const statusMap: Record<string, string> = {
    'draft': 'Draft',
    'in_planning': 'In Planning',
    'in planning': 'In Planning',
    'for_approval': 'For Approval',
    'for approval': 'For Approval',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'cancelled': 'Cancelled',
    'completed': 'Completed'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

/**
 * Maps mediaplan statuses to icon names for consistent UI presentation
 * @param status Mediaplan status string
 * @returns Material Design Icon name
 */
export const getMediaplanStatusIcon = (status?: string): string => {
  if (!status) return 'mdi-help-circle-outline';
  
  switch (status.toLowerCase()) {
    case 'draft':
      return 'mdi-pencil-outline-outline';
    case 'in_planning':
    case 'in planning':
      return 'mdi-clock-outline';
    case 'for_approval':
    case 'for approval':
      return 'mdi-thumb-up-down-outline';
    case 'approved':
      return 'mdi-check-circle-outline';
    case 'rejected':
      return 'mdi-close-circle-outline';
    case 'cancelled':
      return 'mdi-cancel';
    case 'completed':
      return 'mdi-flag-checkered';
    default:
      return 'mdi-help-circle-outline';
  }
};

// Export a complete set of all known mediaplan statuses
export const MEDIAPLAN_STATUSES = [
  'Draft',
  'In Planning',
  'For Approval',
  'Approved',
  'Rejected',
  'Cancelled',
  'Completed'
];
