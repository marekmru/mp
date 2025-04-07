// src/helpers/dateUtils.ts

/**
 * Formats a date string to the specified format
 * @param dateStr String representation of date
 * @param format Format string (DD = day, MM = month, YYYY = year)
 * @param options Additional formatting options
 * @returns Formatted date string
 */
export const formatDate = (
  dateStr: string | Date, 
  format: string = 'DD.MM.YYYY',
  options: {
    locale?: string,
    fallback?: string
  } = {}
): string => {
  const { locale = 'default', fallback = 'Invalid date' } = options;
  
  if (!dateStr) return fallback;
  
  try {
    const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return fallback;
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const monthShort = date.toLocaleString(locale, { month: 'short' });
    
    let result = format;
    result = result.replace('DD', day);
    result = result.replace('MM', month);
    result = result.replace('MMM', monthShort);
    result = result.replace('YYYY', year.toString());
    
    return result;
  } catch (e) {
    console.error('Error formatting date:', e);
    return fallback;
  }
};

/**
 * Formats a date range between two dates
 * @param startDate Start date string
 * @param endDate End date string
 * @param options Formatting options
 * @returns Formatted date range string
 */
export const formatDateRange = (
  startDate: string | Date,
  endDate: string | Date,
  options: {
    format?: string,
    separator?: string,
    locale?: string,
    fallback?: string
  } = {}
): string => {
  const { 
    format = 'DD MMM. YYYY', 
    separator = ' - ',
    locale = 'default',
    fallback = 'Invalid date range'
  } = options;
  
  if (!startDate || !endDate) return fallback;
  
  try {
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);
    
    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return fallback;
    }
    
    const formattedStart = formatDate(start, format, { locale });
    const formattedEnd = formatDate(end, format, { locale });
    
    return `${formattedStart}${separator}${formattedEnd}`;
  } catch (e) {
    console.error('Error formatting date range:', e);
    return fallback;
  }
};

/**
 * Converts a string to a Date object
 * @param dateStr Date string to parse
 * @param options Parsing options
 * @returns Date object or null if invalid
 */
export const parseDate = (
  dateStr: string,
  options: {
    format?: string
  } = {}
): Date | null => {
  if (!dateStr) return null;
  
  try {
    // For now, simple parsing. If needed, add custom format parsing logic
    const date = new Date(dateStr);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return null;
    }
    
    return date;
  } catch (e) {
    console.error('Error parsing date:', e);
    return null;
  }
};

/**
 * Gets the difference between two dates in days
 * @param startDate Start date
 * @param endDate End date
 * @returns Number of days between dates or null if invalid
 */
export const getDaysDifference = (
  startDate: string | Date,
  endDate: string | Date
): number | null => {
  try {
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);
    
    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return null;
    }
    
    // Convert to days and round
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (e) {
    console.error('Error calculating date difference:', e);
    return null;
  }
};

/**
 * Checks if a date is in the past
 * @param dateStr Date to check
 * @returns Boolean indicating if date is in the past
 */
export const isPastDate = (dateStr: string | Date): boolean => {
  try {
    const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
    const now = new Date();
    
    // Set time to start of day for both dates
    date.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    
    return date < now;
  } catch (e) {
    console.error('Error checking if date is in the past:', e);
    return false;
  }
};

/**
 * Formats a date relative to the current date (today, yesterday, etc.)
 * @param dateStr Date to format
 * @param options Formatting options
 * @returns Relative date string
 */
export const formatRelativeDate = (
  dateStr: string | Date,
  options: {
    fallbackFormat?: string,
    locale?: string
  } = {}
): string => {
  const { fallbackFormat = 'DD MMM. YYYY', locale = 'default' } = options;
  
  try {
    const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
    const now = new Date();
    
    // Set time to start of day for comparison
    const dateDay = new Date(date);
    dateDay.setHours(0, 0, 0, 0);
    
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (dateDay.getTime() === today.getTime()) {
      return 'Today';
    } else if (dateDay.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else if (dateDay.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    }
    
    // Otherwise, use standard formatting
    return formatDate(date, fallbackFormat, { locale });
  } catch (e) {
    console.error('Error formatting relative date:', e);
    return formatDate(dateStr, fallbackFormat, { locale });
  }
};