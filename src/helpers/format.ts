/**
 * Performs the core percentage calculation with validation.
 * Checks for valid finite number inputs and handles division by zero.
 * Returns NaN if inputs are invalid or division by zero occurs (except potentially 0/0).
 * Useful when needing the raw calculation result with built-in safety checks.
 *
 * @param {number} used - The amount used.
 * @param {number} total - The total amount.
 * @returns {number} The raw calculated percentage, or NaN if the operation is invalid.
 */
export const calculateRawPercentage = (used, total) => {
    // 1. Input validation: Check if inputs are valid, finite numbers
    if (typeof used !== 'number' || typeof total !== 'number' || !isFinite(used) || !isFinite(total)) {
        console.error("calculateRawPercentage: Invalid input. 'used' and 'total' must be finite numbers.", { used, total });
        return NaN;
    }

    // 2. Handle division by zero
    if (total === 0) {
        // Mathematically, x/0 is undefined/infinite, 0/0 is indeterminate.
        // Return NaN for both cases during raw calculation.
        // Formatting function can later interpret 0/0 specifically if needed.
        if (used !== 0) {
            console.warn("calculateRawPercentage: Division by zero (used != 0).", { used, total });
        }
        return NaN;
    }

    // 3. Calculate percentage
    const percentage = (used / total) * 100;

    // 4. Ensure finite result
    return isFinite(percentage) ? percentage : NaN;
};

/**
 * Calculates the raw percentage value.
 * Provides the same result as calculateRawPercentage. Can be used interchangeably.
 * Returns NaN if inputs are invalid or division by zero occurs.
 *
 * @param {number} used - The amount used.
 * @param {number} total - The total amount.
 * @returns {number} The raw percentage number, or NaN on error/invalid operation.
 */
export const percentage = (used, total) => {
    // This function now directly uses the exported raw calculation function.
    return calculateRawPercentage(used, total);
};

/**
 * Calculates and formats a percentage from used and total values to "xx,yy %".
 * Handles errors gracefully based on the result from calculateRawPercentage.
 *
 * @param {number} used - The amount used.
 * @param {number} total - The total amount.
 * @returns {string} The formatted percentage string "xx,yy %" or an error string ('N/A %' or '0,00 %').
 */
export const formatPercentage = (used, total) => {
    // Use the exported raw calculation function
    const rawPercentage = calculateRawPercentage(used, total);

    // Check if the calculation resulted in NaN
    if (isNaN(rawPercentage)) {
        // Check original inputs specifically for the 0/0 case for special formatting.
        if (typeof used === 'number' && used === 0 && typeof total === 'number' && total === 0) {
            return '0,00 %'; // Display 0/0 as '0,00 %'
        }
        // Otherwise (invalid input, x/0 division), return 'N/A %'
        return 'N/A %';
    }

    // If rawPercentage is a valid number, proceed with formatting:
    const fixedPercentage = rawPercentage.toFixed(2);
    const formattedString = fixedPercentage.replace('.', ',');
    return `${formattedString} %`; // Ensure space before %
};