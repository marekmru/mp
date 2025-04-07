// src/helpers/currencyUtils.ts

/**
 * Available currency codes for the application
 */
export enum CurrencyCode {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
  CHF = 'CHF',
}

/**
 * Currency formatting options
 */
export interface CurrencyFormatOptions {
  /** Currency code (EUR, USD, GBP, etc.) */
  currency?: CurrencyCode | string;
  /** The locale to use for formatting */
  locale?: string;
  /** Show a plus sign for positive amounts */
  showPlus?: boolean;
  /** Text to display if the amount is undefined or null */
  fallback?: string;
  /** Whether to include the currency symbol */
  showSymbol?: boolean;
  /** Minimum number of fraction digits (decimal places) */
  minimumFractionDigits?: number;
  /** Maximum number of fraction digits (decimal places) */
  maximumFractionDigits?: number;
  /** Compact display for large numbers (e.g., 1K, 1M) */
  compact?: boolean;
}

/**
 * Formats a number as currency
 * @param amount The amount to format
 * @param options Formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount?: number | null,
  options: CurrencyFormatOptions = {}
): string => {
  const {
    currency = CurrencyCode.EUR,
    locale = 'en-US',
    showPlus = false,
    fallback = 'N/A',
    showSymbol = true,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    compact = false,
  } = options;

  // Handle null or undefined values
  if (amount === undefined || amount === null) {
    return fallback;
  }

  try {
    // Format options for Intl.NumberFormat
    const formatOptions: Intl.NumberFormatOptions = {
      minimumFractionDigits,
      maximumFractionDigits,
    };

    // Add currency symbol if requested
    if (showSymbol) {
      formatOptions.style = 'currency';
      formatOptions.currency = currency;
    }

    // Use compact notation for large numbers if requested
    if (compact) {
      formatOptions.notation = 'compact';
      formatOptions.compactDisplay = 'short';
    }

    // Format the number
    const formatter = new Intl.NumberFormat(locale, formatOptions);
    let formatted = formatter.format(amount);

    // Add plus sign if requested and amount is positive
    if (showPlus && amount > 0) {
      // If the first character is a currency symbol, insert + after it
      // Otherwise, prepend +
      if (showSymbol) {
        const currencySymbol = formatted.charAt(0);
        formatted = currencySymbol + '+' + formatted.substring(1);
      } else {
        formatted = '+' + formatted;
      }
    }

    return formatted;
  } catch (e) {
    console.error('Error formatting currency:', e);
    return `${amount} ${currency}`;
  }
};

/**
 * Parses a currency string to a number
 * @param currencyStr The currency string to parse
 * @param options Parsing options
 * @returns Parsed number or null if invalid
 */
export const parseCurrency = (
  currencyStr: string,
  options: {
    locale?: string;
    fallback?: null | number;
  } = {}
): number | null => {
  const { locale = 'en-US', fallback = null } = options;

  if (!currencyStr) return fallback;

  try {
    // Remove currency symbols, spaces, and thousand separators
    const cleanedStr = currencyStr
      .replace(/[^\d.,\-+]/g, '') // Remove anything that's not a digit, dot, comma, minus or plus
      .replace(/,/g, '.') // Replace commas with dots for consistent parsing
      .replace(/(.*)(\.\d+)$/g, '$1$2'); // Keep only the last decimal point

    return parseFloat(cleanedStr) || fallback;
  } catch (e) {
    console.error('Error parsing currency:', e);
    return fallback;
  }
};

/**
 * Calculates the percentage of a value relative to a total
 * @param value The value
 * @param total The total
 * @param options Calculation options
 * @returns Percentage as a number, or fallback if invalid
 */
export const calculatePercentage = (
  value?: number | null,
  total?: number | null,
  options: {
    roundTo?: number;
    fallback?: number | null;
  } = {}
): number | null => {
  const { roundTo = 0, fallback = null } = options;

  if (
    value === undefined ||
    value === null ||
    total === undefined ||
    total === null ||
    total === 0
  ) {
    return fallback;
  }

  try {
    const percentage = (value / total) * 100;
    
    if (roundTo === 0) {
      return Math.round(percentage);
    } else {
      const factor = Math.pow(10, roundTo);
      return Math.round(percentage * factor) / factor;
    }
  } catch (e) {
    console.error('Error calculating percentage:', e);
    return fallback;
  }
};

/**
 * Formats a number as a percentage
 * @param value The percentage value (e.g., 42 for 42%)
 * @param options Formatting options
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value?: number | null,
  options: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    fallback?: string;
  } = {}
): string => {
  const {
    locale = 'en-US',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    fallback = 'N/A',
  } = options;

  if (value === undefined || value === null) {
    return fallback;
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value / 100);
  } catch (e) {
    console.error('Error formatting percentage:', e);
    return `${value}%`;
  }
};

/**
 * Formats the remaining budget
 * @param budget Budget object with total, used, and available properties
 * @param options Formatting options
 * @returns Formatted budget string
 */
export const formatBudgetRemaining = (
  budget: { total?: number; used?: number; available?: number } | undefined,
  options: CurrencyFormatOptions = {}
): string => {
  if (!budget) return options.fallback || 'N/A';

  // If available is directly provided, use it
  if (budget.available !== undefined && budget.available !== null) {
    return formatCurrency(budget.available, options);
  }

  // Otherwise calculate from total and used
  if (
    budget.total !== undefined &&
    budget.total !== null &&
    budget.used !== undefined &&
    budget.used !== null
  ) {
    const available = budget.total - budget.used;
    return formatCurrency(available, options);
  }

  return options.fallback || 'N/A';
};

/**
 * Gets a color representing budget usage (for progress bars, etc.)
 * @param budget Budget object or percentage
 * @returns Color code suitable for Vuetify (success, warning, error, etc.)
 */
export const getBudgetStatusColor = (
  budget: { total?: number; used?: number } | number
): string => {
  let percentage: number;

  if (typeof budget === 'number') {
    percentage = budget;
  } else if (
    budget &&
    budget.total !== undefined &&
    budget.total > 0 &&
    budget.used !== undefined
  ) {
    percentage = (budget.used / budget.total) * 100;
  } else {
    return 'grey';
  }

  if (percentage < 50) {
    return 'success';
  } else if (percentage < 75) {
    return 'info';
  } else if (percentage < 90) {
    return 'warning';
  } else {
    return 'error';
  }
};