// src/helpers/campaignTypeUtils.ts

/**
 * Returns a color for a campaign type
 */
export const getCampaignTypeColor = (type?: string): string => {
  if (!type) return 'grey';
  
  const typeColors: Record<string, string> = {
    'Always On': 'primary',
    'Product Launch': 'success',
    'Seasonal': 'info',
    'Promotion': 'warning',
    'Event': 'purple',
    'Brand': 'orange'
  };
  
  return typeColors[type] || 'grey';
};

/**
 * Returns a label for a campaign type
 */
export const getCampaignTypeLabel = (type?: string): string => {
  if (!type) return 'Unknown';
  return type;
};

/**
 * Returns an icon for a campaign type
 */
export const getCampaignTypeIcon = (type?: string): string => {
  if (!type) return 'mdi-help-circle-outline';
  
  const typeIcons: Record<string, string> = {
    'Always On': 'mdi-sync',
    'Product Launch': 'mdi-rocket-launch',
    'Seasonal': 'mdi-calendar-month',
    'Promotion': 'mdi-tag',
    'Event': 'mdi-calendar-star',
    'Brand': 'mdi-badge-account'
  };
  
  return typeIcons[type] || 'mdi-help-circle-outline';
};
