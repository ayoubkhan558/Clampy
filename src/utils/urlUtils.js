/**
 * URL parameter utilities for sharing and persisting clamp settings
 */

import { VALIDATION_RANGES } from './constants';

/**
 * Validate and clamp a numeric value within a range
 * @param {*} value - Value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @param {number} defaultValue - Default value if invalid
 * @returns {number} Validated and clamped value
 */
const validateNumber = (value, min, max, defaultValue) => {
  const num = parseFloat(value);
  if (isNaN(num) || num < min || num > max) {
    return defaultValue;
  }
  return num;
};

/**
 * Get form data from URL parameters with validation
 * @returns {Object} Form data extracted from URL
 */
export const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);

  const outputUnit = params.get('unit');
  const validUnit = (outputUnit === 'px' || outputUnit === 'rem') ? outputUnit : 'px';

  return {
    outputUnit: validUnit,
    rootFontSize: validateNumber(
      params.get('root'),
      VALIDATION_RANGES.rootFontSize.min,
      VALIDATION_RANGES.rootFontSize.max,
      16
    ),
    minSize: validateNumber(
      params.get('min'),
      VALIDATION_RANGES.minSize.min,
      VALIDATION_RANGES.minSize.max,
      16
    ),
    maxSize: validateNumber(
      params.get('max'),
      VALIDATION_RANGES.maxSize.min,
      VALIDATION_RANGES.maxSize.max,
      32
    ),
    minScreenWidth: validateNumber(
      params.get('minScreen'),
      VALIDATION_RANGES.minScreenWidth.min,
      VALIDATION_RANGES.minScreenWidth.max,
      420
    ),
    maxScreenWidth: validateNumber(
      params.get('maxScreen'),
      VALIDATION_RANGES.maxScreenWidth.min,
      VALIDATION_RANGES.maxScreenWidth.max,
      1440
    ),
    generateCustomProperties: params.get('customProps') === 'true',
    customPropertyName: params.get('propName') || 'font-size',
    includeFallback: params.get('fallback') === 'true',
    useContainerQueries: params.get('container') === 'true'
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
  params.set('customProps', formData.generateCustomProperties.toString());
  params.set('propName', formData.customPropertyName);
  params.set('fallback', formData.includeFallback.toString());
  params.set('container', formData.useContainerQueries.toString());

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
  params.set('customProps', formData.generateCustomProperties.toString());
  params.set('propName', formData.customPropertyName);
  params.set('fallback', formData.includeFallback.toString());
  params.set('container', formData.useContainerQueries.toString());

  return `${currentUrl}?${params.toString()}`;
};
