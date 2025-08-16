import { 
  DEFAULT_FORM_VALUES, 
  DEFAULT_BREAKPOINTS, 
  DEVICE_THRESHOLDS, 
  DEVICE_CATEGORIES, 
  DEVICE_ICONS,
  URL_PARAMS,
  SCALING_FUNCTIONS 
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
    maxScreenWidth: parseFloat(params.get(URL_PARAMS.MAX_SCREEN)) || DEFAULT_FORM_VALUES.maxScreenWidth,
    scalingFunction: params.get(URL_PARAMS.SCALING) || DEFAULT_FORM_VALUES.scalingFunction,
    customBezier: params.get(URL_PARAMS.BEZIER) || DEFAULT_FORM_VALUES.customBezier,
    generateCustomProperties: params.get(URL_PARAMS.CUSTOM_PROPS) === 'true',
    customPropertyName: params.get(URL_PARAMS.PROP_NAME) || DEFAULT_FORM_VALUES.customPropertyName
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
  params.set(URL_PARAMS.SCALING, formData.scalingFunction);
  params.set(URL_PARAMS.BEZIER, formData.customBezier);
  params.set(URL_PARAMS.CUSTOM_PROPS, formData.generateCustomProperties.toString());
  params.set(URL_PARAMS.PROP_NAME, formData.customPropertyName);
  
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
  params.set(URL_PARAMS.SCALING, formData.scalingFunction);
  params.set(URL_PARAMS.BEZIER, formData.customBezier);
  params.set(URL_PARAMS.CUSTOM_PROPS, formData.generateCustomProperties.toString());
  params.set(URL_PARAMS.PROP_NAME, formData.customPropertyName);
  
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
    scalingFunction = 'linear',
    customBezier = '0.25, 0.1, 0.25, 1',
    generateCustomProperties = false,
    customPropertyName = 'font-size'
  } = data;

  // Convert to numbers
  const minSizeNum = parseFloat(minSize);
  const maxSizeNum = parseFloat(maxSize);
  const minScreenNum = parseFloat(minScreenWidth);
  const maxScreenNum = parseFloat(maxScreenWidth);
  const rootSizeNum = parseFloat(rootFontSize);

  // Calculate slope and intercept in pixels first
  const slope = (maxSizeNum - minSizeNum) / (maxScreenNum - minScreenNum);
  const intercept = minSizeNum - (slope * minScreenNum);

  // Convert values based on unit
  const minValue = outputUnit === 'rem' ? minSizeNum / rootSizeNum : minSizeNum;
  const maxValue = outputUnit === 'rem' ? maxSizeNum / rootSizeNum : maxSizeNum;
  
  // For rem output, we need to convert the slope and intercept to rem units
  const slopeInUnit = outputUnit === 'rem' ? slope / rootSizeNum : slope;
  const interceptInUnit = outputUnit === 'rem' ? intercept / rootSizeNum : intercept;

  // Format numbers for display
  const slopePercent = formatNumber(slopeInUnit * 100);
  const interceptFormatted = formatNumber(interceptInUnit);
  const minFormatted = formatNumber(minValue);
  const maxFormatted = formatNumber(maxValue);

  // Build CSS clamp with scaling function support
  let fluidCalc, cssClamp, cssCustomProperties = '';
  const bezierValues = scalingFunction === 'custom' ? customBezier : getBezierForFunction(scalingFunction);
  
  // For now, CSS clamp() doesn't support easing functions directly
  // We'll generate the linear clamp but add comments about the intended easing
  fluidCalc = `calc(${slopePercent}vw + ${interceptFormatted}${outputUnit})`;
  cssClamp = `clamp(${minFormatted}${outputUnit}, ${fluidCalc}, ${maxFormatted}${outputUnit})`;
  
  if (scalingFunction !== 'linear') {
    cssClamp = `/* Scaling function: ${scalingFunction} (${bezierValues}) */\n/* Note: CSS clamp() uses linear interpolation. For true easing, consider CSS animations or JavaScript. */\n${cssClamp}`;
  }

  // Generate CSS custom properties if requested
  if (generateCustomProperties) {
    const propName = customPropertyName || 'font-size';
    cssCustomProperties = generateCustomPropertiesCSS(propName, cssClamp, data);
  }

  // Generate breakpoint table data with scaling function
  const breakpointTable = generateBreakpointTable(
    data, 
    customBreakpoints, 
    slope, 
    intercept, 
    minScreenNum, 
    maxScreenNum,
    scalingFunction,
    bezierValues
  );

  return {
    cssClamp,
    cssCustomProperties,
    breakpointTable,
    scalingFunction,
    bezierValues: scalingFunction !== 'linear' ? (scalingFunction === 'custom' ? customBezier : getBezierForFunction(scalingFunction)) : null
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
 * @param {string} scalingFunction - Scaling function type
 * @param {string} bezierValues - Bezier curve values
 * @returns {Array} Breakpoint table data
 */
const generateBreakpointTable = (data, customBreakpoints, slope, intercept, minScreenNum, maxScreenNum, scalingFunction = 'linear', bezierValues = null) => {
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
      // Calculate fluid value with easing
      const minSizeValue = parseFloat(data.minSize);
      const maxSizeValue = parseFloat(data.maxSize);
      const easedValue = calculateSizeWithEasing(
        bp.width, 
        minSizeValue, 
        maxSizeValue, 
        minScreenNum, 
        maxScreenNum, 
        scalingFunction, 
        bezierValues
      );
      computedValue = outputUnit === 'rem' ? easedValue / rootSizeNum : easedValue;
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
 * Get bezier values for predefined scaling functions
 * @param {string} functionName - Name of the scaling function
 * @returns {string} Bezier curve values
 */
export const getBezierForFunction = (functionName) => {
  return SCALING_FUNCTIONS[functionName]?.bezier || '0.25, 0.1, 0.25, 1';
};

/**
 * Apply easing function to a normalized value (0-1)
 * @param {number} t - Normalized progress (0-1)
 * @param {string} easingFunction - Easing function name
 * @param {string} bezierValues - Custom bezier values
 * @returns {number} Eased value (0-1)
 */
export const applyEasing = (t, easingFunction, bezierValues) => {
  if (easingFunction === 'linear' || t <= 0 || t >= 1) {
    return t;
  }
  
  switch (easingFunction) {
    case 'ease-in':
      // Cubic bezier approximation for ease-in
      return t * t * (3 - 2 * t); // Smoothstep approximation
    case 'ease-out':
      // Cubic bezier approximation for ease-out
      return 1 - Math.pow(1 - t, 3);
    case 'ease-in-out':
      // Cubic bezier approximation for ease-in-out
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    case 'custom':
      // For custom bezier, we'll use a simplified approximation
      // In a real implementation, you'd want a proper bezier curve evaluator
      if (bezierValues) {
        const values = bezierValues.split(',').map(v => parseFloat(v.trim()));
        if (values.length === 4) {
          // Simple approximation using the control points
          const [x1, y1, x2, y2] = values;
          return t * t * t * (1 - 3 * x1 + 3 * x2) + 3 * t * t * (x1 - 2 * x2 + 1) + 3 * t * x2 + 0;
        }
      }
      return t;
    default:
      return t;
  }
};

/**
 * Calculate size with easing applied
 * @param {number} screenWidth - Current screen width
 * @param {number} minSize - Minimum size
 * @param {number} maxSize - Maximum size
 * @param {number} minScreen - Minimum screen width
 * @param {number} maxScreen - Maximum screen width
 * @param {string} scalingFunction - Scaling function type
 * @param {string} bezierValues - Bezier curve values
 * @returns {number} Calculated size with easing
 */
export const calculateSizeWithEasing = (screenWidth, minSize, maxSize, minScreen, maxScreen, scalingFunction, bezierValues) => {
  // Clamp screen width to bounds
  if (screenWidth <= minScreen) return minSize;
  if (screenWidth >= maxScreen) return maxSize;
  
  // Calculate normalized progress (0-1)
  const progress = (screenWidth - minScreen) / (maxScreen - minScreen);
  
  // Apply easing to progress
  const easedProgress = applyEasing(progress, scalingFunction, bezierValues);
  
  // Calculate final size
  return minSize + (maxSize - minSize) * easedProgress;
};

/**
 * Generate CSS custom properties
 * @param {string} propName - Property name
 * @param {string} cssClamp - CSS clamp value
 * @param {Object} data - Form data
 * @returns {string} CSS custom properties
 */
export const generateCustomPropertiesCSS = (propName, cssClamp, data) => {
  const { minScreenWidth, maxScreenWidth } = data;
  const cleanPropName = propName.replace(/[^a-zA-Z0-9-]/g, '');
  
  return `:root {
  --${cleanPropName}-fluid: ${cssClamp};
  --${cleanPropName}-min-screen: ${minScreenWidth}px;
  --${cleanPropName}-max-screen: ${maxScreenWidth}px;
}

/* Usage example */
.element {
  ${cleanPropName}: var(--${cleanPropName}-fluid);
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