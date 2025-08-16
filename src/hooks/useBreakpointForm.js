import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { breakpointSchema } from '../utils/validationSchemas';

/**
 * Custom hook for managing the breakpoint form
 */
export const useBreakpointForm = () => {
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

  return {
    registerBreakpoint,
    handleSubmitBreakpoint,
    resetBreakpoint,
    breakpointErrors,
    isBreakpointValid
  };
};
