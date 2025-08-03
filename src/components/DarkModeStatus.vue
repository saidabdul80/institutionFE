<template>
  <div class="fixed bottom-4 left-4 z-50" v-if="showStatus">
    <div 
      class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 transition-all duration-200"
      :class="{ 'opacity-75': !isVisible }"
    >
      <div class="flex items-center space-x-2">
        <div class="flex items-center space-x-1">
          <div 
            class="w-2 h-2 rounded-full transition-colors duration-200"
            :class="isDark ? 'bg-blue-500' : 'bg-yellow-500'"
          ></div>
          <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
            {{ isDark ? 'Dark' : 'Light' }} Mode
          </span>
        </div>
        
        <button 
          @click="toggleTheme"
          class="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors duration-200"
        >
          Switch
        </button>
        
        <button 
          @click="hideStatus"
          class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

export default {
  name: 'DarkModeStatus',
  setup() {
    const themeStore = useThemeStore()
    const showStatus = ref(false)
    const isVisible = ref(true)
    
    // Show status for a few seconds when theme changes
    const showTemporarily = () => {
      showStatus.value = true
      isVisible.value = true
      
      setTimeout(() => {
        isVisible.value = false
        setTimeout(() => {
          showStatus.value = false
        }, 300)
      }, 2000)
    }
    
    const hideStatus = () => {
      isVisible.value = false
      setTimeout(() => {
        showStatus.value = false
      }, 300)
    }
    
    const toggleTheme = () => {
      themeStore.toggleTheme()
      showTemporarily()
    }
    
    onMounted(() => {
      // Show status briefly on mount
      showTemporarily()
    })
    
    return {
      isDark: themeStore.isDark,
      showStatus,
      isVisible,
      toggleTheme,
      hideStatus
    }
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
