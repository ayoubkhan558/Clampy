import { useState, useEffect, useCallback, useRef } from 'react';
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

  // Use ref to store timeout ID instead of window object
  const urlUpdateTimeoutRef = useRef(null);

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
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }
      urlUpdateTimeoutRef.current = setTimeout(() => {
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

    // Cleanup function to clear timeout on unmount
    return () => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }
    };
  }, [formData, isValid, calculateOutputs]);

  return outputs;
};