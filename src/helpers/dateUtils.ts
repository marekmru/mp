// src/helpers/dateUtils.ts

/**
 * Formats a date string to a readable format
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

/**
 * Formats a date range to a readable format
 */
export const formatDateRange = (startDate?: string, endDate?: string): string => {
  if (!startDate || !endDate) return '';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startFormatted = formatDate(startDate);
  const endFormatted = formatDate(endDate);
  
  return `${startFormatted} - ${endFormatted}`;
};

/**
 * Formats a date to DD.MM-DD.MM.YYYY format (used for campaign durations)
 */
export const formatCampaignDuration = (startDate?: string, endDate?: string): string => {
  if (!startDate || !endDate) return '';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startDay = String(start.getDate()).padStart(2, '0');
  const startMonth = String(start.getMonth() + 1).padStart(2, '0');
  const endDay = String(end.getDate()).padStart(2, '0');
  const endMonth = String(end.getMonth() + 1).padStart(2, '0');
  const year = end.getFullYear();
  
  return `${startDay}.${startMonth}-${endDay}.${endMonth}.${year}`;
};
