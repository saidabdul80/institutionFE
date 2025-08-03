// plugins/darkMode.js
import { useThemeStore } from '@/stores/theme'

export default {
  install(app) {
    // Initialize theme store
    const themeStore = useThemeStore()

    // Make theme utilities globally available
    app.config.globalProperties.$theme = themeStore

    // Add dark mode utility functions
    app.config.globalProperties.$darkMode = {
      isDark: () => themeStore.isDark,
      toggle: () => themeStore.toggleTheme(),
      setTheme: (theme) => themeStore.setTheme(theme),

      // Get theme-aware classes
      getClass: (lightClass, darkClass) => {
        return themeStore.isDark ? darkClass : lightClass
      },

      // Get status colors for badges/tags
      getStatusColor: (status) => {
        const colors = {
          active: themeStore.isDark
            ? 'bg-green-900/30 text-green-300'
            : 'bg-green-100 text-green-800',
          inactive: themeStore.isDark
            ? 'bg-gray-700 text-gray-300'
            : 'bg-gray-100 text-gray-800',
          pending: themeStore.isDark
            ? 'bg-yellow-900/30 text-yellow-300'
            : 'bg-yellow-100 text-yellow-800',
          success: themeStore.isDark
            ? 'bg-green-900/30 text-green-300'
            : 'bg-green-100 text-green-800',
          error: themeStore.isDark
            ? 'bg-red-900/30 text-red-300'
            : 'bg-red-100 text-red-800',
          warning: themeStore.isDark
            ? 'bg-yellow-900/30 text-yellow-300'
            : 'bg-yellow-100 text-yellow-800'
        }
        return colors[status] || colors.inactive
      }
    }
  }
}