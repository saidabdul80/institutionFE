/**
 * Dark Mode Class Mappings
 * Use this utility to systematically update components for dark mode support
 */

export const darkModeClassMappings = {
  // Background colors
  'bg-white': 'bg-white dark:bg-gray-800',
  'bg-gray-50': 'bg-gray-50 dark:bg-gray-900',
  'bg-gray-100': 'bg-gray-100 dark:bg-gray-800',
  'bg-gray-200': 'bg-gray-200 dark:bg-gray-700',
  'bg-blue-50': 'bg-blue-50 dark:bg-blue-900/20',
  'bg-green-50': 'bg-green-50 dark:bg-green-900/20',
  'bg-yellow-50': 'bg-yellow-50 dark:bg-yellow-900/20',
  'bg-red-50': 'bg-red-50 dark:bg-red-900/20',

  // Text colors
  'text-gray-900': 'text-gray-900 dark:text-white',
  'text-gray-800': 'text-gray-800 dark:text-gray-100',
  'text-gray-700': 'text-gray-700 dark:text-gray-200',
  'text-gray-600': 'text-gray-600 dark:text-gray-300',
  'text-gray-500': 'text-gray-500 dark:text-gray-400',
  'text-black': 'text-black dark:text-white',

  // Border colors
  'border-gray-100': 'border-gray-100 dark:border-gray-700',
  'border-gray-200': 'border-gray-200 dark:border-gray-600',
  'border-gray-300': 'border-gray-300 dark:border-gray-600',

  // Hover states
  'hover:bg-gray-50': 'hover:bg-gray-50 dark:hover:bg-gray-700',
  'hover:bg-gray-100': 'hover:bg-gray-100 dark:hover:bg-gray-600',
  'hover:bg-blue-50': 'hover:bg-blue-50 dark:hover:bg-blue-900/30',

  // Button colors
  'bg-blue-500': 'bg-blue-500 dark:bg-blue-600',
  'bg-green-500': 'bg-green-500 dark:bg-green-600',
  'bg-red-500': 'bg-red-500 dark:bg-red-600',
  'bg-yellow-500': 'bg-yellow-500 dark:bg-yellow-600',
  'bg-gray-500': 'bg-gray-500 dark:bg-gray-600',

  // Button hover states
  'hover:bg-blue-600': 'hover:bg-blue-600 dark:hover:bg-blue-700',
  'hover:bg-green-600': 'hover:bg-green-600 dark:hover:bg-green-700',
  'hover:bg-red-600': 'hover:bg-red-600 dark:hover:bg-red-700',
  'hover:bg-yellow-600': 'hover:bg-yellow-600 dark:hover:bg-yellow-700',
  'hover:bg-gray-600': 'hover:bg-gray-600 dark:hover:bg-gray-700',

  // Divide colors
  'divide-gray-200': 'divide-gray-200 dark:divide-gray-700',
  'divide-gray-300': 'divide-gray-300 dark:divide-gray-600',
};

/**
 * Common dark mode patterns for different component types
 */
export const componentPatterns = {
  // Page container
  pageContainer: 'bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200',
  
  // Card/Panel
  card: 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-colors duration-200',
  
  // Header
  header: 'bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700',
  
  // Title
  title: 'text-gray-800 dark:text-white transition-colors duration-200',
  
  // Subtitle/Description
  subtitle: 'text-gray-600 dark:text-gray-300 transition-colors duration-200',
  
  // Table
  table: 'bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700',
  tableHeader: 'bg-gray-50 dark:bg-gray-700',
  tableHeaderText: 'text-gray-500 dark:text-gray-300',
  tableRow: 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200',
  tableCell: 'text-gray-900 dark:text-gray-100',
  
  // Form elements
  input: 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white',
  select: 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white',
  
  // Buttons
  primaryButton: 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200',
  secondaryButton: 'bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white transition-colors duration-200',
  successButton: 'bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white transition-colors duration-200',
  dangerButton: 'bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white transition-colors duration-200',
  
  // Status badges
  successBadge: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  warningBadge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  errorBadge: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  infoBadge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  
  // Modal
  modal: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
  modalOverlay: 'bg-black/50 dark:bg-black/70',
};

/**
 * Function to update a component's classes for dark mode
 */
export function updateClassesForDarkMode(originalClasses) {
  let updatedClasses = originalClasses;

  // Apply mappings
  Object.entries(darkModeClassMappings).forEach(([original, updated]) => {
    const regex = new RegExp(`\\b${original}\\b`, 'g');
    updatedClasses = updatedClasses.replace(regex, updated);
  });

  return updatedClasses;
}

/**
 * Auto-update Vue component template for dark mode
 * This function can be used to automatically add dark mode classes
 */
export function autoUpdateTemplate(templateString) {
  let updatedTemplate = templateString;

  // Update common patterns
  quickUpdatePatterns.forEach(pattern => {
    const regex = new RegExp(pattern.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    updatedTemplate = updatedTemplate.replace(regex, pattern.replace);
  });

  // Update individual classes
  Object.entries(darkModeClassMappings).forEach(([original, updated]) => {
    const regex = new RegExp(`class="([^"]*\\b${original}\\b[^"]*)"`, 'g');
    updatedTemplate = updatedTemplate.replace(regex, (_, classContent) => {
      const newClassContent = classContent.replace(new RegExp(`\\b${original}\\b`, 'g'), updated);
      return `class="${newClassContent}"`;
    });
  });

  return updatedTemplate;
}

/**
 * Status color mappings for dark mode
 */
export function getStatusColorDarkMode(status, type = 'badge') {
  const statusMappings = {
    badge: {
      'active': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      'inactive': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
      'pending': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      'completed': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      'failed': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      'success': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      'error': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      'warning': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      'info': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    },
    text: {
      'active': 'text-green-600 dark:text-green-400',
      'inactive': 'text-gray-600 dark:text-gray-400',
      'pending': 'text-yellow-600 dark:text-yellow-400',
      'completed': 'text-blue-600 dark:text-blue-400',
      'failed': 'text-red-600 dark:text-red-400',
      'success': 'text-green-600 dark:text-green-400',
      'error': 'text-red-600 dark:text-red-400',
      'warning': 'text-yellow-600 dark:text-yellow-400',
      'info': 'text-blue-600 dark:text-blue-400',
    }
  };
  
  return statusMappings[type]?.[status] || statusMappings[type]?.['inactive'];
}

/**
 * Quick update patterns for common page structures
 */
export const quickUpdatePatterns = [
  {
    name: 'Page Container',
    find: 'class="p-4 sm:p-6 max-w-7xl mx-auto"',
    replace: 'class="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200"'
  },
  {
    name: 'Header Card',
    find: 'class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100"',
    replace: 'class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200"'
  },
  {
    name: 'Main Title',
    find: 'class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2"',
    replace: 'class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-200"'
  },
  {
    name: 'Subtitle',
    find: 'class="text-gray-600 text-sm sm:text-base"',
    replace: 'class="text-gray-600 dark:text-gray-300 text-sm sm:text-base transition-colors duration-200"'
  }
];

export default {
  darkModeClassMappings,
  componentPatterns,
  updateClassesForDarkMode,
  getStatusColorDarkMode,
  quickUpdatePatterns
};
