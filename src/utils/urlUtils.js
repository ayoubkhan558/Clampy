/**
 * URL parameter utilities for sharing and persisting clamp settings
 */

/**
 * Get form data from URL parameters
 * @returns {Object} Form data extracted from URL
 */
export const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    outputUnit: params.get('unit') || 'px',
    rootFontSize: parseFloat(params.get('root')) || 16,
    minSize: parseFloat(params.get('min')) || 16,
    maxSize: parseFloat(params.get('max')) || 32,
    minScreenWidth: parseFloat(params.get('minScreen')) || 320,
    maxScreenWidth: parseFloat(params.get('maxScreen')) || 1200
  };
};

/**
 * Update URL parameters with current form data
 * @param {Object} formData - Current form data
 */
export const updateUrlParams = (formData) => {
  const params = new URLSearchParams();
  params.set('unit', formData.outputUnit);
  params.set('root', formData.rootFontSize.toString());
  params.set('min', formData.minSize.toString());
  params.set('max', formData.maxSize.toString());
  params.set('minScreen', formData.minScreenWidth.toString());
  params.set('maxScreen', formData.maxScreenWidth.toString());
  
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
};

/**
 * Generate shareable URL with current settings
 * @param {Object} formData - Current form data
 * @returns {string} Shareable URL
 */
export const generateShareUrl = (formData) => {
  const currentUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  params.set('unit', formData.outputUnit);
  params.set('root', formData.rootFontSize.toString());
  params.set('min', formData.minSize.toString());
  params.set('max', formData.maxSize.toString());
  params.set('minScreen', formData.minScreenWidth.toString());
  params.set('maxScreen', formData.maxScreenWidth.toString());
  
  return `${currentUrl}?${params.toString()}`;
};
