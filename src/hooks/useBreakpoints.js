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
    handleDeleteBreakpoint,
    toggleAddBreakpoint,
    hideAddBreakpoint
  };
};