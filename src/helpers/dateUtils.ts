// src/helpers/dateUtils.ts

/**
 * Formats a date string to a readable format
 */
export const formatDate = (dateString?: string, format: string = 'DD.MM.YYYY'): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return format === 'DD.MM.YYYY' ?
        `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}` :
        new Intl.DateTimeFormat('en-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date);
};

/**
 * Formats a date range to a readable format
 */
export const formatDateRange = (startDate?: string, endDate?: string, format: string = 'DD.MM.YYYY'): string => {
    if (!startDate || !endDate) return '';

    const startFormatted = formatDate(startDate, format);
    const endFormatted = formatDate(endDate, format);

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