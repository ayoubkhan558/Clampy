import { useForm, useWatch } from 'react-hook-form';
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