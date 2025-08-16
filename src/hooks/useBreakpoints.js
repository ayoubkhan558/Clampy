import { useState } from 'react';
import { createCustomBreakpoint } from '../utils/breakpointUtils';

/**
 * Custom hook for managing breakpoint state and operations
 */
export const useBreakpoints = () => {
  // Custom breakpoints state
  const [customBreakpoints, setCustomBreakpoints] = useState([]);
  const [showAddBreakpoint, setShowAddBreakpoint] = useState(false);

  /**
   * Add custom breakpoint
   */
  const handleAddBreakpoint = (data) => {
    const customBp = createCustomBreakpoint(data);
    setCustomBreakpoints(prev => [...prev, customBp]);
    setShowAddBreakpoint(false);
    return customBp;
  };

  /**
   * Update breakpoint (handles both custom and default breakpoints)
   */
  const handleUpdateBreakpoint = (id, data) => {
    setCustomBreakpoints(prev => {
      // Check if this is already a custom breakpoint (starts with 'custom-')
      const isCustomBreakpoint = id.startsWith('custom-');
      
      if (isCustomBreakpoint) {
        // Update existing custom breakpoint
        return prev.map(bp => {
          if (bp.id === id) {
            return {
              ...bp,
              name: data.name,
              width: parseInt(data.width),
              device: data.device
            };
          }
          return bp;
        });
      } else {
        // This is a default breakpoint being edited
        // Check if we already have a custom breakpoint for this original ID
        const customId = `custom-${id}`;
        const existingCustomForOriginal = prev.find(bp => bp.id === customId);
        
        if (existingCustomForOriginal) {
          // Update the existing custom breakpoint that overrides this default
          return prev.map(bp => {
            if (bp.id === customId) {
              return {
                ...bp,
                name: data.name,
                width: parseInt(data.width),
                device: data.device
              };
            }
            return bp;
          });
        } else {
          // Create a new custom breakpoint for the first time
          const newCustomBp = createCustomBreakpoint({
            ...data,
            originalId: id // Keep track of the original default breakpoint
          });
          return [...prev, newCustomBp];
        }
      }
    });
  };

  /**
   * Delete custom breakpoint or reset edited default breakpoint
   */
  const handleDeleteBreakpoint = (id) => {
    setCustomBreakpoints(prev => {
      // If it's a custom breakpoint (starts with 'custom-'), remove it directly
      if (id.startsWith('custom-')) {
        return prev.filter(bp => bp.id !== id);
      }
      
      // If it's a default breakpoint ID, look for the custom override and remove it
      const customOverrideId = `custom-${id}`;
      return prev.filter(bp => bp.id !== customOverrideId);
    });
  };

  /**
   * Toggle add breakpoint form visibility
   */
  const toggleAddBreakpoint = () => {
    setShowAddBreakpoint(!showAddBreakpoint);
  };

  /**
   * Hide add breakpoint form
   */
  const hideAddBreakpoint = () => {
    setShowAddBreakpoint(false);
  };

  return {
    customBreakpoints,
    showAddBreakpoint,
    handleAddBreakpoint,
    handleUpdateBreakpoint,
    handleDeleteBreakpoint,
    toggleAddBreakpoint,
    hideAddBreakpoint
  };
};