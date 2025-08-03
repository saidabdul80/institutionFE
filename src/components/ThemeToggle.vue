<template>
  <div class="theme-toggle">
    <!-- Simple Toggle Button -->
    <button
      v-if="variant === 'simple'"
      @click="toggleTheme"
      class="theme-toggle-btn"
      :class="themeClasses"
      :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    >
      <i :class="isDark ? 'fa fa-sun' : 'fa fa-moon'"></i>
    </button>

    <!-- Dropdown Toggle -->
    <div v-else-if="variant === 'dropdown'" class="relative">
      <button
        @click="showDropdown = !showDropdown"
        class="theme-dropdown-btn"
        :class="themeClasses"
      >
        <i :class="themeIcon" class="mr-2"></i>
        <span v-if="showLabel">{{ themeLabel }}</span>
        <i class="fa fa-chevron-down ml-2 text-xs"></i>
      </button>
      
      <div
        v-if="showDropdown"
        class="theme-dropdown"
        :class="dropdownClasses"
      >
        <button
          @click="setTheme('light')"
          class="theme-option"
          :class="{ 'active': !isDark }"
        >
          <i class="fa fa-sun mr-2"></i>
          Light
        </button>
        <button
          @click="setTheme('dark')"
          class="theme-option"
          :class="{ 'active': isDark }"
        >
          <i class="fa fa-moon mr-2"></i>
          Dark
        </button>
        <button
          @click="setTheme('system')"
          class="theme-option"
          :class="{ 'active': theme === 'system' }"
        >
          <i class="fa fa-desktop mr-2"></i>
          System
        </button>
      </div>
    </div>

    <!-- Switch Toggle -->
    <div v-else-if="variant === 'switch'" class="theme-switch">
      <label class="switch-label">
        <span v-if="showLabel" class="switch-text">
          {{ isDark ? 'Dark' : 'Light' }}
        </span>
        <div class="switch-container">
          <input
            type="checkbox"
            :checked="isDark"
            @change="toggleTheme"
            class="switch-input"
          />
          <div class="switch-slider">
            <div class="switch-thumb">
              <i :class="isDark ? 'fa fa-moon' : 'fa fa-sun'" class="switch-icon"></i>
            </div>
          </div>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
import { useThemeStore } from '@/stores/theme'
import { computed, ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ThemeToggle',
  props: {
    variant: {
      type: String,
      default: 'simple', // 'simple', 'dropdown', 'switch'
      validator: (value) => ['simple', 'dropdown', 'switch'].includes(value)
    },
    showLabel: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'md', // 'sm', 'md', 'lg'
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    }
  },
  setup(props) {
    const themeStore = useThemeStore()
    const showDropdown = ref(false)

    // Computed properties
    const isDark = computed(() => themeStore.isDark)
    const theme = computed(() => themeStore.theme)
    
    const themeIcon = computed(() => {
      if (theme.value === 'system') return 'fa fa-desktop'
      return isDark.value ? 'fa fa-moon' : 'fa fa-sun'
    })
    
    const themeLabel = computed(() => {
      if (theme.value === 'system') return 'System'
      return isDark.value ? 'Dark' : 'Light'
    })
    
    const themeClasses = computed(() => {
      const baseClasses = 'transition-all duration-200 ease-in-out'
      const sizeClasses = {
        sm: 'p-1 text-sm',
        md: 'p-2 text-base',
        lg: 'p-3 text-lg'
      }
      
      return [
        baseClasses,
        sizeClasses[props.size],
        isDark.value 
          ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      ]
    })
    
    const dropdownClasses = computed(() => {
      return isDark.value
        ? 'bg-gray-800 border-gray-700 text-white'
        : 'bg-white border-gray-200 text-gray-900'
    })

    // Methods
    const toggleTheme = () => {
      themeStore.toggleTheme()
      showDropdown.value = false
    }
    
    const setTheme = (newTheme) => {
      themeStore.setTheme(newTheme)
      showDropdown.value = false
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.theme-toggle')) {
        showDropdown.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      isDark,
      theme,
      themeIcon,
      themeLabel,
      themeClasses,
      dropdownClasses,
      showDropdown,
      toggleTheme,
      setTheme
    }
  }
}
</script>

<style scoped>
.theme-toggle-btn {
  border-radius: 0.5rem;
  border: 1px solid transparent;
  outline: none;
  transition: all 0.2s;
}

.theme-toggle-btn:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.theme-dropdown-btn {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  outline: none;
  transition: all 0.2s;
}

.theme-dropdown-btn:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.theme-dropdown {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: 8rem;
  border-radius: 0.5rem;
  border: 1px solid;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.theme-option {
  width: 100%;
  padding: 0.5rem 0.75rem;
  text-align: left;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.theme-option:hover {
  background-color: rgba(156, 163, 175, 0.1);
}

.dark .theme-option:hover {
  background-color: rgba(75, 85, 99, 1);
}

.theme-option:first-child {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.theme-option:last-child {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.theme-option.active {
  background-color: rgba(219, 234, 254, 1);
  color: rgba(29, 78, 216, 1);
}

.dark .theme-option.active {
  background-color: rgba(30, 58, 138, 1);
  color: rgba(147, 197, 253, 1);
}

.switch-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.switch-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(55, 65, 81, 1);
}

.dark .switch-text {
  color: rgba(209, 213, 219, 1);
}

.switch-container {
  position: relative;
}

.switch-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.switch-slider {
  width: 3rem;
  height: 1.5rem;
  background-color: rgba(209, 213, 219, 1);
  border-radius: 9999px;
  position: relative;
  transition: background-color 0.2s;
}

.dark .switch-slider {
  background-color: rgba(75, 85, 99, 1);
}

.switch-input:checked + .switch-slider {
  background-color: rgba(59, 130, 246, 1);
}

.dark .switch-input:checked + .switch-slider {
  background-color: rgba(96, 165, 250, 1);
}

.switch-thumb {
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1.25rem;
  height: 1.25rem;
  background-color: white;
  border-radius: 9999px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transform: translateX(0);
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.switch-input:checked + .switch-slider .switch-thumb {
  transform: translateX(1.5rem);
}

.switch-icon {
  font-size: 0.75rem;
  color: rgba(75, 85, 99, 1);
}

.switch-input:checked + .switch-slider .switch-icon {
  color: rgba(251, 191, 36, 1);
}
</style>
