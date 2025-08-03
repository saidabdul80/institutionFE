import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { 
  componentPatterns, 
  getStatusColorDarkMode, 
  updateClassesForDarkMode 
} from '@/utils/darkModeUpdater'

/**
 * Dark Mode Composable
 * Provides reactive dark mode utilities for Vue components
 */
export function useDarkMode() {
  const themeStore = useThemeStore()
  
  // Reactive theme state
  const isDark = computed(() => themeStore.isDark)
  const theme = computed(() => themeStore.theme)
  
  // Theme actions
  const toggleTheme = () => themeStore.toggleTheme()
  const setTheme = (newTheme) => themeStore.setTheme(newTheme)
  
  // Utility functions
  const getThemeClasses = (baseClasses, darkClasses = '') => {
    if (darkClasses) {
      return `${baseClasses} ${darkClasses}`
    }
    return updateClassesForDarkMode(baseClasses)
  }
  
  const getStatusColor = (status, type = 'badge') => {
    return getStatusColorDarkMode(status, type)
  }
  
  // Pre-built component patterns
  const patterns = computed(() => componentPatterns)
  
  // Dynamic class builders
  const buildClasses = {
    page: () => patterns.value.pageContainer,
    card: (padding = 'p-6') => `${patterns.value.card} ${padding}`,
    title: () => patterns.value.title,
    subtitle: () => patterns.value.subtitle,
    button: (variant = 'primary') => patterns.value[`${variant}Button`] || patterns.value.primaryButton,
    badge: (status = 'info') => getStatusColor(status, 'badge'),
    table: () => ({
      table: patterns.value.table,
      header: patterns.value.tableHeader,
      headerText: patterns.value.tableHeaderText,
      row: patterns.value.tableRow,
      cell: patterns.value.tableCell
    }),
    modal: () => ({
      overlay: patterns.value.modalOverlay,
      content: patterns.value.modal
    })
  }
  
  // Conditional classes based on theme
  const conditionalClasses = (lightClasses, darkClasses) => {
    return computed(() => isDark.value ? darkClasses : lightClasses)
  }
  
  // Theme-aware style object
  const themeStyles = computed(() => ({
    backgroundColor: isDark.value ? '#1f2937' : '#ffffff',
    color: isDark.value ? '#f9fafb' : '#111827',
    borderColor: isDark.value ? '#374151' : '#e5e7eb'
  }))
  
  return {
    // State
    isDark,
    theme,
    
    // Actions
    toggleTheme,
    setTheme,
    
    // Utilities
    getThemeClasses,
    getStatusColor,
    patterns,
    buildClasses,
    conditionalClasses,
    themeStyles,
    
    // Helper methods
    isLight: computed(() => !isDark.value),
    isDarkMode: computed(() => isDark.value),
    isLightMode: computed(() => !isDark.value)
  }
}

/**
 * Specific composable for form elements
 */
export function useDarkModeForm() {
  const { isDark, getThemeClasses } = useDarkMode()
  
  const formClasses = computed(() => ({
    input: getThemeClasses(
      'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
      'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
    ),
    select: getThemeClasses(
      'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
      'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
    ),
    textarea: getThemeClasses(
      'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical',
      'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
    ),
    label: getThemeClasses(
      'block text-sm font-medium mb-2',
      'text-gray-700 dark:text-gray-300'
    ),
    error: getThemeClasses(
      'text-sm mt-1',
      'text-red-600 dark:text-red-400'
    ),
    help: getThemeClasses(
      'text-sm mt-1',
      'text-gray-500 dark:text-gray-400'
    )
  }))
  
  return {
    isDark,
    formClasses
  }
}

/**
 * Specific composable for table elements
 */
export function useDarkModeTable() {
  const { isDark, getThemeClasses } = useDarkMode()
  
  const tableClasses = computed(() => ({
    wrapper: getThemeClasses(
      'overflow-x-auto shadow-sm rounded-lg',
      'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
    ),
    table: 'min-w-full divide-y divide-gray-200 dark:divide-gray-700',
    thead: 'bg-gray-50 dark:bg-gray-700',
    th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider',
    tbody: 'bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700',
    tr: 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200',
    td: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'
  }))
  
  return {
    isDark,
    tableClasses
  }
}

export default useDarkMode
