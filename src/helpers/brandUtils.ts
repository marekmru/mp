// src/helpers/brandUtils.ts

import type { Brand, EntityReference } from '@/types/mediaplan';

/**
 * Determines if a brand has a logo
 */
export const hasBrandLogo = (brand?: Brand | EntityReference): boolean => {
  if (!brand) return false;
  
  // Check if it's a Brand with logo property
  if ('logo' in brand) {
    return !!brand.logo;
  }
  
  // Default logos for known brands
  const knownBrands = ['BMW', 'MINI'];
  return knownBrands.includes(brand.name);
};

/**
 * Gets the brand logo URL
 */
export const getBrandLogo = (brand?: Brand | EntityReference): string => {
  if (!brand) return '/brands/default.png';
  
  // If it's a Brand with logo property
  if ('logo' in brand && brand.logo) {
    return brand.logo;
  }
  
  // Default logos for known brands
  const brandLogos: Record<string, string> = {
    'BMW': '/brands/bmw.png',
    'MINI': '/brands/mini.png'
  };
  
  return brandLogos[brand.name] || '/brands/default.png';
};
/**
 * Gets brand initials for brands without logos
 */
export const getBrandInitials = (brand?: Brand | EntityReference): string => {
  if (!brand || !brand.name) return '?';
  
  const words = brand.name.split(' ');
  
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  
  return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
};
