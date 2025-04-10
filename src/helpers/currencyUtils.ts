// src/helpers/currencyUtils.ts

/**
 * Formats a number as currency
 */
export const formatCurrency = (value?: number): string => {
  if (value === undefined || value === null) return '€0';
  
  return new Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Calculates percentage
 */
export const calculatePercentage = (used?: number, total?: number): number => {
  if (!used || !total || total === 0) return 0;
  return Math.round((used / total) * 100);
};

/**
 * Gets color for budget status based on usage percentage
 */
export const getBudgetStatusColor = (budget?: { used?: number, total?: number }): string => {
  if (!budget || !budget.used || !budget.total || budget.total === 0) return 'success';
  
  const percentage = calculatePercentage(budget.used, budget.total);
  
  if (percentage < 70) return 'success';
  if (percentage < 90) return 'warning';
  return 'error';
};
