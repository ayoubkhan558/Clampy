import {
  DEVICE_THRESHOLDS,
  DEVICE_CATEGORIES,
  DEVICE_ICONS,
  PRECISION_THRESHOLD,
  DECIMAL_PLACES
} from './constants';

/**
 * Clamp calculation utilities
 */

/**
 * Format number for display (remove trailing zeros)
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  return Math.abs(num) < PRECISION_THRESHOLD ? '0' : num.toFixed(DECIMAL_PLACES).replace(/\.?0+$/, '');
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
  const { minScreenWidth, maxScreenWidth, minSize, maxSize, rootFontSize } = data;
  const minScreen = parseFloat(minScreenWidth);
  const maxScreen = parseFloat(maxScreenWidth);
  const root = parseFloat(rootFontSize) || 16;

  const minSizeNum = parseFloat(minSize);
  const maxSizeNum = parseFloat(maxSize);
  const minPx = outputUnit === 'rem' ? minSizeNum * root : minSizeNum;
  const maxPx = outputUnit === 'rem' ? maxSizeNum * root : maxSizeNum;
  const slope = (maxPx - minPx) / (maxScreen - minScreen);
  const intercept = minPx - (slope * minScreen);

  const slopeInUnit = outputUnit === 'rem' ? slope / root : slope;
  const interceptInUnit = outputUnit === 'rem' ? intercept / root : intercept;
  const fluidValue = `calc(${formatNumber(slopeInUnit * 100)}vw + ${formatNumber(interceptInUnit)}${outputUnit})`;

  return `/* Fallback for browsers that don't support clamp() */
@supports not (font-size: clamp(1rem, 1vw, 1rem)) {
  /* Below minimum breakpoint */
  font-size: ${minFormatted}${outputUnit};
  
  /* Fluid scaling between breakpoints */
  @media (min-width: ${minScreenWidth}px) {
    font-size: ${fluidValue};
  }
  
  /* Cap at maximum value */
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
