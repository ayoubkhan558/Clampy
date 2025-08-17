import { useForm, useWatch } from 'react-hook-form';
import { useEffect, useRef } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { clampSchema } from '../utils/validationSchemas';
import { getUrlParams, updateUrlParams } from '../utils/urlUtils';
import { DEFAULT_FORM_VALUES } from '../utils/constants';

/**
 * Custom hook for managing the main clamp form
 */
export const useClampForm = () => {
  // Initialize default values from URL params or defaults
  const getDefaultValues = () => {
    try {
      return getUrlParams();
    } catch {
      return DEFAULT_FORM_VALUES;
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

  // Keep sizes consistent when switching units (px <-> rem)
  const prevUnitRef = useRef(formData.outputUnit);
  useEffect(() => {
    const currentUnit = formData.outputUnit;
    const previousUnit = prevUnitRef.current;
    if (!currentUnit || !previousUnit || currentUnit === previousUnit) return;

    const root = parseFloat(formData.rootFontSize) || 16;
    let min = parseFloat(formData.minSize);
    let max = parseFloat(formData.maxSize);

    if (previousUnit === 'px' && currentUnit === 'rem') {
      // Convert px -> rem
      min = min / root;
      max = max / root;
    } else if (previousUnit === 'rem' && currentUnit === 'px') {
      // Convert rem -> px
      min = min * root;
      max = max * root;
    } else {
      prevUnitRef.current = currentUnit;
      return;
    }

    // Apply converted values and update URL
    const minFixed = Number(min.toFixed(3));
    const maxFixed = Number(max.toFixed(3));
    setValue('minSize', minFixed, { shouldValidate: true, shouldDirty: true });
    setValue('maxSize', maxFixed, { shouldValidate: true, shouldDirty: true });
    updateUrlParams({ ...formData, minSize: minFixed, maxSize: maxFixed });

    prevUnitRef.current = currentUnit;
  }, [formData.outputUnit, formData.rootFontSize, formData.minSize, formData.maxSize, setValue]);

  /**
   * Reset form to defaults
   */
  const handleReset = () => {
    reset(DEFAULT_FORM_VALUES);
    updateUrlParams(DEFAULT_FORM_VALUES);
  };

  /**
   * Form submission handler (not used for real-time updates, but kept for completeness)
   */
  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors, isValid },
    formData,
    handleReset,
    onSubmit
  };
};