import { useState } from 'react';
import styles from './ClampGenerator.module.scss';
import ClampChart from './ClampChart';
import BreakpointTable from './BreakpointTable';
import ClampPreview from './ClampPreview';
import {
  HiShare,
  HiPlus,
  HiTableCells,
  HiChartBar,
  HiEye,
} from 'react-icons/hi2';
import { IoMdCopy } from "react-icons/io";
import { FaCss3 } from "react-icons/fa6";

// Custom hooks
import { useClampForm } from '../hooks/useClampForm';
import { useBreakpointForm } from '../hooks/useBreakpointForm';
import { useClampCalculations } from '../hooks/useClampCalculations';
import { useBreakpoints } from '../hooks/useBreakpoints';

// Utilities
import { generateShareUrl } from '../utils/urlUtils';
import { copyToClipboard } from '../utils/clipboardUtils';

/**
 * Form Field Component - Reusable form field with label and error handling
 */
const FormField = ({ label, children, error }) => (
  <div className={styles.fieldGroup}>
    <label className={styles.label}>{label}</label>
    {children}
    {error && <span className={styles.error}>{error}</span>}
  </div>
);

/**
 * Code Output Component - Reusable code output with copy functionality
 */
const CodeOutput = ({ title, code, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(code, title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.codeOutput}>
      <div className={styles.outputHeader}>
        <h3 className={styles.outputLabel}>{title}</h3>
        <button
          onClick={handleCopy}
          className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
          title="Copy to clipboard"
        >
          <IoMdCopy className={styles.buttonIcon} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className={styles.codeBlock}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

/**
 * Breakpoint Form Component - Form for adding custom breakpoints
 */
const BreakpointForm = ({
  registerBreakpoint,
  handleSubmitBreakpoint,
  breakpointErrors,
  isBreakpointValid,
  onAddBreakpoint,
  onCancel
}) => (
  <form className={styles.addBreakpointForm} onSubmit={handleSubmitBreakpoint(onAddBreakpoint)}>
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
        min="200"
        max="4000"
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
        onClick={onCancel}
        className={styles.cancelButton}
      >
        Cancel
      </button>
    </div>
  </form>
);

/**
 * Main ClampGenerator Component
 * Generates CSS clamp() values and SCSS utilities for fluid responsive design
 */
const ClampGenerator = () => {
  // Custom hooks
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    formData,
    handleReset,
    onSubmit
  } = useClampForm();

  const {
    registerBreakpoint,
    handleSubmitBreakpoint,
    resetBreakpoint,
    breakpointErrors,
    isBreakpointValid
  } = useBreakpointForm();

  const {
    customBreakpoints,
    showAddBreakpoint,
    handleAddBreakpoint,
    handleDeleteBreakpoint,
    handleUpdateBreakpoint,
    toggleAddBreakpoint,
    hideAddBreakpoint
  } = useBreakpoints();

  // Active tab state
  const [activeTab, setActiveTab] = useState('code');

  // Get outputs from calculations
  const outputs = useClampCalculations(formData, isValid, customBreakpoints);

  // Event handlers
  const handleShareLink = () => {
    const shareUrl = generateShareUrl(formData);
    copyToClipboard(shareUrl, 'Share Link');
  };

  const onAddBreakpoint = (data) => {
    handleAddBreakpoint(data);
    resetBreakpoint();
  };

  const onCancelBreakpoint = () => {
    hideAddBreakpoint();
    resetBreakpoint();
  };

  const handleCopyCode = (code, type) => {
    copyToClipboard(code, type);
  };

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Left Column - Form */}
        <div className={styles.leftColumn}>
          <div className={styles.formCard}>
            <header className={styles.header}>
              <h1 className={styles.title}>Clampy</h1>
              <p className={styles.subtitle}>
                Generate fluid responsive values with CSS clamp()
              </p>
            </header>

            {/* Code Outputs moved to tabs */}

            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

              {/* Output Unit Selection */}
              <div className={styles.row}>
                <FormField label="Output Unit" error={errors.outputUnit?.message}>
                  <div className={styles.toggleGroup}>
                    <button
                      type="button"
                      className={`${styles.toggleButton} ${watch('outputUnit') === 'px' ? styles.toggleActive : ''}`}
                      onClick={() => setValue('outputUnit', 'px')}
                    >
                      Pixels (px)
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleButton} ${watch('outputUnit') === 'rem' ? styles.toggleActive : ''}`}
                      onClick={() => setValue('outputUnit', 'rem')}
                    >
                      Root em (rem)
                    </button>
                  </div>
                </FormField>

                {/* Root Font Size (for rem calculations) */}
                <FormField label="Root Font Size (px)" error={errors.rootFontSize?.message}>
                  <input
                    type="number"
                    placeholder="16"
                    min="8"
                    max="32"
                    {...register('rootFontSize')}
                    className={`${styles.input} ${errors.rootFontSize ? styles.inputError : ''}`}
                  />
                </FormField>
              </div>

              {/* Size Range */}
              <div className={styles.row}>
                <FormField label="Minimum Size (px)" error={errors.minSize?.message}>
                  <input
                    type="number"
                    placeholder="16"
                    min="0.1"
                    max="1000"
                    step="0.1"
                    {...register('minSize')}
                    className={`${styles.input} ${errors.minSize ? styles.inputError : ''}`}
                  />
                </FormField>
                <FormField label="Maximum Size (px)" error={errors.maxSize?.message}>
                  <input
                    type="number"
                    placeholder="32"
                    min="0.1"
                    max="1000"
                    step="0.1"
                    {...register('maxSize')}
                    className={`${styles.input} ${errors.maxSize ? styles.inputError : ''}`}
                  />
                </FormField>
              </div>

              {/* Screen Width Range */}
              <div className={styles.row}>
                <FormField label="Minimum Screen Width (px)" error={errors.minScreenWidth?.message}>
                  <input
                    type="number"
                    placeholder="320"
                    min="200"
                    max="2000"
                    {...register('minScreenWidth')}
                    className={`${styles.input} ${errors.minScreenWidth ? styles.inputError : ''}`}
                  />
                </FormField>
                <FormField label="Maximum Screen Width (px)" error={errors.maxScreenWidth?.message}>
                  <input
                    type="number"
                    placeholder="1440"
                    min="400"
                    {...register('maxScreenWidth')}
                    className={`${styles.input} ${errors.maxScreenWidth ? styles.inputError : ''}`}
                  />
                </FormField>
              </div>

              {/* CSS Options */}
              <div className={styles.row}>
                <FormField label="CSS Fallback Support">
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        {...register('includeFallback')}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkboxText}>Generate media query fallback for older browsers</span>
                    </label>
                  </div>
                </FormField>
                <FormField label="Container Queries">
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        {...register('useContainerQueries')}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkboxText}>Use container inline size (cqi) instead of viewport width</span>
                    </label>
                  </div>
                </FormField>
              </div>

              {/* CSS Custom Properties */}
              <div className={styles.row}>
                <FormField label="CSS Custom Properties">
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        {...register('generateCustomProperties')}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkboxText}>Generate CSS custom properties</span>
                    </label>
                  </div>
                </FormField>

                {watch('generateCustomProperties') && (
                  <FormField label="Property Name" error={errors.customPropertyName?.message}>
                    <input
                      type="text"
                      placeholder="font-size"
                      {...register('customPropertyName')}
                      className={`${styles.input} ${errors.customPropertyName ? styles.inputError : ''}`}
                    />
                  </FormField>
                )}
              </div>

              {/* Action Buttons */}
              <div className={styles.actions}>
                <button
                  type="button"
                  onClick={handleReset}
                  className={styles.resetButton}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Tabbed Outputs */}
        {outputs.cssClamp && (
          <div className={styles.rightColumn}>
            <div className={styles.outputCard}>
              <div className={styles.tabContainer}>
                {/* Tab Navigation */}
                <div className={styles.tabList}>
                  <button
                    className={`${styles.tab} ${activeTab === 'code' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('code')}
                  >
                    <FaCss3 className={styles.tabIcon} />
                    <span className={styles.tabText}>Code</span>
                  </button>
                  <button
                    className={`${styles.tab} ${activeTab === 'table' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('table')}
                  >
                    <HiTableCells className={styles.tabIcon} />
                    <span className={styles.tabText}>Breakpoints</span>
                  </button>
                  <button
                    className={`${styles.tab} ${activeTab === 'chart' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('chart')}
                  >
                    <HiChartBar className={styles.tabIcon} />
                    <span className={styles.tabText}>Visualization</span>
                  </button>
                  <button
                    className={`${styles.tab} ${activeTab === 'preview' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('preview')}
                  >
                    <HiEye className={styles.tabIcon} />
                    <span className={styles.tabText}>Preview</span>
                  </button>
                </div>

                {/* Tab Content */}
                <div className={styles.tabContent}>
                  {activeTab === 'code' && (
                    <div className={styles.tabPanel}>

                      <button
                        type="button"
                        onClick={handleShareLink}
                        className={styles.shareButton}
                        title="Copy shareable link with current settings"
                      >
                        <HiShare className={styles.buttonIcon} />
                        Share Link
                      </button>
                      <div className={styles.codeOutputs}>
                        {outputs.cssClamp && (
                          <CodeOutput
                            title="CSS Clamp"
                            code={outputs.cssClamp}
                            onCopy={handleCopyCode}
                          />
                        )}

                        {outputs.cssFallback && (
                          <CodeOutput
                            title="CSS Fallback"
                            code={outputs.cssFallback}
                            onCopy={handleCopyCode}
                          />
                        )}

                        {outputs.cssCustomProperties && (
                          <CodeOutput
                            title="CSS Custom Properties"
                            code={outputs.cssCustomProperties}
                            onCopy={handleCopyCode}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'chart' && (
                    <div className={styles.tabPanel}>
                      <ClampChart formData={formData} outputs={outputs} />
                    </div>
                  )}

                  {activeTab === 'preview' && (
                    <div className={styles.tabPanel}>
                      <ClampPreview
                        formData={formData}
                        clampValue={outputs.cssClamp}
                        outputs={outputs}
                      />
                    </div>
                  )}

                  {activeTab === 'table' && (
                    <div className={styles.tabPanel}>
                      <div className={styles.tableHeader}>
                        <div className={styles.breakpointActions}>
                          <button
                            onClick={toggleAddBreakpoint}
                            className={styles.addBreakpointButton}
                            title="Add custom breakpoint"
                          >
                            <HiPlus className={styles.buttonIcon} />
                            Add Breakpoint
                          </button>
                        </div>
                      </div>

                      {/* Breakpoint Form */}
                      {showAddBreakpoint && (
                        <BreakpointForm
                          registerBreakpoint={registerBreakpoint}
                          handleSubmitBreakpoint={handleSubmitBreakpoint}
                          breakpointErrors={breakpointErrors}
                          isBreakpointValid={isBreakpointValid}
                          onAddBreakpoint={onAddBreakpoint}
                          onCancel={onCancelBreakpoint}
                        />
                      )}

                      {/* Breakpoint Table */}
                      <BreakpointTable
                        breakpointTable={outputs.breakpointTable}
                        onDeleteBreakpoint={handleDeleteBreakpoint}
                        onUpdateBreakpoint={handleUpdateBreakpoint}
                      />
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