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

## Color System

### Primary Colors
```scss
--color-primary-50: hsl(221.2 83.2% 95%);
--color-primary-100: hsl(221.2 83.2% 90%);
--color-primary-200: hsl(221.2 83.2% 80%);
--color-primary-300: hsl(221.2 83.2% 70%);
--color-primary-400: hsl(221.2 83.2% 60%);
--color-primary-500: hsl(221.2 83.2% 53.3%);  // Main brand color
--color-primary-600: hsl(221.2 83.2% 48%);
--color-primary-700: hsl(221.2 83.2% 40%);
--color-primary-800: hsl(221.2 83.2% 30%);
--color-primary-900: hsl(221.2 83.2% 20%);
--color-primary-950: hsl(221.2 83.2% 10%);
```

### Neutral Colors
```scss
--color-neutral-50: hsl(210 40% 98%);   // Lightest
--color-neutral-100: hsl(210 40% 96%);
--color-neutral-200: hsl(214.3 31.8% 91.4%);
--color-neutral-300: hsl(213.1 27.5% 84.3%);
--color-neutral-400: hsl(215.4 16.3% 56.9%);
--color-neutral-500: hsl(215.4 16.3% 46.9%);
--color-neutral-600: hsl(215.4 16.3% 36.9%);
--color-neutral-700: hsl(215.4 16.3% 26.9%);
--color-neutral-800: hsl(215.4 16.3% 16.9%);
--color-neutral-900: hsl(222.2 84% 4.9%);   // Darkest
--color-neutral-950: hsl(229 84% 4.9%);
```

### Status Colors
```scss
// Success
--color-success-500: hsl(142.1 76.2% 36.3%);
--color-success-50: hsl(142.1 76.2% 95%);

// Error
--color-error-500: hsl(0 84.2% 60.2%);
--color-error-50: hsl(0 84.2% 95%);

// Warning
--color-warning-500: hsl(38 92% 50%);
--color-warning-50: hsl(38 92% 95%);
```

## Semantic Colors

### Background Colors
```scss
--bg-primary: var(--color-neutral-50);      // Main background
--bg-secondary: var(--color-neutral-100);   // Secondary background
--bg-tertiary: var(--color-neutral-200);    // Tertiary background
--bg-muted: var(--color-neutral-100);       // Muted background
--bg-card: var(--color-neutral-50);         // Card background
--bg-overlay: hsl(0 0% 0% / 0.5);          // Overlay background
```

### Text Colors
```scss
--text-primary: var(--color-neutral-900);   // Primary text
--text-secondary: var(--color-neutral-600); // Secondary text
--text-muted: var(--color-neutral-500);     // Muted text
--text-inverse: var(--color-neutral-50);    // Inverse text
```

### Border Colors
```scss
--border-primary: var(--color-neutral-200);   // Primary borders
--border-secondary: var(--color-neutral-300); // Secondary borders
--border-focus: var(--color-primary-500);     // Focus state borders
--border-error: var(--color-error-500);       // Error state borders
--border-success: var(--color-success-500);   // Success state borders
--border-warning: var(--color-warning-500);   // Warning state borders
```

### Accent Colors
```scss
--accent-primary: var(--color-primary-500);     // Primary accent
--accent-hover: var(--color-primary-600);       // Hover state
--accent-active: var(--color-primary-700);      // Active state
--accent-foreground: var(--color-neutral-50);   // Accent text
```

## Spacing System

The spacing system uses a consistent scale based on 4px (0.25rem) increments:

```scss
--space-0: 0;           // 0px
--space-1: 0.25rem;     // 4px
--space-2: 0.5rem;      // 8px
--space-3: 0.75rem;     // 12px
--space-4: 1rem;        // 16px
--space-5: 1.25rem;     // 20px
--space-6: 1.5rem;      // 24px
--space-8: 2rem;        // 32px
--space-10: 2.5rem;     // 40px
--space-12: 3rem;       // 48px
--space-16: 4rem;       // 64px
--space-20: 5rem;       // 80px
--space-24: 6rem;       // 96px
--space-32: 8rem;       // 128px
```

## Typography System

### Font Families
```scss
--font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
--font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
```

### Font Sizes
```scss
--font-size-xs: 0.75rem;    // 12px
--font-size-sm: 0.875rem;   // 14px
--font-size-base: 1rem;     // 16px
--font-size-lg: 1.125rem;   // 18px
--font-size-xl: 1.25rem;    // 20px
--font-size-2xl: 1.5rem;    // 24px
--font-size-3xl: 1.875rem;  // 30px
--font-size-4xl: 2.25rem;   // 36px
--font-size-5xl: 3rem;      // 48px
--font-size-6xl: 3.75rem;   // 60px
```

