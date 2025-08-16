import { 
  DEFAULT_FORM_VALUES, 
  DEFAULT_BREAKPOINTS, 
  DEVICE_THRESHOLDS, 
  DEVICE_CATEGORIES, 
  DEVICE_ICONS,
  URL_PARAMS 
} from './constants';

/**
 * Get URL parameters and return form data
 * @returns {Object} Form data from URL parameters or defaults
 */
export const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    outputUnit: params.get(URL_PARAMS.UNIT) || DEFAULT_FORM_VALUES.outputUnit,
    rootFontSize: parseFloat(params.get(URL_PARAMS.ROOT)) || DEFAULT_FORM_VALUES.rootFontSize,
    minSize: parseFloat(params.get(URL_PARAMS.MIN)) || DEFAULT_FORM_VALUES.minSize,
    maxSize: parseFloat(params.get(URL_PARAMS.MAX)) || DEFAULT_FORM_VALUES.maxSize,
    minScreenWidth: parseFloat(params.get(URL_PARAMS.MIN_SCREEN)) || DEFAULT_FORM_VALUES.minScreenWidth,
    maxScreenWidth: parseFloat(params.get(URL_PARAMS.MAX_SCREEN)) || DEFAULT_FORM_VALUES.maxScreenWidth
  };
};

/**
 * Update URL parameters with form data
 * @param {Object} formData - Form data to sync to URL
 */
export const updateUrlParams = (formData) => {
  const params = new URLSearchParams();
  params.set(URL_PARAMS.UNIT, formData.outputUnit);
  params.set(URL_PARAMS.ROOT, formData.rootFontSize.toString());
  params.set(URL_PARAMS.MIN, formData.minSize.toString());
  params.set(URL_PARAMS.MAX, formData.maxSize.toString());
  params.set(URL_PARAMS.MIN_SCREEN, formData.minScreenWidth.toString());
  params.set(URL_PARAMS.MAX_SCREEN, formData.maxScreenWidth.toString());
  
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
};

/**
 * Generate a shareable URL with current form data
 * @param {Object} formData - Current form data
 * @returns {string} Shareable URL
 */
export const generateShareUrl = (formData) => {
  const currentUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  params.set(URL_PARAMS.UNIT, formData.outputUnit);
  params.set(URL_PARAMS.ROOT, formData.rootFontSize.toString());
  params.set(URL_PARAMS.MIN, formData.minSize.toString());
  params.set(URL_PARAMS.MAX, formData.maxSize.toString());
  params.set(URL_PARAMS.MIN_SCREEN, formData.minScreenWidth.toString());
  params.set(URL_PARAMS.MAX_SCREEN, formData.maxScreenWidth.toString());
  
  return `${currentUrl}?${params.toString()}`;
};

/**
 * Clamp calculation utilities
 */

/**
 * Format number for display (remove trailing zeros)
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  return Math.abs(num) < 0.001 ? '0' : num.toFixed(3).replace(/\.?0+$/, '');
};

/**
 * Calculate clamp values and generate outputs
 * @param {Object} data - Form data
 * @param {Array} customBreakpoints - Custom breakpoints
 * @returns {Object} Calculated outputs
 */
export const calculateClamp = (data, customBreakpoints = []) => {
  const {
    outputUnit,
    rootFontSize,
    minSize,
    maxSize,
    minScreenWidth,
    maxScreenWidth
  } = data;

  // Convert to numbers
  const minSizeNum = parseFloat(minSize);
  const maxSizeNum = parseFloat(maxSize);
  const minScreenNum = parseFloat(minScreenWidth);
  const maxScreenNum = parseFloat(maxScreenWidth);
  const rootSizeNum = parseFloat(rootFontSize);

  // Calculate slope and intercept
  const slope = (maxSizeNum - minSizeNum) / (maxScreenNum - minScreenNum);
  const intercept = minSizeNum - (slope * minScreenNum);

  // Convert values based on unit
  const minValue = outputUnit === 'rem' ? minSizeNum / rootSizeNum : minSizeNum;
  const maxValue = outputUnit === 'rem' ? maxSizeNum / rootSizeNum : maxSizeNum;
  const interceptValue = outputUnit === 'rem' ? intercept / rootSizeNum : intercept;

  // Format numbers for display
  const slopePercent = formatNumber(slope * 100);
  const interceptFormatted = formatNumber(interceptValue);
  const minFormatted = formatNumber(minValue);
  const maxFormatted = formatNumber(maxValue);

  // Build CSS clamp
  const fluidCalc = `calc(${slopePercent}vw + ${interceptFormatted}${outputUnit})`;
  const cssClamp = `clamp(${minFormatted}${outputUnit}, ${fluidCalc}, ${maxFormatted}${outputUnit})`;

  // Build SCSS function example
  const scssFunction = `// SCSS Function Usage
.element {
  font-size: fluid-clamp(${minSize}, ${maxSize}, ${minScreenWidth}, ${maxScreenWidth}, '${outputUnit}'${outputUnit === 'rem' ? `, ${rootFontSize}` : ''});
}`;

  // Generate breakpoint table data
  const breakpointTable = generateBreakpointTable(
    data, 
    customBreakpoints, 
    slope, 
    intercept, 
    minScreenNum, 
    maxScreenNum
  );

  return {
    cssClamp,
    scssFunction,
    breakpointTable
  };
};

