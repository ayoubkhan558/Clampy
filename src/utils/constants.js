import {
  HiDevicePhoneMobile,
  HiDeviceTablet,
  HiComputerDesktop
} from 'react-icons/hi2';

/**
 * Application constants and default values
 */

/**
 * Default form values
 */
export const DEFAULT_FORM_VALUES = {
  outputUnit: 'px',
  rootFontSize: 16,
  minSize: 16,
  maxSize: 32,
  minScreenWidth: 420,
  maxScreenWidth: 1440,
  scalingFunction: 'linear',
  customBezier: '0.25, 0.1, 0.25, 1',
  generateCustomProperties: false,
  customPropertyName: 'font-size'
};

/**
 * Form field configurations
 */
export const FORM_FIELDS = {
  outputUnit: {
    options: ['px', 'rem'],
    label: 'Output Unit'
  },
  rootFontSize: {
    min: 1,
    max: 100,
    step: 1,
    label: 'Root Font Size (px)'
  },
  minSize: {
    min: 0,
    step: 0.1,
    label: 'Min Size'
  },
  maxSize: {
    min: 0,
    step: 0.1,
    label: 'Max Size'
  },
  minScreenWidth: {
    min: 1,
    step: 1,
    label: 'Min Screen Width (px)'
  },
  maxScreenWidth: {
    min: 1,
    step: 1,
    label: 'Max Screen Width (px)'
  },
  scalingFunction: {
    options: ['linear', 'ease-in', 'ease-out', 'ease-in-out', 'custom'],
    label: 'Scaling Function'
  },
  customBezier: {
    label: 'Custom Bezier (x1, y1, x2, y2)',
    placeholder: '0.25, 0.1, 0.25, 1'
  },
  generateCustomProperties: {
    label: 'Generate CSS Custom Properties'
  },
  customPropertyName: {
    label: 'Property Name',
    placeholder: 'font-size'
  }
};

/**
 * Tab configurations
 */
export const TABS = {
  chart: {
    id: 'chart',
    label: 'Visualization',
    icon: 'HiChartBar'
  },
  table: {
    id: 'table',
    label: 'Breakpoints',
    icon: 'HiTable'
  }
};

/**
 * Default breakpoints with device information
 */
export const DEFAULT_BREAKPOINTS = [
  { 
    name: 'Mobile S', 
    width: 320, 
    device: 'iPhone SE', 
    icon: HiDevicePhoneMobile, 
    category: 'mobile', 
    isDefault: true 
  },
  { 
    name: 'Mobile M', 
    width: 375, 
    device: 'iPhone 12/13', 
    icon: HiDevicePhoneMobile, 
    category: 'mobile', 
    isDefault: true 
  },
  { 
    name: 'Mobile L', 
    width: 425, 
    device: 'iPhone 12 Pro Max', 
    icon: HiDevicePhoneMobile, 
    category: 'mobile', 
    isDefault: true 
  },
  { 
    name: 'Tablet', 
    width: 768, 
    device: 'iPad', 
    icon: HiDeviceTablet, 
    category: 'tablet', 
    isDefault: true 
  },
  { 
    name: 'Laptop', 
    width: 1024, 
    device: 'Laptop', 
    icon: HiComputerDesktop, 
    category: 'desktop', 
    isDefault: true 
  },
  { 
    name: 'Laptop L', 
    width: 1440, 
    device: 'MacBook Pro 16"', 
    icon: HiComputerDesktop, 
    category: 'desktop', 
    isDefault: true 
  },
  { 
    name: 'Desktop', 
    width: 1920, 
    device: 'Desktop HD', 
    icon: HiComputerDesktop, 
    category: 'desktop', 
    isDefault: true 
  },
  { 
    name: 'Desktop L', 
    width: 2560, 
    device: 'Desktop QHD', 
    icon: HiComputerDesktop, 
    category: 'desktop', 
    isDefault: true 
  }
];

/**
 * Device category thresholds for automatic categorization
 */
export const DEVICE_THRESHOLDS = {
  MOBILE_MAX: 768,
  TABLET_MAX: 1024
};

/**
 * Device category mappings
 */
export const DEVICE_CATEGORIES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop'
};

/**
 * Device icons mapping
 */
export const DEVICE_ICONS = {
  [DEVICE_CATEGORIES.MOBILE]: HiDevicePhoneMobile,
  [DEVICE_CATEGORIES.TABLET]: HiDeviceTablet,
  [DEVICE_CATEGORIES.DESKTOP]: HiComputerDesktop
};

/**
 * Scaling function presets
 */
export const SCALING_FUNCTIONS = {
  linear: { name: 'Linear', bezier: null },
  'ease-in': { name: 'Ease In', bezier: '0.42, 0, 1, 1' },
  'ease-out': { name: 'Ease Out', bezier: '0, 0, 0.58, 1' },
  'ease-in-out': { name: 'Ease In-Out', bezier: '0.42, 0, 0.58, 1' },
  custom: { name: 'Custom', bezier: null }
};

/**
 * URL parameter keys for state synchronization
 */
export const URL_PARAMS = {
  UNIT: 'unit',
  ROOT: 'root',
  MIN: 'min',
  MAX: 'max',
  MIN_SCREEN: 'minScreen',
  MAX_SCREEN: 'maxScreen',
  SCALING: 'scaling',
  BEZIER: 'bezier',
  CUSTOM_PROPS: 'customProps',
  PROP_NAME: 'propName'
};

/**
 * Debounce delay for URL updates (in milliseconds)
 */
export const URL_UPDATE_DELAY = 500;