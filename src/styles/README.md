# CSS Variables Design System

This document outlines the comprehensive CSS variables system used throughout the Clampy application for consistent theming and easier maintenance.

## Overview

The design system is built on a foundation of CSS custom properties (variables) that provide:

- **Consistent theming** across all components
- **Dark mode support** with automatic switching
- **Maintainable code** with centralized design tokens
- **Responsive design** with fluid typography and spacing
- **Accessibility** with proper contrast ratios

## File Structure

```
src/styles/
├── _variables.scss      # Main CSS variables and design tokens
├── _clamp.scss          # Fluid typography and spacing utilities
└── README.md           # This documentation file
```