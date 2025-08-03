<template>
  <div 
    :class="[
      'min-h-screen transition-colors duration-300',
      isDark ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    ]"
  >
    <slot />
  </div>
</template>

<script>
import { useThemeStore } from '@/stores/theme'
import { computed } from 'vue'

export default {
  name: 'ThemeLayout',
  setup() {
    const themeStore = useThemeStore()
    
    const isDark = computed(() => themeStore.isDark)
    
    return {
      isDark
    }
  }
}
</script>

<style scoped>
/* Additional theme-specific styles can go here */
</style>
