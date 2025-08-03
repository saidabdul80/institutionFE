<template>
  <div 
    :class="[
      'rounded-lg border shadow-sm transition-all duration-200',
      isDark 
        ? 'bg-gray-800 border-gray-700 text-white hover:shadow-lg hover:shadow-gray-900/20' 
        : 'bg-white border-gray-200 text-gray-900 hover:shadow-lg hover:shadow-gray-900/10',
      padding,
      customClasses
    ]"
  >
    <!-- Header slot -->
    <div v-if="$slots.header" :class="headerClasses">
      <slot name="header" />
    </div>
    
    <!-- Default content slot -->
    <div :class="contentClasses">
      <slot />
    </div>
    
    <!-- Footer slot -->
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
import { useThemeStore } from '@/stores/theme'
import { computed } from 'vue'

export default {
  name: 'ThemeCard',
  props: {
    padding: {
      type: String,
      default: 'p-6',
      validator: (value) => ['p-0', 'p-2', 'p-4', 'p-6', 'p-8'].includes(value)
    },
    headerPadding: {
      type: String,
      default: 'px-6 py-4'
    },
    footerPadding: {
      type: String,
      default: 'px-6 py-4'
    },
    customClasses: {
      type: String,
      default: ''
    },
    bordered: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const themeStore = useThemeStore()
    
    const isDark = computed(() => themeStore.isDark)
    
    const headerClasses = computed(() => [
      props.headerPadding,
      'border-b',
      isDark.value ? 'border-gray-700' : 'border-gray-200'
    ])
    
    const contentClasses = computed(() => [
      // Content gets no padding if card has padding
      props.padding === 'p-0' ? 'p-6' : ''
    ])
    
    const footerClasses = computed(() => [
      props.footerPadding,
      'border-t',
      isDark.value ? 'border-gray-700' : 'border-gray-200'
    ])
    
    return {
      isDark,
      headerClasses,
      contentClasses,
      footerClasses
    }
  }
}
</script>

<style scoped>
/* Additional card-specific styles */
</style>
