export const LOADING_CONFIG = {
  // Delays
  DEFAULT_DELAY: 200, // ms antes de mostrar loader
  AUTO_HIDE_SUCCESS: 2000, // ms para ocultar estado success
  AUTO_HIDE_ERROR: 3000, // ms para ocultar estado error
  DOUBLE_CLICK_DELAY: 1000, // ms entre clicks permitidos
  PAGE_LOAD_TIMEOUT: 10000, // ms timeout para page loads
  DEBOUNCE_DELAY: 300, // ms para debounce de búsquedas
  
  // Button variants
  BUTTON_VARIANTS: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-blue-400',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-500 disabled:bg-gray-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-red-400',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 disabled:bg-green-400',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500 disabled:text-gray-400'
  },
  
  // Spinner types
  SPINNER_TYPES: {
    dots: 'three-dots-spinner',
    circle: 'circle-spinner',
    bars: 'bars-spinner',
    pulse: 'pulse-spinner',
    ring: 'ring-spinner'
  },
  
  // Sizes
  SIZES: {
    xs: { width: 'w-3', height: 'h-3', padding: 'px-2 py-1', text: 'text-xs' },
    sm: { width: 'w-4', height: 'h-4', padding: 'px-3 py-1.5', text: 'text-sm' },
    md: { width: 'w-6', height: 'h-6', padding: 'px-4 py-2', text: 'text-sm' },
    lg: { width: 'w-8', height: 'h-8', padding: 'px-6 py-3', text: 'text-base' },
    xl: { width: 'w-12', height: 'h-12', padding: 'px-8 py-4', text: 'text-lg' }
  },
  
  // Colors
  COLORS: {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    gray: 'text-gray-400',
    success: 'text-green-600',
    danger: 'text-red-600'
  },
  
  // Animation speeds
  SPEEDS: {
    slow: 'animate-spin-slow',
    normal: 'animate-spin',
    fast: 'animate-spin-fast'
  },
  
  // Z-index values
  Z_INDEX: {
    overlay: 9999,
    modal: 9998,
    dropdown: 9997,
    tooltip: 9996
  }
};

export default LOADING_CONFIG;