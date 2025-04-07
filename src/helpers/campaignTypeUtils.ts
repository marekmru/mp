// src/helpers/campaignTypeUtils.ts

/**
 * All known campaign types for consistent reference
 */
export const CAMPAIGN_TYPES = [
  'Always On',
  'Product Launch',
  'Seasonal',
  'Promotion',
  'Awareness',
  'Consideration',
  'Conversion',
  'Retention',
  'Special Offer'
];

/**
 * Maps campaign types to color names for consistent UI presentation
 * @param type Campaign type string
 * @returns Vuetify color name
 */
export const getCampaignTypeColor = (type?: string): string => {
  if (!type) return 'grey';
  
  switch (type.toLowerCase()) {
    case 'always on':
      return 'success';
    case 'product launch':
      return 'primary';
    case 'seasonal':
      return 'purple';
    case 'promotion':
      return 'orange';
    case 'awareness':
      return 'blue';
    case 'consideration':
      return 'indigo';
    case 'conversion':
      return 'deep-purple';
    case 'retention':
      return 'teal';
    case 'special offer':
      return 'amber-darken-2';
    default:
      return 'grey';
  }
};

/**
 * Gets the display text for a campaign type (for normalization)
 * @param type Campaign type string
 * @returns Formatted display text
 */
export const getCampaignTypeDisplayText = (type?: string): string => {
  if (!type) return '';
  
  const typeMap: Record<string, string> = {
    'always on': 'Always On',
    'always-on': 'Always On',
    'product launch': 'Product Launch',
    'product-launch': 'Product Launch',
    'seasonal': 'Seasonal',
    'promotion': 'Promotion',
    'awareness': 'Awareness',
    'consideration': 'Consideration',
    'conversion': 'Conversion',
    'retention': 'Retention',
    'special offer': 'Special Offer',
    'special-offer': 'Special Offer'
  };
  
  return typeMap[type.toLowerCase()] || type;
};

/**
 * Maps campaign types to icon names for consistent UI presentation
 * @param type Campaign type string
 * @returns Material Design Icon name
 */
export const getCampaignTypeIcon = (type?: string): string => {
  if (!type) return 'mdi-help-circle-outline';
  
  switch (type.toLowerCase()) {
    case 'always on':
      return 'mdi-refresh';
    case 'product launch':
      return 'mdi-rocket-launch-outline';
    case 'seasonal':
      return 'mdi-weather-sunny';
    case 'promotion':
      return 'mdi-tag-outline';
    case 'awareness':
      return 'mdi-eye-outline';
    case 'consideration':
      return 'mdi-lightbulb-outline';
    case 'conversion':
      return 'mdi-basket-outline';
    case 'retention':
      return 'mdi-heart-outline';
    case 'special offer':
      return 'mdi-gift-outline';
    default:
      return 'mdi-help-circle-outline';
  }
};