/**
 * Generate breakpoint table with computed values
 * @param {Object} data - Form data
 * @param {Array} customBreakpoints - Custom breakpoints
 * @param {number} slope - Calculated slope
 * @param {number} intercept - Calculated intercept
 * @param {number} minScreenNum - Minimum screen width
 * @param {number} maxScreenNum - Maximum screen width
 * @returns {Array} Breakpoint table data
 */
const generateBreakpointTable = (data, customBreakpoints, slope, intercept, minScreenNum, maxScreenNum) => {
  const { outputUnit, rootFontSize } = data;
  const rootSizeNum = parseFloat(rootFontSize);

  // Default breakpoints
  const defaultBreakpoints = [
    { name: 'Mobile S', width: 320, device: 'iPhone SE', category: 'mobile', isDefault: true },
    { name: 'Mobile M', width: 375, device: 'iPhone 12/13', category: 'mobile', isDefault: true },
    { name: 'Mobile L', width: 425, device: 'iPhone 12 Pro Max', category: 'mobile', isDefault: true },
    { name: 'Tablet', width: 768, device: 'iPad', category: 'tablet', isDefault: true },
    { name: 'Laptop', width: 1024, device: 'Laptop', category: 'desktop', isDefault: true },
    { name: 'Laptop L', width: 1440, device: 'MacBook Pro 16"', category: 'desktop', isDefault: true },
    { name: 'Desktop', width: 1920, device: 'Desktop HD', category: 'desktop', isDefault: true },
    { name: 'Desktop L', width: 2560, device: 'Desktop QHD', category: 'desktop', isDefault: true }
  ];

  // Combine default and custom breakpoints
  const allBreakpoints = [...defaultBreakpoints, ...customBreakpoints].sort((a, b) => a.width - b.width);

  return allBreakpoints.map(bp => {
    let computedValue;
    let status;
    
    if (bp.width <= minScreenNum) {
      const minValue = outputUnit === 'rem' ? parseFloat(data.minSize) / rootSizeNum : parseFloat(data.minSize);
      computedValue = minValue;
      status = 'min';
    } else if (bp.width >= maxScreenNum) {
      const maxValue = outputUnit === 'rem' ? parseFloat(data.maxSize) / rootSizeNum : parseFloat(data.maxSize);
      computedValue = maxValue;
      status = 'max';
    } else {
      // Calculate fluid value
      const fluidValue = slope * bp.width + intercept;
      computedValue = outputUnit === 'rem' ? fluidValue / rootSizeNum : fluidValue;
      status = 'fluid';
    }

    return {
      ...bp,
      computedValue: formatNumber(computedValue),
      status,
      unit: outputUnit
    };
  });
};

/**
 * Determine device category and icon based on width
 * @param {number} width - Screen width in pixels
 * @returns {Object} Object containing category and icon
 */
export const getDeviceCategoryAndIcon = (width) => {
  let category = DEVICE_CATEGORIES.DESKTOP;
  let icon = DEVICE_ICONS[DEVICE_CATEGORIES.DESKTOP];
  
  if (width < DEVICE_THRESHOLDS.MOBILE_MAX) {
    category = DEVICE_CATEGORIES.MOBILE;
    icon = DEVICE_ICONS[DEVICE_CATEGORIES.MOBILE];
  } else if (width < DEVICE_THRESHOLDS.TABLET_MAX) {
    category = DEVICE_CATEGORIES.TABLET;
    icon = DEVICE_ICONS[DEVICE_CATEGORIES.TABLET];
  }

  return { category, icon };
};

/**
 * Create a custom breakpoint object
 * @param {Object} data - Breakpoint data (name, width, device)
 * @returns {Object} Custom breakpoint object
 */
export const createCustomBreakpoint = (data) => {
  const width = parseInt(data.width);
  const { category, icon } = getDeviceCategoryAndIcon(width);

  return {
    name: data.name.trim(),
    width: width,
    device: data.device.trim(),
    icon: icon,
    category: category,
    isDefault: false,
    id: Date.now() // Simple ID for deletion
  };
};

/**
 * Copy text to clipboard with fallback for older browsers
 * @param {string} text - Text to copy
 * @param {string} type - Type of content being copied (for logging)
 * @returns {Promise<void>}
 */
export const copyToClipboard = async (text, type) => {
  try {
    await navigator.clipboard.writeText(text);
    console.log(`${type} copied to clipboard`);
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};