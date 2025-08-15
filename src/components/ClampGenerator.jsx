import { useState, useEffect, useCallback } from 'react';
import styles from './ClampGenerator.module.scss';
import ClampChart from './ClampChart';

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
  // Initialize form state from URL params or defaults
  const [formData, setFormData] = useState(() => {
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
  });

  // Output state
  const [outputs, setOutputs] = useState({
    cssClamp: '',
    scssFunction: '',
    breakpointTable: []
  });

  // Validation state
  const [errors, setErrors] = useState({});

  /**
   * Validate form inputs
   * @param {Object} data - Form data to validate
   * @returns {Object} Validation errors
   */
  const validateInputs = useCallback((data) => {
    const newErrors = {};

    // Check for numeric values
    const numericFields = ['rootFontSize', 'minSize', 'maxSize', 'minScreenWidth', 'maxScreenWidth'];
    numericFields.forEach(field => {
      const value = parseFloat(data[field]);
      if (isNaN(value) || value <= 0) {
        newErrors[field] = 'Must be a positive number';
      }
    });

    // Check size constraints
    if (parseFloat(data.maxSize) <= parseFloat(data.minSize)) {
      newErrors.maxSize = 'Max size must be greater than min size';
    }

    // Check screen width constraints
    if (parseFloat(data.maxScreenWidth) <= parseFloat(data.minScreenWidth)) {
      newErrors.maxScreenWidth = 'Max screen width must be greater than min screen width';
    }

    return newErrors;
  }, []);

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
    const commonBreakpoints = [
      { name: 'Mobile S', width: 320, device: '📱 iPhone SE' },
      { name: 'Mobile M', width: 375, device: '📱 iPhone 12/13' },
      { name: 'Mobile L', width: 425, device: '📱 iPhone 12 Pro Max' },
      { name: 'Tablet', width: 768, device: '📱 iPad' },
      { name: 'Laptop', width: 1024, device: '💻 Laptop' },
      { name: 'Laptop L', width: 1440, device: '💻 MacBook Pro 16"' },
      { name: 'Desktop', width: 1920, device: '🖥️ Desktop HD' },
      { name: 'Desktop L', width: 2560, device: '🖥️ Desktop QHD' }
    ];

    const breakpointTable = commonBreakpoints.map(bp => {
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
  }, []);

  /**
   * Handle input changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);
    
    // Update URL params with debouncing
    clearTimeout(window.urlUpdateTimeout);
    window.urlUpdateTimeout = setTimeout(() => {
      updateUrlParams(newFormData);
    }, 500);
  };

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
    setFormData(defaultData);
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

  // Update outputs when form data changes
  useEffect(() => {
    const newErrors = validateInputs(formData);
    setErrors(newErrors);

    // Only calculate if no errors
    if (Object.keys(newErrors).length === 0) {
      const newOutputs = calculateClamp(formData);
      setOutputs(newOutputs);
    } else {
      setOutputs({ cssClamp: '', scssFunction: '', breakpointTable: [] });
    }
  }, [formData, validateInputs, calculateClamp]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>CSS Clamp() Generator</h1>
          <p className={styles.subtitle}>
            Generate fluid responsive values with CSS clamp() and SCSS utilities
          </p>
        </header>

        <form className={styles.form}>
          {/* Output Unit Selection */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Output Unit</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="outputUnit"
                  value="px"
                  checked={formData.outputUnit === 'px'}
                  onChange={handleInputChange}
                  className={styles.radio}
                />
                <span>px</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="outputUnit"
                  value="rem"
                  checked={formData.outputUnit === 'rem'}
                  onChange={handleInputChange}
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
                name="rootFontSize"
                value={formData.rootFontSize}
                onChange={handleInputChange}
                min="1"
                step="1"
                className={`${styles.input} ${errors.rootFontSize ? styles.inputError : ''}`}
              />
              {errors.rootFontSize && (
                <span className={styles.error}>{errors.rootFontSize}</span>
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
                name="minSize"
                value={formData.minSize}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className={`${styles.input} ${errors.minSize ? styles.inputError : ''}`}
              />
              {errors.minSize && (
                <span className={styles.error}>{errors.minSize}</span>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="maxSize" className={styles.label}>
                Max Size ({formData.outputUnit})
              </label>
              <input
                type="number"
                id="maxSize"
                name="maxSize"
                value={formData.maxSize}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className={`${styles.input} ${errors.maxSize ? styles.inputError : ''}`}
              />
              {errors.maxSize && (
                <span className={styles.error}>{errors.maxSize}</span>
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
                name="minScreenWidth"
                value={formData.minScreenWidth}
                onChange={handleInputChange}
                min="1"
                step="1"
                className={`${styles.input} ${errors.minScreenWidth ? styles.inputError : ''}`}
              />
              {errors.minScreenWidth && (
                <span className={styles.error}>{errors.minScreenWidth}</span>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="maxScreenWidth" className={styles.label}>
                Max Screen Width (px)
              </label>
              <input
                type="number"
                id="maxScreenWidth"
                name="maxScreenWidth"
                value={formData.maxScreenWidth}
                onChange={handleInputChange}
                min="1"
                step="1"
                className={`${styles.input} ${errors.maxScreenWidth ? styles.inputError : ''}`}
              />
              {errors.maxScreenWidth && (
                <span className={styles.error}>{errors.maxScreenWidth}</span>
              )}
            </div>
          </div>

          {/* Reset Button */}
          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleReset}
              className={styles.resetButton}
            >
              Reset to Defaults
            </button>
          </div>
        </form>

        {/* Output Section */}
        {outputs.cssClamp && (
          <section className={styles.outputs}>
            <h2 className={styles.outputsTitle}>Generated Code</h2>

            {/* CSS Clamp Output */}
            <div className={styles.outputGroup}>
              <div className={styles.outputHeader}>
                <h3 className={styles.outputLabel}>CSS Clamp</h3>
                <button
                  onClick={() => copyToClipboard(outputs.cssClamp, 'CSS Clamp')}
                  className={styles.copyButton}
                  title="Copy to clipboard"
                >
                  Copy
                </button>
              </div>
              <pre className={styles.codeBlock}>
                <code>{outputs.cssClamp}</code>
              </pre>
            </div>

            {/* SCSS Function Output */}
            <div className={styles.outputGroup}>
              <div className={styles.outputHeader}>
                <h3 className={styles.outputLabel}>SCSS Function</h3>
                <button
                  onClick={() => copyToClipboard(outputs.scssFunction, 'SCSS Function')}
                  className={styles.copyButton}
                  title="Copy to clipboard"
                >
                  Copy
                </button>
              </div>
              <pre className={styles.codeBlock}>
                <code>{outputs.scssFunction}</code>
              </pre>
            </div>

            {/* Visual Chart */}
            <div className={styles.outputGroup}>
              <ClampChart formData={formData} outputs={outputs} />
            </div>

            {/* Breakpoint Table */}
            <div className={styles.outputGroup}>
              <div className={styles.outputHeader}>
                <h3 className={styles.outputLabel}>Responsive Preview</h3>
              </div>
              <div className={styles.tableContainer}>
                <table className={styles.breakpointTable}>
                  <thead>
                    <tr>
                      <th>Device</th>
                      <th>Screen Width</th>
                      <th>Computed Value</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outputs.breakpointTable.map((bp, index) => (
                      <tr key={index} className={styles[`row${bp.status}`]}>
                        <td className={styles.deviceCell}>
                          <div className={styles.deviceInfo}>
                            <span className={styles.deviceIcon}>{bp.device.split(' ')[0]}</span>
                            <div>
                              <div className={styles.deviceName}>{bp.name}</div>
                              <div className={styles.deviceModel}>{bp.device.substring(2)}</div>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ClampGenerator;