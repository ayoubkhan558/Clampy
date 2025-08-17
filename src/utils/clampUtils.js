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
    maxScreenWidth,
    generateCustomProperties = false,
    customPropertyName = 'font-size',
    includeFallback = false,
    useContainerQueries = false
  } = data;

  // Convert to numbers
  const minSizeNum = parseFloat(minSize);
  const maxSizeNum = parseFloat(maxSize);
  const minScreenNum = parseFloat(minScreenWidth);
  const maxScreenNum = parseFloat(maxScreenWidth);
  const rootSizeNum = parseFloat(rootFontSize);

  // Normalize inputs to px for calculations regardless of selected unit
  const minPx = outputUnit === 'rem' ? minSizeNum * rootSizeNum : minSizeNum;
  const maxPx = outputUnit === 'rem' ? maxSizeNum * rootSizeNum : maxSizeNum;

  // Calculate slope and intercept in pixels
  const slope = (maxPx - minPx) / (maxScreenNum - minScreenNum);
  const intercept = minPx - (slope * minScreenNum);

  // Convert values based on unit
  const minValue = outputUnit === 'rem' ? minPx / rootSizeNum : minPx;
  const maxValue = outputUnit === 'rem' ? maxPx / rootSizeNum : maxPx;
  
  // For rem output, we need to convert the slope and intercept to rem units
  const slopeInUnit = outputUnit === 'rem' ? slope / rootSizeNum : slope;
  const interceptInUnit = outputUnit === 'rem' ? intercept / rootSizeNum : intercept;

  // Format numbers for display
  const slopePercent = formatNumber(slopeInUnit * 100);
  const interceptFormatted = formatNumber(interceptInUnit);
  const minFormatted = formatNumber(minValue);
  const maxFormatted = formatNumber(maxValue);

  // Build CSS clamp with container query support
  const viewportUnit = useContainerQueries ? 'cqi' : 'vw';
  const fluidCalc = `calc(${slopePercent}${viewportUnit} + ${interceptFormatted}${outputUnit})`;
  let cssClamp = `clamp(${minFormatted}${outputUnit}, ${fluidCalc}, ${maxFormatted}${outputUnit})`;
  
  // Add container query wrapper if enabled
  if (useContainerQueries) {
    cssClamp = `/* Container query version (requires container-type: inline-size on parent) */\n${cssClamp}`;
  }

  // Generate CSS fallback if requested
  let cssFallback = '';
  if (includeFallback) {
    cssFallback = generateMediaQueryFallback(data, minFormatted, maxFormatted, outputUnit);
  }

  // Generate CSS custom properties if requested
  let cssCustomProperties = '';
  if (generateCustomProperties && customPropertyName) {
    cssCustomProperties = generateCustomPropertiesCSS(customPropertyName, cssClamp, data);
  }

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
    cssFallback,
    cssCustomProperties,
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
    { name: 'Mobile S', width: 320, device: 'iPhone SE', category: 'mobile', isDefault: true, id: 'mobile-s' },
    { name: 'Mobile M', width: 375, device: 'iPhone 12/13', category: 'mobile', isDefault: true, id: 'mobile-m' },
    { name: 'Mobile L', width: 425, device: 'iPhone 12 Pro Max', category: 'mobile', isDefault: true, id: 'mobile-l' },
    { name: 'Tablet', width: 768, device: 'iPad', category: 'tablet', isDefault: true, id: 'tablet' },
    { name: 'Laptop', width: 1024, device: 'Laptop', category: 'desktop', isDefault: true, id: 'laptop' },
    { name: 'Laptop L', width: 1440, device: 'MacBook Pro 16"', category: 'desktop', isDefault: true, id: 'laptop-l' },
    { name: 'Desktop', width: 1920, device: 'Desktop HD', category: 'desktop', isDefault: true, id: 'desktop' },
    { name: 'Desktop L', width: 2560, device: 'Desktop QHD', category: 'desktop', isDefault: true, id: 'desktop-l' }
  ];

  // Filter out default breakpoints that have been edited (replaced by custom ones)
  const editedDefaultIds = customBreakpoints
    .filter(bp => bp.originalId)
    .map(bp => bp.originalId);

  const uneditedDefaults = defaultBreakpoints.filter(bp => !editedDefaultIds.includes(bp.id));

  // Combine unedited defaults and custom breakpoints
  const allBreakpoints = [...uneditedDefaults, ...customBreakpoints].sort((a, b) => a.width - b.width);

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
 * Generate media query fallback CSS for browsers that don't support clamp()
 * @param {Object} data - Form data
 * @param {string} minFormatted - Formatted minimum value
 * @param {string} maxFormatted - Formatted maximum value
 * @param {string} outputUnit - Output unit (px or rem)
 * @returns {string} Media query fallback CSS
 */
const generateMediaQueryFallback = (data, minFormatted, maxFormatted, outputUnit) => {
  const { minScreenWidth, maxScreenWidth } = data;
  
  return `/* Fallback for browsers that don't support clamp() */
@supports not (font-size: clamp(1rem, 1vw, 1rem)) {
  /* Mobile: use minimum value */
  font-size: ${minFormatted}${outputUnit};
  
  /* Tablet and up: use maximum value */
  @media (min-width: ${minScreenWidth}px) {
    font-size: ${maxFormatted}${outputUnit};
  }
  
  /* Large screens: ensure maximum value */
  @media (min-width: ${maxScreenWidth}px) {
    font-size: ${maxFormatted}${outputUnit};
  }
}`;
};

/**
 * Generate CSS custom properties
 * @param {string} propName - Property name
 * @param {string} cssClamp - CSS clamp value
 * @param {Object} data - Form data
 * @returns {string} CSS custom properties
 */
const generateCustomPropertiesCSS = (propName, cssClamp, data) => {
  const { minSize, maxSize, outputUnit } = data;
  
  return `:root {
  --${propName}: ${cssClamp};
  --${propName}-min: ${minSize}${outputUnit};
  --${propName}-max: ${maxSize}${outputUnit};
}

/* Usage example */
.element {
  font-size: var(--${propName});
}`;
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