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
      // Check if this is a custom breakpoint
      const existingCustom = prev.find(bp => bp.id === id);
      
      if (existingCustom) {
        // Update existing custom breakpoint
        return prev.map(bp => {
          if (bp.id === id) {
            return {
              ...bp,
              name: data.name,
              width: data.width,
              device: data.device
            };
          }
          return bp;
        });
      } else {
        // This is a default breakpoint being edited for the first time
        // Create a new custom breakpoint with the updated data
        const newCustomBp = createCustomBreakpoint({
          ...data,
          originalId: id // Keep track of the original default breakpoint
        });
        return [...prev, newCustomBp];
      }
    });
  };

  /**
   * Delete custom breakpoint
   */
  const handleDeleteBreakpoint = (id) => {
    setCustomBreakpoints(prev => prev.filter(bp => bp.id !== id));
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