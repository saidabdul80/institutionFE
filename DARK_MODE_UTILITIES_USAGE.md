# 🌙 Dark Mode Utilities Usage Guide

This guide shows you how to use the implemented dark mode utilities in your components.

## 🚀 Quick Start

### Using the Dark Mode Composable

```vue
<template>
  <div :class="buildClasses.page()">
    <div :class="buildClasses.card()">
      <h1 :class="buildClasses.title()">My Page</h1>
      <p :class="buildClasses.subtitle()">Page description</p>
      
      <button 
        @click="toggleTheme"
        :class="buildClasses.button('primary')"
      >
        Toggle Theme
      </button>
    </div>
  </div>
</template>

<script>
import { useDarkMode } from '@/composables/useDarkMode'

export default {
  setup() {
    const { 
      isDark, 
      toggleTheme, 
      buildClasses 
    } = useDarkMode()
    
    return {
      isDark,
      toggleTheme,
      buildClasses
    }
  }
}
</script>
```

## 🎯 Available Composables

### 1. `useDarkMode()` - Main Composable

```javascript
const {
  // State
  isDark,           // Boolean: true if dark mode
  theme,            // String: 'light', 'dark', or 'system'
  
  // Actions
  toggleTheme,      // Function: toggle between light/dark
  setTheme,         // Function: set specific theme
  
  // Utilities
  buildClasses,     // Object: pre-built class builders
  getStatusColor,   // Function: get status badge colors
  conditionalClasses, // Function: conditional class application
  patterns          // Object: all component patterns
} = useDarkMode()
```

### 2. `useDarkModeForm()` - Form Elements

```javascript
const { formClasses } = useDarkModeForm()

// Usage in template:
<input :class="formClasses.input" />
<select :class="formClasses.select" />
<textarea :class="formClasses.textarea" />
<label :class="formClasses.label" />
```

### 3. `useDarkModeTable()` - Table Elements

```javascript
const { tableClasses } = useDarkModeTable()

// Usage in template:
<div :class="tableClasses.wrapper">
  <table :class="tableClasses.table">
    <thead :class="tableClasses.thead">
      <tr>
        <th :class="tableClasses.th">Header</th>
      </tr>
    </thead>
    <tbody :class="tableClasses.tbody">
      <tr :class="tableClasses.tr">
        <td :class="tableClasses.td">Cell</td>
      </tr>
    </tbody>
  </table>
</div>
```

## 🎨 Class Builders

### buildClasses Object

```javascript
const { buildClasses } = useDarkMode()

// Available builders:
buildClasses.page()                    // Page container
buildClasses.card('p-6')              // Card with custom padding
buildClasses.title()                  // Page/section title
buildClasses.subtitle()               // Subtitle/description
buildClasses.button('primary')        // Button variants
buildClasses.badge('success')         // Status badges
buildClasses.table()                  // Table classes object
buildClasses.modal()                  // Modal classes object
```

### Button Variants

```javascript
buildClasses.button('primary')    // Blue button
buildClasses.button('secondary')  // Gray button
buildClasses.button('success')    // Green button
buildClasses.button('danger')     // Red button
buildClasses.button('warning')    // Yellow button
```

## 🏷️ Status Colors

### Badge Colors

```javascript
const { getStatusColor } = useDarkMode()

getStatusColor('active', 'badge')     // Green badge
getStatusColor('inactive', 'badge')   // Gray badge
getStatusColor('pending', 'badge')    // Yellow badge
getStatusColor('success', 'badge')    // Green badge
getStatusColor('error', 'badge')      // Red badge
getStatusColor('warning', 'badge')    // Yellow badge
```

### Text Colors

```javascript
getStatusColor('active', 'text')      // Green text
getStatusColor('error', 'text')       // Red text
// ... etc
```

## 🔄 Conditional Classes

For dynamic styling based on theme:

```vue
<template>
  <div 
    :class="conditionalClasses(
      'bg-blue-100 text-blue-800',     // Light mode classes
      'bg-blue-900/30 text-blue-300'   // Dark mode classes
    ).value"
  >
    Content that changes with theme
  </div>
</template>

<script>
const { conditionalClasses } = useDarkMode()
</script>
```

## 📋 Real-World Examples

### 1. Page Layout

```vue
<template>
  <div :class="buildClasses.page()">
    <!-- Header -->
    <div :class="buildClasses.card('p-6 mb-6')">
      <h1 :class="buildClasses.title()">Page Title</h1>
      <p :class="buildClasses.subtitle()">Page description</p>
    </div>
    
    <!-- Content -->
    <div :class="buildClasses.card()">
      <!-- Your content here -->
    </div>
  </div>
</template>
```

