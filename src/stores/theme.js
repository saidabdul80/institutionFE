import { darkModeClassMappings } from '@/utils/darkModeUpdater'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // State
  const isDark = ref(false)
  const theme = ref('light')
  
  // Initialize theme from localStorage or system preference
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme) {
      theme.value = savedTheme
      isDark.value = savedTheme === 'dark'
    } else {
      theme.value = systemPrefersDark ? 'dark' : 'light'
      isDark.value = systemPrefersDark
    }
    applyTheme()
  }

 const transformClasses = () => {
    // const elements = document.querySelectorAll('[class]')
    // elements.forEach(el => {
    //   let newClasses = el.className.split(' ')
    //     .map(originalClass => {
    //       // Check if this class has a dark mode equivalent
    //       return classMappings[originalClass] 
    //         ? `${originalClass} ${darkModeClassMappings[originalClass]}`
    //         : originalClass
    //     })
    //     .join(' ')
      
    //   el.className = newClasses
    // })
  }
  
  // Apply theme to document
  const applyTheme = () => {
    const root = document.documentElement
    
    if (isDark.value) {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark.value ? '#1f2937' : '#ffffff')
    }

     if (isDark.value) {
      transformClasses()
    }

  }
  
  // Toggle theme
  const toggleTheme = () => {
    isDark.value = !isDark.value
    theme.value = isDark.value ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    applyTheme()
  }
  
  // Set specific theme
  const setTheme = (newTheme) => {
    theme.value = newTheme
    isDark.value = newTheme === 'dark'
    localStorage.setItem('theme', newTheme)
    applyTheme()
  }
  
  // Watch for system theme changes
  const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches
        theme.value = e.matches ? 'dark' : 'light'
        applyTheme()
      }
    })
  }
  
  // Getters
  const currentTheme = () => theme.value
  const isLightMode = () => !isDark.value
  const isDarkMode = () => isDark.value
  
  return {
    // State
    isDark,
    theme,
    
    // Actions
    initializeTheme,
    toggleTheme,
    setTheme,
    watchSystemTheme,
    
    // Getters
    currentTheme,
    isLightMode,
    isDarkMode
  }
})
