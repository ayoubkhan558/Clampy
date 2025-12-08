/**
 * Generate unique IDs for breakpoints
 */

/**
 * Generate a unique ID using crypto.randomUUID() with fallback
 * @returns {string} Unique ID
 */
export const generateUniqueId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for older browsers
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
