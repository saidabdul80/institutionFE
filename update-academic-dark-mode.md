# 🌙 Academic Setup Pages Dark Mode Update Guide

## ✅ Pages Already Updated:
- ✅ Faculty Page (`FacultyPage.vue`) - Complete
- ✅ Department Page (`DepartmentPage.vue`) - Partial
- ✅ Programme Page (`ProgramPage.vue`) - Partial

## 📋 Pages Still Need Updates:

### 1. Course Management (`/staff/courses`)
**File:** `src/views/Staff/Preference/CoursePage.vue`

**Quick Updates Needed:**
```vue
<!-- Page Container -->
<div class="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">

<!-- Main Card -->
<div class="bg-white dark:bg-gray-800 relative rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">

<!-- Headers -->
<h2 class="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">

<!-- Buttons -->
<Button class="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200">
```

### 2. Course Categories (`/staff/course_category`)
**File:** `src/views/Staff/Preference/CourseCategoryPage.vue`

**Quick Updates Needed:**
```vue
<!-- Same pattern as above -->
```

### 3. Programme Courses (`/staff/programme_courses`)
**File:** `src/views/Staff/Preference/ProgrammeCoursesPage.vue`

**Quick Updates Needed:**
```vue
<!-- Same pattern as above -->
```

### 4. Levels (`/staff/level`)
**File:** `src/views/Staff/Preference/LevelPage.vue`

**Quick Updates Needed:**
```vue
<!-- Same pattern as above -->
```

### 5. Sessions (`/staff/sessions`)
**File:** `src/views/Staff/Preference/SessionPage.vue`

**Quick Updates Needed:**
```vue
<!-- Same pattern as above -->
```

## 🔧 Standard Update Pattern

For each academic setup page, apply these changes:

### 1. Page Container
```vue
<!-- Before -->
<div>

<!-- After -->
<div class="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
```

### 2. Main Content Card
```vue
<!-- Before -->
<div class="bg-white relative">

<!-- After -->
<div class="bg-white dark:bg-gray-800 relative rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
```

### 3. Headers and Text
```vue
<!-- Before -->
<h2 class="text-xl font-semibold text-gray-900">

<!-- After -->
<h2 class="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
```

### 4. Buttons
```vue
<!-- Before -->
<Button label="New Item" icon="fa fa-plus" class="place-self-end" />

<!-- After -->
<Button label="New Item" icon="fa fa-plus" 
        class="place-self-end bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200" />
```

### 5. DataTable (if using PrimeVue DataTable)
```vue
<!-- The PrimeVue dark mode CSS will handle DataTable styling automatically -->
<!-- Just ensure the container has dark mode classes -->
```

### 6. Dialogs
```vue
<!-- Before -->
<Dialog header="New Item" v-model:visible="dialog" class="w-[45%]" :modal="true">

<!-- After -->
<Dialog header="New Item" v-model:visible="dialog" class="w-[45%]" :modal="true"
        :pt="{ 
            root: { class: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700' },
            header: { class: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700' },
            content: { class: 'bg-white dark:bg-gray-800' },
            footer: { class: 'bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700' }
        }">
```

### 7. Form Labels and Inputs
```vue
<!-- Before -->
<label for="name">Name</label>
<InputText id="name" v-model="item.name" class="w-full" />

<!-- After -->
<label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
<InputText id="name" v-model="item.name" 
          class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
```

## 🎯 Priority Order

Update in this order based on usage frequency:

1. **High Priority:**
   - Course Management (most used)
   - Programme Courses (frequently accessed)
   - Levels (commonly used)

2. **Medium Priority:**
   - Sessions (periodic access)
   - Course Categories (less frequent)

## 🚀 Quick Implementation

For each page:

1. **Open the file**
2. **Find the main template structure**
3. **Apply the standard pattern above**
4. **Test in both light and dark modes**
5. **Verify all interactive elements work**

## 📝 Testing Checklist

For each updated page:

- ✅ Page loads correctly in light mode
- ✅ Page loads correctly in dark mode
- ✅ Theme toggle works
- ✅ All text is readable
- ✅ Buttons have proper hover states
- ✅ Forms are functional
- ✅ Dialogs display correctly
- ✅ Tables are properly styled
- ✅ No visual glitches during theme switch

## 🎨 Color Reference

Use these consistent colors across all academic pages:

### Backgrounds
- Light: `bg-white`, `bg-gray-50`
- Dark: `dark:bg-gray-800`, `dark:bg-gray-900`

### Text
- Primary: `text-gray-900 dark:text-white`
- Secondary: `text-gray-600 dark:text-gray-300`
- Muted: `text-gray-500 dark:text-gray-400`

### Borders
- Light: `border-gray-100`, `border-gray-200`
- Dark: `dark:border-gray-700`, `dark:border-gray-600`

### Buttons
- Primary: `bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700`
- Secondary: `bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700`

## 🔧 Troubleshooting

### Common Issues:

1. **PrimeVue components not styling correctly**
   - Solution: The `primevue-dark.css` file handles this automatically

2. **Text not visible in dark mode**
   - Solution: Add `dark:text-white` or `dark:text-gray-100` classes

3. **Buttons not changing color**
   - Solution: Ensure both base color and hover states have dark variants

4. **Borders not visible**
   - Solution: Add `dark:border-gray-700` or similar dark border classes

## 📞 Need Help?

If you encounter issues:

1. Check the updated Faculty page as a reference
2. Verify the Table.vue component is working correctly
3. Ensure the theme store is properly initialized
4. Test with browser dev tools to see which styles are being applied
