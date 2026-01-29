// Design System - Dark mode first, clean and modern

export const colors = {
  // Backgrounds
  background: {
    primary: '#0A0A0A',      // Main background - near black
    secondary: '#141414',    // Cards, elevated surfaces
    tertiary: '#1E1E1E',     // Input fields, subtle elevation
  },

  // Text
  text: {
    primary: '#FFFFFF',      // Main text
    secondary: '#A0A0A0',    // Muted text
    tertiary: '#606060',     // Very muted, hints
  },

  // Accent - Electric blue (can be changed later)
  accent: {
    primary: '#3B82F6',      // Main accent color
    secondary: '#60A5FA',    // Lighter variant
    muted: '#1E3A5F',        // Background tint
  },

  // Success/Progress
  success: {
    primary: '#22C55E',
    secondary: '#4ADE80',
    muted: '#14532D',
  },

  // Warning
  warning: {
    primary: '#F59E0B',
    secondary: '#FBBF24',
    muted: '#78350F',
  },

  // Error
  error: {
    primary: '#EF4444',
    secondary: '#F87171',
    muted: '#7F1D1D',
  },

  // Borders
  border: {
    primary: '#2A2A2A',
    secondary: '#3A3A3A',
  },

  // Specific UI elements
  tabBar: {
    background: '#0A0A0A',
    active: '#3B82F6',
    inactive: '#606060',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  title: 32,
  hero: 40,
};

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Common shadow for cards (subtle on dark mode)
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
};

export default theme;
