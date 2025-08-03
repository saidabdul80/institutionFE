# 🌙 Theme System Guide

This guide explains how to use the light/dark mode theme system in the Institution Management System.

## 🚀 Quick Start

### Using the Theme Toggle Component

```vue
<template>
  <!-- Simple toggle button -->
  <ThemeToggle variant="simple" />
  
  <!-- Dropdown with system option -->
  <ThemeToggle variant="dropdown" :show-label="true" />
  
  <!-- Switch toggle -->
  <ThemeToggle variant="switch" :show-label="true" />
</template>

<script>
import ThemeToggle from '@/components/ThemeToggle.vue'

export default {
  components: {
    ThemeToggle
  }
}
</script>
```

### Using the Theme Store

```vue
<script>
import { useThemeStore } from '@/stores/theme'
import { computed } from 'vue'

export default {
  setup() {
    const themeStore = useThemeStore()
    
    const isDark = computed(() => themeStore.isDark)
    const currentTheme = computed(() => themeStore.theme)
    
    const toggleTheme = () => {
      themeStore.toggleTheme()
    }
    
    const setLightMode = () => {
      themeStore.setTheme('light')
    }
    
    const setDarkMode = () => {
      themeStore.setTheme('dark')
    }
    
    return {
      isDark,
      currentTheme,
      toggleTheme,
      setLightMode,
      setDarkMode
    }
  }
}
</script>
```

## 🎨 Styling Components for Dark Mode

### Method 1: Using Tailwind Dark Mode Classes

```vue
<template>
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
    <h1 class="text-gray-800 dark:text-gray-100">Title</h1>
    <p class="text-gray-600 dark:text-gray-300">Description</p>
    
    <!-- Cards -->
    <div class="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
      Card content
    </div>
    
    <!-- Buttons -->
    <button class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded">
      Button
    </button>
    
    <!-- Inputs -->
    <input class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2" />
  </div>
</template>
```

### Method 2: Using CSS Custom Properties

```vue
<template>
  <div class="themed-container">
    <h1 class="themed-title">Title</h1>
    <p class="themed-text">Description</p>
    <div class="themed-card">Card content</div>
  </div>
</template>

<style scoped>
.themed-container {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.themed-title {
  color: var(--text-primary);
}

.themed-text {
  color: var(--text-secondary);
}

.themed-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px var(--shadow-color);
}
</style>
```

### Method 3: Using Theme-Aware Components

```vue
<template>
  <ThemeLayout>
    <ThemeCard>
      <template #header>
        <h2>Card Title</h2>
      </template>
      
      <p>Card content goes here</p>
      
      <template #footer>
        <button>Action</button>
      </template>
    </ThemeCard>
  </ThemeLayout>
</template>

<script>
import ThemeLayout from '@/components/ThemeLayout.vue'
import ThemeCard from '@/components/ThemeCard.vue'

export default {
  components: {
    ThemeLayout,
    ThemeCard
  }
}
</script>
```

## 🛠️ Available CSS Variables

### Colors
- `--bg-primary`: Primary background color
- `--bg-secondary`: Secondary background color  
- `--bg-tertiary`: Tertiary background color
- `--text-primary`: Primary text color
- `--text-secondary`: Secondary text color
- `--text-muted`: Muted text color
- `--border-color`: Border color
- `--shadow-color`: Shadow color

### Brand Colors
- `--primary-50` to `--primary-900`: Primary brand colors
- `--success-50` to `--success-600`: Success colors
- `--warning-50` to `--warning-600`: Warning colors
- `--error-50` to `--error-600`: Error colors

## 🎯 Best Practices

### 1. Always Include Dark Mode Classes
```vue
<!-- ✅ Good -->
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">

<!-- ❌ Bad -->
<div class="bg-white text-gray-900">
```

### 2. Use Consistent Color Scales
```vue
<!-- ✅ Good - Consistent contrast -->
<div class="bg-gray-50 dark:bg-gray-800">
  <p class="text-gray-900 dark:text-gray-100">Primary text</p>
  <p class="text-gray-600 dark:text-gray-300">Secondary text</p>
</div>

<!-- ❌ Bad - Inconsistent contrast -->
<div class="bg-gray-50 dark:bg-gray-900">
  <p class="text-gray-900 dark:text-gray-200">Primary text</p>
  <p class="text-gray-600 dark:text-gray-800">Secondary text</p>
</div>
```

### 3. Test Both Themes
Always test your components in both light and dark modes to ensure proper contrast and readability.

### 4. Use Transitions
Add smooth transitions for theme changes:
```vue
<div class="transition-colors duration-200 bg-white dark:bg-gray-800">
```

## 🔧 Theme Store API

### State
- `isDark`: Boolean indicating if dark mode is active
- `theme`: Current theme ('light', 'dark', or 'system')

### Actions
- `initializeTheme()`: Initialize theme from localStorage or system preference
- `toggleTheme()`: Toggle between light and dark mode
- `setTheme(theme)`: Set specific theme ('light', 'dark', or 'system')
- `watchSystemTheme()`: Watch for system theme changes

### Getters
- `currentTheme()`: Get current theme
- `isLightMode()`: Check if light mode is active
- `isDarkMode()`: Check if dark mode is active

## 📱 Theme Toggle Variants

### Simple Button
```vue
<ThemeToggle variant="simple" size="md" />
```

### Dropdown with System Option
```vue
<ThemeToggle variant="dropdown" :show-label="true" />
```

### Switch Toggle
```vue
<ThemeToggle variant="switch" :show-label="true" />
```

## 🎨 Customizing Colors

To customize theme colors, edit `src/assets/theme.css`:

```css
:root {
  /* Light mode colors */
  --primary-500: #your-color;
}

.dark {
  /* Dark mode colors */
  --primary-500: #your-dark-color;
}
```

## 🚀 Integration with PrimeVue

The theme system works alongside PrimeVue components. For PrimeVue components, you may need to add custom CSS:

```css
/* PrimeVue dark mode overrides */
.dark .p-inputtext {
  background-color: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.dark .p-button {
  background-color: var(--primary-600);
}
```

## 🔍 Troubleshooting

### Theme not persisting
- Check if localStorage is available
- Ensure `initializeTheme()` is called on app startup

### Colors not changing
- Verify Tailwind's `darkMode: 'class'` is configured
- Check if `dark` class is being applied to `<html>` element
- Ensure CSS custom properties are defined

### Flashing on page load
- Initialize theme before mounting the app
- Use CSS to hide content until theme is loaded
- Add `theme-transitioning` class during theme changes