### Font Weights
```scss
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

### Line Heights
```scss
--line-height-tight: 1.25;
--line-height-snug: 1.375;
--line-height-normal: 1.5;
--line-height-relaxed: 1.625;
--line-height-loose: 2;
```

## Border Radius System

```scss
--radius-none: 0;
--radius-sm: 0.125rem;   // 2px
--radius-base: 0.25rem;  // 4px
--radius-md: 0.375rem;   // 6px
--radius-lg: 0.5rem;     // 8px
--radius-xl: 0.75rem;    // 12px
--radius-2xl: 1rem;      // 16px
--radius-3xl: 1.5rem;    // 24px
--radius-full: 9999px;
```

## Shadow System

```scss
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

## Transition System

```scss
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slower: 500ms cubic-bezier(0.4, 0, 0.2, 1);
```

## Z-Index System

```scss
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
--z-toast: 1080;
```

## Breakpoints

```scss
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

## Usage Examples

### Basic Component Styling
```scss
.myComponent {
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
  
  &:hover {
    background: var(--bg-secondary);
    box-shadow: var(--shadow-lg);
  }
  
  &:focus {
    outline: 2px solid var(--border-focus);
    outline-offset: 2px;
  }
}
```

### Button Component
```scss
.button {
  background: var(--accent-primary);
  color: var(--accent-foreground);
  border: 1px solid var(--accent-primary);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    background: var(--accent-hover);
    border-color: var(--accent-hover);
  }
  
  &:focus {
    outline: 2px solid var(--border-focus);
    outline-offset: 2px;
  }
  
  &.secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-color: var(--border-primary);
    
    &:hover {
      background: var(--bg-tertiary);
      border-color: var(--text-muted);
    }
  }
}
```

### Form Input
```scss
.input {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  transition: var(--transition-base);
  
  &:focus {
    outline: none;
    border-color: var(--border-focus);
    box-shadow: 0 0 0 2px var(--color-primary-500 / 0.2);
  }
  
  &.error {
    border-color: var(--border-error);
    
    &:focus {
      box-shadow: 0 0 0 2px var(--color-error-500 / 0.2);
    }
  }
}
```

## Dark Mode

The design system automatically supports dark mode through CSS media queries. When `prefers-color-scheme: dark` is detected, the variables are automatically updated to provide appropriate contrast and colors for dark themes.

### Dark Mode Color Changes
- Background colors switch to darker variants
- Text colors switch to lighter variants
- Border colors adjust for better contrast
- Shadows become darker for better visibility
- Accent colors remain vibrant but slightly adjusted

## Utility Classes

The system includes utility classes for common styling needs:

### Background Utilities
```scss
.bg-primary { background-color: var(--bg-primary); }
.bg-secondary { background-color: var(--bg-secondary); }
.bg-tertiary { background-color: var(--bg-tertiary); }
.bg-muted { background-color: var(--bg-muted); }
.bg-card { background-color: var(--bg-card); }
```

### Text Utilities
```scss
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-muted { color: var(--text-muted); }
.text-inverse { color: var(--text-inverse); }
```

### Spacing Utilities
```scss
.m-4 { margin: var(--space-4); }
.p-4 { padding: var(--space-4); }
.mt-6 { margin-top: var(--space-6); }
.pb-8 { padding-bottom: var(--space-8); }
```

### Shadow Utilities
```scss
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
```

## Best Practices

1. **Always use CSS variables** instead of hardcoded values
2. **Use semantic color names** (e.g., `--text-primary` instead of `--color-neutral-900`)
3. **Leverage the spacing system** for consistent layouts
4. **Use the typography scale** for consistent text sizing
5. **Apply transitions** for smooth interactions
6. **Test in both light and dark modes**
7. **Ensure proper contrast ratios** for accessibility

## Maintenance

When updating the design system:

1. **Update variables in `_variables.scss`** - This is the single source of truth
2. **Test across all components** to ensure consistency
3. **Update documentation** to reflect changes
4. **Consider accessibility** when changing colors or contrast
5. **Test in both light and dark modes** to ensure proper theming

## Future Enhancements

Potential improvements to consider:

- **CSS-in-JS integration** for dynamic theming
- **Theme switching** beyond just light/dark modes
- **Custom property fallbacks** for older browsers
- **Animation system** with predefined keyframes
- **Component-specific variables** for more granular control
