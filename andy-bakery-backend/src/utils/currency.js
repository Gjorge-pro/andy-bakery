/**
 * Currency Formatting Utility for Andy Bakery (Backend)
 * Formats numeric amounts as Tanzanian Shillings (Tsh).
 *
 * Usage:
 *   const { formatCurrency } = require('../utils/currency');
 *   formatCurrency(15000)   → "Tsh 15,000"
 *   formatCurrency(2500.5)  → "Tsh 2,500.5"
 */

/**
 * Format a numeric amount as Tanzanian Shillings.
 * @param {number} amount - The numeric value to format
 * @returns {string} Formatted currency string (e.g. "Tsh 15,000")
 */
function formatCurrency(amount) {
  return `Tsh ${Number(amount).toLocaleString('en-TZ')}`;
}

module.exports = { formatCurrency };
