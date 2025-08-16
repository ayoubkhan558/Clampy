import { useState, useEffect, useCallback } from 'react';
import { calculateClamp } from '../utils/clampUtils';
import { updateUrlParams } from '../utils/urlUtils';

/**
 * Custom hook for managing clamp calculations and outputs
 */
export const useClampCalculations = (formData, isValid, customBreakpoints) => {
  // Output state
  const [outputs, setOutputs] = useState({
    cssClamp: '',
    cssFallback: '',
    cssCustomProperties: '',
    breakpointTable: []
  });

  // Calculate clamp values
  const calculateOutputs = useCallback((data) => {
    return calculateClamp(data, customBreakpoints);
  }, [customBreakpoints]);

  // Update outputs when form data changes
  useEffect(() => {
    // Only calculate if form is valid
    if (isValid && formData) {
      const newOutputs = calculateOutputs(formData);
      setOutputs(newOutputs);
      
      // Update URL params with debouncing
      clearTimeout(window.urlUpdateTimeout);
      window.urlUpdateTimeout = setTimeout(() => {
        updateUrlParams(formData);
      }, 500);
    } else {
      setOutputs({ 
        cssClamp: '', 
        cssFallback: '', 
        cssCustomProperties: '', 
        breakpointTable: [] 
      });
    }
  }, [formData, isValid, calculateOutputs]);

  return outputs;
};