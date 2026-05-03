/**
 * Clipboard utilities for copying text to clipboard
 */

/**
 * Copy text to clipboard with fallback for older browsers
 * @param {string} text - Text to copy
 * @param {string} type - Type of content being copied (for logging)
 * @returns {Promise<void>}
 */
export const copyToClipboard = async (text, type = 'Text') => {
  try {
    await navigator.clipboard.writeText(text);
    console.log(`${type} copied to clipboard`);
    // You could add a toast notification here
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    // Fallback for older browsers
    return fallbackCopyToClipboard(text);
  }
};

/**
 * Fallback copy method for older browsers
 * @param {string} text - Text to copy
 */
const fallbackCopyToClipboard = (text) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const copied = document.execCommand('copy');
    if (!copied) {
      throw new Error('Copy command rejected');
    }
    console.log('Text copied using fallback method');
    return true;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    return false;
  } finally {
    document.body.removeChild(textArea);
  }
};