### 2. Data Table

```vue
<template>
  <div :class="tableClasses.wrapper">
    <table :class="tableClasses.table">
      <thead :class="tableClasses.thead">
        <tr>
          <th :class="tableClasses.th">Name</th>
          <th :class="tableClasses.th">Status</th>
        </tr>
      </thead>
      <tbody :class="tableClasses.tbody">
        <tr v-for="item in items" :class="tableClasses.tr">
          <td :class="tableClasses.td">{{ item.name }}</td>
          <td :class="tableClasses.td">
            <span :class="getStatusColor(item.status, 'badge')">
              {{ item.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useDarkMode, useDarkModeTable } from '@/composables/useDarkMode'

export default {
  setup() {
    const { getStatusColor } = useDarkMode()
    const { tableClasses } = useDarkModeTable()
    
    return { getStatusColor, tableClasses }
  }
}
</script>
```

### 3. Form with Validation

```vue
<template>
  <div :class="buildClasses.card('p-6')">
    <h2 :class="buildClasses.title() + ' text-lg mb-4'">User Form</h2>
    
    <div class="space-y-4">
      <div>
        <label :class="formClasses.label">Name *</label>
        <input 
          type="text" 
          :class="formClasses.input"
          v-model="form.name"
          :class="{ 'border-red-500 dark:border-red-400': errors.name }"
        />
        <p v-if="errors.name" :class="formClasses.error">
          {{ errors.name }}
        </p>
      </div>
      
      <div>
        <label :class="formClasses.label">Status</label>
        <select :class="formClasses.select" v-model="form.status">
          <option value="">Select status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <p :class="formClasses.help">
          Choose the user's current status
        </p>
      </div>
      
      <div class="flex gap-2">
        <button :class="buildClasses.button('primary')">
          Save
        </button>
        <button :class="buildClasses.button('secondary')">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useDarkMode, useDarkModeForm } from '@/composables/useDarkMode'

export default {
  setup() {
    const { buildClasses } = useDarkMode()
    const { formClasses } = useDarkModeForm()
    
    const form = ref({ name: '', status: '' })
    const errors = ref({})
    
    return {
      buildClasses,
      formClasses,
      form,
      errors
    }
  }
}
</script>
```

## 🎯 Migration Tips

### Converting Existing Components

1. **Replace hardcoded classes:**
   ```vue
   <!-- Before -->
   <div class="bg-white p-6 rounded-lg shadow">
   
   <!-- After -->
   <div :class="buildClasses.card('p-6')">
   ```

2. **Use status colors:**
   ```vue
   <!-- Before -->
   <span class="bg-green-100 text-green-800 px-2 py-1 rounded">
   
   <!-- After -->
   <span :class="getStatusColor('success', 'badge')">
   ```

3. **Add theme awareness:**
   ```vue
   <!-- Before -->
   <h1 class="text-gray-800 text-2xl font-bold">
   
   <!-- After -->
   <h1 :class="buildClasses.title() + ' text-2xl'">
   ```

## 🔧 Customization

### Extending the Composable

```javascript
// In your component
const { buildClasses, getThemeClasses } = useDarkMode()

// Create custom class builder
const customClasses = {
  specialCard: () => getThemeClasses(
    'bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl',
    'dark:from-blue-600 dark:to-purple-700'
  )
}
```

### Adding New Status Types

```javascript
// Extend status colors
const getCustomStatusColor = (status) => {
  const customColors = {
    'processing': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
    'archived': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
  }
  
  return customColors[status] || getStatusColor(status, 'badge')
}
```

## ✅ Best Practices

1. **Always use composables** instead of hardcoded classes
2. **Test in both themes** before deploying
3. **Use semantic naming** for status types
4. **Leverage buildClasses** for consistency
5. **Combine with Tailwind** for additional styling
6. **Keep accessibility** in mind (contrast ratios)

## 🐛 Troubleshooting

### Theme not applying?
- Check if theme store is initialized in main.js
- Verify Tailwind config has `darkMode: 'class'`
- Ensure `dark` class is on document root

### Classes not updating?
- Make sure you're using reactive computed properties
- Check if composable is properly imported
- Verify component is using the returned values

### Performance issues?
- Use `buildClasses` instead of calling functions repeatedly
- Consider memoizing complex class combinations
- Avoid inline class generation in templates
