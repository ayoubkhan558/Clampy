/**
 * Clipboard utilities for copying text to clipboard
 */

/**
 * Copy text to clipboard with fallback for older browsers
 * @param {string} text - Text to copy
 * @param {string} type - Type of content being copied (for logging)
 * @param {Function} onSuccess - Callback function to execute on successful copy
 * @param {Function} onError - Callback function to execute on copy failure
 * @returns {Promise<void>}
 */
export const copyToClipboard = async (text, type = 'Text', onSuccess, onError) => {
  try {
    await navigator.clipboard.writeText(text);
    console.log(`${type} copied to clipboard`);
    if (onSuccess) onSuccess();
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    // Fallback for older browsers
    try {
      fallbackCopyToClipboard(text);
      if (onSuccess) onSuccess();
    } catch (fallbackErr) {
      console.error('Fallback copy also failed:', fallbackErr);
      if (onError) onError();
    }
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
  
  const successful = document.execCommand('copy');
  document.body.removeChild(textArea);
  
  if (!successful) {
    throw new Error('Fallback copy method failed');
  }
  
  console.log('Text copied using fallback method');
};
