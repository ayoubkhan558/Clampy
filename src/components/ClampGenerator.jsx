import { useState, useEffect, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './ClampGenerator.module.scss';
import ClampChart from './ClampChart';
import {
  HiShare,
  HiClipboard,
  HiChartBar,
  // HiTable,
  HiDevicePhoneMobile,
  HiDeviceTablet,
  HiComputerDesktop,
  HiPlus,
  HiTrash,
  HiPencil
} from 'react-icons/hi2';

// Validation schema
const clampSchema = yup.object({
  outputUnit: yup.string().oneOf(['px', 'rem']).required('Output unit is required'),
  rootFontSize: yup.number()
    .positive('Root font size must be positive')
    .integer('Root font size must be an integer')
    .min(1, 'Root font size must be at least 1')
    .max(100, 'Root font size must be at most 100')
    .required('Root font size is required'),
  minSize: yup.number()
    .positive('Min size must be positive')
    .required('Min size is required'),
  maxSize: yup.number()
    .positive('Max size must be positive')
    .test('greater-than-min', 'Max size must be greater than min size', function(value) {
      return value > this.parent.minSize;
    })
    .required('Max size is required'),
  minScreenWidth: yup.number()
    .positive('Min screen width must be positive')
    .integer('Min screen width must be an integer')
    .min(1, 'Min screen width must be at least 1')
    .required('Min screen width is required'),
  maxScreenWidth: yup.number()
    .positive('Max screen width must be positive')
    .integer('Max screen width must be an integer')
    .test('greater-than-min-screen', 'Max screen width must be greater than min screen width', function(value) {
      return value > this.parent.minScreenWidth;
    })
    .required('Max screen width is required')
});

// Custom breakpoint validation schema
const breakpointSchema = yup.object({
  name: yup.string()
    .trim()
    .min(1, 'Name is required')
    .max(50, 'Name must be at most 50 characters')
    .required('Name is required'),
  width: yup.number()
    .positive('Width must be positive')
    .integer('Width must be an integer')
    .min(1, 'Width must be at least 1')
    .max(10000, 'Width must be at most 10000')
    .required('Width is required'),
  device: yup.string()
    .trim()
    .min(1, 'Device name is required')
    .max(100, 'Device name must be at most 100 characters')
    .required('Device name is required')
});

/**
 * URL parameter utilities
 */
const getUrlParams = () => {
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

const updateUrlParams = (formData) => {
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
 * ClampGenerator Component
 * Generates CSS clamp() values and SCSS utilities for fluid responsive design
 */
const ClampGenerator = () => {
  // Initialize default values from URL params or defaults
  const getDefaultValues = () => {
    try {
      return getUrlParams();
    } catch {
      return {
        outputUnit: 'px',
        rootFontSize: 16,
        minSize: 16,
        maxSize: 32,
        minScreenWidth: 320,
        maxScreenWidth: 1200
      };
    }
  };

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(clampSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange'
  });

  // Watch form values for real-time updates
  const formData = useWatch({ control }) || getDefaultValues();

  // Custom breakpoint form
  const {
    register: registerBreakpoint,
    handleSubmit: handleSubmitBreakpoint,
    reset: resetBreakpoint,
    formState: { errors: breakpointErrors, isValid: isBreakpointValid }
  } = useForm({
    resolver: yupResolver(breakpointSchema),
    defaultValues: { name: '', width: '', device: '' },
    mode: 'onChange'
  });

  // Output state
  const [outputs, setOutputs] = useState({
    cssClamp: '',
    scssFunction: '',
    breakpointTable: []
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState('chart');

  // Custom breakpoints state
  const [customBreakpoints, setCustomBreakpoints] = useState([]);
  const [showAddBreakpoint, setShowAddBreakpoint] = useState(false);

  // Form submission handler (not used for real-time updates, but kept for completeness)
  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  /**
   * Calculate clamp values
   * @param {Object} data - Form data
   * @returns {Object} Calculated outputs
   */
  const calculateClamp = useCallback((data) => {
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
    const formatNumber = (num) => {
      return Math.abs(num) < 0.001 ? '0' : num.toFixed(3).replace(/\.?0+$/, '');
    };

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
    const defaultBreakpoints = [
      { name: 'Mobile S', width: 320, device: 'iPhone SE', icon: HiDevicePhoneMobile, category: 'mobile', isDefault: true },
      { name: 'Mobile M', width: 375, device: 'iPhone 12/13', icon: HiDevicePhoneMobile, category: 'mobile', isDefault: true },
      { name: 'Mobile L', width: 425, device: 'iPhone 12 Pro Max', icon: HiDevicePhoneMobile, category: 'mobile', isDefault: true },
      { name: 'Tablet', width: 768, device: 'iPad', icon: HiDeviceTablet, category: 'tablet', isDefault: true },
      { name: 'Laptop', width: 1024, device: 'Laptop', icon: HiComputerDesktop, category: 'desktop', isDefault: true },
      { name: 'Laptop L', width: 1440, device: 'MacBook Pro 16"', icon: HiComputerDesktop, category: 'desktop', isDefault: true },
      { name: 'Desktop', width: 1920, device: 'Desktop HD', icon: HiComputerDesktop, category: 'desktop', isDefault: true },
      { name: 'Desktop L', width: 2560, device: 'Desktop QHD', icon: HiComputerDesktop, category: 'desktop', isDefault: true }
    ];

    // Combine default and custom breakpoints
    const allBreakpoints = [...defaultBreakpoints, ...customBreakpoints].sort((a, b) => a.width - b.width);

    const breakpointTable = allBreakpoints.map(bp => {
      let computedValue;
      let status;
      
      if (bp.width <= minScreenNum) {
        computedValue = minValue;
        status = 'min';
      } else if (bp.width >= maxScreenNum) {
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

    return {
      cssClamp,
      scssFunction,
      breakpointTable
    };
  }, [customBreakpoints]);

  /**
   * Reset form to defaults
   */
  const handleReset = () => {
    const defaultData = {
      outputUnit: 'px',
      rootFontSize: 16,
      minSize: 16,
      maxSize: 32,
      minScreenWidth: 320,
      maxScreenWidth: 1200
    };
    reset(defaultData);
    updateUrlParams(defaultData);
  };

  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @param {string} type - Type of content being copied
   */
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
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

  /**
   * Generate and copy share link
   */
  const handleShareLink = () => {
    const currentUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set('unit', formData.outputUnit);
    params.set('root', formData.rootFontSize.toString());
    params.set('min', formData.minSize.toString());
    params.set('max', formData.maxSize.toString());
    params.set('minScreen', formData.minScreenWidth.toString());
    params.set('maxScreen', formData.maxScreenWidth.toString());
    
    const shareUrl = `${currentUrl}?${params.toString()}`;
    copyToClipboard(shareUrl, 'Share Link');
  };

  /**
   * Add custom breakpoint
   */
  const handleAddBreakpoint = (data) => {
    const width = parseInt(data.width);
    
    // Determine category and icon based on width
    let category = 'desktop';
    let icon = HiComputerDesktop;
    
    if (width < 768) {
      category = 'mobile';
      icon = HiDevicePhoneMobile;
    } else if (width < 1024) {
      category = 'tablet';
      icon = HiDeviceTablet;
    }

    const customBp = {
      name: data.name.trim(),
      width: width,
      device: data.device.trim(),
      icon: icon,
      category: category,
      isDefault: false,
      id: Date.now() // Simple ID for deletion
    };

    setCustomBreakpoints(prev => [...prev, customBp]);
    resetBreakpoint();
    setShowAddBreakpoint(false);
  };

  /**
   * Delete custom breakpoint
   */
  const handleDeleteBreakpoint = (id) => {
    setCustomBreakpoints(prev => prev.filter(bp => bp.id !== id));
  };

  // Update outputs when form data changes
  useEffect(() => {
    // Only calculate if form is valid
    if (isValid && formData) {
      const newOutputs = calculateClamp(formData);
      setOutputs(newOutputs);
      
      // Update URL params with debouncing
      clearTimeout(window.urlUpdateTimeout);
      window.urlUpdateTimeout = setTimeout(() => {
        updateUrlParams(formData);
      }, 500);
    } else {
      setOutputs({ cssClamp: '', scssFunction: '', breakpointTable: [] });
    }
  }, [formData, isValid, calculateClamp]);

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Left Column - Form */}
        <div className={styles.leftColumn}>
          <div className={styles.formCard}>
            <header className={styles.header}>
              <h1 className={styles.title}>CSS Clamp() Generator</h1>
              <p className={styles.subtitle}>
                Generate fluid responsive values with CSS clamp() and SCSS utilities
              </p>
            </header>

            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              {/* Output Unit Selection */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Output Unit</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      value="px"
                      {...register('outputUnit')}
                      className={styles.radio}
                    />
                    <span>px</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      value="rem"
                      {...register('outputUnit')}
                      className={styles.radio}
                    />
                    <span>rem</span>
                  </label>
                </div>
              </div>

              {/* Root Font Size (only show for rem) */}
              {formData.outputUnit === 'rem' && (
                <div className={styles.fieldGroup}>
                  <label htmlFor="rootFontSize" className={styles.label}>
                    Root Font Size (px)
                  </label>
                  <input
                    type="number"
                    id="rootFontSize"
                    min="1"
                    step="1"
                    {...register('rootFontSize')}
                    className={`${styles.input} ${errors.rootFontSize ? styles.inputError : ''}`}
                  />
                  {errors.rootFontSize && (
                    <span className={styles.error}>{errors.rootFontSize.message}</span>
                  )}
                </div>
              )}

              {/* Size Inputs */}
              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="minSize" className={styles.label}>
                    Min Size ({formData.outputUnit})
                  </label>
                  <input
                    type="number"
                    id="minSize"
                    min="0"
                    step="0.1"
                    {...register('minSize')}
                    className={`${styles.input} ${errors.minSize ? styles.inputError : ''}`}
                  />
                  {errors.minSize && (
                    <span className={styles.error}>{errors.minSize.message}</span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="maxSize" className={styles.label}>
                    Max Size ({formData.outputUnit})
                  </label>
                  <input
                    type="number"
                    id="maxSize"
                    min="0"
                    step="0.1"
                    {...register('maxSize')}
                    className={`${styles.input} ${errors.maxSize ? styles.inputError : ''}`}
                  />
                  {errors.maxSize && (
                    <span className={styles.error}>{errors.maxSize.message}</span>
                  )}
                </div>
              </div>

              {/* Screen Width Inputs */}
              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="minScreenWidth" className={styles.label}>
                    Min Screen Width (px)
                  </label>
                  <input
                    type="number"
                    id="minScreenWidth"
                    min="1"
                    step="1"
                    {...register('minScreenWidth')}
                    className={`${styles.input} ${errors.minScreenWidth ? styles.inputError : ''}`}
                  />
                  {errors.minScreenWidth && (
                    <span className={styles.error}>{errors.minScreenWidth.message}</span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="maxScreenWidth" className={styles.label}>
                    Max Screen Width (px)
                  </label>
                  <input
                    type="number"
                    id="maxScreenWidth"
                    min="1"
                    step="1"
                    {...register('maxScreenWidth')}
                    className={`${styles.input} ${errors.maxScreenWidth ? styles.inputError : ''}`}
                  />
                  {errors.maxScreenWidth && (
                    <span className={styles.error}>{errors.maxScreenWidth.message}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actions}>
                <button
                  type="button"
                  onClick={handleReset}
                  className={styles.resetButton}
                >
                  {/* <HiRefresh className={styles.buttonIcon} /> */}
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleShareLink}
                  className={styles.shareButton}
                  title="Copy shareable link with current settings"
                >
                  <HiShare className={styles.buttonIcon} />
                  Share Link
                </button>
              </div>
            </form>

            {/* CSS Output - Always visible */}
            {outputs.cssClamp && (
              <div className={styles.codeOutput}>
                <div className={styles.outputHeader}>
                  <h3 className={styles.outputLabel}>CSS Clamp</h3>
                  <button
                    onClick={() => copyToClipboard(outputs.cssClamp, 'CSS Clamp')}
                    className={styles.copyButton}
                    title="Copy to clipboard"
                  >
                    <HiClipboard className={styles.buttonIcon} />
                    Copy
                  </button>
                </div>
                <pre className={styles.codeBlock}>
                  <code>{outputs.cssClamp}</code>
                </pre>
              </div>
            )}

            {/* SCSS Function Output */}
            {outputs.scssFunction && (
              <div className={styles.codeOutput}>
                <div className={styles.outputHeader}>
                  <h3 className={styles.outputLabel}>SCSS Function</h3>
                  <button
                    onClick={() => copyToClipboard(outputs.scssFunction, 'SCSS Function')}
                    className={styles.copyButton}
                    title="Copy to clipboard"
                  >
                    <HiClipboard className={styles.buttonIcon} />
                    Copy
                  </button>
                </div>
                <pre className={styles.codeBlock}>
                  <code>{outputs.scssFunction}</code>
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Tabbed Outputs */}
        {outputs.cssClamp && (
          <div className={styles.rightColumn}>
            <div className={styles.outputCard}>
              <div className={styles.tabContainer}>
                <div className={styles.tabList}>
                  <button
                    className={`${styles.tab} ${activeTab === 'chart' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('chart')}
                  >
                    <HiChartBar className={styles.tabIcon} />
                    <span className={styles.tabText}>Visualization</span>
                  </button>
                  <button
                    className={`${styles.tab} ${activeTab === 'table' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('table')}
                  >
                    {/* <HiTable className={styles.tabIcon} /> */}
                    <span className={styles.tabText}>Breakpoints</span>
                  </button>
                </div>

                <div className={styles.tabContent}>
                  {activeTab === 'chart' && (
                    <div className={styles.tabPanel}>
                      <ClampChart formData={formData} outputs={outputs} />
                    </div>
                  )}

                  {activeTab === 'table' && (
                    <div className={styles.tabPanel}>
                      <div className={styles.tableHeader}>
                        <h3 className={styles.tableTitle}>Responsive Preview</h3>
                        <p className={styles.tableSubtitle}>
                          See how your clamp value behaves across different devices
                        </p>
                        <div className={styles.breakpointActions}>
                          <button
                            onClick={() => setShowAddBreakpoint(!showAddBreakpoint)}
                            className={styles.addBreakpointButton}
                            title="Add custom breakpoint"
                          >
                            <HiPlus className={styles.buttonIcon} />
                            Add Breakpoint
                          </button>
                        </div>
                      </div>

                      {/* Add Breakpoint Form */}
                      {showAddBreakpoint && (
                        <form className={styles.addBreakpointForm} onSubmit={handleSubmitBreakpoint(handleAddBreakpoint)}>
                          <div className={styles.formRow}>
                            <input
                              type="text"
                              placeholder="Breakpoint name (e.g., Custom Mobile)"
                              {...registerBreakpoint('name')}
                              className={`${styles.input} ${breakpointErrors.name ? styles.inputError : ''}`}
                            />
                            <input
                              type="number"
                              placeholder="Width (px)"
                              min="1"
                              {...registerBreakpoint('width')}
                              className={`${styles.input} ${breakpointErrors.width ? styles.inputError : ''}`}
                            />
                            <input
                              type="text"
                              placeholder="Device name (e.g., Custom Device)"
                              {...registerBreakpoint('device')}
                              className={`${styles.input} ${breakpointErrors.device ? styles.inputError : ''}`}
                            />
                          </div>
                          {(breakpointErrors.name || breakpointErrors.width || breakpointErrors.device) && (
                            <div className={styles.formErrors}>
                              {breakpointErrors.name && <span className={styles.error}>{breakpointErrors.name.message}</span>}
                              {breakpointErrors.width && <span className={styles.error}>{breakpointErrors.width.message}</span>}
                              {breakpointErrors.device && <span className={styles.error}>{breakpointErrors.device.message}</span>}
                            </div>
                          )}
                          <div className={styles.formActions}>
                            <button
                              type="submit"
                              className={styles.addButton}
                              disabled={!isBreakpointValid}
                            >
                              <HiPlus className={styles.buttonIcon} />
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddBreakpoint(false);
                                resetBreakpoint();
                              }}
                              className={styles.cancelButton}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}

                      <div className={styles.tableContainer}>
                        <table className={styles.breakpointTable}>
                          <thead>
                            <tr>
                              <th>Device</th>
                              <th>Screen Width</th>
                              <th>Computed Value</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {outputs.breakpointTable.map((bp, index) => (
                              <tr key={bp.id || index} className={styles[`row${bp.status}`]}>
                                <td className={styles.deviceCell}>
                                  <div className={styles.deviceInfo}>
                                    <bp.icon className={`${styles.deviceIcon} ${styles[`icon${bp.category}`]}`} />
                                    <div>
                                      <div className={styles.deviceName}>{bp.name}</div>
                                      <div className={styles.deviceModel}>{bp.device}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className={styles.widthCell}>{bp.width}px</td>
                                <td className={styles.valueCell}>
                                  <span className={styles.computedValue}>
                                    {bp.computedValue}{bp.unit}
                                  </span>
                                </td>
                                <td className={styles.statusCell}>
                                  <span className={`${styles.statusBadge} ${styles[`status${bp.status}`]}`}>
                                    {bp.status === 'min' ? 'MIN' : bp.status === 'max' ? 'MAX' : 'FLUID'}
                                  </span>
                                </td>
                                <td className={styles.actionsCell}>
                                  {!bp.isDefault && (
                                    <button
                                      onClick={() => handleDeleteBreakpoint(bp.id)}
                                      className={styles.deleteButton}
                                      title="Delete custom breakpoint"
                                    >
                                      <HiTrash className={styles.buttonIcon} />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClampGenerator;