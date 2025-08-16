import {
  HiDevicePhoneMobile,
  HiDeviceTablet,
  HiComputerDesktop
} from 'react-icons/hi2';

/**
 * Breakpoint management utilities
 */

/**
 * Default breakpoints configuration
 */
export const DEFAULT_BREAKPOINTS = [
  { name: 'Mobile S', width: 320, device: 'iPhone SE', icon: HiDevicePhoneMobile, category: 'mobile', isDefault: true },
  { name: 'Mobile M', width: 375, device: 'iPhone 12/13', icon: HiDevicePhoneMobile, category: 'mobile', isDefault: true },
  { name: 'Mobile L', width: 425, device: 'iPhone 12 Pro Max', icon: HiDevicePhoneMobile, category: 'mobile', isDefault: true },
  { name: 'Tablet', width: 768, device: 'iPad', icon: HiDeviceTablet, category: 'tablet', isDefault: true },
  { name: 'Laptop', width: 1024, device: 'Laptop', icon: HiComputerDesktop, category: 'desktop', isDefault: true },
  { name: 'Laptop L', width: 1440, device: 'MacBook Pro 16"', icon: HiComputerDesktop, category: 'desktop', isDefault: true },
  { name: 'Desktop', width: 1920, device: 'Desktop HD', icon: HiComputerDesktop, category: 'desktop', isDefault: true },
  { name: 'Desktop L', width: 2560, device: 'Desktop QHD', icon: HiComputerDesktop, category: 'desktop', isDefault: true }
];

/**
 * Determine device category and icon based on screen width
 * @param {number} width - Screen width in pixels
 * @returns {Object} Category and icon information
 */
export const getDeviceCategory = (width) => {
  let category = 'desktop';
  let icon = HiComputerDesktop;
  
  if (width < 768) {
    category = 'mobile';
    icon = HiDevicePhoneMobile;
  } else if (width < 1024) {
    category = 'tablet';
    icon = HiDeviceTablet;
  }

  return { category, icon };
};

/**
 * Create a custom breakpoint object
 * @param {Object} data - Breakpoint form data
 * @returns {Object} Custom breakpoint object
 */
export const createCustomBreakpoint = (data) => {
  const width = parseInt(data.width);
  const { category, icon } = getDeviceCategory(width);

  return {
    name: data.name.trim(),
    width: width,
    device: data.device.trim(),
    icon: icon,
    category: category,
    isDefault: false,
    id: data.originalId ? `custom-${data.originalId}` : `custom-${Date.now()}`, // Use consistent ID for edited defaults
    originalId: data.originalId || null // Keep track of original default breakpoint ID
  };
};

/**
 * Sort breakpoints by width
 * @param {Array} breakpoints - Array of breakpoints
 * @returns {Array} Sorted breakpoints
 */
export const sortBreakpoints = (breakpoints) => {
  return [...breakpoints].sort((a, b) => a.width - b.width);
};
