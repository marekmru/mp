// src/constants/mediaplanStatuses.ts

// Define the available mediaplan statuses
export enum MediaplanStatus {
  IN_PLANNING = 'in_planning',
  DRAFT = 'draft',
  FOR_APPROVAL = 'for_approval',
}

// MEDIAPLAN_STATUSES object structure for backward compatibility with existing code
export const MEDIAPLAN_STATUSES = {
  IN_PLANNING: { value: MediaplanStatus.IN_PLANNING, label: 'In Planning' },
  DRAFT: { value: MediaplanStatus.DRAFT, label: 'Draft' },
  FOR_APPROVAL: { value: MediaplanStatus.FOR_APPROVAL, label: 'For Approval' },
};

// Get array of status values
export const getMediaplanStatusValues = (): string[] => {
  return Object.values(MediaplanStatus);
};

// Get array of status objects with value and label
export const getMediaplanStatusOptions = (): { value: string; label: string }[] => {
  return Object.entries(MEDIAPLAN_STATUSES).map(([_, statusObj]) => ({
    value: statusObj.value,
    label: statusObj.label,
  }));
};

// Get color for a mediaplan status
export const getMediaplanStatusColor = (status?: string): string => {
  if (!status) return 'grey';
  
  const statusColors: Record<string, string> = {
    [MediaplanStatus.IN_PLANNING]: 'blue',
    [MediaplanStatus.DRAFT]: 'grey',
    [MediaplanStatus.FOR_APPROVAL]: 'amber'
  };
  
  return statusColors[status] || 'grey';
};

// Get label for a mediaplan status
export const getMediaplanStatusLabel = (status?: string): string => {
  if (!status) return 'Unknown';
  
  const statusLabels: Record<string, string> = {
    [MediaplanStatus.IN_PLANNING]: 'In Planning',
    [MediaplanStatus.DRAFT]: 'Draft',
    [MediaplanStatus.FOR_APPROVAL]: 'For Approval'
  };
  
  return statusLabels[status] || 'Unknown';
};
