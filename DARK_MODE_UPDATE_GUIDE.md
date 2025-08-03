# 🌙 Dark Mode Update Guide

This guide helps you systematically update existing pages to support dark mode.

## 🚀 Quick Update Checklist

For each page that needs dark mode support, follow this checklist:

### ✅ 1. Page Container
```vue
<!-- Before -->
<div class="p-4 sm:p-6 max-w-7xl mx-auto">

<!-- After -->
<div class="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
```

### ✅ 2. Header Cards
```vue
<!-- Before -->
<div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">

<!-- After -->
<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
```

### ✅ 3. Titles and Text
```vue
<!-- Before -->
<h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
<p class="text-gray-600 text-sm sm:text-base">

<!-- After -->
<h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-200">
<p class="text-gray-600 dark:text-gray-300 text-sm sm:text-base transition-colors duration-200">
```

### ✅ 4. Buttons
```vue
<!-- Before -->
<button class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">

<!-- After -->
<button class="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200">
```

### ✅ 5. Tables
```vue
<!-- Before -->
<table class="min-w-full divide-y divide-gray-200">
  <thead class="bg-gray-50">
    <tr>
      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    </tr>
  </thead>
  <tbody class="bg-white divide-y divide-gray-200">
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">

<!-- After -->
<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
  <thead class="bg-gray-50 dark:bg-gray-700">
    <tr>
      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
    </tr>
  </thead>
  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
```

## 🎯 Using the Dark Mode Mixin

Add the mixin to your component for easy dark mode support:

```vue
<script>
import { darkModeMixin } from '@/mixins/darkModeMixin'

export default {
  mixins: [darkModeMixin],
  
  methods: {
    // Use mixin methods
    getButtonClass(variant) {
      return this.getButtonClasses(variant)
    },
    
    getStatusClass(status) {
      return this.getStatusColor(status)
    }
  }
}
</script>

<template>
  <div :class="themeClasses.pageContainer">
    <div :class="themeClasses.contentCard">
      <h1 :class="themeClasses.title">Title</h1>
      <p :class="themeClasses.subtitle">Subtitle</p>
      
      <button :class="getButtonClasses('primary')">
        Primary Button
      </button>
    </div>
  </div>
</template>
```

## 📋 Pages That Need Updates

Based on the codebase analysis, these pages need dark mode updates:

### Staff Pages
- ✅ `ControlPage.vue` - Updated
- ✅ `GradeSettings.vue` - Updated  
- ✅ `StudentManagement.vue` - Updated
- ❌ `ResultManagement.vue` - Needs update
- ❌ `CourseManagement.vue` - Needs update
- ❌ `StaffManagement.vue` - Needs update
- ❌ `PaymentManagement.vue` - Needs update
- ❌ `ReportGeneration.vue` - Needs update

### Student Pages
- ❌ `StudentDashboard.vue` - Needs update
- ❌ `CourseRegistration.vue` - Needs update
- ❌ `ResultViewing.vue` - Needs update
- ❌ `PaymentHistory.vue` - Needs update

### Application Pages
- ❌ `ApplicationForm.vue` - Needs update
- ❌ `DocumentUpload.vue` - Needs update
- ❌ `PaymentPage.vue` - Needs update

## 🔧 Common Patterns to Update

### Status Colors
```javascript
// Before
getStatusColor(status) {
  const colors = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800'
  };
  return colors[status];
}

// After
getStatusColor(status) {
  const colors = {
    'active': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    'inactive': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
  };
  return colors[status];
}
```

### Form Elements
```vue
<!-- Before -->
<input class="w-full px-3 py-2 border border-gray-300 rounded-md">
<select class="w-full px-3 py-2 border border-gray-300 rounded-md">

<!-- After -->
<input class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
<select class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
```

### Modals
```vue
<!-- Before -->
<div class="fixed inset-0 bg-black bg-opacity-50">
  <div class="bg-white rounded-lg p-6">

<!-- After -->
<div class="fixed inset-0 bg-black/50 dark:bg-black/70">
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
```

## 🎨 Color Scheme Reference

### Background Colors
- `bg-white` → `bg-white dark:bg-gray-800`
- `bg-gray-50` → `bg-gray-50 dark:bg-gray-900`
- `bg-gray-100` → `bg-gray-100 dark:bg-gray-800`

### Text Colors
- `text-gray-900` → `text-gray-900 dark:text-white`
- `text-gray-800` → `text-gray-800 dark:text-gray-100`
- `text-gray-600` → `text-gray-600 dark:text-gray-300`

### Border Colors
- `border-gray-100` → `border-gray-100 dark:border-gray-700`
- `border-gray-200` → `border-gray-200 dark:border-gray-600`
- `border-gray-300` → `border-gray-300 dark:border-gray-600`

## 🚀 Automated Update Script

Use this regex pattern to find and replace common patterns:

```bash
# Find pages that need updates
grep -r "bg-white" src/views/ --include="*.vue" | grep -v "dark:"

# Find text that needs dark mode classes
grep -r "text-gray-800" src/views/ --include="*.vue" | grep -v "dark:"
```

## ✅ Testing Checklist

After updating a page:

1. ✅ Toggle between light and dark modes
2. ✅ Check all text is readable in both modes
3. ✅ Verify buttons have proper hover states
4. ✅ Test form elements are visible and functional
5. ✅ Check modals and overlays work correctly
6. ✅ Verify tables are properly styled
7. ✅ Test on different screen sizes
8. ✅ Check status badges and colors

## 🎯 Priority Order

Update pages in this order based on usage frequency:

1. **High Priority** (Most used)
   - Dashboard pages
   - Student/Staff management
   - Course management

2. **Medium Priority**
   - Settings pages
   - Report pages
   - Payment pages

3. **Low Priority**
   - Admin configuration
   - Rarely used features

## 📝 Notes

- Always add `transition-colors duration-200` for smooth theme transitions
- Test with real data to ensure proper contrast
- Consider accessibility (WCAG guidelines)
- Use consistent color patterns across the application
