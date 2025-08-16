import * as yup from 'yup';

// Main clamp validation schema
export const clampSchema = yup.object({
  outputUnit: yup.string()
    .oneOf(['px', 'rem'], 'Please select px or rem')
    .required('Please select an output unit'),
  
  rootFontSize: yup.number()
    .typeError('Please enter a valid number')
    .positive('Root font size must be positive')
    .integer('Root font size must be a whole number')
    .min(8, 'Root font size should be at least 8px')
    .max(32, 'Root font size should be at most 32px')
    .required('Root font size is required'),
  
  minSize: yup.number()
    .typeError('Please enter a valid number')
    .positive('Minimum size must be positive')
    .min(0.1, 'Minimum size should be at least 0.1')
    .max(1000, 'Minimum size should be at most 1000')
    .required('Minimum size is required'),
  
  maxSize: yup.number()
    .typeError('Please enter a valid number')
    .positive('Maximum size must be positive')
    .min(0.1, 'Maximum size should be at least 0.1')
    .max(1000, 'Maximum size should be at most 1000')
    .test('greater-than-min', 'Maximum size must be greater than minimum size', function(value) {
      const { minSize } = this.parent;
      return !minSize || !value || value > minSize;
    })
    .required('Maximum size is required'),
  
  minScreenWidth: yup.number()
    .typeError('Please enter a valid number')
    .positive('Minimum screen width must be positive')
    .integer('Screen width must be a whole number')
    .min(200, 'Minimum screen width should be at least 200px')
    .max(2000, 'Minimum screen width should be at most 2000px')
    .required('Minimum screen width is required'),
  
  maxScreenWidth: yup.number()
    .typeError('Please enter a valid number')
    .positive('Maximum screen width must be positive')
    .integer('Screen width must be a whole number')
    .min(400, 'Maximum screen width should be at least 400px')
    .max(4000, 'Maximum screen width should be at most 4000px')
    .test('greater-than-min-screen', 'Maximum screen width must be greater than minimum screen width', function(value) {
      const { minScreenWidth } = this.parent;
      return !minScreenWidth || !value || value > minScreenWidth;
    })
    .required('Maximum screen width is required'),
    
  generateCustomProperties: yup.boolean(),
  
  includeFallback: yup.boolean(),
  
  useContainerQueries: yup.boolean(),
  
  customPropertyName: yup.string()
    .when('generateCustomProperties', {
      is: true,
      then: (schema) => schema
        .trim()
        .min(1, 'Property name is required')
        .max(50, 'Property name must be 50 characters or less')
        .matches(/^[a-zA-Z][a-zA-Z0-9-]*$/, 'Property name must start with a letter and contain only letters, numbers, and hyphens')
        .required('Property name is required when generating custom properties'),
      otherwise: (schema) => schema.optional()
    })
});

// Custom breakpoint validation schema
export const breakpointSchema = yup.object({
  name: yup.string()
    .trim()
    .min(1, 'Please enter a breakpoint name')
    .max(30, 'Name must be 30 characters or less')
    .matches(/^[a-zA-Z0-9\s\-_]+$/, 'Name can only contain letters, numbers, spaces, hyphens, and underscores')
    .required('Please enter a breakpoint name'),
  
  width: yup.number()
    .typeError('Please enter a valid number')
    .positive('Width must be positive')
    .integer('Width must be a whole number')
    .min(200, 'Width should be at least 200px')
    .max(4000, 'Width should be at most 4000px')
    .required('Please enter a screen width'),
  
  device: yup.string()
    .trim()
    .min(1, 'Please enter a device name')
    .max(50, 'Device name must be 50 characters or less')
    .matches(/^[a-zA-Z0-9\s\-_()]+$/, 'Device name can only contain letters, numbers, spaces, hyphens, underscores, and parentheses')
    .required('Please enter a device name')
});