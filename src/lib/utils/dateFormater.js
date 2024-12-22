// utils/dateFormatter.js

/**
 * Formats a given ISO date string into a friendly format.
 *
 * @param {string} isoDateString - The ISO date string to format (e.g., '2024-12-17T16:02:53.534Z').
 * @returns {string} The formatted date string (e.g., '2024/12/03 at 4:02 pm').
 */
export function formatFriendlyDate(isoDateString) {
    const date = new Date(isoDateString);
  
    // Extract individual components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const isPM = hours >= 12;
  
    // Convert to 12-hour format
    hours = hours % 12 || 12;
  
    // Format the date
    return `${year}/${month}/${day} at ${hours}:${minutes} ${isPM ? 'pm' : 'am'}`;
  }
  