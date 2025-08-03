import { useThemeStore } from '@/stores/theme'
import { computed } from 'vue'
import { getStatusColorDarkMode } from '@/utils/darkModeUpdater'

/**
 * Dark Mode Mixin
 * Provides common dark mode functionality to components
 */
export const darkModeMixin = {
  setup() {
    const themeStore = useThemeStore()
    
    const isDark = computed(() => themeStore.isDark)
    const theme = computed(() => themeStore.theme)
    
    return {
      isDark,
      theme
    }
  },
  
  methods: {
    /**
     * Get theme-aware classes
     */
    getThemeClasses(lightClasses, darkClasses = '') {
      if (darkClasses) {
        return `${lightClasses} ${darkClasses}`
      }
      
      // Auto-generate dark classes for common patterns
      const autoMappings = {
        'bg-white': 'dark:bg-gray-800',
        'bg-gray-50': 'dark:bg-gray-900',
        'bg-gray-100': 'dark:bg-gray-800',
        'text-gray-900': 'dark:text-white',
        'text-gray-800': 'dark:text-gray-100',
        'text-gray-600': 'dark:text-gray-300',
        'border-gray-100': 'dark:border-gray-700',
        'border-gray-200': 'dark:border-gray-600',
      }
      
      let result = lightClasses
      Object.entries(autoMappings).forEach(([light, dark]) => {
        if (lightClasses.includes(light)) {
          result += ` ${dark}`
        }
      })
      
      return result
    },
    
    /**
     * Get status color classes with dark mode support
     */
    getStatusColor(status, type = 'badge') {
      return getStatusColorDarkMode(status, type)
    },
    
    /**
     * Get button classes with dark mode support
     */
    getButtonClasses(variant = 'primary', size = 'md') {
      const variants = {
        primary: 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white',
        secondary: 'bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white',
        success: 'bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white',
        danger: 'bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white',
        warning: 'bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 text-white',
        outline: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
      }
      
      const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
      }
      
      return `${variants[variant]} ${sizes[size]} rounded-lg transition-colors duration-200`
    },
    
    /**
     * Get card classes with dark mode support
     */
    getCardClasses(padding = 'p-6') {
      return `bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${padding}`
    },
    
    /**
     * Get table classes with dark mode support
     */
    getTableClasses() {
      return {
        table: 'min-w-full divide-y divide-gray-200 dark:divide-gray-700',
        thead: 'bg-gray-50 dark:bg-gray-700',
        th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider',
        tbody: 'bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700',
        tr: 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200',
        td: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'
      }
    },
    
    /**
     * Get input classes with dark mode support
     */
    getInputClasses() {
      return 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200'
    },
    
    /**
     * Get modal classes with dark mode support
     */
    getModalClasses() {
      return {
        overlay: 'fixed inset-0 bg-black/50 dark:bg-black/70 z-50',
        container: 'fixed inset-0 z-50 flex items-center justify-center p-4',
        content: 'bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto',
        header: 'px-6 py-4 border-b border-gray-200 dark:border-gray-700',
        body: 'px-6 py-4',
        footer: 'px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2'
      }
    },
    
    /**
     * Toggle theme
     */
    toggleTheme() {
      const themeStore = useThemeStore()
      themeStore.toggleTheme()
    },
    
    /**
     * Set specific theme
     */
    setTheme(theme) {
      const themeStore = useThemeStore()
      themeStore.setTheme(theme)
    }
  },
  
  computed: {
    /**
     * Common theme-aware classes
     */
    themeClasses() {
      return {
        pageContainer: 'bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200',
        contentCard: 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-colors duration-200',
        title: 'text-gray-800 dark:text-white transition-colors duration-200',
        subtitle: 'text-gray-600 dark:text-gray-300 transition-colors duration-200',
        text: 'text-gray-900 dark:text-gray-100 transition-colors duration-200',
        mutedText: 'text-gray-500 dark:text-gray-400 transition-colors duration-200'
      }
    }
  }
}

export default darkModeMixin
