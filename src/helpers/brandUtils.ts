// src/helpers/brandUtils.ts

import type { Brand, EntityReference } from '@/types/mediaplan';

// Map of known brand IDs to their logos
// This could be expanded to include all brands or loaded from a config
const BRAND_LOGOS: Record<string, string> = {
  'brand-123': '/img/brands/BMW.svg',
  'brand-124': '/img/brands/MINI.svg',
  'brand-125': '/img/brands/RollsRoyce.svg',
};

// Map of brand IDs to their colors
const BRAND_COLORS: Record<string, string> = {
  'brand-123': '#0066B1', // BMW Blue
  'brand-124': '#000000', // MINI Black
  'brand-125': '#4F2724', // Rolls-Royce Burgundy
};

/**
 * Gets the logo URL for a brand
 * @param brand Brand object or ID
 * @param options Options for logo retrieval
 * @returns URL to the brand logo
 */
export const getBrandLogo = (
  brand?: Brand | EntityReference | string | null,
  options: {
    fallback?: string;
    defaultPath?: string;
  } = {}
): string => {
  const { fallback = '', defaultPath = '/img/brands/' } = options;

  if (!brand) return fallback;

  // Handle different brand input types
  const brandId = typeof brand === 'string' ? brand : brand._id;

  // Check for predefined logo
  if (BRAND_LOGOS[brandId]) {
    return BRAND_LOGOS[brandId];
  }

  // Try to construct a dynamic path based on brand name
  if (typeof brand !== 'string' && brand.name) {
    // Remove spaces and special characters for filename
    const filename = brand.name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
    return `${defaultPath}${filename}.svg`;
  }

  return fallback;
};

/**
 * Gets the brand color for a specific brand
 * @param brand Brand object or ID
 * @param options Options for color retrieval
 * @returns Color value (hex, rgb, etc.)
 */
export const getBrandColor = (
  brand?: Brand | EntityReference | string | null,
  options: {
    fallback?: string;
  } = {}
): string => {
  const { fallback = '#9e9e9e' } = options;

  if (!brand) return fallback;

  // Handle different brand input types
  const brandId = typeof brand === 'string' ? brand : brand._id;

  return BRAND_COLORS[brandId] || fallback;
};

/**
 * Gets initials from a brand name
 * @param brand Brand object or name
 * @param options Options for generating initials
 * @returns Initials string
 */
export const getBrandInitials = (
  brand?: Brand | EntityReference | string | null,
  options: {
    maxLength?: number;
    fallback?: string;
  } = {}
): string => {
  const { maxLength = 2, fallback = '?' } = options;

  if (!brand) return fallback;

  // Get brand name
  const brandName =
    typeof brand === 'string' ? brand : brand.name || fallback;

  if (!brandName || brandName === fallback) return fallback;

  // Extract initials from brand name
  // Split by words and get first letter of each word
  const initials = brandName
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, maxLength);

  return initials || fallback;
};

/**
 * Check if a brand object has a valid logo
 * @param brand Brand object
 * @returns boolean indicating if the brand has a valid logo
 */
export const hasBrandLogo = (brand?: Brand | EntityReference | null): boolean => {
  if (!brand) return false;

  // Check if logo is directly available in the brand object
  if ('logo' in brand && brand.logo) {
    return true;
  }

  // Check if we have a predefined logo for this brand ID
  return !!BRAND_LOGOS[brand._id];
};

/**
 * Gets a list of all registered brand colors
 * @returns Record of brand IDs to their colors
 */
export const getAllBrandColors = (): Record<string, string> => {
  return { ...BRAND_COLORS };
};

/**
 * Formats a brand display text (e.g., for dropdowns or lists)
 * @param brand Brand object
 * @param options Formatting options
 * @returns Formatted brand name
 */
export const formatBrandDisplayText = (
  brand?: Brand | EntityReference | null,
  options: {
    showId?: boolean;
    fallback?: string;
  } = {}
): string => {
  const { showId = false, fallback = 'Unknown Brand' } = options;

  if (!brand) return fallback;

  if (showId) {
    return `${brand.name} (${brand._id})`;
  }

  return brand.name || fallback;
};